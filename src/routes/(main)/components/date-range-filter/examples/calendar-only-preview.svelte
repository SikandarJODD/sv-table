<script lang="ts">
	import DateRangeFilter, {
		type DateRangeFilterValue
	} from "$table/date-range-filter";

	let range = $state<DateRangeFilterValue | undefined>({
		start: new Date(2026, 4, 10),
		end: new Date(2026, 4, 18)
	});
</script>

<div class="flex w-full flex-col gap-3 rounded-lg border bg-card p-4">
	<DateRangeFilter
		bind:value={range}
		title="Delivery"
		presets={false}
		min={new Date(2026, 0, 1)}
		max={new Date(2026, 11, 31)}
		numberOfMonths={1}
		weekStartsOn={1}
		locale="en-GB"
	/>
	<p class="text-sm text-muted-foreground">
		Calendar only · 2026 dates · weeks start on Monday
	</p>
</div>
