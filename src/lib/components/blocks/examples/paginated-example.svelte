<script lang="ts">
	import ChevronDownIcon from "@lucide/svelte/icons/chevron-down";
	import ChevronUpIcon from "@lucide/svelte/icons/chevron-up";
	import {
		columnOrderingFeature,
		columnPinningFeature,
		columnResizingFeature,
		columnSizingFeature,
		createPaginatedRowModel,
		createSortedRowModel,
		createTable,
		FlexRender,
		renderComponent,
		renderSnippet,
		rowPaginationFeature,
		rowSelectionFeature,
		rowSortingFeature,
		sortFn_alphanumeric,
		sortFn_text,
		tableFeatures,
		type ColumnDef
	} from "@tanstack/svelte-table";
	import { onMount } from "svelte";

	import HeaderCheckbox from "$table/header-checkbox";
	import PageSizeSelector from "$table/page-size-selector";
	import Pagination from "$table/pagination";
	import RowCheckbox from "$table/row-checkbox";
	import {
		Badge,
		type BadgeVariant
	} from "$lib/components/ui/spell/badge";
	import * as Table from "$lib/components/ui/table";
	import { cn } from "$lib/utils";
	import PaginationArrow from "$table/pagination-arrow";

	type Item = {
		id: number;
		name: string;
		email: string;
		location: string;
		flag: string;
		status: "Active" | "Inactive" | "Pending";
		balance: number;
	};

	// Change these variants to quickly customize the status colors:
	// https://sv-animations.vercel.app/spell/badge
	const statusVariants = {
		Active: "green",
		Pending: "yellow",
		Inactive: "slate"
	} as const satisfies Record<Item["status"], BadgeVariant>;

	let data = $state<Item[]>([]);

	const features = tableFeatures({
		rowPaginationFeature,
		paginatedRowModel: createPaginatedRowModel(),
		rowSelectionFeature,
		rowSortingFeature,
		sortedRowModel: createSortedRowModel(),
		sortFns: {
			alphanumeric: sortFn_alphanumeric,
			text: sortFn_text
		},
		columnSizingFeature,
		columnResizingFeature,
		columnOrderingFeature,
		columnPinningFeature
	});

	const columns: ColumnDef<typeof features, Item, any>[] = [
		{
			id: "select",
			size: 44,
			enableSorting: false,
			header: ({ table }) => {
				const allSelected = table.getIsAllPageRowsSelected();

				return renderComponent(HeaderCheckbox, {
					checked: allSelected,
					indeterminate:
						table.getIsSomePageRowsSelected() && !allSelected,
					onCheckedChange: (checked) =>
						table.toggleAllPageRowsSelected(checked),
					"aria-label": "Select all rows on this page"
				});
			},
			cell: ({ row }) =>
				renderComponent(RowCheckbox, {
					checked: row.getIsSelected(),
					onCheckedChange: (checked) => row.toggleSelected(checked),
					"aria-label": `Select ${row.original.name}`
				})
		},
		{
			accessorKey: "name",
			header: "Name",
			size: 180,
			cell: ({ row }) =>
				renderSnippet(nameCell, { name: row.original.name })
		},
		{
			accessorKey: "email",
			header: "Email",
			size: 220
		},
		{
			accessorKey: "location",
			header: "Location",
			size: 200,
			cell: ({ row }) =>
				renderSnippet(locationCell, {
					flag: row.original.flag,
					location: row.original.location
				})
		},
		{
			accessorKey: "status",
			header: "Status",
			size: 120,
			cell: ({ row }) =>
				renderSnippet(statusCell, { status: row.original.status })
		},
		{
			accessorKey: "balance",
			header: "Balance",
			size: 140,
			cell: ({ row }) =>
				renderSnippet(balanceCell, { balance: row.original.balance })
		}
	];

	const table = createTable({
		features,
		columns,
		enableSortingRemoval: false,
		get data() {
			return data;
		},
		initialState: {
			pagination: { pageIndex: 0, pageSize: 10 },
			sorting: [{ id: "name", desc: false }]
		}
	});

	const pagination = $derived(table.atoms.pagination.get());
	const totalRows = $derived(data.length);
	const firstVisibleRow = $derived(
		totalRows === 0 ? 0 : pagination.pageIndex * pagination.pageSize + 1
	);
	const lastVisibleRow = $derived(
		Math.min((pagination.pageIndex + 1) * pagination.pageSize, totalRows)
	);

	onMount(async () => {
		const response = await fetch("/dummy-data/data.json");
		data = (await response.json()) as Item[];
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

{#snippet statusCell({ status }: { status: Item["status"] })}
	<Badge variant={statusVariants[status]}>{status}</Badge>
{/snippet}

{#snippet balanceCell({ balance }: { balance: number })}
	<div class="text-right tabular-nums">
		{new Intl.NumberFormat("en-US", {
			currency: "USD",
			style: "currency"
		}).format(balance)}
	</div>
{/snippet}

<div class="space-y-4">
	<div class="w-full overflow-x-auto rounded-lg border">
		<Table.Root
			class="table-fixed"
			style={`min-width: ${table.getTotalSize()}px;`}
		>
			<Table.Header>
				{#each table.getHeaderGroups() as headerGroup (headerGroup.id)}
					<Table.Row class="hover:bg-transparent">
						{#each headerGroup.headers as header (header.id)}
							<Table.Head
								aria-sort={header.column.getIsSorted() === "asc"
									? "ascending"
									: header.column.getIsSorted() === "desc"
										? "descending"
										: "none"}
								class={cn(
									"h-11",
									header.column.id === "balance" &&
										"text-right"
								)}
								style={`width: ${header.getSize()}px;`}
							>
								{#if !header.isPlaceholder}
									{#if header.column.getCanSort()}
										<button
											type="button"
											class={cn(
												"flex h-full w-full cursor-pointer items-center justify-between gap-2 text-left select-none",
												header.column.id ===
													"balance" && "justify-end"
											)}
											onclick={header.column.getToggleSortingHandler()}
										>
											<span class="truncate"
												><FlexRender {header} /></span
											>
											{#if header.column.getIsSorted() === "asc"}
												<ChevronUpIcon
													aria-hidden="true"
													class="size-4 shrink-0 opacity-60"
												/>
											{:else if header.column.getIsSorted() === "desc"}
												<ChevronDownIcon
													aria-hidden="true"
													class="size-4 shrink-0 opacity-60"
												/>
											{/if}
										</button>
									{:else}
										<FlexRender {header} />
									{/if}
								{/if}
							</Table.Head>
						{/each}
					</Table.Row>
				{/each}
			</Table.Header>

			<Table.Body>
				{#each table.getRowModel().rows as row (row.id)}
					<Table.Row
						data-state={row.getIsSelected()
							? "selected"
							: undefined}
					>
						{#each row.getAllCells() as cell (cell.id)}
							<Table.Cell
								class={cn(
									"truncate whitespace-nowrap",
									cell.column.id === "balance" && "text-right"
								)}
							>
								<FlexRender {cell} />
							</Table.Cell>
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

	<div class="flex flex-wrap items-center justify-between gap-4">
		<PageSizeSelector
			pageSize={pagination.pageSize}
			setPageSize={(pageSize) => table.setPageSize(pageSize)}
		/>

		<div class="flex flex-wrap items-center justify-end gap-4">
			<PaginationArrow
				currentPage={pagination.pageIndex + 1}
				pageCount={table.getPageCount()}
				canPreviousPage={table.getCanPreviousPage()}
				canNextPage={table.getCanNextPage()}
				onPrevious={() => table.previousPage()}
				onNext={() => table.nextPage()}
				onGoToPage={(page) => table.setPageIndex(page - 1)}
				{firstVisibleRow}
				{lastVisibleRow}
				{totalRows}
			/>
		</div>
	</div>
</div>
