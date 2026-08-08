<!-- routes/examples/pagination/basic/+page.svelte -->
<script lang="ts">
	import {
		createTable,
		tableFeatures,
		rowPaginationFeature,
		createPaginatedRowModel
	} from "@tanstack/svelte-table";
	import type { ColumnDef } from "@tanstack/svelte-table";
	import DataTableEmpty from "$table/data-table-empty";
	import * as Table from "$lib/components/ui/table";
	import PageSizeSelector from "$table/page-size-selector";
	import Pagination from "$table/pagination";
	import PaginationArrow from "$table/pagination-arrow";
	import { Button } from "$lib/components/ui/button";
	import { Input } from "$lib/components/ui/input";
	import { makePeople, type Person } from "$lib/seed/seed";

	const data: Person[] = makePeople(300);
	let query = $state("");

	const filteredData = $derived.by(() => {
		const normalizedQuery = query.trim().toLowerCase();

		if (!normalizedQuery) return data;

		return data.filter((person) =>
			[
				person.firstName,
				person.lastName,
				person.email,
				person.department,
				person.country
			].some((value) => value.toLowerCase().includes(normalizedQuery))
		);
	});

	// Register the pagination feature + its client-side row model
	const features = tableFeatures({
		rowPaginationFeature,
		paginatedRowModel: createPaginatedRowModel()
	});

	const columns: ColumnDef<typeof features, Person>[] = [
		{ accessorKey: "firstName", header: "First Name" },
		{ accessorKey: "lastName", header: "Last Name" },
		{ accessorKey: "email", header: "Email" },
		{ accessorKey: "department", header: "Department" },
		{ accessorKey: "country", header: "Country" },
		{ accessorKey: "age", header: "Age" }
	];

	const table = createTable({
		features,
		columns,
		get data() {
			return filteredData;
		},
		initialState: {
			pagination: { pageIndex: 0, pageSize: 10 }
		}
	});

	let pagination = $derived(table.atoms.pagination.get());
	const rows = $derived(table.getRowModel().rows);
	const totalRows = $derived(filteredData.length);
	const firstVisibleRow = $derived(
		totalRows === 0 ? 0 : pagination.pageIndex * pagination.pageSize + 1
	);
	const lastVisibleRow = $derived(
		Math.min((pagination.pageIndex + 1) * pagination.pageSize, totalRows)
	);

	function clearSearch() {
		query = "";
		table.setPageIndex(0);
	}
</script>

<div class="space-y-4 p-6">
	<Input
		bind:value={query}
		type="search"
		placeholder="Search people..."
		aria-label="Search people"
		class="max-w-sm"
		oninput={() => table.setPageIndex(0)}
	/>

	<div class="overflow-hidden rounded-sm border">
		<Table.Root>
			<Table.Header>
				{#each table.getHeaderGroups() as headerGroup (headerGroup.id)}
					<Table.Row>
						{#each headerGroup.headers as header (header.id)}
							<Table.Head>
								{#if header.isPlaceholder}
									&nbsp;
								{:else}
									{header.column.columnDef.header ??
										header.column.id}
								{/if}
							</Table.Head>
						{/each}
					</Table.Row>
				{/each}
			</Table.Header>

			<Table.Body>
				{#each rows as row (row.id)}
					<Table.Row>
						{#each row.getAllCells() as cell (cell.id)}
							<Table.Cell>{cell.getValue()}</Table.Cell>
						{/each}
					</Table.Row>
				{:else}
					<DataTableEmpty
						colspan={columns.length}
						title="No people found"
						description="No rows match your current search."
					>
						{#snippet actions()}
							<Button
								variant="outline"
								size="sm"
								onclick={clearSearch}>Clear search</Button
							>
						{/snippet}
					</DataTableEmpty>
				{/each}
			</Table.Body>
		</Table.Root>
	</div>
	<div class="flex flex-wrap items-center justify-between gap-4">
		<PageSizeSelector
			pageSize={pagination.pageSize}
			setPageSize={(pageSize) => table.setPageSize(pageSize)}
		/>

		<div class="flex flex-wrap items-center gap-4">
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
			<Pagination
				currentPage={pagination.pageIndex + 1}
				pageCount={table.getPageCount()}
				canPreviousPage={table.getCanPreviousPage()}
				canNextPage={table.getCanNextPage()}
				onPrevious={() => table.previousPage()}
				onNext={() => table.nextPage()}
				onGoToPage={(page) => table.setPageIndex(page - 1)}
			/>
		</div>
	</div>
</div>
