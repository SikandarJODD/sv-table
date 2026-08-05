<script lang="ts">
	import CheckIcon from "@lucide/svelte/icons/check";
	import ChevronDownIcon from "@lucide/svelte/icons/chevron-down";
	import ChevronUpIcon from "@lucide/svelte/icons/chevron-up";
	import ChevronsUpDownIcon from "@lucide/svelte/icons/chevrons-up-down";
	import EllipsisIcon from "@lucide/svelte/icons/ellipsis";
	import EyeOffIcon from "@lucide/svelte/icons/eye-off";
	import XIcon from "@lucide/svelte/icons/x";

	import { Button } from "$lib/components/ui/button";
	import * as DropdownMenu from "$lib/components/ui/dropdown-menu";
	import { cn } from "$lib/utils.js";

	type SortDirection = "asc" | "desc";

	type DataTableColumn = {
		id: string;
		getCanSort: () => boolean;
		getCanMultiSort?: () => boolean;
		getIsSorted: () => false | SortDirection;
		toggleSorting: (desc?: boolean, isMulti?: boolean) => void;
		clearSorting: () => void;
		getCanHide?: () => boolean;
		toggleVisibility?: (visible?: boolean) => void;
	};

	let {
		column,
		title,
		class: className
	}: {
		column: DataTableColumn;
		title: string;
		class?: string;
	} = $props();

	let canSort = $derived(column.getCanSort());
	let sortDirection = $derived(column.getIsSorted());
	let canHide = $derived(column.getCanHide?.() ?? false);
	let hasMenuActions = $derived(canSort || canHide);

	let sortLabel = $derived(
		sortDirection === "asc"
			? "ascending"
			: sortDirection === "desc"
				? "descending"
				: "not sorted"
	);

	function toggleSorting(event: MouseEvent) {
		const isMultiSort =
			event.shiftKey && (column.getCanMultiSort?.() ?? false);

		if (sortDirection === "asc") {
			column.toggleSorting(true, isMultiSort);
		} else if (sortDirection === "desc") {
			column.clearSorting();
		} else {
			column.toggleSorting(false, isMultiSort);
		}
	}

	function sortAscending() {
		column.toggleSorting(false);
	}

	function sortDescending() {
		column.toggleSorting(true);
	}

	function resetSorting() {
		column.clearSorting();
	}

	function hideColumn() {
		column.toggleVisibility?.(false);
	}
</script>

<div
	data-slot="data-table-column-header"
	class={cn("flex items-center gap-1", className)}
>
	{#if canSort}
		<Button
			variant="ghost"
			size="sm"
			class="-ml-2 h-8 px-2 font-medium"
			onclick={toggleSorting}
			aria-label={`Sort ${title}. Currently ${sortLabel}.`}
		>
			<span>{title}</span>
			{#if sortDirection === "asc"}
				<ChevronUpIcon class="size-4 text-muted-foreground" />
			{:else if sortDirection === "desc"}
				<ChevronDownIcon class="size-4 text-muted-foreground" />
			{:else}
				<ChevronsUpDownIcon class="size-4 text-muted-foreground/70" />
			{/if}
		</Button>
	{:else}
		<span class="font-medium">{title}</span>
	{/if}

	{#if hasMenuActions}
		<DropdownMenu.Root>
			<DropdownMenu.Trigger>
				{#snippet child({ props })}
					<Button
						{...props}
						variant="ghost"
						size="icon-sm"
						class="size-7"
						aria-label={`Open ${title} column menu`}
					>
						<EllipsisIcon class="size-4" />
					</Button>
				{/snippet}
			</DropdownMenu.Trigger>

			<DropdownMenu.Content align="start" class="w-44">
				{#if canSort}
					<DropdownMenu.Item
						class="relative cursor-pointer pr-8"
						onSelect={sortAscending}
					>
						<ChevronUpIcon />
						<span>Asc</span>
						{#if sortDirection === "asc"}
							<CheckIcon class="absolute right-2" />
						{/if}
					</DropdownMenu.Item>

					<DropdownMenu.Item
						class="relative cursor-pointer pr-8"
						onSelect={sortDescending}
					>
						<ChevronDownIcon />
						<span>Desc</span>
						{#if sortDirection === "desc"}
							<CheckIcon class="absolute right-2" />
						{/if}
					</DropdownMenu.Item>

					<DropdownMenu.Item
						class="cursor-pointer"
						disabled={!sortDirection}
						onSelect={resetSorting}
					>
						<XIcon />
						<span>Reset sort</span>
					</DropdownMenu.Item>
				{/if}

				{#if canHide}
					<DropdownMenu.Item
						class="cursor-pointer"
						onSelect={hideColumn}
					>
						<EyeOffIcon />
						<span>Hide</span>
					</DropdownMenu.Item>
				{/if}
			</DropdownMenu.Content>
		</DropdownMenu.Root>
	{/if}
</div>
