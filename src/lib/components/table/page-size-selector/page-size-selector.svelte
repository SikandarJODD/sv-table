<script lang="ts">
	import * as Select from "$lib/components/ui/select";
	import { cn } from "$lib/utils.js";

	let {
		pageSize,
		options = [5, 10, 25, 50],
		setPageSize,
		class: className
	}: {
		pageSize: number;
		options?: number[];
		setPageSize: (pageSize: number) => void;
		class?: string;
	} = $props();
</script>

<div class={cn("flex items-center gap-2", className)}>
	<span class="text-sm font-medium whitespace-nowrap">Rows per page</span>

	<Select.Root
		type="single"
		value={String(pageSize)}
		onValueChange={(value) => setPageSize(Number(value))}
	>
		<Select.Trigger aria-label="Rows per page" class="h-9 w-18">
			{pageSize}
		</Select.Trigger>
		<Select.Content class="min-w-18">
			{#each options as size (size)}
				<Select.Item value={String(size)} label={String(size)} />
			{/each}
		</Select.Content>
	</Select.Root>
</div>
