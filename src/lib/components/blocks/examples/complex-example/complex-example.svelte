<script lang="ts">
	import PlusIcon from "@lucide/svelte/icons/plus";
	import {
		createTable,
		renderComponent,
		renderSnippet,
		type ColumnDef
	} from "@tanstack/svelte-table";
	import { onMount } from "svelte";

	import DataTableFacetedFilter, {
		type DataTableFacetedFilterOption
	} from "$table/data-table-faceted-filter";
	import DataTableView from "$table/data-table-view";
	import DebounceInput from "$table/debounce-input";
	import HeaderCheckbox from "$table/header-checkbox";
	import PageSizeSelector from "$table/page-size-selector";
	import PaginationArrow from "$table/pagination-arrow";
	import RowCheckbox from "$table/row-checkbox";
	import { Button } from "$lib/components/ui/button";

	import { fetchData, type Person } from "./fetch-data";
	import Table from "./table.svelte";
	import { features } from "./table-features";
	import {
		balanceCell,
		locationCell,
		nameCell,
		statusCell
	} from "./table-snippets.svelte";

	const statusOptions: DataTableFacetedFilterOption[] = [
		{ label: "Active", value: "Active" },
		{ label: "Pending", value: "Pending" },
		{ label: "Inactive", value: "Inactive" }
	];

	let data = $state<Person[]>([]);
	let search = $state("");

	const columns: ColumnDef<typeof features, Person, any>[] = [
		{
			id: "select",
			size: 44,
			enableHiding: false,
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
			enableHiding: false,
			filterFn: "multiColumn",
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
			size: 180,
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
			filterFn: "arrHas",
			cell: ({ row }) =>
				renderSnippet(statusCell, { status: row.original.status })
		},
		{
			accessorKey: "performance",
			header: "Performance",
			size: 140
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

	const nameColumn = table.getColumn("name")!;
	const statusColumn = table.getColumn("status")!;
	const pagination = $derived(table.atoms.pagination.get());
	const filteredRowCount = $derived(table.getRowCount());
	const pageCount = $derived(table.getPageCount());
	const currentPage = $derived(pagination.pageIndex + 1);
	const firstVisibleRow = $derived(
		filteredRowCount === 0
			? 0
			: pagination.pageIndex * pagination.pageSize + 1
	);
	const lastVisibleRow = $derived(
		Math.min(
			(pagination.pageIndex + 1) * pagination.pageSize,
			filteredRowCount
		)
	);

	function filterUsers(value: string) {
		nameColumn.setFilterValue(value || undefined);
		table.setPageIndex(0);
	}

	onMount(async () => {
		data = await fetchData();
	});
</script>

<div class="space-y-4">
	<div class="flex flex-wrap items-center justify-between gap-3">
		<div class="flex flex-1 flex-wrap items-center gap-2 p-1">
			<DebounceInput
				bind:value={search}
				onChange={filterUsers}
				placeholder="Filter by name or email..."
				debounce={300}
				class="w-full sm:w-64"
			/>

			<DataTableFacetedFilter
				column={statusColumn}
				title="Status"
				options={statusOptions}
			/>

			<DataTableView {table} />
		</div>

		<Button variant="outline" size="sm">
			<PlusIcon aria-hidden="true" />
			Add user
		</Button>
	</div>

	<Table {table} />

	<div class="flex flex-wrap items-center justify-between gap-4">
		<PageSizeSelector
			pageSize={pagination.pageSize}
			setPageSize={(pageSize) => table.setPageSize(pageSize)}
		/>

		<div class="flex flex-wrap items-center justify-end gap-4">
			<PaginationArrow
				{currentPage}
				{pageCount}
				canPreviousPage={table.getCanPreviousPage()}
				canNextPage={table.getCanNextPage()}
				onPrevious={() => table.previousPage()}
				onNext={() => table.nextPage()}
				onGoToPage={(page) => table.setPageIndex(page - 1)}
				{firstVisibleRow}
				{lastVisibleRow}
				totalRows={filteredRowCount}
			/>
		</div>
	</div>
</div>
