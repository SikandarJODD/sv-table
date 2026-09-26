<script lang="ts" generics="TData extends Record<string, any>">
	import { Checkbox } from "$lib/components/ui/checkbox";
	import type { DataGridController } from "$lib/hooks/use-data-grid.svelte";

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
	let checked = $derived(Boolean(cell.getValue()));

	function change(next: boolean) {
		if (!grid.readOnly) grid.updateCell(rowIndex, cell.column.id, next);
	}

	function keydown(event: KeyboardEvent) {
		if (
			(event.key === " " || event.key === "Enter") &&
			cell.getIsFocused() &&
			!grid.readOnly
		) {
			event.preventDefault();
			event.stopPropagation();
			change(!checked);
		}
	}
</script>

<DataGridCellWrapper {cell} {grid} {rowIndex} onkeydown={keydown}>
	<Checkbox
		{checked}
		disabled={grid.readOnly}
		onCheckedChange={change}
		onclick={(event) => event.stopPropagation()}
		aria-label={`Toggle ${cell.column.columnDef.meta?.label ?? cell.column.id}`}
	/>
</DataGridCellWrapper>
