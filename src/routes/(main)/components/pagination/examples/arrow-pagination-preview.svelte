<script lang="ts">
	import PaginationArrow from "$lib/components/table/pagination-arrow";

	let currentPage = $state(3);
	const pageCount = 8;
	const pageSize = 10;
	const totalItems = 73;

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

<div class="flex w-full max-w-3xl justify-center">
	<PaginationArrow
		{currentPage}
		{pageCount}
		{canPreviousPage}
		{canNextPage}
		{onPrevious}
		{onNext}
		{onGoToPage}
		{pageSize}
		{totalItems}
	/>
</div>
