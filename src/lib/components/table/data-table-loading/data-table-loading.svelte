<script lang="ts">
	import { Skeleton } from "$lib/components/ui/skeleton";
	import * as Table from "$lib/components/ui/table";
	import { cn } from "$lib/utils.js";

	type Props = {
		columnCount: number;
		rowCount?: number;
		class?: string;
	};

	const widths = ["w-4/5", "w-full", "w-2/3", "w-5/6"];

	let { columnCount, rowCount = 5, class: className }: Props = $props();

	const loadingRows = $derived(Array.from({ length: Math.max(0, rowCount) }));
	const loadingColumns = $derived(
		Array.from({ length: Math.max(0, columnCount) })
	);
</script>

{#each loadingRows as _, rowIndex}
	<Table.Row aria-hidden="true" class="hover:bg-transparent">
		{#each loadingColumns as _, columnIndex}
			<Table.Cell>
				<Skeleton
					class={cn(
						"h-4",
						widths[(rowIndex + columnIndex) % widths.length],
						className
					)}
				/>
			</Table.Cell>
		{/each}
	</Table.Row>
{/each}
