<script lang="ts">
	import * as Select from "$lib/components/ui/select";
	import { cn } from "$lib/utils.js";

	type PageSizeTable = {
		atoms: {
			pagination: {
				get: () => { pageSize: number };
			};
		};
		setPageSize: (pageSize: number) => void;
	};

	let {
		table,
		pageSizeOptions = [5, 10, 25, 50],
		class: className
	}: {
		table: PageSizeTable;
		pageSizeOptions?: number[];
		class?: string;
	} = $props();

	const pageSize = $derived(table.atoms.pagination.get().pageSize);
</script>

<div class={cn("flex items-center gap-2", className)}>
	<span class="text-sm font-medium whitespace-nowrap">Rows per page</span>

	<Select.Root
		type="single"
		value={String(pageSize)}
		onValueChange={(value) => table.setPageSize(Number(value))}
	>
		<Select.Trigger aria-label="Rows per page" class="h-9 w-18">
			{pageSize}
		</Select.Trigger>
		<Select.Content class="min-w-18">
			{#each pageSizeOptions as size (size)}
				<Select.Item value={String(size)} label={String(size)} />
			{/each}
		</Select.Content>
	</Select.Root>
</div>
