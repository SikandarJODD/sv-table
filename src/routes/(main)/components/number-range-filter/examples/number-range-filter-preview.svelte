<script lang="ts">
	import NumberRangeFilter, {
		type NumberRangeFilterValue
	} from "$table/number-range-filter";

	let range = $state<NumberRangeFilterValue | undefined>({
		min: 500,
		max: 2500
	});

	const currency = new Intl.NumberFormat("en-US", {
		style: "currency",
		currency: "USD",
		maximumFractionDigits: 0
	});

	let summary = $derived(
		range
			? `${range.min ?? "Any"} to ${range.max ?? "Any"}`
			: "No price filter"
	);
</script>

<div class="flex w-full flex-col gap-4 rounded-xl border bg-card p-4 shadow-xs">
	<NumberRangeFilter
		bind:value={range}
		title="Price"
		min={0}
		max={5000}
		step={100}
		formatValue={(value) => currency.format(value)}
	/>

	<p class="text-sm text-muted-foreground">Applied range: {summary}</p>
</div>
