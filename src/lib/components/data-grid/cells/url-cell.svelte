<script lang="ts" generics="TData extends Record<string, any>">
	import { toast } from "svelte-sonner";
	import { watch } from "runed";

	import type { DataGridController } from "$lib/hooks/use-data-grid.svelte";
	import DataGridCellWrapper from "../data-grid-cell-wrapper.svelte";
	import type { DataGridCell } from "../types";
	import { getUrlHref } from "../utils";

	let {
		cell,
		grid,
		rowIndex
	}: {
		cell: DataGridCell<TData>;
		grid: DataGridController<TData>;
		rowIndex: number;
	} = $props();
	function readValue() {
		return String(cell.getValue() ?? "");
	}
	let value = $state(readValue());
	let editor = $state<HTMLDivElement | null>(null);
	const editing = $derived(grid.isEditing(rowIndex, cell.column.id));
	const href = $derived(getUrlHref(value));

	watch(
		() => cell.getValue(),
		(next) => {
			if (!editing) value = String(next ?? "");
		},
		{ lazy: true }
	);
	watch(
		() => editing,
		(active) => {
			if (!active) return;
			requestAnimationFrame(() => {
				const pending = grid.consumePendingEditKey();
				if (pending) value = pending;
				if (editor) {
					editor.textContent = value;
					editor.focus();
				}
			});
		},
		{ lazy: true }
	);

	function save(options?: Parameters<typeof grid.stopEditing>[0]) {
		value = (editor?.textContent ?? value).trim();
		if (value !== String(cell.getValue() ?? ""))
			grid.updateCell(rowIndex, cell.column.id, value || null);
		grid.stopEditing(options);
	}

	function keydown(event: KeyboardEvent) {
		if (!editing) return;
		if (event.key === "Enter") {
			event.preventDefault();
			save({ moveToNextRow: true });
		} else if (event.key === "Tab") {
			event.preventDefault();
			save({ direction: event.shiftKey ? "left" : "right" });
		} else if (event.key === "Escape") {
			event.preventDefault();
			value = String(cell.getValue() ?? "");
			grid.stopEditing();
		}
	}

	function linkClick(event: MouseEvent) {
		event.stopPropagation();
		if (!href) {
			event.preventDefault();
			toast.error("Invalid or unsafe URL");
		}
	}
</script>

<DataGridCellWrapper {cell} {grid} {rowIndex} onkeydown={keydown}>
	{#if !editing && value}
		<a
			data-slot="grid-cell-content"
			class="block truncate text-primary underline decoration-primary/30 underline-offset-2"
			{href}
			target="_blank"
			rel="noopener noreferrer"
			onclick={linkClick}>{value}</a
		>
	{:else}
		<div
			bind:this={editor}
			role="textbox"
			data-slot="grid-cell-content"
			contenteditable={editing}
			tabindex="-1"
			class="size-full overflow-hidden outline-none"
			oninput={(event) => (value = event.currentTarget.textContent ?? "")}
			onblur={() => editing && save()}
		>
			{editing ? "" : value}
		</div>
	{/if}
</DataGridCellWrapper>
