<script lang="ts">
	import { page } from "$app/state";
	import ApiTable from "$lib/components/docs/base/api-table/api-table.svelte";
	import CopyPageDropdown from "$lib/components/docs/base/main/copy-page-dropdown.svelte";
	import InstallComponent from "$lib/components/docs/base/main/install-component.svelte";
	import Seo from "$lib/components/docs/base/main/seo.svelte";
	import DataTableColumnHeaderCode from "$table/data-table-column-header/data-table-column-header.svelte?raw";
	import DataTableColumnHeaderIndexCode from "$table/data-table-column-header/index.ts?raw";
	import { SingleFile } from "$lib/components/ui/code";
	import { PreviewComponent } from "$lib/components/ui/preview-component";
	import type { CodeBlock } from "$lib/types/code";
	import type { PropsTable } from "$lib/types/structure";
	import { CodeSpan, H1, H2, Paragraph } from "$markdown";
	import DataTableColumnHeaderPreview from "./examples/data-table-column-header-preview.svelte";
	import DataTableColumnHeaderPreviewCode from "./examples/data-table-column-header-preview.svelte?raw";

	const title = "Data Table Column Header";
	const description =
		"A sortable table heading with explicit sort controls and column actions.";

	const previewCode: CodeBlock = {
		name: "data-table-column-header-preview.svelte",
		lang: "svelte",
		code: DataTableColumnHeaderPreviewCode
	};

	const usageCode: CodeBlock = {
		name: "usage.svelte",
		lang: "svelte",
		code: `<script lang="ts">
  import {
    columnVisibilityFeature,
    createSortedRowModel,
    createTable,
    rowSortingFeature,
    tableFeatures
  } from "@tanstack/svelte-table";
  import DataTableColumnHeader from "$lib/components/table/data-table-column-header";

  const features = tableFeatures({
    columnVisibilityFeature,
    rowSortingFeature,
    sortedRowModel: createSortedRowModel()
  });

  // Create the table with these features, then render each header:
${"</" + "script>"}

<Table.Head
  aria-sort={header.column.getIsSorted() === "asc"
    ? "ascending"
    : header.column.getIsSorted() === "desc"
      ? "descending"
      : "none"}
>
  <DataTableColumnHeader
    column={header.column}
    title="Project"
  />
</Table.Head>`
	};

	const folderStructure = [
		"src/",
		"`-- lib/",
		"    `-- components/",
		"        `-- table/",
		"            `-- data-table-column-header/",
		"                |-- index.ts",
		"                `-- data-table-column-header.svelte"
	].join("\n");

	const propsTable: PropsTable = {
		name: "Data table column header props",
		props: [
			{
				name: "column",
				type: "TanStack column",
				default: "required",
				required: true,
				description:
					"A column configured with rowSortingFeature. Hide is shown when columnVisibilityFeature is also available."
			},
			{
				name: "title",
				type: "string",
				default: "required",
				required: true,
				description: "The visible and accessible column label."
			},
			{
				name: "class",
				type: "string",
				default: "undefined",
				description: "Optional classes for the root header controls."
			}
		]
	};

	const getURLPath = (url: string) => url.split("?")[0].split("#")[0];
	const installUrl = $derived(
		`${page.url.origin}/r/data-table-column-header.json`
	);
	const llmsTxtUrl = $derived(`${getURLPath(page.url.href)}/llms.txt`);
</script>

<Seo
	{title}
	{description}
	keywords={[
		"data table column header",
		"svelte table sorting",
		"tanstack table",
		"column actions"
	]}
/>

<div class="space-y-8 md:space-y-10">
	<section class="space-y-3">
		<div
			class="flex flex-col justify-between gap-3 md:flex-row md:items-center md:gap-4"
		>
			<H1 id="data-table-column-header">{title}</H1>
			<CopyPageDropdown componentName={title} {llmsTxtUrl} />
		</div>

		<div class="max-w-2xl">
			<Paragraph>{description}</Paragraph>
			<Paragraph>
				Click the title to cycle through ascending, descending, and
				unsorted states. Open the action menu to choose a direction,
				reset sorting, or hide the column.
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
			<DataTableColumnHeaderPreview />
		</PreviewComponent>
	</section>

	<section>
		<H2 id="installation">Installation</H2>
		<InstallComponent
			{installUrl}
			codeBlocks={[
				{
					name: "table/data-table-column-header/data-table-column-header.svelte",
					lang: "svelte",
					code: DataTableColumnHeaderCode,
					isExpand: true
				},
				{
					name: "table/data-table-column-header/index.ts",
					lang: "typescript",
					code: DataTableColumnHeaderIndexCode
				}
			]}
			{folderStructure}
			class="mt-4"
		/>
	</section>

	<section class="space-y-3">
		<H2 id="usage">Usage</H2>
		<Paragraph>
			Configure the table with <CodeSpan>rowSortingFeature</CodeSpan> and pass
			the header column directly to the component. Add
			<CodeSpan>columnVisibilityFeature</CodeSpan> to enable Hide.
		</Paragraph>
		<SingleFile code={usageCode} />
	</section>

	<section class="space-y-3">
		<H2 id="behavior">Behavior</H2>
		<ul
			class="ml-5 max-w-2xl list-disc space-y-2 text-sm leading-7 text-muted-foreground"
		>
			<li>The title button cycles from Asc to Desc to unsorted.</li>
			<li>Asc and Desc select an exact direction.</li>
			<li>Reset sort removes only this column from the sorting state.</li>
			<li>
				Shift-click supports multi-sort when it is enabled on the table.
			</li>
			<li>
				Place <CodeSpan>aria-sort</CodeSpan> on the surrounding table header,
				as shown in the example.
			</li>
		</ul>
	</section>

	<section>
		<H2 id="props">Props</H2>
		<div class="mt-3">
			<ApiTable data={propsTable} />
		</div>
	</section>
</div>
