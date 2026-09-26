<script lang="ts" generics="TData extends Record<string, any>">
	import ChevronDownIcon from "@lucide/svelte/icons/chevron-down";
	import ChevronUpIcon from "@lucide/svelte/icons/chevron-up";
	import EyeOffIcon from "@lucide/svelte/icons/eye-off";
	import PinIcon from "@lucide/svelte/icons/pin";
	import PinOffIcon from "@lucide/svelte/icons/pin-off";
	import XIcon from "@lucide/svelte/icons/x";
	import type { Header } from "@tanstack/svelte-table";

	import * as DropdownMenu from "$lib/components/ui/dropdown-menu";
	import { cn } from "$lib/utils";
	import type { DataGridController } from "$lib/hooks/use-data-grid.svelte";

	import type { DataGridFeatures } from "./data-grid-features";
	import { getColumnVariant } from "./utils";

	let {
		header,
		grid
	}: {
		header: Header<DataGridFeatures, TData, any>;
		grid: DataGridController<TData>;
	} = $props();

	const column = $derived(header.column);
	const label = $derived(
		column.columnDef.meta?.label ??
			(typeof column.columnDef.header === "string"
				? column.columnDef.header
				: column.id)
	);
	const variantLabel = $derived(
		getColumnVariant(column.columnDef.meta?.cell?.variant)
	);

	function handlePointerDown(event: PointerEvent) {
		if (event.button === 0) grid.selectColumn(column.id);
	}

	function resizeKeydown(event: KeyboardEvent) {
		if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
			event.preventDefault();
			const delta = event.key === "ArrowRight" ? 10 : -10;
			grid.table.setColumnSizing((current) => ({
				...current,
				[column.id]: Math.max(
					60,
					Math.min(800, column.getSize() + delta)
				)
			}));
		}
	}
</script>

<DropdownMenu.Root>
	<DropdownMenu.Trigger
		class="flex size-full items-center justify-between gap-2 p-2 text-sm hover:bg-accent/40 data-[state=open]:bg-accent/40 [&_svg]:size-4"
		onpointerdown={handlePointerDown}
	>
		<div class="flex min-w-0 flex-1 items-center gap-1.5">
			<span class="truncate">{label}</span>
			<span class="sr-only">{variantLabel}</span>
		</div>
		<ChevronDownIcon class="shrink-0 text-muted-foreground" />
	</DropdownMenu.Trigger>
	<DropdownMenu.Content align="start" sideOffset={0} class="w-60">
		{#if column.getCanSort()}
			<DropdownMenu.CheckboxItem
				checked={column.getIsSorted() === "asc"}
				onSelect={() => column.toggleSorting(false, true)}
			>
				<ChevronUpIcon /> Sort ascending
			</DropdownMenu.CheckboxItem>
			<DropdownMenu.CheckboxItem
				checked={column.getIsSorted() === "desc"}
				onSelect={() => column.toggleSorting(true, true)}
			>
				<ChevronDownIcon /> Sort descending
			</DropdownMenu.CheckboxItem>
			{#if column.getIsSorted()}
				<DropdownMenu.Item onSelect={() => column.clearSorting()}>
					<XIcon /> Remove sort
				</DropdownMenu.Item>
			{/if}
		{/if}
		{#if column.getCanPin()}
			<DropdownMenu.Separator />
			{#if column.getIsPinned() === "start"}
				<DropdownMenu.Item onSelect={() => column.pin(false)}>
					<PinOffIcon /> Unpin from start
				</DropdownMenu.Item>
			{:else}
				<DropdownMenu.Item onSelect={() => column.pin("start")}>
					<PinIcon /> Pin to start
				</DropdownMenu.Item>
			{/if}
			{#if column.getIsPinned() === "end"}
				<DropdownMenu.Item onSelect={() => column.pin(false)}>
					<PinOffIcon /> Unpin from end
				</DropdownMenu.Item>
			{:else}
				<DropdownMenu.Item onSelect={() => column.pin("end")}>
					<PinIcon /> Pin to end
				</DropdownMenu.Item>
			{/if}
		{/if}
		{#if column.getCanHide()}
			<DropdownMenu.Separator />
			<DropdownMenu.Item onSelect={() => column.toggleVisibility(false)}>
				<EyeOffIcon /> Hide column
			</DropdownMenu.Item>
		{/if}
	</DropdownMenu.Content>
</DropdownMenu.Root>

{#if column.getCanResize()}
	<button
		type="button"
		aria-label={`Resize ${label} column`}
		class={cn(
			"absolute -end-px top-0 z-50 h-full w-0.5 cursor-ew-resize touch-none bg-border opacity-0 transition-opacity select-none after:absolute after:inset-y-0 after:start-1/2 after:w-[18px] after:-translate-x-1/2 hover:bg-primary hover:opacity-100 focus:bg-primary focus:opacity-100 focus:outline-none",
			column.getIsResizing() && "bg-primary opacity-100"
		)}
		ondblclick={() => column.resetSize()}
		onmousedown={header.getResizeHandler()}
		ontouchstart={header.getResizeHandler()}
		onkeydown={resizeKeydown}
	></button>
{/if}
