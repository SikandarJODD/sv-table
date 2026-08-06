<script lang="ts">
	import CircleCheckIcon from "@lucide/svelte/icons/circle-check";
	import CircleOffIcon from "@lucide/svelte/icons/circle-off";
	import Clock3Icon from "@lucide/svelte/icons/clock-3";
	import XIcon from "@lucide/svelte/icons/x";
	import {
		columnFacetingFeature,
		columnFilteringFeature,
		createFacetedRowModel,
		createFacetedUniqueValues,
		createFilteredRowModel,
		createTable,
		filterFn_arrHas,
		tableFeatures,
		type ColumnDef
	} from "@tanstack/svelte-table";

	import DataTableFacetedFilter, {
		type DataTableFacetedFilterOption
	} from "$lib/components/table/data-table-faceted-filter";
	import { makePeople, type Person } from "$lib/seed/seed";
	import { Button } from "$lib/components/ui/button";
	import { Badge } from "$lib/components/ui/spell/badge";
	import * as Table from "$lib/components/ui/table";

	const people = makePeople(400, 84);

	const statusOptions: DataTableFacetedFilterOption[] = [
		{ label: "Active", value: "active", icon: CircleCheckIcon },
		{ label: "Pending", value: "pending", icon: Clock3Icon },
		{ label: "Inactive", value: "inactive", icon: CircleOffIcon }
	];

	const departmentOptions: DataTableFacetedFilterOption[] = [
		{ label: "Engineering", value: "Engineering" },
		{ label: "Design", value: "Design" },
		{ label: "Product", value: "Product" },
		{ label: "Sales", value: "Sales" },
		{ label: "Support", value: "Support" },
		{ label: "Operations", value: "Operations" }
	];

	const features = tableFeatures({
		columnFilteringFeature,
		columnFacetingFeature,
		filteredRowModel: createFilteredRowModel(),
		facetedRowModel: createFacetedRowModel(),
		facetedUniqueValues: createFacetedUniqueValues(),
		filterFns: {
			arrHas: filterFn_arrHas
		}
	});

	const columns: ColumnDef<typeof features, Person>[] = [
		{
			id: "name",
			header: "Name",
			accessorFn: (person) => `${person.firstName} ${person.lastName}`
		},
		{
			accessorKey: "department",
			header: "Department",
			filterFn: "arrHas"
		},
		{
			accessorKey: "country",
			header: "Country"
		},
		{
			accessorKey: "status",
			header: "Status",
			filterFn: "arrHas"
		},
		{
			accessorKey: "joinedAt",
			header: "Joined"
		}
	];

	const table = createTable({
		features,
		columns,
		get data() {
			return people;
		}
	});

	const statusColumn = table.getColumn("status")!;
	const departmentColumn = table.getColumn("department")!;

	let columnFilters = $derived(table.atoms.columnFilters.get());
	let filteredRows = $derived(table.getFilteredRowModel().rows);
	let visibleRows = $derived(filteredRows.slice(0, 12));

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
	<div class="flex flex-wrap items-center gap-2">
		<DataTableFacetedFilter
			column={statusColumn}
			title="Status"
			options={statusOptions}
		/>
		<DataTableFacetedFilter
			column={departmentColumn}
			title="Department"
			options={departmentOptions}
		/>

		{#if columnFilters.length > 0}
			<Button
				variant="ghost"
				size="sm"
				class="h-8 px-2"
				onclick={() => table.resetColumnFilters(true)}
			>
				Reset
				<XIcon />
			</Button>
		{/if}

		<span class="ml-auto text-sm whitespace-nowrap text-muted-foreground">
			{filteredRows.length.toLocaleString()} of {people.length.toLocaleString()}
			people
		</span>
	</div>

	<div class="overflow-x-auto rounded-lg border">
		<Table.Root>
			<Table.Header>
				<Table.Row>
					{#each columns as column (String(column.header))}
						<Table.Head>{String(column.header)}</Table.Head>
					{/each}
				</Table.Row>
			</Table.Header>
			<Table.Body>
				{#if visibleRows.length === 0}
					<Table.Row>
						<Table.Cell
							colspan={columns.length}
							class="h-24 text-center text-muted-foreground"
						>
							No people match the selected filters.
						</Table.Cell>
					</Table.Row>
				{:else}
					{#each visibleRows as row (row.id)}
						<Table.Row>
							<Table.Cell class="font-medium">
								{row.original.firstName}
								{row.original.lastName}
							</Table.Cell>
							<Table.Cell>{row.original.department}</Table.Cell>
							<Table.Cell class="text-muted-foreground">
								{row.original.country}
							</Table.Cell>
							<Table.Cell>
								<Badge
									variant={getStatusVariant(
										row.original.status
									)}
								>
									{formatStatus(row.original.status)}
								</Badge>
							</Table.Cell>
							<Table.Cell class="text-muted-foreground">
								{row.original.joinedAt}
							</Table.Cell>
						</Table.Row>
					{/each}
				{/if}
			</Table.Body>
		</Table.Root>
	</div>

	<p class="text-xs text-muted-foreground">
		Showing the first {Math.min(12, filteredRows.length)} matching rows. Select
		one facet, then open the other to see its counts update.
	</p>
</div>
