<script lang="ts">
	import DataTableFacetedFilter, {
		type DataTableFacetedFilterColumn
	} from "$table/data-table-faceted-filter";

	const options = [
		{ label: "Active", value: "active" },
		{ label: "Pending", value: "pending" },
		{ label: "Inactive", value: "inactive" }
	];
	const facets = new Map([
		["active", 84],
		["pending", 31],
		["inactive", 12]
	]);

	let selected = $state(["active", "pending"]);
	const column: DataTableFacetedFilterColumn = {
		getFilterValue: () => selected,
		setFilterValue: (value) => (selected = value ?? []),
		getFacetedUniqueValues: () => facets
	};
</script>

<div class="grid w-full max-w-2xl grid-cols-2 items-end gap-6">
	<div class="grid gap-2">
		<span class="text-sm text-muted-foreground">With counts</span>
		<DataTableFacetedFilter
			{column}
			title="Status"
			{options}
			showCounts={true}
		/>
	</div>

	<div class="grid gap-2">
		<span class="text-sm text-muted-foreground">Without counts</span>
		<DataTableFacetedFilter
			{column}
			title="Status"
			{options}
			showCounts={false}
		/>
	</div>
</div>
