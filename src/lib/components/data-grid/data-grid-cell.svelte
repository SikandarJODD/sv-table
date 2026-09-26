<script lang="ts" generics="TData extends Record<string, any>">
	import type { DataGridController } from "$lib/hooks/use-data-grid.svelte";

	import CheckboxCell from "./cells/checkbox-cell.svelte";
	import DateCell from "./cells/date-cell.svelte";
	import FileCell from "./cells/file-cell.svelte";
	import LongTextCell from "./cells/long-text-cell.svelte";
	import MultiSelectCell from "./cells/multi-select-cell.svelte";
	import NumberCell from "./cells/number-cell.svelte";
	import SelectCell from "./cells/select-cell.svelte";
	import ShortTextCell from "./cells/short-text-cell.svelte";
	import UrlCell from "./cells/url-cell.svelte";
	import type { DataGridCell as GridCell } from "./types";

	let {
		cell,
		grid,
		rowIndex
	}: {
		cell: GridCell<TData>;
		grid: DataGridController<TData>;
		rowIndex: number;
	} = $props();

	const variant = $derived(
		cell.column.columnDef.meta?.cell?.variant ?? "short-text"
	);
</script>

{#if variant === "long-text"}
	<LongTextCell {cell} {grid} {rowIndex} />
{:else if variant === "number"}
	<NumberCell {cell} {grid} {rowIndex} />
{:else if variant === "url"}
	<UrlCell {cell} {grid} {rowIndex} />
{:else if variant === "checkbox"}
	<CheckboxCell {cell} {grid} {rowIndex} />
{:else if variant === "select"}
	<SelectCell {cell} {grid} {rowIndex} />
{:else if variant === "multi-select"}
	<MultiSelectCell {cell} {grid} {rowIndex} />
{:else if variant === "date"}
	<DateCell {cell} {grid} {rowIndex} />
{:else if variant === "file"}
	<FileCell {cell} {grid} {rowIndex} />
{:else}
	<ShortTextCell {cell} {grid} {rowIndex} />
{/if}
