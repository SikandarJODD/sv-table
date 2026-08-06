<script lang="ts" module>
	export type NumberRangeFilterValue = {
		min: number | undefined;
		max: number | undefined;
	};
</script>

<script lang="ts">
	import ListFilterIcon from "@lucide/svelte/icons/list-filter";
	import XIcon from "@lucide/svelte/icons/x";

	import { Button } from "$lib/components/ui/button";
	import { Input } from "$lib/components/ui/input";
	import { Label } from "$lib/components/ui/label";
	import * as Popover from "$lib/components/ui/popover";
	import { Separator } from "$lib/components/ui/separator";
	import { Slider } from "$lib/components/ui/slider";
	import { cn } from "$lib/utils.js";

	type Props = {
		value?: NumberRangeFilterValue;
		onValueChange?: (value: NumberRangeFilterValue | undefined) => void;
		title?: string;
		placeholder?: string;
		min?: number;
		max?: number;
		step?: number;
		showSlider?: boolean;
		formatValue?: (value: number) => string;
		locale?: string;
		minimumText?: string;
		maximumText?: string;
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
		title = "Value",
		placeholder = "Any value",
		min,
		max,
		step = 1,
		showSlider = true,
		formatValue,
		locale = "en-US",
		minimumText = "Minimum",
		maximumText = "Maximum",
		clearText = "Clear",
		applyText = "Apply",
		disabled = false,
		open = $bindable(false),
		class: className,
		contentClass
	}: Props = $props();

	let resolvedStep = $derived(Number.isFinite(step) && step > 0 ? step : 1);
	let canShowSlider = $derived(
		showSlider &&
			Number.isFinite(min) &&
			Number.isFinite(max) &&
			(min as number) < (max as number)
	);

	// Keep raw strings so temporary values such as "", "1", and "50" are
	// never replaced while the user is still typing a larger number.
	let draftMin = $state(value?.min?.toString() ?? "");
	let draftMax = $state(value?.max?.toString() ?? "");

	// The slider owns a separate numeric draft. Bits UI may snap this value to
	// `step`, but that normalization must not write into the text inputs.
	let sliderDraft = $state(
		getSliderValue(value ?? { min: undefined, max: undefined })
	);

	let draft = $derived(resolveDraft(draftMin, draftMax));
	let selectedLabel = $derived(formatRange(value));

	function parseNumber(input: string) {
		if (!input.trim()) return undefined;
		const number = Number(input);
		return Number.isFinite(number) ? number : undefined;
	}

	function resolveDraft(minInput: string, maxInput: string) {
		const draftValue: NumberRangeFilterValue = {
			min: parseNumber(minInput),
			max: parseNumber(maxInput)
		};
		const hasMinimum = minInput.trim() !== "";
		const hasMaximum = maxInput.trim() !== "";
		let error = "";

		if (
			(hasMinimum && draftValue.min === undefined) ||
			(hasMaximum && draftValue.max === undefined)
		) {
			error = "Enter valid numbers.";
		} else if (min !== undefined && max !== undefined && min > max) {
			error = "Minimum boundary must not exceed maximum boundary.";
		} else if (
			min !== undefined &&
			((draftValue.min !== undefined && draftValue.min < min) ||
				(draftValue.max !== undefined && draftValue.max < min))
		) {
			error = `Values must be ${min} or more.`;
		} else if (
			max !== undefined &&
			((draftValue.min !== undefined && draftValue.min > max) ||
				(draftValue.max !== undefined && draftValue.max > max))
		) {
			error = `Values must be ${max} or less.`;
		} else if (
			draftValue.min !== undefined &&
			draftValue.max !== undefined &&
			draftValue.min > draftValue.max
		) {
			error = `${minimumText} must not exceed ${maximumText.toLowerCase()}.`;
		}

		return {
			value: draftValue,
			hasValue: hasMinimum || hasMaximum,
			error
		};
	}

	function getSliderValue(range: NumberRangeFilterValue) {
		if (!canShowSlider) return [];

		const lowerBoundary = min as number;
		const upperBoundary = max as number;
		const first = Math.min(
			upperBoundary,
			Math.max(lowerBoundary, range.min ?? lowerBoundary)
		);
		const second = Math.min(
			upperBoundary,
			Math.max(lowerBoundary, range.max ?? upperBoundary)
		);

		return first <= second ? [first, second] : [second, first];
	}

	function formatNumber(number: number) {
		return (
			formatValue?.(number) ??
			new Intl.NumberFormat(locale).format(number)
		);
	}

	function formatRange(range?: NumberRangeFilterValue) {
		if (range?.min !== undefined && range.max !== undefined) {
			return `${formatNumber(range.min)} – ${formatNumber(range.max)}`;
		}

		if (range?.min !== undefined) return `≥ ${formatNumber(range.min)}`;
		if (range?.max !== undefined) return `≤ ${formatNumber(range.max)}`;
		return "";
	}

	function changeOpen(nextOpen: boolean) {
		if (nextOpen) {
			draftMin = value?.min?.toString() ?? "";
			draftMax = value?.max?.toString() ?? "";
			sliderDraft = getSliderValue(
				value ?? { min: undefined, max: undefined }
			);
		}

		open = nextOpen;
	}

	// Input drafts update the slider only after typing is complete. Empty
	// endpoints stay empty even though the slider displays their boundary.
	function syncInputsToSlider() {
		if (draft.error) return;
		sliderDraft = getSliderValue(draft.value);
	}

	function handleInputKeydown(event: KeyboardEvent) {
		if (event.key === "Enter") syncInputsToSlider();
	}

	// Only a committed slider interaction is allowed to replace input text.
	function commitSlider(nextValue: number[]) {
		if (nextValue.length < 2) return;
		draftMin = nextValue[0].toString();
		draftMax = nextValue[1].toString();
	}

	function updateValue(nextValue?: NumberRangeFilterValue) {
		value = nextValue;
		onValueChange?.(nextValue);
	}

	function clearValue() {
		updateValue(undefined);
		open = false;
	}

	function applyValue() {
		if (!draft.hasValue || draft.error) return;
		updateValue(draft.value);
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
					<ListFilterIcon />
					{title}

					<Separator orientation="vertical" class="mx-1 h-4" />
					<span class="font-normal text-muted-foreground">
						{selectedLabel || placeholder}
					</span>
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

	<Popover.Content align="start" class={cn("w-72 gap-0 p-0", contentClass)}>
		<div class="grid grid-cols-2 gap-3 p-4">
			<Label class="grid gap-2">
				<span class="text-xs text-muted-foreground">{minimumText}</span>
				<Input
					type="number"
					value={draftMin}
					{min}
					{max}
					step={resolvedStep}
					placeholder="No minimum"
					aria-invalid={Boolean(draft.error)}
					oninput={(event) => (draftMin = event.currentTarget.value)}
					onblur={syncInputsToSlider}
					onkeydown={handleInputKeydown}
				/>
			</Label>

			<Label class="grid gap-2">
				<span class="text-xs text-muted-foreground">{maximumText}</span>
				<Input
					type="number"
					value={draftMax}
					{min}
					{max}
					step={resolvedStep}
					placeholder="No maximum"
					aria-invalid={Boolean(draft.error)}
					oninput={(event) => (draftMax = event.currentTarget.value)}
					onblur={syncInputsToSlider}
					onkeydown={handleInputKeydown}
				/>
			</Label>

			{#if canShowSlider}
				<div class="col-span-2 space-y-2 pt-2">
					<Slider
						type="multiple"
						bind:value={sliderDraft}
						min={min as number}
						max={max as number}
						step={resolvedStep}
						onValueCommit={commitSlider}
					/>
					<div
						class="flex justify-between text-xs text-muted-foreground tabular-nums"
					>
						<span>{formatNumber(min as number)}</span>
						<span>{formatNumber(max as number)}</span>
					</div>
				</div>
			{/if}

			{#if draft.error}
				<p class="col-span-2 text-xs text-destructive" role="alert">
					{draft.error}
				</p>
			{/if}
		</div>

		<div class="flex items-center justify-end gap-2 border-t p-3">
			<Button variant="ghost" size="sm" onclick={clearValue}>
				{clearText}
			</Button>
			<Button
				size="sm"
				disabled={!draft.hasValue || Boolean(draft.error)}
				onclick={applyValue}
			>
				{applyText}
			</Button>
		</div>
	</Popover.Content>
</Popover.Root>
