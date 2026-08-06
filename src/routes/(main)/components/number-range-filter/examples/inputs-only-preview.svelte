<script lang="ts">
	import NumberRangeFilter, {
		type NumberRangeFilterValue
	} from "$table/number-range-filter";

	let range = $state<NumberRangeFilterValue | undefined>({
		min: 70,
		max: undefined
	});
</script>

<div class="flex w-full flex-col gap-3 rounded-xl border bg-card p-4">
	<NumberRangeFilter
		bind:value={range}
		title="Score"
		min={0}
		max={100}
		showSlider={false}
	/>

	<p class="text-sm text-muted-foreground">
		Use one input for an open-ended range.
	</p>
</div>
