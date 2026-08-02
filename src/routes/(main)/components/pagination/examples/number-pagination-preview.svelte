<script lang="ts">
	import Pagination from "$lib/components/table/pagination";

	let currentPage = $state(4);
	const pageCount = 12;

	const canPreviousPage = $derived(currentPage > 1);
	const canNextPage = $derived(currentPage < pageCount);

	function onPrevious() {
		if (!canPreviousPage) return;
		currentPage -= 1;
	}

	function onNext() {
		if (!canNextPage) return;
		currentPage += 1;
	}

	function onGoToPage(page: number) {
		currentPage = page;
	}
</script>

<div class="flex w-full max-w-2xl flex-col items-center gap-4">
	<p class="text-sm text-muted-foreground">
		Page {currentPage} of {pageCount}
	</p>

	<Pagination
		{currentPage}
		{pageCount}
		{canPreviousPage}
		{canNextPage}
		{onPrevious}
		{onNext}
		{onGoToPage}
	/>
</div>
