<script lang="ts" generics="TData extends Record<string, any>">
	import { CalendarDate, type DateValue } from "@internationalized/date";
	import { watch } from "runed";

	import * as Popover from "$lib/components/ui/popover";
	import type { DataGridController } from "$lib/hooks/use-data-grid.svelte";

	import DataGridCalendar from "../data-grid-calendar.svelte";
	import DataGridCellWrapper from "../data-grid-cell-wrapper.svelte";
	import type { DataGridCell } from "../types";
	import { formatDateForDisplay } from "../utils";

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
	const calendarValue = $derived.by(() => {
		const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(value);
		return match
			? new CalendarDate(
					Number(match[1]),
					Number(match[2]),
					Number(match[3])
				)
			: undefined;
	});

	watch(
		() => cell.getValue(),
		(next) => {
			if (!editing) value = String(next ?? "");
		},
		{ lazy: true }
	);

	function select(date: DateValue | undefined) {
		if (!date || grid.readOnly) return;
		value = `${date.year}-${String(date.month).padStart(2, "0")}-${String(date.day).padStart(2, "0")}`;
		grid.updateCell(rowIndex, cell.column.id, value);
		grid.stopEditing();
	}

	function keydown(event: KeyboardEvent) {
		if (event.key === "Escape") {
			event.preventDefault();
			grid.stopEditing();
		} else if (event.key === "Tab") {
			event.preventDefault();
			grid.stopEditing({ direction: event.shiftKey ? "left" : "right" });
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
				<span data-slot="grid-cell-content"
					>{formatDateForDisplay(value)}</span
				>
			</DataGridCellWrapper>
		{/snippet}
	</Popover.Trigger>
	{#if editing}
		<Popover.Content data-grid-cell-editor align="start" class="w-auto p-0">
			<DataGridCalendar value={calendarValue} onValueChange={select} />
		</Popover.Content>
	{/if}
</Popover.Root>
