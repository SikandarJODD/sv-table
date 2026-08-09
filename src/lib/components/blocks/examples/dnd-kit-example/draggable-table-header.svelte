<script lang="ts">
	import { createSortable } from "@dnd-kit/svelte/sortable";
	import ChevronDownIcon from "@lucide/svelte/icons/chevron-down";
	import ChevronUpIcon from "@lucide/svelte/icons/chevron-up";
	import GripVerticalIcon from "@lucide/svelte/icons/grip-vertical";
	import { FlexRender, type Header } from "@tanstack/svelte-table";

	import * as Table from "$lib/components/ui/table";

	import type { DraggableTableFeatures } from "./table-features";
	import type { Item } from "./types";

	type Props = {
		header: Header<DraggableTableFeatures, Item, unknown>;
		index: number;
	};

	let { header, index }: Props = $props();
	let title = $derived(
		String(header.column.columnDef.header ?? header.column.id)
	);

	const sortable = createSortable({
		get id() {
			return header.column.id;
		},
		get index() {
			return index;
		},
		group: "table-columns",
		type: "table-column",
		accept: "table-column"
	});
</script>

<Table.Head
	{@attach sortable.attach}
	aria-label={title}
	aria-sort={header.column.getIsSorted() === "asc"
		? "ascending"
		: header.column.getIsSorted() === "desc"
			? "descending"
			: "none"}
	class="relative before:absolute before:inset-y-0 before:start-0 before:w-px before:bg-border first:before:bg-transparent data-[dragging=true]:z-10 data-[dragging=true]:bg-muted/50 data-[dragging=true]:opacity-80"
	colspan={header.colSpan}
	data-dragging={sortable.isDragging || undefined}
	style={`width: ${header.getSize()}px;`}
>
	<div class="flex h-full items-center justify-start gap-0.5">
		<button
			{@attach sortable.attachHandle}
			type="button"
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
