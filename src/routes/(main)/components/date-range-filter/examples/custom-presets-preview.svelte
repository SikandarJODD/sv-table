<script lang="ts">
	import DateRangeFilter, {
		type DateRangeFilterPreset,
		type DateRangeFilterValue
	} from "$table/date-range-filter";

	function localDate(date: Date) {
		return new Date(date.getFullYear(), date.getMonth(), date.getDate());
	}

	const presets: DateRangeFilterPreset[] = [
		{
			label: "This week",
			getValue: (today) => {
				const end = localDate(today);
				const start = localDate(today);
				const day = start.getDay() || 7;
				start.setDate(start.getDate() - day + 1);
				return { start, end };
			}
		},
		{
			label: "Previous month",
			getValue: (today) => ({
				start: new Date(today.getFullYear(), today.getMonth() - 1, 1),
				end: new Date(today.getFullYear(), today.getMonth(), 0)
			})
		},
		{
			label: "Year to date",
			getValue: (today) => ({
				start: new Date(today.getFullYear(), 0, 1),
				end: localDate(today)
			})
		}
	];

	let range = $state<DateRangeFilterValue | undefined>();

	const formatter = new Intl.DateTimeFormat("en-US", {
		month: "short",
		day: "numeric",
		year: "numeric"
	});

	let summary = $derived(
		range?.start && range.end
			? formatter.formatRange(range.start, range.end)
			: "Choose a custom preset"
	);
</script>

<div class="flex w-full flex-col gap-3 rounded-lg border bg-card p-4">
	<DateRangeFilter
		bind:value={range}
		title="Updated"
		{presets}
		numberOfMonths={1}
	/>
	<p class="text-sm text-muted-foreground">{summary}</p>
</div>
