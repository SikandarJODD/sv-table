<script lang="ts">
	import PlusIcon from "@lucide/svelte/icons/plus";
	import { createTable } from "@tanstack/svelte-table";
	import { onMount } from "svelte";

	import DataTableFacetedFilter from "$table/data-table-faceted-filter";
	import DataTableView from "$table/data-table-view";
	import DebounceInput from "$table/debounce-input";
	import PageSizeSelector from "$table/page-size-selector";
	import PaginationArrow from "$table/pagination-arrow";
	import { Button } from "$lib/components/ui/button";

	import { fetchData, type Person } from "./fetch-data";
	import Table from "./table.svelte";
	import { columns, features, statusOptions } from "./table-config";

	let data = $state<Person[]>([]);
	let search = $state("");

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
