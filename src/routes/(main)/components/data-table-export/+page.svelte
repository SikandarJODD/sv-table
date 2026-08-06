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
	import { H1, H2, Paragraph } from "$markdown";
	import DataTableExportCode from "$table/data-table-export/data-table-export.svelte?raw";
	import DataTableExportIndexCode from "$table/data-table-export/index.ts?raw";
	import DataTableExportPreview from "./examples/data-table-export-preview.svelte";
	import DataTableExportPreviewCode from "./examples/data-table-export-preview.svelte?raw";

	const title = "Data Table Export";
	const description =
		"A dependency-free CSV download button with typed columns, value formatting, escaping, and formula protection.";

	const previewCode: CodeBlock = {
		name: "data-table-export-preview.svelte",
		lang: "svelte",
		code: DataTableExportPreviewCode
	};

	const usageCode: CodeBlock = {
		name: "projects-table.svelte",
		lang: "svelte",
		code: `<script lang="ts">
  import DataTableExport, {
    type CsvExportColumn
  } from "$lib/components/table/data-table-export";

  type Project = {
    name: string;
    owner: string;
    budget: number;
  };

  const exportColumns: CsvExportColumn<Project>[] = [
    { id: "name", header: "Project", accessor: "name" },
    { id: "owner", header: "Owner", accessor: "owner" },
    { id: "budget", header: "Budget", accessor: "budget" }
  ];

  const exportRows = $derived(
    table.getRowModel().rows.map((row) => row.original)
  );
${"</" + "script>"}

<DataTableExport
  rows={exportRows}
  columns={exportColumns}
  filename="projects"
/>`
	};

	const formatCode: CodeBlock = {
		name: "export-columns.ts",
		lang: "typescript",
		code: `type Project = {
  budget: number;
  owner: { name: string };
};

const exportColumns: CsvExportColumn<Project>[] = [
  {
    id: "budget",
    header: "Budget",
    accessor: "budget",
    format: (value) => "$" + Number(value).toFixed(2)
  },
  {
    id: "owner",
    header: "Owner",
    accessor: (row) => row.owner.name
  }
];`
	};

	const folderStructure = [
		"src/",
		"`-- lib/",
		"    `-- components/",
		"        `-- table/",
		"            `-- data-table-export/",
		"                |-- index.ts",
		"                `-- data-table-export.svelte"
	].join("\n");

	const propsTable: PropsTable = {
		name: "Data table export props",
		props: [
			{
				name: "rows",
				type: "T[]",
				default: "required",
				required: true,
				description: "Rows included in the downloaded CSV file."
			},
			{
				name: "columns",
				type: "CsvExportColumn<T>[]",
				default: "required",
				required: true,
				description:
					"Ordered column definitions used to create headers and cell values."
			},
			{
				name: "filename",
				type: "string",
				default: '"table-export"',
				description:
					"Downloaded filename. The .csv extension is added when missing."
			},
			{
				name: "label",
				type: "string",
				default: '"Export CSV"',
				description: "Text displayed in the export button."
			},
			{
				name: "delimiter",
				type: "string",
				default: '","',
				description: "Separator placed between exported cells."
			},
			{
				name: "includeBom",
				type: "boolean",
				default: "true",
				description:
					"Adds a UTF-8 byte order mark for spreadsheet compatibility."
			},
			{
				name: "protectFormulas",
				type: "boolean",
				default: "true",
				description:
					"Prefixes formula-like strings to prevent spreadsheet execution."
			},
			{
				name: "disabled",
				type: "boolean",
				default: "false",
				description:
					"Disables export. Empty rows or columns also disable the button."
			},
			{
				name: "class",
				type: "string",
				default: "undefined",
				description: "Classes applied to the export button."
			},
			{
				name: "onExport",
				type: "(result: CsvExportResult) => void",
				default: "undefined",
				description:
					"Runs after the browser download starts with filename and row count."
			}
		]
	};

	const columnTable: PropsTable = {
		name: "CsvExportColumn<T>",
		props: [
			{
				name: "id",
				type: "string",
				default: "required",
				required: true,
				description: "Stable column identifier."
			},
			{
				name: "header",
				type: "string",
				default: "required",
				required: true,
				description: "Header written to the first CSV row."
			},
			{
				name: "accessor",
				type: "keyof T | ((row: T) => CsvValue)",
				default: "required",
				required: true,
				description:
					"Row key or function that returns the exported value."
			},
			{
				name: "format",
				type: "(value: CsvValue, row: T) => CsvValue",
				default: "undefined",
				description: "Optional exported-value transformation."
			}
		]
	};

	const getURLPath = (url: string) => url.split("?")[0].split("#")[0];
	const installUrl = $derived(`${page.url.origin}/r/data-table-export.json`);
	const llmsTxtUrl = $derived(`${getURLPath(page.url.href)}/llms.txt`);
</script>

<Seo
	{title}
	{description}
	keywords={[
		"csv export",
		"data table export",
		"svelte table",
		"tanstack table",
		"download csv"
	]}
/>

<div class="space-y-8 md:space-y-10">
	<section class="space-y-3">
		<div
			class="flex flex-col justify-between gap-3 md:flex-row md:items-center md:gap-4"
		>
			<H1 id="data-table-export">{title}</H1>
			<CopyPageDropdown componentName={title} {llmsTxtUrl} />
		</div>

		<div class="max-w-2xl">
			<Paragraph>{description}</Paragraph>
		</div>
	</section>

	<section>
		<PreviewComponent
			code={previewCode}
			frame
			isCentered={false}
			class="min-h-80 p-4 md:p-6"
		>
			<DataTableExportPreview />
		</PreviewComponent>
	</section>

	<section>
		<H2 id="installation">Installation</H2>
		<InstallComponent
			{installUrl}
			codeBlocks={[
				{
					name: "table/data-table-export/data-table-export.svelte",
					lang: "svelte",
					code: DataTableExportCode,
					isExpand: true
				},
				{
					name: "table/data-table-export/index.ts",
					lang: "typescript",
					code: DataTableExportIndexCode
				}
			]}
			{folderStructure}
			class="mt-4"
		/>
	</section>

	<section class="space-y-3">
		<H2 id="usage">Usage</H2>
		<Paragraph>
			Pass the row model that matches the scope users should download. For
			a TanStack table, mapping the current row model preserves its
			filtering, sorting, and pagination.
		</Paragraph>
		<SingleFile code={usageCode} />
	</section>

	<section class="space-y-3">
		<H2 id="formatting-values">Formatting values</H2>
		<Paragraph>
			Use an accessor function for nested data and `format` when the
			downloaded value should differ from the raw value. Rendered
			components such as badges, checkboxes, and action menus are
			intentionally not serialized.
		</Paragraph>
		<SingleFile code={formatCode} />
	</section>

	<section class="space-y-3">
		<H2 id="server-side-data">Server-side data</H2>
		<Paragraph>
			The component can only export rows available in the browser. With
			server-side pagination, fetch the complete filtered dataset first or
			generate the file on your server.
		</Paragraph>
	</section>

	<section class="space-y-3">
		<H2 id="csv-behavior">CSV behavior</H2>
		<Paragraph>
			Quotes, delimiters, and line breaks are escaped automatically. Dates
			use ISO format, a UTF-8 byte order mark is included by default, and
			formula-like strings are protected before spreadsheet applications
			open the file.
		</Paragraph>
	</section>

	<section>
		<H2 id="api-reference">API reference</H2>
		<div class="mt-3 space-y-6">
			<ApiTable data={propsTable} />
			<ApiTable data={columnTable} />
		</div>
	</section>
</div>
