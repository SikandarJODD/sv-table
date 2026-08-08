<script lang="ts">
	import { createSortable } from "@dnd-kit/svelte/sortable";
	import { FlexRender, type Cell } from "@tanstack/svelte-table";

	import type { DraggableTableFeatures } from "./table-features";
	import type { Item } from "./types";

	type Props = {
		cell: Cell<DraggableTableFeatures, Item, unknown>;
		index: number;
		isDragging: boolean;
	};

	let { cell, index, isDragging }: Props = $props();

	const sortable = createSortable({
		get id() {
			return `cell-${cell.id}`;
		},
		get index() {
			return index;
		},
		get group() {
			return `table-row-${cell.row.id}`;
		},
		type: "table-cell",
		accept: "table-column",
		disabled: {
			draggable: true,
			droppable: false
		}
	});
</script>

<td
	{@attach sortable.attach}
	data-slot="table-cell"
	class="truncate p-2 align-middle whitespace-nowrap transition-opacity [&:has([role=checkbox])]:pr-0"
	style:opacity={isDragging ? 0.8 : 1}
	style:width={`${cell.column.getSize()}px`}
>
	<FlexRender {cell} />
</td>
