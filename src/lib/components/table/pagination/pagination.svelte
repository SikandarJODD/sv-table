<script lang="ts">
	let {
		currentPage, // 1-based current page number
		pageCount, // total number of pages
		canPreviousPage, // whether "Prev" should be enabled
		canNextPage, // whether "Next" should be enabled
		onPrevious, // called when "Prev" is clicked
		onNext, // called when "Next" is clicked
		onGoToPage, // called with a 1-based page number when a number is clicked
		siblingCount = 1 // how many page numbers to show beside the current page
	}: {
		currentPage: number;
		pageCount: number;
		canPreviousPage: boolean;
		canNextPage: boolean;
		onPrevious: () => void;
		onNext: () => void;
		onGoToPage: (page: number) => void;
		siblingCount?: number;
	} = $props();

	// ----------------------------------------------------------
	// Build the visible page-number list with ellipsis
	// Returns e.g. [1, 2, 3, '...', 7, 8, 9]
	// ----------------------------------------------------------
	function getPageNumbers(
		current: number,
		total: number,
		siblings: number
	): (number | "...")[] {
		const totalNumbersVisible = siblings * 2 + 5;

		// Small enough to show every page — no collapsing needed
		if (total <= totalNumbersVisible) {
			return Array.from({ length: total }, (_, i) => i + 1);
		}

		const leftSibling = Math.max(current - siblings, 1);
		const rightSibling = Math.min(current + siblings, total);

		const showLeftEllipsis = leftSibling > 2;
		const showRightEllipsis = rightSibling < total - 1;

		// Near the start: "1 2 3 4 ... 10"
		if (!showLeftEllipsis && showRightEllipsis) {
			const leftRange = Array.from(
				{ length: 3 + siblings * 2 },
				(_, i) => i + 1
			);
			return [...leftRange, "...", total];
		}

		// Near the end: "1 ... 7 8 9 10"
		if (showLeftEllipsis && !showRightEllipsis) {
			const rightCount = 3 + siblings * 2;
			const rightRange = Array.from(
				{ length: rightCount },
				(_, i) => total - rightCount + i + 1
			);
			return [1, "...", ...rightRange];
		}

		// Somewhere in the middle: "1 ... 4 5 6 ... 10"
		const middleRange = Array.from(
			{ length: rightSibling - leftSibling + 1 },
			(_, i) => leftSibling + i
		);
		return [1, "...", ...middleRange, "...", total];
	}

	let pageNumbers = $derived(
		getPageNumbers(currentPage, pageCount, siblingCount)
	);
</script>

{#if pageCount > 1}
	<nav class="flex items-center gap-1" aria-label="Table pagination">
		<button
			type="button"
			class="rounded border px-2 py-1 text-sm disabled:cursor-not-allowed disabled:opacity-40"
			disabled={!canPreviousPage}
			onclick={onPrevious}
		>
			Prev
		</button>

		{#each pageNumbers as page, i (page === "..." ? `dots-${i}` : page)}
			{#if page === "..."}
				<span class="px-2 text-sm text-muted-foreground select-none"
					>...</span
				>
			{:else}
				<button
					type="button"
					class="rounded border px-2.5 py-1 text-sm
                 {page === currentPage
						? 'border-primary bg-primary text-primary-foreground'
						: 'hover:bg-muted'}"
					aria-current={page === currentPage ? "page" : undefined}
					onclick={() => onGoToPage(page)}
				>
					{page}
				</button>
			{/if}
		{/each}

		<button
			type="button"
			class="rounded border px-2 py-1 text-sm disabled:cursor-not-allowed disabled:opacity-40"
			disabled={!canNextPage}
			onclick={onNext}
		>
			Next
		</button>
	</nav>
{/if}
