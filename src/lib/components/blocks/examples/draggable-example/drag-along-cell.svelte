<script lang="ts">
	import { FlexRender, type Cell } from "@tanstack/svelte-table";

	import * as Table from "$lib/components/ui/table";

	import type { DraggableTableFeatures } from "./table-features";
	import type { Item } from "./types";

	type Props = {
		cell: Cell<DraggableTableFeatures, Item, unknown>;
		isDragging: boolean;
	};

	let { cell, isDragging }: Props = $props();
</script>

<Table.Cell
	class="truncate transition-opacity"
	style={`width: ${cell.column.getSize()}px; opacity: ${isDragging ? 0.8 : 1};`}
>
	<FlexRender {cell} />
</Table.Cell>
