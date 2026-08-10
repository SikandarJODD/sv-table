<script lang="ts">
	import { page } from "$app/state";
	import ApiTable from "$lib/components/docs/base/api-table/api-table.svelte";
	import CopyPageDropdown from "$lib/components/docs/base/main/copy-page-dropdown.svelte";
	import InstallComponent from "$lib/components/docs/base/main/install-component.svelte";
	import Seo from "$lib/components/docs/base/main/seo.svelte";
	import { SingleFile } from "$lib/components/ui/code";
	import { PreviewComponent } from "$lib/components/ui/preview-component";
	import type { CodeBlock } from "$lib/types/code";
	import type { PropsTable } from "$lib/types/structure";
	import { CodeSpan, H1, H2, Paragraph } from "$markdown";
	import DataTableFacetedFilterCode from "$table/data-table-faceted-filter/data-table-faceted-filter.svelte?raw";
	import DataTableFacetedFilterIndexCode from "$table/data-table-faceted-filter/index.ts?raw";
	import CountDisplayPreview from "./examples/count-display-preview.svelte";
	import CountDisplayPreviewCode from "./examples/count-display-preview.svelte?raw";
	import DataTableFacetedFilterPreview from "./examples/data-table-faceted-filter-preview.svelte";
	import DataTableFacetedFilterPreviewCode from "./examples/data-table-faceted-filter-preview.svelte?raw";

	const title = "Data Table Faceted Filter";
	const description =
		"A searchable multi-select filter with live facet counts for categorical table columns.";

	const previewCode: CodeBlock = {
		name: "data-table-faceted-filter-preview.svelte",
		lang: "svelte",
		code: DataTableFacetedFilterPreviewCode,
		highlight: [
			[24, 28],
			[31, 38],
			[81, 85]
		]
	};

	const countDisplayCode: CodeBlock = {
		name: "count-display-preview.svelte",
		lang: "svelte",
		code: CountDisplayPreviewCode
	};

	const setupCode: CodeBlock = {
		name: "table.svelte.ts",
		lang: "typescript",
		code: `import {
  columnFacetingFeature,
  columnFilteringFeature,
  createFacetedRowModel,
  createFacetedUniqueValues,
  createFilteredRowModel,
  createTable,
  filterFn_arrHas,
  tableFeatures
} from "@tanstack/svelte-table";

const features = tableFeatures({
  columnFilteringFeature,
  columnFacetingFeature,
  filteredRowModel: createFilteredRowModel(),
  facetedRowModel: createFacetedRowModel(),
  facetedUniqueValues: createFacetedUniqueValues(),
  filterFns: { arrHas: filterFn_arrHas }
});

const columns = [
  {
    accessorKey: "status",
    header: "Status",
    filterFn: "arrHas"
  }
];

export const table = createTable({
  features,
  columns,
  get data() {
    return rows;
  }
});`,
		highlight: [
			[12, 19],
			[25, 25]
		]
	};

	const usageCode: CodeBlock = {
		name: "toolbar.svelte",
		lang: "svelte",
		code: `<script lang="ts">
  import CircleCheckIcon from "@lucide/svelte/icons/circle-check";
  import DataTableFacetedFilter, {
    type DataTableFacetedFilterOption
  } from "$lib/components/table/data-table-faceted-filter";

  const options: DataTableFacetedFilterOption[] = [
    { label: "Active", value: "active", icon: CircleCheckIcon },
    { label: "Pending", value: "pending" },
    { label: "Inactive", value: "inactive" }
  ];

  const statusColumn = table.getColumn("status")!;
${"</" + "script>"}

<DataTableFacetedFilter
  column={statusColumn}
  title="Status"
  {options}
/>`,
		highlight: [
			[3, 5],
			[7, 11],
			[16, 20]
		]
	};

	const serverCountsCode: CodeBlock = {
		name: "server-counts.svelte",
		lang: "svelte",
		code: `<DataTableFacetedFilter
  column={statusColumn}
  title="Status"
  options={statusOptions}
  facets={new Map([
    ["active", 126],
    ["pending", 43],
    ["inactive", 18]
  ])}
/>`
	};

	// const folderStructure = [
	// 	"src/",
	// 	"`-- lib/",
	// 	"    `-- components/",
	// 	"        `-- table/",
	// 	"            `-- data-table-faceted-filter/",
	// 	"                |-- index.ts",
	// 	"                `-- data-table-faceted-filter.svelte"
	// ].join("\n");

	const folderStructure = `src/
└── lib/
    └── components/
        └── table/
            └── data-table-faceted-filter/
                ├── data-table-faceted-filter.svelte
                └── index.ts`;

	const propsTable: PropsTable = {
		name: "Data table faceted filter props",
		props: [
			{
				name: "column",
				type: "DataTableFacetedFilterColumn",
				default: "required",
				required: true,
				description:
					"A TanStack-compatible column exposing filter values and optional faceted counts."
			},
			{
				name: "title",
				type: "string",
				default: "required",
				required: true,
				description: "Filter label displayed in the trigger."
			},
			{
				name: "options",
				type: "DataTableFacetedFilterOption[]",
				default: "required",
				required: true,
				description:
					"Selectable labels and values, with optional icons."
			},
			{
				name: "facets",
				type: "Map<string, number>",
				default: "column counts",
				description:
					"Optional count override, useful when counts come from a server."
			},
			{
				name: "searchPlaceholder",
				type: "string",
				default: '"Search {title}..."',
				description: "Placeholder for the option search input."
			},
			{
				name: "emptyText",
				type: "string",
				default: '"No results found."',
				description:
					"Message displayed when option search has no matches."
			},
			{
				name: "clearText",
				type: "string",
				default: '"Clear filters"',
				description: "Label for the clear action."
			},
			{
				name: "showCounts",
				type: "boolean",
				default: "true",
				description:
					"Shows option counts and the selected result total when facet data exists."
			},
			{
				name: "disabled",
				type: "boolean",
				default: "false",
				description: "Disables the filter trigger."
			},
			{
				name: "open",
				type: "boolean",
				default: "false",
				description: "Bindable popover open state."
			},
			{
				name: "class",
				type: "string",
				default: "undefined",
				description: "Classes applied to the trigger button."
			},
			{
				name: "contentClass",
				type: "string",
				default: "undefined",
				description: "Classes applied to the popover content."
			}
		]
	};

	const optionTable: PropsTable = {
		name: "DataTableFacetedFilterOption",
		props: [
			{
				name: "label",
				type: "string",
				default: "required",
				required: true,
				description: "Human-readable option text."
			},
			{
				name: "value",
				type: "string",
				default: "required",
				required: true,
				description: "Value stored in the column filter array."
			},
			{
				name: "icon",
				type: "Component",
				default: "undefined",
				description: "Optional Svelte icon component."
			}
		]
	};

	const getURLPath = (url: string) => url.split("?")[0].split("#")[0];
	const installUrl = $derived(
		`${page.url.origin}/r/data-table-faceted-filter.json`
	);
	const llmsTxtUrl = $derived(`${getURLPath(page.url.href)}/llms.txt`);
