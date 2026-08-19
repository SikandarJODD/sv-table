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
	renderComponent,
	renderSnippet,
	rowPaginationFeature,
	rowSelectionFeature,
	rowSortingFeature,
	sortFn_alphanumeric,
	sortFn_text,
	tableFeatures,
	type ColumnDef,
	type FilterFn
} from "@tanstack/svelte-table";

import type { DataTableFacetedFilterOption } from "$table/data-table-faceted-filter";
import HeaderCheckbox from "$table/header-checkbox";
import RowCheckbox from "$table/row-checkbox";

import type { Person } from "./fetch-data";
import {
	balanceCell,
	locationCell,
	nameCell,
	statusCell
} from "./table-snippets.svelte";

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

export const columns: ColumnDef<typeof features, Person, any>[] = [
	{
		id: "select",
		size: 44,
		enableHiding: false,
		enableSorting: false,
		header: ({ table }) => {
			const allSelected = table.getIsAllPageRowsSelected();

			return renderComponent(HeaderCheckbox, {
				checked: allSelected,
				indeterminate:
					table.getIsSomePageRowsSelected() && !allSelected,
				onCheckedChange: (checked) =>
					table.toggleAllPageRowsSelected(checked),
				"aria-label": "Select all rows on this page"
			});
		},
		cell: ({ row }) =>
			renderComponent(RowCheckbox, {
				checked: row.getIsSelected(),
				onCheckedChange: (checked) => row.toggleSelected(checked),
				"aria-label": `Select ${row.original.name}`
			})
	},
	{
		accessorKey: "name",
		header: "Name",
		size: 180,
		enableHiding: false,
		filterFn: "multiColumn",
		cell: ({ row }) => renderSnippet(nameCell, { name: row.original.name })
	},
	{
		accessorKey: "email",
		header: "Email",
		size: 220
	},
	{
		accessorKey: "location",
		header: "Location",
		size: 180,
		cell: ({ row }) =>
			renderSnippet(locationCell, {
				flag: row.original.flag,
				location: row.original.location
			})
	},
	{
		accessorKey: "status",
		header: "Status",
		size: 120,
		filterFn: "arrHas",
		cell: ({ row }) =>
			renderSnippet(statusCell, { status: row.original.status })
	},
	{
		accessorKey: "performance",
		header: "Performance",
		size: 140
	},
	{
		accessorKey: "balance",
		header: "Balance",
		size: 140,
		cell: ({ row }) =>
			renderSnippet(balanceCell, { balance: row.original.balance })
	}
];

export const statusOptions: DataTableFacetedFilterOption[] = [
	{ label: "Active", value: "Active" },
	{ label: "Pending", value: "Pending" },
	{ label: "Inactive", value: "Inactive" }
];
