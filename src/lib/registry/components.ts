export type BadgeType = "New" | "Updated" | "Beta";

export interface Component {
	id: string;
	name: string;
	href: string;
	badge?: BadgeType;
	desc?: string;
}

export interface DocPage {
	id: string;
	name: string;
	href: string;
	desc?: string;
}

export interface QuickExample {
	id: string;
	name: string;
	href: string;
	desc?: string;
}

let components: Component[] = [
	{
		id: "row-checkbox",
		name: "Row Checkbox",
		href: "/components/row-checkbox",
		desc: "A controlled checkbox for selecting an individual table row.",
	},
	{
		id: "header-checkbox",
		name: "Header Checkbox",
		href: "/components/header-checkbox",
		desc: "A select-all checkbox with support for an indeterminate state.",
	},
	{
		id: "bulk-actions-bar",
		name: "Bulk Actions Bar",
		href: "/components/bulk-actions-bar",
		desc: "A floating action bar for performing custom actions on selected rows.",
	},
	{
		id: "row-actions-menu",
		name: "Row Actions Menu",
		href: "/components/row-actions-menu",
		desc: "An accessible dropdown menu for actions on an individual table row.",
	},
	{
		id: "data-table-export",
		name: "Data Table Export",
		href: "/components/data-table-export",
		desc: "Download typed table rows and columns as a safe CSV file.",
	},
	{
		id: "data-table-empty",
		name: "Data Table Empty",
		href: "/components/data-table-empty",
		desc: "A table row for displaying a clear empty or filtered-results state.",
	},
	{
		id: "data-table-loading",
		name: "Data Table Loading",
		href: "/components/data-table-loading",
		desc: "Skeleton rows that preserve a table layout while its data is loading.",
	},
	{
		id: "debounce-input",
		name: "Debounce Input",
		href: "/components/debounce-input",
		desc: "A search input with an optional delay for value changes.",
	},
	{
		id: "filters",
		name: "Data Table Filters",
		href: "/components/filters",
		desc: "Composable table filters with text, number, option, and date operators for Svelte apps.",
		badge: "New"
	},
	{
		id: "data-table-faceted-filter",
		name: "Data Table Faceted Filter",
		href: "/components/data-table-faceted-filter",
		desc: "A searchable multi-select filter with live counts for categorical table columns.",
	},
	{
		id: "date-range-filter",
		name: "Date Range Filter",
		href: "/components/date-range-filter",
		desc: "A responsive date-range picker with presets and explicit apply behavior.",
	},
	{
		id: "number-range-filter",
		name: "Number Range Filter",
		href: "/components/number-range-filter",
		desc: "A number range picker with exact inputs, an optional slider, and explicit apply behavior.",
	},
	{
		id: "data-table-column-header",
		name: "Data Table Column Header",
		href: "/components/data-table-column-header",
		desc: "A table heading with sorting, pinning, ordering, and visibility actions.",
	},
	{
		id: "data-table-view",
		name: "Data Table View",
		href: "/components/data-table-view",
		desc: "A checkbox dropdown for toggling table column visibility.",
	},
	{
		id: "pagination",
		name: "Pagination",
		href: "/components/pagination",
		desc: "Minimal docs for number pagination and arrow pagination table components.",
	},
	{
		id: "page-size-selector",
		name: "Page Size Selector",
		href: "/components/page-size-selector",
		desc: "Change the number of rows displayed on each table page.",
	}
];

export { components };

let quickExamples: QuickExample[] = [
	{
		id: "basic",
		name: "Basic Example",
		href: "/quick-examples/basic",
		desc: "A complete quick example that mirrors the table filters preview."
	},
	{
		id: "faceted-filter-example",
		name: "Faceted Filter",
		href: "/quick-examples/faceted-filter",
		desc: "Filter 400 seeded rows with multiple facets and live counts."
	},
	{
		id: "date-range-filter-example",
		name: "Date Range Filter",
		href: "/quick-examples/date-range-filter",
		desc: "Filter table rows with presets or a custom inclusive date range."
	},
	{
		id: "sorting",
		name: "Sorting",
		href: "/quick-examples/sorting",
		desc: "Sorting-focused quick example route."
	},
	{
		id: "pagination-example",
		name: "Pagination",
		href: "/quick-examples/pagination",
		desc: "Pagination-focused quick example route."
	},
	{
		id: "csv-export-example",
		name: "CSV Export",
		href: "/quick-examples/csv-export",
		desc: "Export the currently filtered table rows to a CSV file."
	}
];

export { quickExamples };

let docsPages: DocPage[] = [
	{
		id: "docs",
		name: "Introduction",
		href: "/docs",
		desc: "Getting started with the setup."
	}
	// {
	//   id: "installation",
	//   name: "Installation",
	//   href: "/docs/installation",
	//   desc: "Create the app and initialize shadcn-svelte.",
	// },
];

export { docsPages };

type NavigationItem = DocPage | Component | QuickExample;

function getNavigationItems(): NavigationItem[] {
	return [...docsPages, ...components, ...quickExamples];
}

function findNavigationIndex(target: string): number {
	const items = getNavigationItems();

	return items.findIndex(
		(item) => item.id === target || item.href === target
	);
}

export function getPrevNext(id: string): {
	prev: NavigationItem | null;
	next: NavigationItem | null;
} {
	let items = getNavigationItems();
	let index = findNavigationIndex(id);
	if (index === -1) return { prev: null, next: null };
	return {
		prev: index > 0 ? items[index - 1] : null,
		next: index < items.length - 1 ? items[index + 1] : null
	};
}
