<script lang="ts">
	import {
		createTable,
		createTableState,
		FlexRender,
		renderSnippet,
		type ColumnDef,
		type SortingState
	} from "@tanstack/svelte-table";
	import { onMount } from "svelte";
	import { flip } from "svelte/animate";
	import { cubicOut } from "svelte/easing";
	import { dragHandleZone, type DndEvent } from "svelte-dnd-action";

	import * as Table from "$lib/components/ui/table";

	import DraggableTableHeader from "./draggable-table-header.svelte";
	import {
		draggableTableFeatures,
		type DraggableTableFeatures
	} from "./table-features";
	import type { DraggableColumn, Item } from "./types";
	import { FaviconLink } from "$markdown";

	const flipDurationMs = 300;

	let data = $state<Item[]>([]);
	let draggedColumnId = $state<string | null>(null);
	let columnItems = $state<DraggableColumn[]>([
		{ id: "name", columnId: "name", label: "Name" },
		{ id: "email", columnId: "email", label: "Email" },
		{ id: "location", columnId: "location", label: "Location" },
		{ id: "status", columnId: "status", label: "Status" },
		{ id: "balance", columnId: "balance", label: "Balance" }
	]);

	const [sorting, setSorting] = createTableState<SortingState>([]);

	const columns: ColumnDef<DraggableTableFeatures, Item, any>[] = [
		{
			id: "name",
			accessorKey: "name",
			header: "Name",
			cell: ({ row }) =>
				renderSnippet(nameCell, { name: row.original.name }),
			sortDescFirst: false,
			sortUndefined: "last"
		},
		{
			id: "email",
			accessorKey: "email",
			header: "Email"
		},
		{
			id: "location",
			accessorKey: "location",
			header: "Location",
			cell: ({ row }) =>
				renderSnippet(locationCell, {
					flag: row.original.flag,
					location: row.original.location
				})
		},
		{
			id: "status",
			accessorKey: "status",
			header: "Status"
		},
		{
			id: "balance",
			accessorKey: "balance",
			header: "Balance",
			cell: (info) =>
				new Intl.NumberFormat("en-US", {
					currency: "USD",
					style: "currency"
				}).format(Number(info.getValue()))
		}
	];

	const table = createTable({
		features: draggableTableFeatures,
		columns,
		enableSortingRemoval: false,
		get data() {
			return data;
		},
		state: {
			get columnOrder() {
				return columnItems.map((item) => item.columnId);
			},
			get sorting() {
				return sorting();
			}
		},
		onSortingChange: setSorting
	});

	function updateColumnOrder(event: CustomEvent<DndEvent<DraggableColumn>>) {
		columnItems = event.detail.items;
		draggedColumnId = event.detail.info.id;
	}
	function finishColumnOrder(event: CustomEvent<DndEvent<DraggableColumn>>) {
		columnItems = event.detail.items;
		draggedColumnId = null;
	}

	onMount(async () => {
		const response = await fetch("/dummy-data/data.json");
		const items = (await response.json()) as Item[];
		data = items.slice(0, 10);
	});
</script>

{#snippet nameCell({ name }: { name: string })}
	<div class="truncate font-medium">{name}</div>
{/snippet}

{#snippet locationCell({ flag, location }: { flag: string; location: string })}
	<div class="truncate">
		<span class="text-lg leading-none">{flag}</span>
		{location}
	</div>
{/snippet}

<div>
	<div class="w-full overflow-hidden rounded-lg border">
		<Table.Root
			class="table-fixed"
			style={`min-width: ${table.getTotalSize()}px;`}
		>
			<Table.Header>
				<tr
					use:dragHandleZone={{
						items: columnItems,
						flipDurationMs,
						dropTargetStyle: { outline: "none" }
					}}
					aria-label="Draggable table columns"
					class="border-b bg-muted/50 transition-colors hover:bg-muted/50"
					onconsider={updateColumnOrder}
					onfinalize={finishColumnOrder}
				>
					{#each columnItems as columnItem (columnItem.id)}
						{@const header = table
							.getLeafHeaders()
							.find(
								(item) => item.column.id === columnItem.columnId
							)}
						{#if header}
							<DraggableTableHeader
								{header}
								isDragging={draggedColumnId ===
									columnItem.columnId}
								isShadow={Boolean(columnItem.isDndShadowItem)}
							/>
						{/if}
					{/each}
				</tr>
			</Table.Header>

			<Table.Body>
				{#each table.getRowModel().rows as row (row.id)}
					<Table.Row>
						{#each row.getAllCells() as cell (cell.column.id)}
							<td
								animate:flip={{
									duration: flipDurationMs
								}}
								data-slot="table-cell"
								class="truncate p-2 align-middle whitespace-nowrap transition-opacity has-[[role=checkbox]]:pr-0"
								style={`width: ${cell.column.getSize()}px; opacity: ${draggedColumnId === cell.column.id ? 0.8 : 1};`}
							>
								<FlexRender {cell} />
							</td>
						{/each}
					</Table.Row>
				{/each}

				{#if table.getRowModel().rows.length === 0}
					<Table.Row>
						<Table.Cell
							class="h-24 text-center"
							colspan={columns.length}
						>
							No results.
						</Table.Cell>
					</Table.Row>
				{/if}
			</Table.Body>
		</Table.Root>
	</div>

	<p class="mt-4 text-center text-sm text-muted-foreground">
		Drag columns by their handles. Made with
		<FaviconLink
			href="https://tanstack.com/table"
			rel="noopener noreferrer"
			target="_blank"
			class="font-medium"
		>
			TanStack Table
		</FaviconLink>
		and
		<FaviconLink
			class="font-medium"
			href="https://github.com/isaacHagoel/svelte-dnd-action"
			rel="noopener noreferrer"
			target="_blank"
		>
			svelte-dnd-action
		</FaviconLink>
	</p>
</div>

<style>
	:global(#dnd-action-dragged-el) {
		border: 0 !important;
		outline: none !important;
		box-shadow: none !important;
	}
</style>
