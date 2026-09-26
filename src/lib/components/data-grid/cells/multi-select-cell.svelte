<script lang="ts" generics="TData extends Record<string, any>">
	import CheckIcon from "@lucide/svelte/icons/check";
	import XIcon from "@lucide/svelte/icons/x";
	import { watch } from "runed";

	import { Badge } from "$lib/components/ui/badge";
	import { Input } from "$lib/components/ui/input";
	import * as Popover from "$lib/components/ui/popover";
	import type { DataGridController } from "$lib/hooks/use-data-grid.svelte";
	import { useBadgeOverflow } from "$lib/hooks/use-badge-overflow.svelte";

	import DataGridCellWrapper from "../data-grid-cell-wrapper.svelte";
	import type { DataGridCell } from "../types";
	import { getLineCount } from "../utils";

	let {
		cell,
		grid,
		rowIndex
	}: {
		cell: DataGridCell<TData>;
		grid: DataGridController<TData>;
		rowIndex: number;
	} = $props();
	function readValue() {
		return (cell.getValue() as string[] | null) ?? [];
	}
	let selected = $state.raw<string[]>(readValue());
	let query = $state("");
	let badgeContainer = $state<HTMLElement | null>(null);
	let inputRef = $state<HTMLInputElement | null>(null);
	const editing = $derived(grid.isEditing(rowIndex, cell.column.id));
	const options = $derived(
		cell.column.columnDef.meta?.cell?.variant === "multi-select"
			? cell.column.columnDef.meta.cell.options
			: []
	);
	const labels = $derived(
		selected.map(
			(value) =>
				options.find((option) => option.value === value)?.label ?? value
		)
	);
	const filtered = $derived(
		options.filter((option) =>
			option.label.toLowerCase().includes(query.toLowerCase())
		)
	);
	const overflow = useBadgeOverflow({
		get items() {
			return labels;
		},
		get container() {
			return badgeContainer;
		},
		get lineCount() {
			return getLineCount(grid.rowHeight);
		},
		getLabel: (label) => label
	});

	watch(
		() => cell.getValue(),
		(next) => {
			if (!editing) selected = [...((next as string[] | null) ?? [])];
		},
		{ lazy: true }
	);
	watch(
		() => editing,
		(active) => {
			if (active) requestAnimationFrame(() => inputRef?.focus());
			else query = "";
		},
		{ lazy: true }
	);

	function commit(next: string[]) {
		if (grid.readOnly) return;
		selected = next;
		grid.updateCell(rowIndex, cell.column.id, next);
		query = "";
		requestAnimationFrame(() => inputRef?.focus());
	}

	function toggle(value: string) {
		commit(
			selected.includes(value)
				? selected.filter((item) => item !== value)
				: [...selected, value]
		);
	}

	function keydown(event: KeyboardEvent) {
		if (event.key === "Escape") {
			event.preventDefault();
			grid.stopEditing();
		} else if (event.key === "Tab") {
			event.preventDefault();
			grid.stopEditing({ direction: event.shiftKey ? "left" : "right" });
		} else if (event.key === "Backspace" && !query && selected.length) {
			event.preventDefault();
			commit(selected.slice(0, -1));
		}
	}
</script>

<Popover.Root
	open={editing}
	onOpenChange={(open) => !open && editing && grid.stopEditing()}
>
	<Popover.Trigger>
		{#snippet child({ props })}
			<DataGridCellWrapper
				{...props}
				{cell}
				{grid}
				{rowIndex}
				onkeydown={keydown}
			>
				<div
					bind:this={badgeContainer}
					data-slot="grid-cell-content"
					class="flex size-full flex-wrap items-center gap-1 overflow-hidden"
				>
					{#each overflow.visibleItems as label, index (`${selected[index]}-${index}`)}
						<Badge variant="secondary" class="px-1.5 py-px"
							>{label}</Badge
						>
					{/each}
					{#if overflow.hiddenCount > 0}<Badge
							variant="outline"
							class="px-1.5 py-px">+{overflow.hiddenCount}</Badge
						>{/if}
				</div>
			</DataGridCellWrapper>
		{/snippet}
	</Popover.Trigger>
	{#if editing}
		<Popover.Content data-grid-cell-editor align="start" class="w-72 p-0">
			<div class="flex flex-wrap gap-1 border-b p-2">
				{#each selected as value (value)}
					<Badge variant="secondary" class="gap-1 px-1.5 py-px">
						{options.find((option) => option.value === value)
							?.label ?? value}
						<button
							type="button"
							onclick={() =>
								commit(
									selected.filter((item) => item !== value)
								)}
							aria-label={`Remove ${value}`}
							><XIcon class="size-3" /></button
						>
					</Badge>
				{/each}
				<Input
					bind:ref={inputRef}
					bind:value={query}
					class="h-7 min-w-24 flex-1 border-0 p-0 shadow-none focus-visible:ring-0"
					placeholder="Search..."
					onkeydown={keydown}
				/>
			</div>
			<div class="max-h-64 overflow-y-auto p-1">
				{#if filtered.length === 0}<p
						class="p-4 text-center text-sm text-muted-foreground"
					>
						No options found.
					</p>{/if}
				{#each filtered as option (option.value)}
					<button
						type="button"
						class="flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-sm hover:bg-accent"
						onclick={() => toggle(option.value)}
					>
						<span
							class="flex size-4 items-center justify-center rounded-sm border"
							>{#if selected.includes(option.value)}<CheckIcon
									class="size-3"
								/>{/if}</span
						>
						{option.label}
					</button>
				{/each}
				{#if selected.length}<button
						type="button"
						class="mt-1 w-full border-t px-2 py-2 text-sm text-muted-foreground"
						onclick={() => commit([])}>Clear all</button
					>{/if}
			</div>
		</Popover.Content>
	{/if}
</Popover.Root>
