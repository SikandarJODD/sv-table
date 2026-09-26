import {
	cellSelectionFeature,
	columnFilteringFeature,
	columnOrderingFeature,
	columnPinningFeature,
	columnResizingFeature,
	columnSizingFeature,
	columnVisibilityFeature,
	createFilteredRowModel,
	createSortedRowModel,
	rowSelectionFeature,
	rowSortingFeature,
	tableFeatures
} from "@tanstack/svelte-table";

export const dataGridFeatures = tableFeatures({
	cellSelectionFeature,
	columnFilteringFeature,
	columnOrderingFeature,
	columnPinningFeature,
	columnResizingFeature,
	columnSizingFeature,
	columnVisibilityFeature,
	rowSelectionFeature,
	rowSortingFeature,
	filteredRowModel: createFilteredRowModel(),
	sortedRowModel: createSortedRowModel()
});

export type DataGridFeatures = typeof dataGridFeatures;
