<!-- routes/examples/pagination/basic/+page.svelte -->
<script lang="ts">
	import {
		createTable,
		tableFeatures,
		rowPaginationFeature,
		createPaginatedRowModel
	} from "@tanstack/svelte-table";
	import type { ColumnDef } from "@tanstack/svelte-table";
	import * as Table from "$lib/components/ui/table";
	import Pagination from "$table/pagination";
	import PaginationArrow from "$table/pagination-arrow";
	import { makePeople, type Person } from "$lib/seed/seed";

	const data: Person[] = makePeople(300);

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
			return data;
		},
		initialState: {
			pagination: { pageIndex: 0, pageSize: 10 }
		}
	});

	let pagination = $derived(table.atoms.pagination.get());
</script>

<div class="space-y-4 p-6">
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
				{#each table.getRowModel().rows as row (row.id)}
					<Table.Row>
						{#each row.getAllCells() as cell (cell.id)}
							<Table.Cell>{cell.getValue()}</Table.Cell>
						{/each}
					</Table.Row>
				{/each}
			</Table.Body>
		</Table.Root>
	</div>
	<div class="flex items-center justify-between">
		<PaginationArrow
			currentPage={pagination.pageIndex + 1}
			pageCount={table.getPageCount()}
			canPreviousPage={table.getCanPreviousPage()}
			canNextPage={table.getCanNextPage()}
			onPrevious={() => table.previousPage()}
			onNext={() => table.nextPage()}
			onGoToPage={(page) => table.setPageIndex(page - 1)}
			pageSize={pagination.pageSize}
			totalItems={data.length}
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
