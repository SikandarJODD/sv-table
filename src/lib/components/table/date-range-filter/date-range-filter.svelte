<script lang="ts" module>
	export type DateRangeFilterValue = {
		start: Date | undefined;
		end: Date | undefined;
	};

	export type DateRangeFilterPreset = {
		label: string;
		getValue: (referenceDate: Date) => DateRangeFilterValue;
	};

	function localDate(date: Date) {
		return new Date(date.getFullYear(), date.getMonth(), date.getDate());
	}

	function daysBefore(date: Date, days: number) {
		const next = localDate(date);
		next.setDate(next.getDate() - days);
		return next;
	}

	export const defaultDateRangeFilterPresets: DateRangeFilterPreset[] = [
		{
			label: "Today",
			getValue: (today) => ({
				start: localDate(today),
				end: localDate(today)
			})
		},
		{
			label: "Last 7 days",
			getValue: (today) => ({
				start: daysBefore(today, 6),
				end: localDate(today)
			})
		},
		{
			label: "Last 30 days",
			getValue: (today) => ({
				start: daysBefore(today, 29),
				end: localDate(today)
			})
		},
		{
			label: "This month",
			getValue: (today) => ({
				start: new Date(today.getFullYear(), today.getMonth(), 1),
				end: localDate(today)
			})
		}
	];
</script>

<script lang="ts">
	import { CalendarDate, type DateValue } from "@internationalized/date";
	import CalendarDaysIcon from "@lucide/svelte/icons/calendar-days";
	import XIcon from "@lucide/svelte/icons/x";
	import { MediaQuery } from "svelte/reactivity";

	import { Button } from "$lib/components/ui/button";
	import * as Popover from "$lib/components/ui/popover";
	import { RangeCalendar } from "$lib/components/ui/range-calendar";
	import { Separator } from "$lib/components/ui/separator";
	import { cn } from "$lib/utils.js";

	type CalendarRange = {
		start: DateValue | undefined;
		end: DateValue | undefined;
	};

	type Props = {
		value?: DateRangeFilterValue;
		onValueChange?: (value: DateRangeFilterValue | undefined) => void;
		title?: string;
		placeholder?: string;
		presets?: DateRangeFilterPreset[] | false;
		min?: Date;
		max?: Date;
		numberOfMonths?: number;
		weekStartsOn?: 0 | 1 | 2 | 3 | 4 | 5 | 6;
		locale?: string;
		clearText?: string;
		applyText?: string;
		disabled?: boolean;
		open?: boolean;
		class?: string;
		contentClass?: string;
	};

	let {
		value = $bindable(),
		onValueChange,
		title = "Date",
		placeholder = "Select date range",
		presets = defaultDateRangeFilterPresets,
		min,
		max,
		numberOfMonths = 2,
		weekStartsOn = 0,
		locale = "en-US",
		clearText = "Clear",
		applyText = "Apply",
		disabled = false,
		open = $bindable(false),
		class: className,
		contentClass
	}: Props = $props();

	const isMobile = new MediaQuery("max-width: 767px");

	let draftValue = $state<CalendarRange>({
		start: undefined,
		end: undefined
	});
	let draftPlaceholder = $state<DateValue | undefined>(undefined);

	let visiblePresets = $derived(presets === false ? [] : presets);
	let displayedMonths = $derived(
		isMobile.current ? 1 : Math.max(1, numberOfMonths)
	);
	let hasCompleteDraft = $derived(
		Boolean(draftValue.start && draftValue.end)
	);
	let selectedLabel = $derived(formatDateRange(value));

	function toCalendarDate(date?: Date) {
		return date
			? new CalendarDate(
					date.getFullYear(),
					date.getMonth() + 1,
					date.getDate()
				)
			: undefined;
	}

	function fromCalendarDate(date?: DateValue) {
		return date ? new Date(date.year, date.month - 1, date.day) : undefined;
	}

	function toCalendarRange(range?: DateRangeFilterValue): CalendarRange {
		return {
			start: toCalendarDate(range?.start),
			end: toCalendarDate(range?.end)
		};
	}

	function formatDateRange(range?: DateRangeFilterValue) {
		if (!range?.start) return "";

		const formatter = new Intl.DateTimeFormat(locale, {
			month: "short",
			day: "numeric",
			year: "numeric"
		});

		if (!range.end || range.start.getTime() === range.end.getTime()) {
			return formatter.format(range.start);
		}

		return formatter.formatRange(range.start, range.end);
	}

	function sameCalendarDate(a?: DateValue, b?: Date) {
		return Boolean(
			a &&
			b &&
			a.year === b.getFullYear() &&
			a.month === b.getMonth() + 1 &&
			a.day === b.getDate()
		);
	}

	function isActivePreset(preset: DateRangeFilterPreset) {
		const presetValue = preset.getValue(new Date());
		return (
			sameCalendarDate(draftValue.start, presetValue.start) &&
			sameCalendarDate(draftValue.end, presetValue.end)
		);
	}

	function isPresetDisabled(preset: DateRangeFilterPreset) {
		const presetValue = preset.getValue(new Date());
		const minimum = min ? localDate(min).getTime() : -Infinity;
		const maximum = max ? localDate(max).getTime() : Infinity;
		const start = presetValue.start?.getTime() ?? -Infinity;
		const end = presetValue.end?.getTime() ?? Infinity;

		return start < minimum || end > maximum;
	}

	function changeOpen(nextOpen: boolean) {
		if (nextOpen) {
			draftValue = toCalendarRange(value);
			draftPlaceholder = draftValue.start ?? toCalendarDate(new Date());
		}

		open = nextOpen;
	}

	function selectPreset(preset: DateRangeFilterPreset) {
		const presetValue = preset.getValue(new Date());
		draftValue = toCalendarRange(presetValue);
		draftPlaceholder = draftValue.start;
	}

	function updateValue(nextValue?: DateRangeFilterValue) {
		value = nextValue;
		onValueChange?.(nextValue);
	}

	function clearValue() {
		updateValue(undefined);
		open = false;
	}

	function applyValue() {
		if (!draftValue.start || !draftValue.end) return;

		updateValue({
			start: fromCalendarDate(draftValue.start),
			end: fromCalendarDate(draftValue.end)
		});
		open = false;
	}
