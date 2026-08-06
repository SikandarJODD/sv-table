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
		badge: "New"
	},
	{
		id: "header-checkbox",
		name: "Header Checkbox",
		href: "/components/header-checkbox",
		desc: "A select-all checkbox with support for an indeterminate state.",
		badge: "New"
	},
	{
		id: "bulk-actions-bar",
		name: "Bulk Actions Bar",
		href: "/components/bulk-actions-bar",
		desc: "A floating action bar for performing custom actions on selected rows.",
		badge: "New"
	},
	{
		id: "row-actions-menu",
		name: "Row Actions Menu",
		href: "/components/row-actions-menu",
		desc: "An accessible dropdown menu for actions on an individual table row.",
		badge: "New"
	},
	{
		id: "debounce-input",
		name: "Debounce Input",
		href: "/components/debounce-input",
		desc: "A search input that delays value changes until typing pauses.",
		badge: "New"
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
		badge: "New"
	},
	{
		id: "data-table-column-header",
		name: "Data Table Column Header",
		href: "/components/data-table-column-header",
		desc: "A table heading with sorting, pinning, ordering, and visibility actions.",
		badge: "New"
	},
	{
		id: "data-table-view",
		name: "Data Table View",
		href: "/components/data-table-view",
		desc: "A checkbox dropdown for toggling table column visibility.",
		badge: "New"
	},
	{
		id: "pagination",
		name: "Pagination",
		href: "/components/pagination",
		desc: "Minimal docs for number pagination and arrow pagination table components.",
		badge: "New"
	},
	{
		id: "page-size-selector",
		name: "Page Size Selector",
		href: "/components/page-size-selector",
		desc: "Change the number of rows displayed on each table page.",
		badge: "New"
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
