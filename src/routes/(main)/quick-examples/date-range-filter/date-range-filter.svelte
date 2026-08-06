<script lang="ts">
	import {
		columnFilteringFeature,
		createFilteredRowModel,
		createTable,
		filterFn_inDateRange,
		tableFeatures,
		type ColumnDef
	} from "@tanstack/svelte-table";

	import DateRangeFilter, {
		type DateRangeFilterValue
	} from "$lib/components/table/date-range-filter";
	import { makePeople, type Person } from "$lib/seed/seed";
	import * as Table from "$lib/components/ui/table";

	const people = makePeople(400, 93);

	const features = tableFeatures({
		columnFilteringFeature,
		filteredRowModel: createFilteredRowModel(),
		filterFns: { inDateRange: filterFn_inDateRange }
	});

	const columns: ColumnDef<typeof features, Person, any>[] = [
		{
			id: "name",
			header: "Name",
			accessorFn: (person) => `${person.firstName} ${person.lastName}`
		},
		{ accessorKey: "department", header: "Department" },
		{
			id: "joinedAt",
			header: "Joined",
			accessorFn: (person) => new Date(`${person.joinedAt}T00:00:00`),
			filterFn: "inDateRange"
		}
	];

	const table = createTable({
		features,
		columns,
		get data() {
			return people;
		}
	});

	const joinedColumn = table.getColumn("joinedAt")!;
	let range = $state<DateRangeFilterValue | undefined>();
	let filteredRows = $derived(table.getFilteredRowModel().rows);
	let visibleRows = $derived(filteredRows.slice(0, 10));

	function changeRange(value: DateRangeFilterValue | undefined) {
		range = value;
		joinedColumn.setFilterValue(
			value ? [value.start, value.end] : undefined
		);
	}

	const dateFormatter = new Intl.DateTimeFormat("en-US", {
		month: "short",
		day: "numeric",
		year: "numeric"
	});
</script>

<div class="flex w-full flex-col gap-4">
	<div class="flex flex-wrap items-center gap-2">
		<DateRangeFilter
			value={range}
			onValueChange={changeRange}
			title="Joined"
		/>

		<span class="ml-auto text-sm whitespace-nowrap text-muted-foreground">
			{filteredRows.length.toLocaleString()} of {people.length.toLocaleString()}
			people
		</span>
	</div>

	<div class="overflow-x-auto rounded-lg border">
		<Table.Root>
			<Table.Header>
				<Table.Row>
					<Table.Head>Name</Table.Head>
					<Table.Head>Department</Table.Head>
					<Table.Head>Joined</Table.Head>
				</Table.Row>
			</Table.Header>
			<Table.Body>
				{#if visibleRows.length === 0}
					<Table.Row>
						<Table.Cell
							colspan={columns.length}
							class="h-24 text-center text-muted-foreground"
						>
							No people joined during this date range.
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
								{dateFormatter.format(
									row.getValue("joinedAt") as Date
								)}
							</Table.Cell>
						</Table.Row>
					{/each}
				{/if}
			</Table.Body>
		</Table.Root>
	</div>

	<p class="text-xs text-muted-foreground">
		Showing the first {Math.min(10, filteredRows.length)} matching rows. The built-in
		date filter treats both endpoints as inclusive.
	</p>
</div>
