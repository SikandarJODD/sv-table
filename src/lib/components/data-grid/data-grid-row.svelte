<script lang="ts" generics="TData extends Record<string, any>">
	import { FlexRender, type Row } from "@tanstack/svelte-table";
	import type { VirtualItem } from "@tanstack/svelte-virtual";

	import { cn } from "$lib/utils";
	import type { DataGridController } from "$lib/hooks/use-data-grid.svelte";

	import DataGridCell from "./data-grid-cell.svelte";
	import type { DataGridFeatures } from "./data-grid-features";
	import {
		getColumnBorderVisibility,
		getColumnPinningStyle,
		getRowHeightValue
	} from "./utils";

	let {
		row,
		virtualItem,
		grid,
		stretchColumns = false
	}: {
		row: Row<DataGridFeatures, TData>;
		virtualItem: VirtualItem;
		grid: DataGridController<TData>;
		stretchColumns?: boolean;
	} = $props();

	function register(node: HTMLDivElement) {
		grid.registerRow(virtualItem.index, node);
		return { destroy: () => grid.registerRow(virtualItem.index, null) };
	}
</script>

<div
	role="row"
	aria-rowindex={virtualItem.index + 2}
	aria-selected={row.getIsSelected()}
	data-index={virtualItem.index}
	data-slot="grid-row"
	class="absolute flex w-full border-b will-change-transform [content-visibility:auto]"
	style={`height:${getRowHeightValue(grid.rowHeight)}px;transform:translateY(${virtualItem.start}px);`}
	use:register
>
	{#each row.getVisibleCells() as cell, columnIndex (cell.id)}
		{@const nextCell = row.getVisibleCells()[columnIndex + 1]}
		{@const borders = getColumnBorderVisibility(
			cell.column,
			nextCell?.column
		)}
		<div
			role="gridcell"
			aria-colindex={columnIndex + 1}
			data-highlighted={cell.getIsFocused() ? "" : undefined}
			data-slot="grid-cell"
			class={cn("shrink-0", {
				grow: stretchColumns && cell.column.id !== "select",
				"border-e":
					borders.showEndBorder && cell.column.id !== "select",
				"border-s":
					borders.showStartBorder && cell.column.id !== "select"
			})}
			style={`${getColumnPinningStyle(cell.column, grid.dir)}width:calc(var(--col-${cell.column.id}-size) * 1px);`}
		>
			{#if typeof cell.column.columnDef.header === "function"}
				<div
					class={cn(
						"size-full px-3 py-1.5",
						row.getIsSelected() && "bg-primary/10"
					)}
				>
					<FlexRender {cell} />
				</div>
			{:else}
				<DataGridCell {cell} {grid} rowIndex={virtualItem.index} />
			{/if}
		</div>
	{/each}
</div>
