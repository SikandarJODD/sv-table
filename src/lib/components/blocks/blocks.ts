export type Block = {
	name: string;
	url: string;
	disabled?: boolean;
};

export const blocks: Block[] = [
	{ name: "Basic Data Table", url: "/blocks#basic-data-table" },
	{ name: "Row Selection", url: "/blocks#row-selection" },
	{
		name: "Data Table with Filters",
		url: "/blocks#data-table-with-filters"
	},
	{
		name: "Data Table with Custom Filters",
		url: "/blocks#data-table-with-custom-filters"
	},
	{
		name: "Resizable & Sortable Columns",
		url: "/blocks#resizable-sortable-columns"
	},
	{ name: "Pinnable Columns", url: "/blocks#pinnable-columns" },
	{ name: "Draggable Columns", url: "/blocks#draggable-columns" },
	{
		name: "Expandable Sub Rows",
		url: "/blocks#expandable-sub-rows"
	},
	{ name: "Paginated Table", url: "/blocks#paginated-table" },
	{ name: "Numeric Pagination", url: "/blocks#numeric-pagination" },
	{ name: "Complex Table", url: "/blocks#complex-table" }
];
