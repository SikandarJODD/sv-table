<!-- routes/examples/pagination/basic/+page.svelte -->
<script lang="ts">
	import {
		createTable,
		tableFeatures,
		rowPaginationFeature,
		createPaginatedRowModel,
		FlexRender
	} from "@tanstack/svelte-table";
	import type { ColumnDef } from "@tanstack/svelte-table";
	import Pagination from "$table/pagination";

	type Person = { firstName: string; age: number };

	const data: Person[] = Array.from({ length: 87 }, (_, i) => ({
		firstName: `Person ${i + 1}`,
		age: 20 + (i % 40)
	}));

	// Register the pagination feature + its client-side row model
	const features = tableFeatures({
		rowPaginationFeature,
		paginatedRowModel: createPaginatedRowModel()
	});

	const columns: ColumnDef<typeof features, Person>[] = [
		{ accessorKey: "firstName", header: "Name" },
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

	// Derived reads from the table — this is the ONLY place in the
	// page that talks to TanStack Table's pagination API. Everything
	// below just receives plain values/callbacks.
	let pagination = $derived(table.atoms.pagination.get());
</script>

<div></div>
<Pagination
	currentPage={pagination.pageIndex + 1}
	pageCount={table.getPageCount()}
	canPreviousPage={table.getCanPreviousPage()}
	canNextPage={table.getCanNextPage()}
	onPrevious={() => table.previousPage()}
	onNext={() => table.nextPage()}
	onGoToPage={(page) => table.setPageIndex(page - 1)}
/>