</script>

<Seo
	{title}
	{description}
	keywords={[
		"faceted filter",
		"multi-select filter",
		"svelte table",
		"tanstack table",
		"facet counts"
	]}
/>

<div class="space-y-8 md:space-y-10">
	<section class="space-y-3">
		<div
			class="flex flex-col justify-between gap-3 md:flex-row md:items-center md:gap-4"
		>
			<H1 id="data-table-faceted-filter">{title}</H1>
			<CopyPageDropdown componentName={title} {llmsTxtUrl} />
		</div>

		<div class="max-w-2xl">
			<Paragraph>{description}</Paragraph>
			<Paragraph>
				Selections inside one filter use OR matching. Separate column
				filters are combined by the table, so Status = Active or Pending
				can be combined with Department = Engineering.
			</Paragraph>
		</div>
	</section>

	<section>
		<PreviewComponent
			code={previewCode}
			frame
			isCentered={false}
			class="min-h-96 p-4 md:p-6"
		>
			<DataTableFacetedFilterPreview />
		</PreviewComponent>
	</section>

	<section>
		<H2 id="installation">Installation</H2>
		<InstallComponent
			{installUrl}
			packages={["@lucide/svelte"]}
			codeBlocks={[
				{
					name: "table/data-table-faceted-filter/data-table-faceted-filter.svelte",
					lang: "svelte",
					code: DataTableFacetedFilterCode,
					isExpand: true
				},
				{
					name: "table/data-table-faceted-filter/index.ts",
					lang: "typescript",
					code: DataTableFacetedFilterIndexCode
				}
			]}
			{folderStructure}
			class="mt-4"
		/>
	</section>

	<section class="space-y-3">
		<H2 id="table-setup">Table setup</H2>
		<Paragraph>
			Enable column filtering and faceting, provide their row models, and
			use <CodeSpan>filterFn_arrHas</CodeSpan> so a scalar column matches any
			selected option.
		</Paragraph>
		<SingleFile code={setupCode} />
	</section>

	<section class="space-y-3">
		<H2 id="usage">Usage</H2>
		<Paragraph>
			Pass a filterable column and the complete option list. The component
			reads live counts from <CodeSpan>getFacetedUniqueValues()</CodeSpan> and
			stores selected values as a string array.
		</Paragraph>
		<SingleFile code={usageCode} />
	</section>

	<section class="space-y-3">
		<H2 id="examples">Examples</H2>
		<Paragraph>
			Counts are shown by default. Pass
			<CodeSpan>{"showCounts={false}"}</CodeSpan> to hide both the option counts
			and selected result total.
		</Paragraph>
		<PreviewComponent
			code={countDisplayCode}
			frame
			class="min-h-48 p-4 md:p-6"
		>
			<CountDisplayPreview />
		</PreviewComponent>
	</section>

	<section class="space-y-3">
		<H2 id="server-counts">Server-provided counts</H2>
		<Paragraph>
			For server-side filtering, pass the backend facet map through
			<CodeSpan>facets</CodeSpan>. It overrides counts from the column
			while the selection API remains unchanged.
		</Paragraph>
		<SingleFile code={serverCountsCode} />
	</section>

	<section class="space-y-3">
		<H2 id="accessibility">Accessibility</H2>
		<Paragraph>
			The popover and command list provide focus management, option
			search, arrow-key navigation, selection, Escape handling, and focus
			restoration. The trigger announces the active selection count.
		</Paragraph>
	</section>

	<section>
		<H2 id="props">Props</H2>
		<div class="mt-3 space-y-6">
			<ApiTable data={propsTable} />
			<ApiTable data={optionTable} />
		</div>
	</section>
</div>
