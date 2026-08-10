<script lang="ts">
	import {
		columnFacetingFeature,
		columnFilteringFeature,
		createFacetedRowModel,
		createFacetedUniqueValues,
		createFilteredRowModel,
		createTable,
		filterFn_arrHas,
		filterFn_includesString,
		filterFn_inNumberRange,
		FlexRender,
		tableFeatures,
		type ColumnDef
	} from "@tanstack/svelte-table";
	import { onMount } from "svelte";

	import DataTableFacetedFilter, {
		type DataTableFacetedFilterOption
	} from "$lib/components/table/data-table-faceted-filter";
	import DebounceInput from "$lib/components/table/debounce-input";
	import NumberRangeFilter, {
		type NumberRangeFilterValue
	} from "$lib/components/table/number-range-filter";
	import * as Table from "$lib/components/ui/table";

	type Item = {
		id: number;
		name: string;
		email: string;
		age: number;
		location: string;
		flag: string;
		status: "Active" | "Inactive" | "Pending";
		balance: number;
	};

	const statusOptions: DataTableFacetedFilterOption[] = [
		{ label: "Active", value: "Active" },
		{ label: "Pending", value: "Pending" },
		{ label: "Inactive", value: "Inactive" }
	];

	let data: Item[] = $state([]);
	let nameSearch = $state("");
	let ageRange = $state<NumberRangeFilterValue | undefined>();

	const features = tableFeatures({
		columnFilteringFeature,
		columnFacetingFeature,
		filteredRowModel: createFilteredRowModel(),
		facetedRowModel: createFacetedRowModel(),
		facetedUniqueValues: createFacetedUniqueValues(),
		filterFns: {
			arrHas: filterFn_arrHas,
			includesString: filterFn_includesString,
			inNumberRange: filterFn_inNumberRange
		}
	});

	const columns: ColumnDef<typeof features, Item>[] = [
		{
			accessorKey: "name",
			header: "Name",
			filterFn: "includesString"
		},
		{
			accessorKey: "email",
			header: "Email"
		},
		{
			accessorKey: "age",
			header: "Age",
			filterFn: "inNumberRange"
		},
		{
			accessorKey: "location",
			header: "Location"
		},
		{
			accessorKey: "status",
			header: "Status",
			filterFn: "arrHas"
		}
	];

	const table = createTable({
		columns,
		features,
		get data() {
			return data;
		}
	});

	const nameColumn = table.getColumn("name")!;
	const ageColumn = table.getColumn("age")!;
	const statusColumn = table.getColumn("status")!;
	let rows = $derived(table.getRowModel().rows);

	function filterByName(value: string) {
		nameColumn.setFilterValue(value || undefined);
	}

	function filterByAge(value: NumberRangeFilterValue | undefined) {
		ageRange = value;
		ageColumn.setFilterValue(value ? [value.min, value.max] : undefined);
	}

	onMount(async () => {
		const response = await fetch("/dummy-data/data.json");
		const items = (await response.json()) as Item[];
		data = items.slice(0, 200);
	});
</script>

<div class="flex w-full flex-col gap-4">
	<div class="flex flex-wrap items-center gap-2 p-1">
		<DebounceInput
			bind:value={nameSearch}
			onChange={filterByName}
			placeholder="Search by name..."
			debounce={300}
			class="w-full sm:w-64"
		/>

		<NumberRangeFilter
			value={ageRange}
			onValueChange={filterByAge}
			title="Age"
			placeholder="Any age"
			min={18}
			max={80}
		/>

		<DataTableFacetedFilter
			column={statusColumn}
			title="Status"
			options={statusOptions}
		/>

		<span class="ml-auto text-sm text-muted-foreground">
			{rows.length} results
		</span>
	</div>

	<div class="w-full overflow-auto rounded-lg border [&>div]:max-h-128">
		<Table.Root
			class="border-separate border-spacing-0 [&_td]:border-border [&_th]:border-b [&_th]:border-border [&_tr]:border-none [&_tr:not(:last-child)_td]:border-b"
		>
			<Table.Header
				class="sticky top-0 z-10 bg-background/90 backdrop-blur-xs"
			>
				{#each table.getHeaderGroups() as headerGroup (headerGroup.id)}
					<Table.Row class="hover:bg-transparent">
						{#each headerGroup.headers as header (header.id)}
							<Table.Head>
								{#if !header.isPlaceholder}
									<FlexRender {header} />
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
							<Table.Cell>
								<FlexRender {cell} />
							</Table.Cell>
						{/each}
					</Table.Row>
				{/each}

				{#if rows.length === 0}
					<Table.Row>
						<Table.Cell
							class="h-24 text-center"
							colspan={columns.length}
						>
							No results.
						</Table.Cell>
					</Table.Row>
				{/if}
			</Table.Body>
		</Table.Root>
	</div>
</div>
