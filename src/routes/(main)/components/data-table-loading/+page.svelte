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
	import DataTableLoadingCode from "$table/data-table-loading/data-table-loading.svelte?raw";
	import DataTableLoadingIndexCode from "$table/data-table-loading/index.ts?raw";
	import DataTableLoadingPreview from "./examples/data-table-loading-preview.svelte";
	import DataTableLoadingPreviewCode from "./examples/data-table-loading-preview.svelte?raw";

	const title = "Data Table Loading";
	const description =
		"Skeleton rows that preserve a table layout while its data is loading.";

	const previewCode: CodeBlock = {
		name: "data-table-loading-preview.svelte",
		lang: "svelte",
		code: DataTableLoadingPreviewCode
	};

	const usageCode: CodeBlock = {
		name: "data-table.svelte",
		lang: "svelte",
		code: `<script lang="ts">
  import DataTableLoading from "$lib/components/table/data-table-loading";
  import * as Table from "$lib/components/ui/table";
${"</" + "script>"}

<Table.Body aria-busy={isLoading}>
  {#if isLoading}
    <DataTableLoading columnCount={columns.length} rowCount={5} />
  {:else}
    {#each rows as row (row.id)}
      <!-- Render table rows -->
    {/each}
  {/if}
</Table.Body>`
	};

	const folderStructure = [
		"src/",
		"`-- lib/",
		"    `-- components/",
		"        `-- table/",
		"            `-- data-table-loading/",
		"                |-- index.ts",
		"                `-- data-table-loading.svelte"
	].join("\n");

	const propsTable: PropsTable = {
		name: "Data table loading props",
		props: [
			{
				name: "columnCount",
				type: "number",
				default: "required",
				required: true,
				description: "Number of skeleton cells rendered in each row."
			},
			{
				name: "rowCount",
				type: "number",
				default: "5",
				description: "Number of skeleton rows rendered."
			},
			{
				name: "class",
				type: "string",
				default: "undefined",
				description: "Classes applied to every skeleton bar."
			}
		]
	};

	const getURLPath = (url: string) => url.split("?")[0].split("#")[0];
	const installUrl = $derived(`${page.url.origin}/r/data-table-loading.json`);
	const llmsTxtUrl = $derived(`${getURLPath(page.url.href)}/llms.txt`);
</script>

<Seo
	{title}
	{description}
	keywords={[
		"data table loading",
		"table skeleton",
		"svelte table",
		"tanstack table"
	]}
/>

<div class="space-y-8 md:space-y-10">
	<section class="space-y-3">
		<div
			class="flex flex-col justify-between gap-3 md:flex-row md:items-center md:gap-4"
		>
			<H1 id="data-table-loading">{title}</H1>
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
			class="p-4 md:p-6"
		>
			<DataTableLoadingPreview />
		</PreviewComponent>
	</section>

	<section>
		<H2 id="installation">Installation</H2>
		<InstallComponent
			{installUrl}
			codeBlocks={[
				{
					name: "table/data-table-loading/data-table-loading.svelte",
					lang: "svelte",
					code: DataTableLoadingCode,
					isExpand: true
				},
				{
					name: "table/data-table-loading/index.ts",
					lang: "typescript",
					code: DataTableLoadingIndexCode
				}
			]}
			{folderStructure}
			class="mt-4"
		/>
	</section>

	<section class="space-y-3">
		<H2 id="usage">Usage</H2>
		<SingleFile code={usageCode} />
	</section>

	<section>
		<H2 id="props">Props</H2>
		<div class="mt-3">
			<ApiTable data={propsTable} />
		</div>
	</section>
</div>
