<script lang="ts" generics="TData extends Record<string, any>">
	import PlusIcon from "@lucide/svelte/icons/plus";
	import { FlexRender } from "@tanstack/svelte-table";

	import { cn } from "$lib/utils";
	import type { DataGridController } from "$lib/hooks/use-data-grid.svelte";

	import DataGridColumnHeader from "./data-grid-column-header.svelte";
	import DataGridContextMenu from "./data-grid-context-menu.svelte";
	import DataGridPasteDialog from "./data-grid-paste-dialog.svelte";
	import DataGridRow from "./data-grid-row.svelte";
	import DataGridSearch from "./data-grid-search.svelte";
	import { getColumnBorderVisibility, getColumnPinningStyle } from "./utils";
	import type { DataGridProps } from "./types";

	let {
		grid,
		height = 600,
		stretchColumns = false,
		class: className,
		...restProps
	}: DataGridProps<TData> & { grid: DataGridController<TData> } = $props();

	const rowVirtualizer = $derived(grid.rowVirtualizer);
	const rows = $derived(grid.table.getRowModel().rows);

	function addRowKeydown(event: KeyboardEvent) {
		if (event.key === "Enter" || event.key === " ") {
			event.preventDefault();
			void grid.addRow();
		}
	}
</script>

<div
	data-slot="grid-wrapper"
	dir={grid.dir}
	class={cn("relative flex w-full flex-col", className)}
	{...restProps}
>
	{#if grid.options.enableSearch}
		<DataGridSearch {grid} />
	{/if}
	<DataGridContextMenu {grid} />
	<DataGridPasteDialog {grid} />

	<div
		role="grid"
		aria-label="Data grid"
		aria-rowcount={rows.length + (grid.options.onRowAdd ? 1 : 0)}
		aria-colcount={grid.table.getVisibleLeafColumns().length}
		data-slot="grid"
		tabindex="0"
		bind:this={grid.dataGridRef}
		class="relative grid overflow-auto rounded-md border select-none focus:outline-none"
		style={`${grid.columnSizeStyle}max-height:${height}px;`}
		onkeydown={grid.handleKeydown}
		oncontextmenu={(event) => event.preventDefault()}
	>
		<div
			role="rowgroup"
			data-slot="grid-header"
			bind:this={grid.headerRef}
			class="sticky top-0 z-10 grid border-b bg-background"
		>
			{#each grid.table.getHeaderGroups() as headerGroup, rowIndex (headerGroup.id)}
				<div
					role="row"
					aria-rowindex={rowIndex + 1}
					data-slot="grid-header-row"
					class="flex w-full"
				>
					{#each headerGroup.headers as header, columnIndex (header.id)}
						{@const nextHeader =
							headerGroup.headers[columnIndex + 1]}
						{@const borders = getColumnBorderVisibility(
							header.column,
							nextHeader?.column
						)}
						<div
							role="columnheader"
							aria-colindex={columnIndex + 1}
							aria-sort={header.column.getIsSorted() === "asc"
								? "ascending"
								: header.column.getIsSorted() === "desc"
									? "descending"
									: header.column.getCanSort()
										? "none"
										: undefined}
							data-slot="grid-header-cell"
							class={cn("relative shrink-0", {
								grow:
									stretchColumns &&
									header.column.id !== "select",
								"border-e":
									borders.showEndBorder &&
									header.column.id !== "select",
								"border-s":
									borders.showStartBorder &&
									header.column.id !== "select"
							})}
							style={`${getColumnPinningStyle(header.column, grid.dir)}width:calc(var(--header-${header.id}-size) * 1px);`}
						>
							{#if !header.isPlaceholder}
								{#if typeof header.column.columnDef.header === "function"}
									<div class="size-full px-3 py-1.5">
										<FlexRender {header} />
									</div>
								{:else}
									<DataGridColumnHeader {header} {grid} />
								{/if}
							{/if}
						</div>
					{/each}
				</div>
			{/each}
		</div>

		<div
			role="rowgroup"
			data-slot="grid-body"
			class="relative grid"
			style={`height:${$rowVirtualizer.getTotalSize()}px;contain:strict;`}
		>
			{#each $rowVirtualizer.getVirtualItems() as virtualItem (virtualItem.key)}
				{@const row = rows[virtualItem.index]}
				{#if row}
					<DataGridRow {row} {virtualItem} {grid} {stretchColumns} />
				{/if}
			{/each}
		</div>

		{#if !grid.readOnly && grid.options.onRowAdd}
			<div
				role="rowgroup"
				data-slot="grid-footer"
				bind:this={grid.footerRef}
				class="sticky bottom-0 z-10 grid border-t bg-background"
			>
				<div
					role="row"
					aria-rowindex={rows.length + 2}
					class="flex w-full"
				>
					<div
						role="gridcell"
						tabindex="0"
						class="relative flex h-9 grow items-center bg-muted/30 transition-colors hover:bg-muted/50 focus:bg-muted/50 focus:outline-none"
						style={`width:${grid.table.getTotalSize()}px;min-width:${grid.table.getTotalSize()}px;`}
						onclick={(event) => void grid.addRow(event)}
						onkeydown={addRowKeydown}
					>
						<div
							class="sticky start-0 flex items-center gap-2 px-3 text-muted-foreground"
						>
							<PlusIcon class="size-3.5" />
							<span class="text-sm">Add row</span>
						</div>
					</div>
				</div>
			</div>
		{/if}
	</div>
</div>
