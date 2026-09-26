<script lang="ts" generics="TData extends Record<string, any>">
	import { mergeProps } from "bits-ui";
	import type { Snippet } from "svelte";
	import type { HTMLAttributes } from "svelte/elements";

	import { cn } from "$lib/utils";
	import type { DataGridController } from "$lib/hooks/use-data-grid.svelte";

	import type { DataGridCell } from "./types";

	let {
		cell,
		grid,
		rowIndex,
		children,
		class: className,
		onkeydown: onkeydownProp,
		...restProps
	}: {
		cell: DataGridCell<TData>;
		grid: DataGridController<TData>;
		rowIndex: number;
		children?: Snippet;
		onkeydown?: (event: KeyboardEvent) => void;
	} & HTMLAttributes<HTMLDivElement> = $props();

	let wasFocusedOnPointerDown = false;
	const editing = $derived(grid.isEditing(rowIndex, cell.column.id));

	function register(node: HTMLDivElement) {
		grid.registerCell(rowIndex, cell.column.id, node);
		return {
			destroy: () => grid.registerCell(rowIndex, cell.column.id, null)
		};
	}

	function handleMouseDown(event: MouseEvent) {
		if (editing) return;
		wasFocusedOnPointerDown = cell.getIsFocused();
		cell.getSelectionStartHandler()(event);
	}

	function handleClick(event: MouseEvent) {
		if (editing) return;
		event.preventDefault();
		if (wasFocusedOnPointerDown && !grid.readOnly)
			grid.startEditing(rowIndex, cell.column.id);
	}

	function handleKeydown(event: KeyboardEvent) {
		onkeydownProp?.(event);
		if (
			event.defaultPrevented ||
			editing ||
			grid.readOnly ||
			!cell.getIsFocused()
		)
			return;
		if (event.key === "Enter" || event.key === "F2" || event.key === " ") {
			event.preventDefault();
			event.stopPropagation();
			grid.startEditing(rowIndex, cell.column.id);
		} else if (
			event.key.length === 1 &&
			!event.metaKey &&
			!event.ctrlKey &&
			!event.altKey
		) {
			event.preventDefault();
			event.stopPropagation();
			grid.startEditing(rowIndex, cell.column.id, event.key);
		}
	}

	const mergedProps = $derived(
		mergeProps(restProps, {
			role: "button",
			"data-slot": "grid-cell-wrapper",
			"data-editing": editing ? "" : undefined,
			"data-focused": cell.getIsFocused() ? "" : undefined,
			"data-selected": cell.getIsSelected() ? "" : undefined,
			"data-search-match": grid.isSearchMatch(rowIndex, cell.column.id)
				? ""
				: undefined,
			"data-active-search-match": grid.isActiveSearchMatch(
				rowIndex,
				cell.column.id
			)
				? ""
				: undefined,
			tabindex: editing ? -1 : cell.getTabIndex(),
			class: cn(
				"size-full cursor-default px-2 py-1.5 text-start text-sm outline-none has-data-[slot=checkbox]:pt-2.5",
				cell.getIsFocused() && "ring-1 ring-ring ring-inset",
				cell.getIsSelected() && !editing && "bg-primary/10",
				grid.isSearchMatch(rowIndex, cell.column.id) &&
					"bg-yellow-100 dark:bg-yellow-900/30",
				grid.isActiveSearchMatch(rowIndex, cell.column.id) &&
					"bg-orange-200 dark:bg-orange-900/50",
				grid.rowHeight === "short" &&
					!editing &&
					"**:data-[slot=grid-cell-content]:line-clamp-1",
				grid.rowHeight === "medium" &&
					!editing &&
					"**:data-[slot=grid-cell-content]:line-clamp-2",
				grid.rowHeight === "tall" &&
					!editing &&
					"**:data-[slot=grid-cell-content]:line-clamp-3",
				grid.rowHeight === "extra-tall" &&
					!editing &&
					"**:data-[slot=grid-cell-content]:line-clamp-4",
				className
			),
			onclick: handleClick,
			ondblclick: () =>
				!editing && grid.startEditing(rowIndex, cell.column.id),
			onmousedown: handleMouseDown,
			onmouseenter: (event: MouseEvent) =>
				!editing && cell.getSelectionExtendHandler()(event),
			oncontextmenu: (event: MouseEvent) =>
				!editing &&
				grid.openContextMenu(rowIndex, cell.column.id, event),
			onkeydown: handleKeydown
		})
	);
</script>

<div use:register {...mergedProps}>
	{@render children?.()}
</div>
