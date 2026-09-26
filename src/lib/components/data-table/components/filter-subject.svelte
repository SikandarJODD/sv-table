<script lang="ts">
	import type { Column, ColumnDataType } from "../core/types";

	interface Props {
		column: Column<any, ColumnDataType>;
	}

	let { column }: Props = $props();
</script>

<span
	class="flex items-center gap-1 px-2 font-medium whitespace-nowrap select-none"
>
	{#if column.icon}
		{@const Icon = column.icon}
		<Icon class="size-4 stroke-[2.25px]" />
	{/if}
	<span>{column.displayName}</span>
</span>
