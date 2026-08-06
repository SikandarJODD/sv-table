<script lang="ts" module>
	import type { Component } from "svelte";

	export type DataTableFacetedFilterOption = {
		label: string;
		value: string;
		icon?: Component;
	};

	export type DataTableFacetedFilterColumn = {
		getFilterValue?: () => unknown;
		setFilterValue?: (value: string[] | undefined) => void;
		getFacetedUniqueValues?: () => Map<unknown, number>;
	};
</script>

<script lang="ts">
	import CirclePlusIcon from "@lucide/svelte/icons/circle-plus";

	import { Badge } from "$lib/components/ui/badge";
	import { Button } from "$lib/components/ui/button";
	import { Checkbox } from "$lib/components/ui/checkbox";
	import * as Command from "$lib/components/ui/command";
	import * as Popover from "$lib/components/ui/popover";
	import { Separator } from "$lib/components/ui/separator";
	import { cn } from "$lib/utils.js";

	type Props = {
		column: DataTableFacetedFilterColumn;
		title: string;
		options: DataTableFacetedFilterOption[];
		facets?: Map<string, number>;
		searchPlaceholder?: string;
		emptyText?: string;
		clearText?: string;
		showCounts?: boolean;
		disabled?: boolean;
		class?: string;
		contentClass?: string;
		open?: boolean;
	};

	let {
		column,
		title,
		options,
		facets,
		searchPlaceholder = `Search ${title.toLowerCase()}...`,
		emptyText = "No results found.",
		clearText = "Clear filters",
		showCounts = true,
		disabled = false,
		class: className,
		contentClass,
		open = $bindable(false)
	}: Props = $props();

	let selectedValues = $derived.by(() => {
		const value = column.getFilterValue?.();
		return new Set(
			Array.isArray(value)
				? value.filter(
						(item): item is string => typeof item === "string"
					)
				: []
		);
	});

	let facetCounts = $derived(
		facets ??
			new Map(
				[...(column.getFacetedUniqueValues?.() ?? new Map())].map(
					([value, count]) => [String(value), count]
				)
			)
	);

	let selectedOptions = $derived(
		options.filter((option) => selectedValues.has(option.value))
	);

	function toggleOption(value: string) {
		const nextValues = new Set(selectedValues);

		if (nextValues.has(value)) {
			nextValues.delete(value);
		} else {
			nextValues.add(value);
		}

		column.setFilterValue?.(
			nextValues.size > 0 ? [...nextValues] : undefined
		);
	}

	function clearFilters() {
		column.setFilterValue?.(undefined);
		open = false;
	}
</script>

<Popover.Root bind:open>
	<Popover.Trigger>
		{#snippet child({ props })}
			<Button
				{...props}
				variant="outline"
				size="sm"
				class={cn("h-8 border-dashed", className)}
				{disabled}
				aria-label={`${title} filter${selectedValues.size ? `, ${selectedValues.size} selected` : ""}`}
			>
				<CirclePlusIcon />
				{title}

				{#if selectedValues.size > 0}
					<Separator orientation="vertical" class="mx-1 h-4" />
					<Badge
						variant="secondary"
						class="rounded-sm px-1 font-normal lg:hidden"
					>
						{selectedValues.size}
					</Badge>

					<div class="hidden gap-1 lg:flex">
						{#if selectedOptions.length > 2}
							<Badge
								variant="secondary"
								class="rounded-sm px-1 font-normal"
							>
								{selectedOptions.length} selected
							</Badge>
						{:else}
							{#each selectedOptions as option (option.value)}
								<Badge
									variant="secondary"
									class="rounded-sm px-1 font-normal"
								>
									{option.label}
								</Badge>
							{/each}
						{/if}
					</div>
				{/if}
			</Button>
		{/snippet}
	</Popover.Trigger>

	<Popover.Content align="start" class={cn("w-56 p-0", contentClass)}>
		<Command.Root loop>
			<Command.Input placeholder={searchPlaceholder} />
			<Command.Empty>{emptyText}</Command.Empty>
			<Command.List class="max-h-72">
				<Command.Group>
					{#each options as option (option.value)}
						{@const checked = selectedValues.has(option.value)}
						<Command.Item
							value={option.value}
							keywords={[option.label, option.value]}
							onSelect={() => toggleOption(option.value)}
							class="gap-2"
						>
							<Checkbox
								{checked}
								aria-hidden="true"
								tabindex={-1}
								class="pointer-events-none"
							/>

							{#if option.icon}
								{@const Icon = option.icon}
								<Icon class="size-4 text-muted-foreground" />
							{/if}

							<span>{option.label}</span>

							{#if showCounts && facetCounts.size > 0}
								<span
									class="ml-auto font-mono text-xs text-muted-foreground tabular-nums"
								>
									{facetCounts.get(option.value) ?? 0}
								</span>
							{/if}
						</Command.Item>
					{/each}
				</Command.Group>

				{#if selectedValues.size > 0}
					<Command.Separator />
					<Command.Group>
						<Command.Item
							value="__clear__"
							onSelect={clearFilters}
							class="justify-center text-center"
						>
							{clearText}
						</Command.Item>
					</Command.Group>
				{/if}
			</Command.List>
		</Command.Root>
	</Popover.Content>
</Popover.Root>
