<script lang="ts">
	import ChevronsLeftIcon from "@lucide/svelte/icons/chevrons-left";
	import ChevronLeftIcon from "@lucide/svelte/icons/chevron-left";
	import ChevronRightIcon from "@lucide/svelte/icons/chevron-right";
	import ChevronsRightIcon from "@lucide/svelte/icons/chevrons-right";
	import { Button } from "$lib/components/ui/button";
	import { cn } from "$lib/utils.js";

	let {
		currentPage,
		pageCount,
		canPreviousPage,
		canNextPage,
		onPrevious,
		onNext,
		onGoToPage,
		siblingCount = 1,
		pageSize = 1,
		totalItems = pageCount * pageSize,
		class: className
	}: {
		currentPage: number;
		pageCount: number;
		canPreviousPage: boolean;
		canNextPage: boolean;
		onPrevious: () => void;
		onNext: () => void;
		onGoToPage: (page: number) => void;
		siblingCount?: number;
		pageSize?: number;
		totalItems?: number;
		class?: string;
	} = $props();

	const safeTotalItems = $derived(Math.max(totalItems, 0));
	const rangeStart = $derived(
		safeTotalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1
	);
	const rangeEnd = $derived(Math.min(currentPage * pageSize, safeTotalItems));

	function goToFirstPage() {
		if (!canPreviousPage) return;
		onGoToPage(1);
	}

	function goToLastPage() {
		if (!canNextPage) return;
		onGoToPage(pageCount);
	}
</script>

{#if pageCount > 1}
	<nav
		aria-label="Table pagination"
		class={cn("flex flex-wrap items-center gap-4 sm:gap-6", className)}
	>
		<p class="text-sm font-medium whitespace-nowrap text-foreground">
			{rangeStart}-{rangeEnd} of {safeTotalItems}
		</p>

		<div class="flex items-center gap-2">
			<Button
				type="button"
				variant="outline"
				size="icon"
				disabled={!canPreviousPage}
				aria-label="Go to first page"
				onclick={goToFirstPage}
			>
				<ChevronsLeftIcon />
			</Button>

			<Button
				type="button"
				variant="outline"
				size="icon"
				disabled={!canPreviousPage}
				aria-label="Go to previous page"
				onclick={onPrevious}
			>
				<ChevronLeftIcon />
			</Button>

			<Button
				type="button"
				variant="outline"
				size="icon"
				disabled={!canNextPage}
				aria-label="Go to next page"
				onclick={onNext}
			>
				<ChevronRightIcon />
			</Button>

			<Button
				type="button"
				variant="outline"
				size="icon"
				disabled={!canNextPage}
				aria-label="Go to last page"
				onclick={goToLastPage}
			>
				<ChevronsRightIcon />
			</Button>
		</div>
	</nav>
{/if}
