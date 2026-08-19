import BasicDataTable from "./examples/basic-data-table.svelte";
import ComplexExample from "./examples/complex-example/complex-example.svelte";
import CustomFiltersExample from "./examples/custom-filters-example.svelte";
import DataTableFiltersExample from "./examples/data-table-filters-example.svelte";
import DraggableExample from "./examples/draggable-example/draggable-example.svelte";
import ExpandedSubRows from "./examples/expanded-sub-rows/expanded-sub-rows.svelte";
import NumericPaginationExample from "./examples/numeric-pagination-example.svelte";
import PaginatedExample from "./examples/paginated-example.svelte";
import PinnableColumn from "./examples/pinnable-column.svelte";
import ResizableSortExample from "./examples/resizable-sort-example.svelte";
import RowSelection from "./examples/row-selection.svelte";
import {
	createBlockCodeTree,
	type BlockCodeFileInput,
	type BlockShowcaseItem
} from "$lib/components/docs/tree/types";

const exampleSources = import.meta.glob<string>(
	[
		"./examples/*.svelte",
		"./examples/complex-example/*.{svelte,ts}",
		"./examples/draggable-example/*.{svelte,ts}",
		"./examples/expanded-sub-rows/*.svelte"
	],
	{
		query: "?raw",
		import: "default",
		eager: true
	}
);

function createCodeFile(path: string): BlockCodeFileInput {
	const sourcePath = `./examples/${path}`;
	const code = exampleSources[sourcePath];

	if (code === undefined) {
		throw new Error(`Missing block example source: ${sourcePath}`);
	}

	return {
		path,
		code,
		lang: path.endsWith(".svelte") ? "svelte" : "typescript"
	};
}

function createExampleCodeTree(
	defaultFilePath: string,
	filePaths: string[] = [defaultFilePath]
) {
	return createBlockCodeTree(
		defaultFilePath,
		filePaths.map(createCodeFile)
	);
}

export const blockShowcases = [
	{
		id: "basic-data-table",
		title: "Basic Data Table",
		previewComponent: BasicDataTable,
		codeTree: createExampleCodeTree("basic-data-table.svelte")
	},
	{
		id: "row-selection",
		title: "Row Selection",
		previewComponent: RowSelection,
		codeTree: createExampleCodeTree("row-selection.svelte"),
		components: [
			{
				name: 'Header Checkbox',
				url: '/components/header-checkbox'
			},
			{
				name: 'Row Checkbox',
				url: '/components/row-checkbox'
			},
		]
	},
	{
		id: "data-table-with-filters",
		title: "Data Table with Filters",
		previewComponent: DataTableFiltersExample,
		codeTree: createExampleCodeTree("data-table-filters-example.svelte"),
		components: [
			{
				name: 'Number Range Filter',
				url: '/components/number-range-filter'
			},
			{
				name: 'Debounce Input',
				url: '/components/debounce-input'
			},
			{
				name: 'Faceted Filter',
				url: '/components/data-table-faceted-filter'
			}
		]
	},
	{
		id: "data-table-with-custom-filters",
		title: "Data Table with Custom Filters",
		previewComponent: CustomFiltersExample,
		codeTree: createExampleCodeTree("custom-filters-example.svelte"),
		components: [
			{
				name: "Filters",
				url: "/components/filters"
			}
		]
	},
	{
		id: "resizable-sortable-columns",
		title: "Resizable & Sortable Columns",
		previewComponent: ResizableSortExample,
		codeTree: createExampleCodeTree("resizable-sort-example.svelte")
	},
	{
		id: "pinnable-columns",
		title: "Pinnable Columns",
		previewComponent: PinnableColumn,
		codeTree: createExampleCodeTree("pinnable-column.svelte")
	},
	{
		id: "draggable-columns",
		title: "Draggable Columns",
		previewComponent: DraggableExample,
		codeTree: createExampleCodeTree(
			"draggable-example/draggable-example.svelte",
			[
				"draggable-example/draggable-example.svelte",
				"draggable-example/drag-along-cell.svelte",
				"draggable-example/draggable-table-header.svelte",
				"draggable-example/table-features.ts",
				"draggable-example/types.ts"
			]
		)
	},
	{
		id: "expandable-sub-rows",
		title: "Expandable Sub Rows",
		previewComponent: ExpandedSubRows,
		codeTree: createExampleCodeTree(
			"expanded-sub-rows/expanded-sub-rows.svelte",
			[
				"expanded-sub-rows/expanded-sub-rows.svelte",
				"expanded-sub-rows/row-expander.svelte"
			]
		),
		components: [
			{
				name: "Header Checkbox",
				url: "/components/header-checkbox"
			},
			{
				name: "Row Checkbox",
				url: "/components/row-checkbox"
			}
		]
	},
	{
		id: "paginated-table",
		title: "Paginated Table",
		previewComponent: PaginatedExample,
		codeTree: createExampleCodeTree("paginated-example.svelte"),
		components: [
			{
				name: "Header Checkbox",
				url: "/components/header-checkbox"
			},
			{
				name: "Page Size Selector",
				url: "/components/page-size-selector"
			},
			{
				name: "Pagination",
				url: "/components/pagination"
			},
			{
				name: "Pagination Arrow",
				url: "/components/pagination#arrow-pagination"
			},
			{
				name: "Row Checkbox",
				url: "/components/row-checkbox"
			}
		]
	},
	{
		id: "numeric-pagination",
		title: "Numeric Pagination",
		previewComponent: NumericPaginationExample,
		codeTree: createExampleCodeTree("numeric-pagination-example.svelte"),
		components: [
			{
				name: "Header Checkbox",
				url: "/components/header-checkbox"
			},
			{
				name: "Page Size Selector",
				url: "/components/page-size-selector"
			},
			{
				name: "Pagination",
				url: "/components/pagination"
			},
			{
				name: "Row Checkbox",
				url: "/components/row-checkbox"
			}
		]
	},
	{
		id: "complex-table",
		title: "Complex Table",
		previewComponent: ComplexExample,
		codeTree: createExampleCodeTree(
			"complex-example/complex-example.svelte",
			[
				"complex-example/complex-example.svelte",
				"complex-example/table.svelte",
				"complex-example/table-config.ts",
				"complex-example/table-snippets.svelte",
				"complex-example/fetch-data.ts"
			]
		),
		components: [
			{
				name: "Data Table Faceted Filter",
				url: "/components/data-table-faceted-filter"
			},
			{
				name: "Data Table View",
				url: "/components/data-table-view"
			},
			{
				name: "Debounce Input",
				url: "/components/debounce-input"
			},
			{
				name: "Header Checkbox",
				url: "/components/header-checkbox"
			},
			{
				name: "Page Size Selector",
				url: "/components/page-size-selector"
			},
			{
				name: "Pagination Arrow",
				url: "/components/pagination"
			},
			{
				name: "Row Checkbox",
				url: "/components/row-checkbox"
			}
		]
	}
] satisfies BlockShowcaseItem[];
