<script lang="ts">
	import {
		createPaginatedRowModel,
		createTable,
		rowPaginationFeature,
		tableFeatures
	} from "@tanstack/svelte-table";
	import type { ColumnDef } from "@tanstack/svelte-table";
	import PageSizeSelector from "$table/page-size-selector";

	type Row = { id: number };

	const data: Row[] = Array.from({ length: 100 }, (_, index) => ({
		id: index + 1
	}));

	const features = tableFeatures({
		rowPaginationFeature,
		paginatedRowModel: createPaginatedRowModel()
	});

	const columns: ColumnDef<typeof features, Row>[] = [
		{ accessorKey: "id", header: "ID" }
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

	const pagination = $derived(table.atoms.pagination.get());
</script>

<div class="flex flex-col items-center gap-3">
	<PageSizeSelector
		pageSize={pagination.pageSize}
		setPageSize={(pageSize) => table.setPageSize(pageSize)}
	/>
	<p class="text-sm text-muted-foreground">
		Showing {pagination.pageSize} rows per page
	</p>
</div>
