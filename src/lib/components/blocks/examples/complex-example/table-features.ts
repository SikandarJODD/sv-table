import {
	columnFacetingFeature,
	columnFilteringFeature,
	columnSizingFeature,
	columnVisibilityFeature,
	createFacetedRowModel,
	createFacetedUniqueValues,
	createFilteredRowModel,
	createPaginatedRowModel,
	createSortedRowModel,
	filterFn_arrHas,
	rowPaginationFeature,
	rowSelectionFeature,
	rowSortingFeature,
	sortFn_alphanumeric,
	sortFn_text,
	tableFeatures,
	type FilterFn
} from "@tanstack/svelte-table";

import type { Person } from "./fetch-data";

const multiColumnFilterFn: FilterFn<any, Person> = (
	row,
	_columnId,
	filterValue
) => {
	const searchableContent =
		`${row.original.name} ${row.original.email}`.toLowerCase();
	return searchableContent.includes(String(filterValue ?? "").toLowerCase());
};

export const features = tableFeatures({
	columnFacetingFeature,
	columnFilteringFeature,
	columnSizingFeature,
	columnVisibilityFeature,
	rowPaginationFeature,
	rowSelectionFeature,
	rowSortingFeature,
	facetedRowModel: createFacetedRowModel(),
	facetedUniqueValues: createFacetedUniqueValues(),
	filteredRowModel: createFilteredRowModel(),
	paginatedRowModel: createPaginatedRowModel(),
	sortedRowModel: createSortedRowModel(),
	sortFns: {
		alphanumeric: sortFn_alphanumeric,
		text: sortFn_text
	},
	filterFns: {
		arrHas: filterFn_arrHas,
		multiColumn: multiColumnFilterFn
	}
});
