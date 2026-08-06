<script lang="ts">
	import DateRangeFilter, {
		type DateRangeFilterValue
	} from "$table/date-range-filter";

	let range = $state<DateRangeFilterValue | undefined>({
		start: new Date(2026, 7, 1),
		end: new Date(2026, 7, 7)
	});

	const formatter = new Intl.DateTimeFormat("en-US", {
		dateStyle: "full"
	});

	let summary = $derived(
		range?.start && range.end
			? `${formatter.format(range.start)} through ${formatter.format(range.end)}`
			: "No date range applied"
	);
</script>

<div class="flex w-full flex-col gap-4 rounded-xl border bg-card p-4 shadow-xs">
	<div class="flex flex-wrap items-center gap-3">
		<DateRangeFilter
			bind:value={range}
			title="Created"
			min={new Date(2025, 0, 1)}
			max={new Date(2026, 11, 31)}
		/>

		<span class="text-sm text-muted-foreground">
			Choose a preset or a custom range.
		</span>
	</div>

	<div class="rounded-lg bg-muted/50 px-4 py-3">
		<p
			class="text-xs font-medium tracking-wide text-muted-foreground uppercase"
		>
			Applied filter
		</p>
		<p class="mt-1 text-sm font-medium">{summary}</p>
	</div>
</div>
