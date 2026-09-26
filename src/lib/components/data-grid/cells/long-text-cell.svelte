<script lang="ts" generics="TData extends Record<string, any>">
	import { watch } from "runed";

	import * as Popover from "$lib/components/ui/popover";
	import { Textarea } from "$lib/components/ui/textarea";
	import type { DataGridController } from "$lib/hooks/use-data-grid.svelte";
	import { useDebounceCallback } from "$lib/hooks/use-debounce-callback";

	import DataGridCellWrapper from "../data-grid-cell-wrapper.svelte";
	import type { DataGridCell } from "../types";

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
	let textarea = $state<HTMLTextAreaElement | null>(null);
	const editing = $derived(grid.isEditing(rowIndex, cell.column.id));
	const saveLater = useDebounceCallback(
		(next: string) => grid.updateCell(rowIndex, cell.column.id, next),
		300
	);

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
				textarea?.focus();
			});
		},
		{ lazy: true }
	);

	function input(event: Event) {
		value = (event.currentTarget as HTMLTextAreaElement).value;
		if (!grid.readOnly) saveLater(value);
	}

	function finish() {
		saveLater.flush();
		if (value !== String(cell.getValue() ?? ""))
			grid.updateCell(rowIndex, cell.column.id, value);
		grid.stopEditing();
	}

	function keydown(event: KeyboardEvent) {
		if (event.key === "Escape") {
			event.preventDefault();
			value = String(cell.getValue() ?? "");
			grid.stopEditing();
		} else if (event.key === "Tab") {
			event.preventDefault();
			finish();
			grid.table.moveCellSelection(event.shiftKey ? "left" : "right");
		}
	}
</script>

<Popover.Root
	open={editing}
	onOpenChange={(open) => !open && editing && finish()}
>
	<Popover.Trigger>
		{#snippet child({ props })}
			<DataGridCellWrapper {...props} {cell} {grid} {rowIndex}>
				<span data-slot="grid-cell-content" class="whitespace-pre-wrap"
					>{value}</span
				>
			</DataGridCellWrapper>
		{/snippet}
	</Popover.Trigger>
	{#if editing}
		<Popover.Content data-grid-cell-editor align="start" class="w-96 p-2">
			<Textarea
				bind:ref={textarea}
				{value}
				class="min-h-36 resize-y"
				oninput={input}
				onkeydown={keydown}
			/>
		</Popover.Content>
	{/if}
</Popover.Root>
