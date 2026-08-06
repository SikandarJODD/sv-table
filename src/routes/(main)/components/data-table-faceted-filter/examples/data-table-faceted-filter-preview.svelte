<script lang="ts">
	import CircleCheckIcon from "@lucide/svelte/icons/circle-check";
	import CircleOffIcon from "@lucide/svelte/icons/circle-off";
	import Clock3Icon from "@lucide/svelte/icons/clock-3";
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
	} from "$table/data-table-faceted-filter";
	import { makePeople, type Person } from "$lib/seed/seed";
	import { Badge } from "$lib/components/ui/spell/badge";
	import * as Table from "$lib/components/ui/table";

	const people = makePeople(400, 84);

	const statusOptions: DataTableFacetedFilterOption[] = [
		{ label: "Active", value: "active", icon: CircleCheckIcon },
		{ label: "Pending", value: "pending", icon: Clock3Icon },
		{ label: "Inactive", value: "inactive", icon: CircleOffIcon }
	];

	const features = tableFeatures({
		columnFilteringFeature,
		columnFacetingFeature,
		filteredRowModel: createFilteredRowModel(),
		facetedRowModel: createFacetedRowModel(),
		facetedUniqueValues: createFacetedUniqueValues(),
		filterFns: { arrHas: filterFn_arrHas }
	});

	const columns: ColumnDef<typeof features, Person>[] = [
		{
			id: "name",
			header: "Name",
			accessorFn: (person) => `${person.firstName} ${person.lastName}`
		},
		{ accessorKey: "department", header: "Department" },
		{
			accessorKey: "status",
			header: "Status",
			filterFn: "arrHas"
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
	let filteredRows = $derived(table.getFilteredRowModel().rows);
	let visibleRows = $derived(filteredRows.slice(0, 8));

	function formatStatus(status: Person["status"]) {
		return status.charAt(0).toUpperCase() + status.slice(1);
	}

	function getStatusVariant(status: Person["status"]) {
		return status === "active"
			? "emerald"
			: status === "pending"
				? "amber"
				: "secondary";
	}
</script>

<div class="flex w-full flex-col gap-3">
	<div class="flex flex-wrap items-center gap-2">
		<DataTableFacetedFilter
			column={statusColumn}
			title="Status"
			options={statusOptions}
		/>
		<span class="ml-auto text-sm text-muted-foreground">
			{filteredRows.length} results
		</span>
	</div>

	<div class="overflow-hidden rounded-lg border">
		<Table.Root>
			<Table.Header>
				<Table.Row>
					<Table.Head>Name</Table.Head>
					<Table.Head>Department</Table.Head>
					<Table.Head>Status</Table.Head>
				</Table.Row>
			</Table.Header>
			<Table.Body>
				{#each visibleRows as row (row.id)}
					<Table.Row>
						<Table.Cell class="font-medium">
							{row.original.firstName}
							{row.original.lastName}
						</Table.Cell>
						<Table.Cell class="text-muted-foreground">
							{row.original.department}
						</Table.Cell>
						<Table.Cell>
							<Badge
								variant={getStatusVariant(row.original.status)}
							>
								{formatStatus(row.original.status)}
							</Badge>
						</Table.Cell>
					</Table.Row>
				{/each}
			</Table.Body>
		</Table.Root>
	</div>
</div>
