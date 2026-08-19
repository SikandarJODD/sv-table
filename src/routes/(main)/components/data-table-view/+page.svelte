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
	import DataTableViewCode from "$table/data-table-view/data-table-view.svelte?raw";
	import DataTableViewIndexCode from "$table/data-table-view/index.ts?raw";
	import DataTableViewPreview from "./examples/data-table-view-preview.svelte";
	import DataTableViewPreviewCode from "./examples/data-table-view-preview.svelte?raw";

	const title = "Column Visibility";
	const description =
		"A compact column visibility dropdown that lets users check or uncheck every hideable table column.";

	const previewCode: CodeBlock = {
		name: "data-table-view-preview.svelte",
		lang: "svelte",
		code: DataTableViewPreviewCode,
		highlight: [3, 46, 69]
	};

	const usageCode: CodeBlock = {
		name: "usage.svelte",
		lang: "svelte",
		code: `<script lang="ts">
  import {
    columnVisibilityFeature,
    createTable,
    tableFeatures
  } from "@tanstack/svelte-table";
  import DataTableView from "$lib/components/table/data-table-view";

  const features = tableFeatures({ columnVisibilityFeature });

  const table = createTable({
    features,
    columns,
    get data() {
      return data;
    }
  });
${"</" + "script>"}

<DataTableView {table} />`,
		highlight: [3, 9, 20]
	};

	// const folderStructure = [
	// 	"src/",
	// 	"`-- lib/",
	// 	"    `-- components/",
	// 	"        `-- table/",
	// 	"            `-- data-table-view/",
	// 	"                |-- index.ts",
	// 	"                `-- data-table-view.svelte"
	// ].join("\n");

	const folderStructure = `src/
└── lib/
    └── components/
        └── table/
            └── data-table-view/
                ├── data-table-view.svelte
                └── index.ts`;

	const propsTable: PropsTable = {
		name: "Data table view props",
		props: [
			{
				name: "table",
				type: "TanStack table",
				default: "required",
				required: true,
				description:
					"The table instance containing columns configured with the visibility feature."
			},
			{
				name: "label",
				type: "string",
				default: '"View"',
				description: "Text displayed in the dropdown trigger."
			},
			{
				name: "class",
				type: "string",
				default: "undefined",
				description: "Optional classes for the dropdown trigger."
			}
		]
	};

	const getURLPath = (url: string) => url.split("?")[0].split("#")[0];
	const installUrl = $derived(`${page.url.origin}/r/data-table-view.json`);
	const llmsTxtUrl = $derived(`${getURLPath(page.url.href)}/llms.txt`);
</script>

<Seo
	{title}
	{description}
	keywords={[
		"data table view",
		"column visibility",
		"svelte table",
		"tanstack table"
	]}
/>

<div class="space-y-8 md:space-y-10">
	<section class="space-y-3">
		<div
			class="flex flex-col justify-between gap-3 md:flex-row md:items-center md:gap-4"
		>
			<H1 id="data-table-view">{title}</H1>
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
			<DataTableViewPreview />
		</PreviewComponent>
	</section>

	<section>
		<H2 id="installation">Installation</H2>
		<InstallComponent
			{installUrl}
			codeBlocks={[
				{
					name: "table/data-table-view/data-table-view.svelte",
					lang: "svelte",
					code: DataTableViewCode,
					isExpand: true
				},
				{
					name: "table/data-table-view/index.ts",
					lang: "typescript",
					code: DataTableViewIndexCode
				}
			]}
			{folderStructure}
			class="mt-4"
		/>
	</section>

	<section class="space-y-3">
		<H2 id="usage">Usage</H2>
		<Paragraph>
			Enable column visibility on the table, then pass the table instance
			to the component. The important setup is highlighted below.
		</Paragraph>
		<SingleFile code={usageCode} />
	</section>

	<section>
		<H2 id="props">Props</H2>
		<div class="mt-3">
			<ApiTable data={propsTable} />
		</div>
	</section>
</div>
