<script lang="ts">
	import * as Pagination from "$lib/components/ui/pagination";
	import { cn } from "$lib/utils";

	let {
		currentPage, // 1-based current page number
		pageCount, // total number of pages
		canPreviousPage, // whether "Prev" should be enabled
		canNextPage, // whether "Next" should be enabled
		onPrevious, // called when "Prev" is clicked
		onNext, // called when "Next" is clicked
		onGoToPage, // called with a 1-based page number when a number is clicked
		siblingCount = 1, // how many page numbers to show beside the current page
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
		class?: string;
	} = $props();

	function handlePageChange(page: number) {
		if (page === currentPage) return;

		if (page === currentPage - 1 && canPreviousPage) {
			onPrevious();
			return;
		}

		if (page === currentPage + 1 && canNextPage) {
			onNext();
			return;
		}

		onGoToPage(page);
	}
</script>

{#if pageCount > 1}
	<Pagination.Root
		count={pageCount}
		perPage={1}
		page={currentPage}
		{siblingCount}
		onPageChange={handlePageChange}
		aria-label="Table pagination"
		class={cn("mx-0 w-auto", className)}
	>
		{#snippet children({ pages, currentPage: activePage })}
			<Pagination.Content>
				<Pagination.Item>
					<Pagination.Previous disabled={!canPreviousPage} />
				</Pagination.Item>

				{#each pages as page}
					{#if page.type === "ellipsis"}
						<Pagination.Item>
							<Pagination.Ellipsis />
						</Pagination.Item>
					{:else}
						<Pagination.Item>
							<Pagination.Link
								{page}
								isActive={activePage === page.value}
							/>
						</Pagination.Item>
					{/if}
				{/each}

				<Pagination.Item>
					<Pagination.Next disabled={!canNextPage} />
				</Pagination.Item>
			</Pagination.Content>
		{/snippet}
	</Pagination.Root>
{/if}
