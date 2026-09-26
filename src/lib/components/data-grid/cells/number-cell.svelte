<script lang="ts" generics="TData extends Record<string, any>">
	import { watch } from "runed";

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
	let inputRef = $state<HTMLInputElement | null>(null);
	const editing = $derived(grid.isEditing(rowIndex, cell.column.id));
	const options = $derived(
		cell.column.columnDef.meta?.cell?.variant === "number"
			? cell.column.columnDef.meta.cell
			: null
	);

	watch(
		() => cell.getValue(),
		(next) => {
			if (!editing) value = String(next ?? "");
		},
		{ lazy: true }
	);
	watch(
		() => editing,
		(active) => {
			if (!active) return;
			requestAnimationFrame(() => {
				const pending = grid.consumePendingEditKey();
				if (pending) value = pending;
				inputRef?.focus();
			});
		},
		{ lazy: true }
	);

	function save(options?: Parameters<typeof grid.stopEditing>[0]) {
		const next = value === "" ? null : Number(value);
		if (next !== cell.getValue())
			grid.updateCell(rowIndex, cell.column.id, next);
		grid.stopEditing(options);
	}

	function keydown(event: KeyboardEvent) {
		if (!editing) return;
		if (event.key === "Enter") {
			event.preventDefault();
			save({ moveToNextRow: true });
		} else if (event.key === "Tab") {
			event.preventDefault();
			save({ direction: event.shiftKey ? "left" : "right" });
		} else if (event.key === "Escape") {
			event.preventDefault();
			value = String(cell.getValue() ?? "");
			grid.stopEditing();
		}
	}
</script>

<DataGridCellWrapper {cell} {grid} {rowIndex} onkeydown={keydown}>
	{#if editing}
		<input
			bind:this={inputRef}
			bind:value
			type="number"
			min={options?.min}
			max={options?.max}
			step={options?.step}
			class="w-full [appearance:textfield] border-none bg-transparent p-0 outline-none"
			onblur={() => editing && save()}
		/>
	{:else}
		<span data-slot="grid-cell-content">{value}</span>
	{/if}
</DataGridCellWrapper>
