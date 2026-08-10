<script lang="ts">
	import {
		type DragEndEvent,
		type DragOverEvent,
		type DragStartEvent
	} from "@dnd-kit/abstract";
	import { RestrictToHorizontalAxis } from "@dnd-kit/abstract/modifiers";
	import { move } from "@dnd-kit/helpers";
	import { DragDropProvider } from "@dnd-kit/svelte";
	import {
		createTable,
		createTableState,
		renderSnippet,
		type ColumnDef,
		type SortingState
	} from "@tanstack/svelte-table";
	import { onMount } from "svelte";

	import * as Table from "$lib/components/ui/table";

	import DragAlongCell from "./drag-along-cell.svelte";
	import DraggableTableHeader from "./draggable-table-header.svelte";
	import {
		draggableTableFeatures,
		type DraggableTableFeatures
	} from "./table-features";
	import type { Item } from "./types";

	let data = $state<Item[]>([]);
	let activeColumnId = $state<string | null>(null);
	let columnOrder = $state([
		"name",
		"email",
		"location",
		"status",
		"balance"
	]);
	let columnOrderSnapshot: string[] = [];

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
				return columnOrder;
			},
			get sorting() {
				return sorting();
			}
		},
		onSortingChange: setSorting
	});

	function onDragStart(event: DragStartEvent) {
		columnOrderSnapshot = columnOrder.slice();
		activeColumnId = String(event.operation.source?.id ?? "");
	}

	function onDragOver(event: DragOverEvent) {
		columnOrder = move(columnOrder, event);
	}

	function onDragEnd(event: DragEndEvent) {
		if (event.canceled) columnOrder = columnOrderSnapshot;
		activeColumnId = null;
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

<DragDropProvider
	modifiers={[RestrictToHorizontalAxis]}
	{onDragStart}
	{onDragOver}
	{onDragEnd}
>
	<div>
		<div class="w-full overflow-hidden rounded-lg border">
			<Table.Root
				class="table-fixed"
				style={`width: ${table.getTotalSize()}px;`}
			>
				<Table.Header>
					<Table.Row
						aria-label="Draggable table columns"
						class="bg-muted/50 hover:bg-muted/50"
					>
						{#each columnOrder as columnId, index (columnId)}
							{@const header = table
								.getLeafHeaders()
								.find((item) => item.column.id === columnId)}
							{#if header}
								<DraggableTableHeader {header} {index} />
							{/if}
						{/each}
					</Table.Row>
				</Table.Header>

				<Table.Body>
					{#each table.getRowModel().rows as row (row.id)}
						<Table.Row>
							{#each columnOrder as columnId, index (columnId)}
								{@const cell =
									row.getAllCellsByColumnId()[columnId]}
								{#if cell}
									<DragAlongCell
										{cell}
										{index}
										isDragging={activeColumnId === columnId}
									/>
								{/if}
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
			<a
				class="underline hover:text-foreground"
				href="https://tanstack.com/table"
				rel="noopener noreferrer"
				target="_blank"
			>
				TanStack Table
			</a>
			and
			<a
				class="underline hover:text-foreground"
				href="https://dndkit.com/svelte/quickstart/"
				rel="noopener noreferrer"
				target="_blank"
			>
				dnd kit for Svelte
			</a>
		</p>
	</div>
</DragDropProvider>
