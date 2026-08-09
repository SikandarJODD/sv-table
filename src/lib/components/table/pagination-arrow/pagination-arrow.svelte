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
		firstVisibleRow,
		lastVisibleRow,
		totalRows,
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
		firstVisibleRow: number;
		lastVisibleRow: number;
		totalRows: number;
		class?: string;
	} = $props();

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
		<p
			aria-live="polite"
			class="text-sm whitespace-nowrap text-muted-foreground"
		>
			<span class="text-foreground"
				>{firstVisibleRow}-{lastVisibleRow}</span
			>
			of <span class="text-foreground">{totalRows}</span>
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
