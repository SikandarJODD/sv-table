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
	let editor = $state<HTMLDivElement | null>(null);
	const editing = $derived(grid.isEditing(rowIndex, cell.column.id));

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
				if (!editor) return;
				editor.textContent = value;
				editor.focus();
				const range = document.createRange();
				range.selectNodeContents(editor);
				range.collapse(false);
				const selection = getSelection();
				selection?.removeAllRanges();
				selection?.addRange(range);
			});
		},
		{ lazy: true }
	);

	function save(options?: Parameters<typeof grid.stopEditing>[0]) {
		const next = editor?.textContent ?? value;
		if (next !== String(cell.getValue() ?? ""))
			grid.updateCell(rowIndex, cell.column.id, next);
		value = next;
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
			if (editor) editor.textContent = value;
			grid.stopEditing();
		}
	}
</script>

<DataGridCellWrapper {cell} {grid} {rowIndex} onkeydown={keydown}>
	<div
		bind:this={editor}
		role="textbox"
		data-slot="grid-cell-content"
		contenteditable={editing}
		tabindex="-1"
		class="size-full overflow-hidden outline-none"
		oninput={(event) => (value = event.currentTarget.textContent ?? "")}
		onblur={() => editing && save()}
	>
		{editing ? "" : value}
	</div>
</DataGridCellWrapper>
