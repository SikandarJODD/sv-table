<script lang="ts">
	import {
		columnFilteringFeature,
		type ColumnDef,
		createFilteredRowModel,
		createPaginatedRowModel,
		createTable,
		filterFn_includesString,
		globalFilteringFeature,
		rowPaginationFeature,
		tableFeatures
	} from "@tanstack/svelte-table";

	import DebounceInput from "$lib/components/table/debounce-input";
	import Pagination from "$lib/components/table/pagination";
	import { makePeople, type Person } from "$lib/seed/seed";
	import { Badge } from "$lib/components/ui/spell/badge";
	import * as Table from "$lib/components/ui/table";

	const people = makePeople(1_000, 27);

	const features = tableFeatures({
		columnFilteringFeature,
		globalFilteringFeature,
		rowPaginationFeature,
		filteredRowModel: createFilteredRowModel(),
		paginatedRowModel: createPaginatedRowModel(),
		filterFns: {
			includesString: filterFn_includesString
		}
	});

	const columns: ColumnDef<typeof features, Person, any>[] = [
		{
			id: "name",
			header: "Name",
			accessorFn: (person) => `${person.firstName} ${person.lastName}`
		},
		{
			id: "email",
			header: "Email",
			accessorKey: "email"
		},
		{
			id: "department",
			header: "Department",
			accessorKey: "department"
		},
		{
			id: "country",
			header: "Country",
			accessorKey: "country"
		},
		{
			id: "status",
			header: "Status",
			accessorKey: "status"
		}
	];

	const table = createTable({
		features,
		columns,
		get data() {
			return people;
		},
		globalFilterFn: "includesString",
		initialState: {
			pagination: {
				pageIndex: 0,
				pageSize: 10
			}
		}
	});

	let search = $state("");

	const pagination = $derived(table.atoms.pagination.get());
	const rows = $derived(table.getRowModel().rows);
	const filteredRowCount = $derived(table.getRowCount());
	const pageCount = $derived(table.getPageCount());
	const currentPage = $derived(pagination.pageIndex + 1);

	function searchPeople(value: string) {
		table.setGlobalFilter(value);
		table.setPageIndex(0);
	}

	function getCellText(person: Person, columnId: string) {
		switch (columnId) {
			case "name":
				return `${person.firstName} ${person.lastName}`;
			case "email":
				return person.email;
			case "department":
				return person.department;
			case "country":
				return person.country;
			default:
				return "";
		}
	}

	function formatStatus(status: Person["status"]) {
		return status.charAt(0).toUpperCase() + status.slice(1);
	}

	function getStatusVariant(status: Person["status"]) {
		switch (status) {
			case "active":
				return "emerald";
			case "pending":
				return "amber";
			default:
				return "secondary";
		}
	}
</script>

<div class="flex w-full flex-col gap-4">
	<div
		class="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between"
	>
		<DebounceInput
			bind:value={search}
			onChange={searchPeople}
			placeholder="Search 1,000 people..."
			class="w-full sm:max-w-60"
		/>

		<p class="text-sm whitespace-nowrap text-muted-foreground">
			{filteredRowCount.toLocaleString()} of {people.length.toLocaleString()}
			people
		</p>
	</div>

	<div class="overflow-x-auto rounded-lg border">
		<Table.Root>
			<Table.Header>
				{#each table.getHeaderGroups() as headerGroup (headerGroup.id)}
					<Table.Row>
						{#each headerGroup.headers as header (header.id)}
							<Table.Head>
								{String(
									header.column.columnDef.header ??
										header.column.id
								)}
							</Table.Head>
						{/each}
					</Table.Row>
				{/each}
			</Table.Header>

			<Table.Body>
				{#if rows.length === 0}
					<Table.Row>
						<Table.Cell
							colspan={columns.length}
							class="h-24 text-center text-muted-foreground"
						>
							No people match “{search}”.
						</Table.Cell>
					</Table.Row>
				{:else}
					{#each rows as row (row.id)}
						<Table.Row>
							{#each row.getAllCells() as cell (cell.id)}
								<Table.Cell
									class={cell.column.id === "email"
										? "text-muted-foreground"
										: undefined}
								>
									{#if cell.column.id === "status"}
										<Badge
											variant={getStatusVariant(
												row.original.status
											)}
										>
											{formatStatus(row.original.status)}
										</Badge>
									{:else}
										{getCellText(
											row.original,
											cell.column.id
										)}
									{/if}
								</Table.Cell>
							{/each}
						</Table.Row>
					{/each}
				{/if}
			</Table.Body>
		</Table.Root>
	</div>

	<Pagination
		{currentPage}
		{pageCount}
		canPreviousPage={table.getCanPreviousPage()}
		canNextPage={table.getCanNextPage()}
		onPrevious={() => table.previousPage()}
		onNext={() => table.nextPage()}
		onGoToPage={(page) => table.setPageIndex(page - 1)}
		class="justify-end"
	/>
</div>
