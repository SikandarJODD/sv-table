import {
	columnOrderingFeature,
	columnResizingFeature,
	columnSizingFeature,
	createSortedRowModel,
	rowSortingFeature,
	tableFeatures
} from "@tanstack/svelte-table";

export const draggableTableFeatures = tableFeatures({
	columnOrderingFeature,
	columnSizingFeature,
	columnResizingFeature,
	rowSortingFeature,
	sortedRowModel: createSortedRowModel()
});

export type DraggableTableFeatures = typeof draggableTableFeatures;
