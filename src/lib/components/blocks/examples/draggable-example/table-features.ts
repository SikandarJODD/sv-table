import {
	columnOrderingFeature,
	createSortedRowModel,
	rowSortingFeature,
	tableFeatures,
	columnSizingFeature,
	columnResizingFeature,
	columnPinningFeature,

} from "@tanstack/svelte-table";

export const draggableTableFeatures = tableFeatures({
	columnOrderingFeature,
	rowSortingFeature,
	sortedRowModel: createSortedRowModel(),
	columnSizingFeature,
	columnResizingFeature,
	columnPinningFeature,
});

export type DraggableTableFeatures = typeof draggableTableFeatures;
