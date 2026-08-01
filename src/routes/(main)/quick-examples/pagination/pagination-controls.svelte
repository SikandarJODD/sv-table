<script
	lang="ts"
	generics="TFeatures extends TableFeatures & { rowPaginationFeature: unknown }, TData extends RowData"
>
	import ChevronLeftIcon from "@lucide/svelte/icons/chevron-left";
	import ChevronRightIcon from "@lucide/svelte/icons/chevron-right";
	import ChevronsLeftIcon from "@lucide/svelte/icons/chevrons-left";
	import ChevronsRightIcon from "@lucide/svelte/icons/chevrons-right";

	import { Button } from "$lib/components/ui/button";
	import * as Select from "$lib/components/ui/select";
	import type {
		PaginationState,
		RowData,
		SvelteTable,
		TableFeatures
	} from "@tanstack/svelte-table";
	import type { Table_RowPagination } from "@tanstack/svelte-table";

	type PaginationTable<
		TFeatures extends TableFeatures,
		TData extends RowData
	> = SvelteTable<TFeatures, TData> &
		Table_RowPagination<TFeatures, TData> & {
			atoms: {
				pagination: {
					get(): PaginationState;
				};
			};
		};

	interface Props {
		table: PaginationTable<TFeatures, TData>;
		pageSizeOptions?: number[];
	}

	let { table, pageSizeOptions = [10, 20, 30, 40, 50] }: Props = $props();

	const pagination = $derived(table.atoms.pagination.get());
	const pageCount = $derived(table.getPageCount());
	const currentPage = $derived(
		pageCount === 0 ? 0 : pagination.pageIndex + 1
	);
	const totalRows = $derived(table.getRowCount());
	const lastPageIndex = $derived(Math.max(pageCount - 1, 0));
</script>

<div
	class="flex w-full flex-col-reverse items-center justify-between gap-4 overflow-auto p-1 sm:flex-row sm:gap-8"
>
	<div class="flex-1 text-sm whitespace-nowrap text-muted-foreground">
		{totalRows} row(s) total.
	</div>

	<div
		class="flex flex-col-reverse items-center gap-4 sm:flex-row sm:gap-6 lg:gap-8"
	>
		<div class="flex items-center space-x-2">
			<p class="text-sm font-medium whitespace-nowrap">Rows per page</p>

			<Select.Root
				type="single"
				value={String(pagination.pageSize)}
				onValueChange={(value) => table.setPageSize(Number(value))}
			>
				<Select.Trigger class="h-8 w-18" size="sm">
					{pagination.pageSize}
				</Select.Trigger>
				<Select.Content side="top">
					{#each pageSizeOptions as pageSize (pageSize)}
						<Select.Item
							value={String(pageSize)}
							label={String(pageSize)}
						/>
					{/each}
				</Select.Content>
			</Select.Root>
		</div>

		<div class="flex items-center justify-center text-sm font-medium">
			Page {currentPage} of {pageCount}
		</div>

		<div class="flex items-center space-x-2">
			<Button
				aria-label="Go to first page"
				variant="outline"
				size="icon-sm"
				class="hidden lg:flex"
				onclick={() => table.setPageIndex(0)}
				disabled={!table.getCanPreviousPage()}
			>
				<ChevronsLeftIcon />
			</Button>

			<Button
				aria-label="Go to previous page"
				variant="outline"
				size="icon-sm"
				onclick={() => table.previousPage()}
				disabled={!table.getCanPreviousPage()}
			>
				<ChevronLeftIcon />
			</Button>

			<Button
				aria-label="Go to next page"
				variant="outline"
				size="icon-sm"
				onclick={() => table.nextPage()}
				disabled={!table.getCanNextPage()}
			>
				<ChevronRightIcon />
			</Button>

			<Button
				aria-label="Go to last page"
				variant="outline"
				size="icon-sm"
				class="hidden lg:flex"
				onclick={() => table.setPageIndex(lastPageIndex)}
				disabled={!table.getCanNextPage()}
			>
				<ChevronsRightIcon />
			</Button>
		</div>
	</div>
</div>