</script>

<Popover.Root {open} onOpenChange={changeOpen}>
	<div class="inline-flex items-center">
		<Popover.Trigger>
			{#snippet child({ props })}
				<Button
					{...props}
					variant="outline"
					size="sm"
					class={cn(
						"h-8 border-dashed",
						selectedLabel && "rounded-r-none",
						className
					)}
					{disabled}
					aria-label={`${title} filter${selectedLabel ? `, ${selectedLabel}` : ""}`}
				>
					<CalendarDaysIcon />
					{title}

					{#if selectedLabel}
						<Separator orientation="vertical" class="mx-1 h-4" />
						<span class="font-normal text-muted-foreground">
							{selectedLabel}
						</span>
					{:else}
						<span class="font-normal text-muted-foreground">
							{placeholder}
						</span>
					{/if}
				</Button>
			{/snippet}
		</Popover.Trigger>

		{#if selectedLabel}
			<Button
				variant="outline"
				size="icon-sm"
				class="-ml-px h-8 rounded-l-none border-dashed"
				{disabled}
				onclick={clearValue}
				aria-label={`${clearText} ${title} filter`}
			>
				<XIcon />
			</Button>
		{/if}
	</div>

	<Popover.Content
		align="start"
		class={cn(
			"w-auto max-w-[calc(100vw-2rem)] gap-0 overflow-x-auto p-0",
			contentClass
		)}
	>
		<div class="flex flex-col md:flex-row">
			{#if visiblePresets.length > 0}
				<div
					class="flex min-w-40 flex-col items-stretch gap-1 border-b p-3 md:border-r md:border-b-0"
				>
					{#each visiblePresets as preset (preset.label)}
						<Button
							variant={isActivePreset(preset)
								? "secondary"
								: "ghost"}
							size="sm"
							class="justify-start font-normal"
							disabled={isPresetDisabled(preset)}
							onclick={() => selectPreset(preset)}
						>
							{preset.label}
						</Button>
					{/each}
				</div>
			{/if}

			<div class="min-w-0">
				<RangeCalendar
					value={draftValue}
					onValueChange={(nextValue) => (draftValue = nextValue)}
					bind:placeholder={draftPlaceholder}
					numberOfMonths={displayedMonths}
					pagedNavigation
					fixedWeeks
					minValue={toCalendarDate(min)}
					maxValue={toCalendarDate(max)}
					{weekStartsOn}
					{locale}
					calendarLabel={`${title} range`}
				/>

				<div class="flex items-center justify-end gap-2 border-t p-3">
					<Button variant="ghost" size="sm" onclick={clearValue}>
						{clearText}
					</Button>
					<Button
						size="sm"
						disabled={!hasCompleteDraft}
						onclick={applyValue}
					>
						{applyText}
					</Button>
				</div>
			</div>
		</div>
	</Popover.Content>
</Popover.Root>
