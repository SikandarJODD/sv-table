<script lang="ts">
	import ChevronLeftIcon from "@lucide/svelte/icons/chevron-left";
	import ChevronRightIcon from "@lucide/svelte/icons/chevron-right";
	import { Calendar as CalendarPrimitive } from "bits-ui";
	import type { DateValue } from "@internationalized/date";

	let {
		value = $bindable<DateValue | undefined>(),
		onValueChange
	}: {
		value?: DateValue;
		onValueChange?: (value: DateValue | undefined) => void;
	} = $props();
</script>

<CalendarPrimitive.Root
	type="single"
	{value}
	{onValueChange}
	initialFocus
	fixedWeeks
	weekdayFormat="short"
	class="w-fit bg-background p-3"
>
	{#snippet children({ months, weekdays })}
		<div class="relative">
			<div
				class="absolute inset-x-0 top-0 flex items-center justify-between"
			>
				<CalendarPrimitive.PrevButton
					class="inline-flex size-8 items-center justify-center rounded-md hover:bg-accent"
					><ChevronLeftIcon
						class="size-4"
					/></CalendarPrimitive.PrevButton
				>
				<CalendarPrimitive.NextButton
					class="inline-flex size-8 items-center justify-center rounded-md hover:bg-accent"
					><ChevronRightIcon
						class="size-4"
					/></CalendarPrimitive.NextButton
				>
			</div>
			{#each months as month (month.value.toString())}
				<CalendarPrimitive.Header
					class="mb-3 flex h-8 items-center justify-center"
				>
					<CalendarPrimitive.Heading class="text-sm font-medium" />
				</CalendarPrimitive.Header>
				<CalendarPrimitive.Grid class="border-collapse">
					<CalendarPrimitive.GridHead>
						<CalendarPrimitive.GridRow class="flex">
							{#each weekdays as weekday}<CalendarPrimitive.HeadCell
									class="w-8 text-center text-xs font-normal text-muted-foreground"
									>{weekday.slice(
										0,
										2
									)}</CalendarPrimitive.HeadCell
								>{/each}
						</CalendarPrimitive.GridRow>
					</CalendarPrimitive.GridHead>
					<CalendarPrimitive.GridBody>
						{#each month.weeks as week}
							<CalendarPrimitive.GridRow class="mt-1 flex">
								{#each week as date (date.toString())}
									<CalendarPrimitive.Cell
										{date}
										month={month.value}
										class="size-8 p-0"
									>
										<CalendarPrimitive.Day
											class="inline-flex size-8 items-center justify-center rounded-md text-sm hover:bg-accent data-outside-month:text-muted-foreground data-outside-month:opacity-50 data-selected:bg-primary data-selected:text-primary-foreground"
										/>
									</CalendarPrimitive.Cell>
								{/each}
							</CalendarPrimitive.GridRow>
						{/each}
					</CalendarPrimitive.GridBody>
				</CalendarPrimitive.Grid>
			{/each}
		</div>
	{/snippet}
</CalendarPrimitive.Root>
