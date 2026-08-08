<script lang="ts">
	import BasicDataTable from "$blocks/examples/basic-data-table.svelte";
	import CustomFiltersExample from "$blocks/examples/custom-filters-example.svelte";
	import DataTableFiltersExample from "$blocks/examples/data-table-filters-example.svelte";
	import RowSelection from "$blocks/examples/row-selection.svelte";
</script>

<div class="space-y-12">
	<RowSelection />
	<DataTableFiltersExample />
	<CustomFiltersExample />
</div>

<style>
</style>
