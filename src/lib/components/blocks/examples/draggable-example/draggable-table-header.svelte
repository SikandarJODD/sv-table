<script lang="ts">
	import ChevronDownIcon from "@lucide/svelte/icons/chevron-down";
	import ChevronUpIcon from "@lucide/svelte/icons/chevron-up";
	import GripVerticalIcon from "@lucide/svelte/icons/grip-vertical";
	import { FlexRender, type Header } from "@tanstack/svelte-table";
	import { dragHandle } from "svelte-dnd-action";

	import * as Table from "$lib/components/ui/table";

	import type { DraggableTableFeatures } from "./table-features";
	import type { Item } from "./types";

	type Props = {
		header: Header<DraggableTableFeatures, Item, unknown>;
		isDragging: boolean;
		isShadow: boolean;
	};

	let { header, isDragging, isShadow }: Props = $props();
	let title = $derived(
		String(header.column.columnDef.header ?? header.column.id)
	);
</script>

<Table.Head
	aria-label={title}
	aria-sort={header.column.getIsSorted() === "asc"
		? "ascending"
		: header.column.getIsSorted() === "desc"
			? "descending"
			: "none"}
	class="relative h-10 border-t before:absolute before:inset-y-0 before:start-0 before:w-px before:bg-border first:before:bg-transparent"
	colspan={header.colSpan}
	data-is-dnd-shadow-item-hint={isShadow || undefined}
	style={`width: ${header.getSize()}px; opacity: ${isDragging ? 0.8 : 1};`}
>
	<div class="flex items-center justify-start gap-0.5">
		<button
			type="button"
			use:dragHandle
			aria-label={`Drag ${title} column`}
			class="-ml-2 inline-flex size-7 cursor-grab touch-none items-center justify-center rounded-md text-sm hover:bg-muted active:cursor-grabbing"
		>
			<GripVerticalIcon aria-hidden="true" class="size-4 opacity-60" />
		</button>

		<span class="grow truncate">
			{#if !header.isPlaceholder}
				<FlexRender {header} />
			{/if}
		</span>

		{#if header.column.getCanSort()}
			<button
				type="button"
				aria-label={`Sort ${title} column`}
				class="group -mr-1 inline-flex size-7 items-center justify-center rounded-md hover:bg-muted"
				onclick={header.column.getToggleSortingHandler()}
			>
				{#if header.column.getIsSorted() === "asc"}
					<ChevronUpIcon
						aria-hidden="true"
						class="size-4 shrink-0 opacity-60"
					/>
				{:else if header.column.getIsSorted() === "desc"}
					<ChevronDownIcon
						aria-hidden="true"
						class="size-4 shrink-0 opacity-60"
					/>
				{:else}
					<ChevronUpIcon
						aria-hidden="true"
						class="size-4 shrink-0 opacity-0 group-hover:opacity-60"
					/>
				{/if}
			</button>
		{/if}
	</div>
</Table.Head>
