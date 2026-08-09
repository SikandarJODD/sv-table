<script lang="ts">
	import PaginationArrow from "$lib/components/table/pagination-arrow";

	let currentPage = $state(3);
	const pageCount = 8;
	const pageSize = 10;
	const totalRows: number = 73;

	const canPreviousPage = $derived(currentPage > 1);
	const canNextPage = $derived(currentPage < pageCount);
	const firstVisibleRow = $derived(
		totalRows === 0 ? 0 : (currentPage - 1) * pageSize + 1
	);
	const lastVisibleRow = $derived(
		Math.min(currentPage * pageSize, totalRows)
	);

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
		{firstVisibleRow}
		{lastVisibleRow}
		{totalRows}
	/>
</div>
