<script lang="ts" generics="TData extends Record<string, any>">
	import { watch } from "runed";

	import { Badge } from "$lib/components/ui/badge";
	import * as Select from "$lib/components/ui/select";
	import type { DataGridController } from "$lib/hooks/use-data-grid.svelte";

	import DataGridCellWrapper from "../data-grid-cell-wrapper.svelte";
	import type { DataGridCell } from "../types";

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
		return String(cell.getValue() ?? "");
	}
	let value = $state(readValue());
	const editing = $derived(grid.isEditing(rowIndex, cell.column.id));
	const options = $derived(
		cell.column.columnDef.meta?.cell?.variant === "select"
			? cell.column.columnDef.meta.cell.options
			: []
	);
	const label = $derived(
		options.find((option) => option.value === value)?.label ?? value
	);

	watch(
		() => cell.getValue(),
		(next) => {
			if (!editing) value = String(next ?? "");
		},
		{ lazy: true }
	);

	function change(next: string) {
		if (grid.readOnly) return;
		value = next;
		grid.updateCell(rowIndex, cell.column.id, next);
		grid.stopEditing();
	}

	function keydown(event: KeyboardEvent) {
		if (event.key === "Escape" && editing) {
			event.preventDefault();
			grid.stopEditing();
		} else if (event.key === "Tab" && cell.getIsFocused()) {
			event.preventDefault();
			grid.stopEditing({ direction: event.shiftKey ? "left" : "right" });
		}
	}
</script>

<DataGridCellWrapper {cell} {grid} {rowIndex} onkeydown={keydown}>
	{#if editing}
		<Select.Root
			type="single"
			open={editing}
			{value}
			onValueChange={change}
			onOpenChange={(open) => !open && grid.stopEditing()}
		>
			<Select.Trigger
				size="sm"
				class="size-full border-none bg-transparent p-0 shadow-none focus-visible:ring-0"
			>
				{#if label}<Badge variant="secondary" class="px-1.5 py-px"
						>{label}</Badge
					>{/if}
			</Select.Trigger>
			<Select.Content data-grid-cell-editor align="start" sideOffset={-8}>
				{#each options as option (option.value)}
					<Select.Item value={option.value} label={option.label} />
				{/each}
			</Select.Content>
		</Select.Root>
	{:else if label}
		<Badge
			data-slot="grid-cell-content"
			variant="secondary"
			class="px-1.5 py-px whitespace-pre-wrap">{label}</Badge
		>
	{/if}
</DataGridCellWrapper>
