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
	import { H1, H2, H3, Paragraph } from "$markdown";
	import DataTableEmptyCode from "$table/data-table-empty/data-table-empty.svelte?raw";
	import DataTableEmptyIndexCode from "$table/data-table-empty/index.ts?raw";
	import ActionEmptyPreview from "./examples/action-empty-preview.svelte";
	import ActionEmptyPreviewCode from "./examples/action-empty-preview.svelte?raw";
	import BasicEmptyPreview from "./examples/basic-empty-preview.svelte";
	import BasicEmptyPreviewCode from "./examples/basic-empty-preview.svelte?raw";
	import CustomIconEmptyPreview from "./examples/custom-icon-empty-preview.svelte";
	import CustomIconEmptyPreviewCode from "./examples/custom-icon-empty-preview.svelte?raw";
	import SearchEmptyPreview from "./examples/search-empty-preview.svelte";
	import SearchEmptyPreviewCode from "./examples/search-empty-preview.svelte?raw";

	const title = "Data Table Empty";
	const description =
		"A table row for displaying a clear empty or filtered-results state.";

	const basicCode: CodeBlock = {
		name: "basic-empty-preview.svelte",
		lang: "svelte",
		code: BasicEmptyPreviewCode
	};

	const actionCode: CodeBlock = {
		name: "action-empty-preview.svelte",
		lang: "svelte",
		code: ActionEmptyPreviewCode
	};

	const customIconCode: CodeBlock = {
		name: "custom-icon-empty-preview.svelte",
		lang: "svelte",
		code: CustomIconEmptyPreviewCode
	};

	const searchCode: CodeBlock = {
		name: "search-empty-preview.svelte",
		lang: "svelte",
		code: SearchEmptyPreviewCode
	};

	const usageCode: CodeBlock = {
		name: "data-table.svelte",
		lang: "svelte",
		code: `<script lang="ts">
  import DataTableEmpty from "$lib/components/table/data-table-empty";
  import * as Table from "$lib/components/ui/table";

  const rows = $derived(table.getRowModel().rows);
  const columnCount = $derived(table.getVisibleLeafColumns().length);
${"</" + "script>"}

<Table.Body>
  {#each rows as row (row.id)}
    <Table.Row>
      {#each row.getAllCells() as cell (cell.id)}
        <Table.Cell>{cell.getValue()}</Table.Cell>
      {/each}
    </Table.Row>
  {:else}
    <DataTableEmpty
      colspan={columnCount}
      title="No matching rows"
      description="Try changing or clearing your filters."
    />
  {/each}
</Table.Body>`
	};

	const folderStructure = [
		"src/",
		"`-- lib/",
		"    `-- components/",
		"        `-- table/",
		"            `-- data-table-empty/",
		"                |-- index.ts",
		"                `-- data-table-empty.svelte"
	].join("\n");

	const propsTable: PropsTable = {
		name: "Data table empty props",
		props: [
			{
				name: "colspan",
				type: "number",
				default: "required",
				required: true,
				description:
					"Number of visible table columns the empty row spans."
			},
			{
				name: "title",
				type: "string",
				default: '"No results found"',
				description: "Empty-state heading."
			},
			{
				name: "description",
				type: "string",
				default: '"There are no rows to display."',
				description: "Supporting empty-state text."
			},
			{
				name: "icon",
				type: "Snippet",
				default: "SearchXIcon",
				description: "Optional icon snippet rendered above the title."
			},
			{
				name: "actions",
				type: "Snippet",
				default: "undefined",
				description:
					"Optional action content such as a clear-filters button."
			},
			{
				name: "class",
				type: "string",
				default: "undefined",
				description: "Classes applied to the empty-state container."
			}
		]
	};

	const getURLPath = (url: string) => url.split("?")[0].split("#")[0];
	const installUrl = $derived(`${page.url.origin}/r/data-table-empty.json`);
	const llmsTxtUrl = $derived(`${getURLPath(page.url.href)}/llms.txt`);
</script>

<Seo
	{title}
	{description}
	keywords={[
		"data table empty state",
		"svelte table",
		"tanstack table",
		"no results"
	]}
/>

<div class="space-y-8 md:space-y-10">
	<section class="space-y-3">
		<div
			class="flex flex-col justify-between gap-3 md:flex-row md:items-center md:gap-4"
		>
			<H1 id="data-table-empty">{title}</H1>
			<CopyPageDropdown componentName={title} {llmsTxtUrl} />
		</div>
		<div class="max-w-2xl">
			<Paragraph>{description}</Paragraph>
		</div>
	</section>

	<section>
		<PreviewComponent
			code={searchCode}
			frame
			isCentered={false}
			class="p-4 md:p-6"
		>
			<SearchEmptyPreview />
		</PreviewComponent>
	</section>

	<section>
		<H2 id="installation">Installation</H2>
		<InstallComponent
			{installUrl}
			codeBlocks={[
				{
					name: "table/data-table-empty/data-table-empty.svelte",
					lang: "svelte",
					code: DataTableEmptyCode,
					isExpand: true
				},
				{
					name: "table/data-table-empty/index.ts",
					lang: "typescript",
					code: DataTableEmptyIndexCode
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

	<section class="space-y-6">
		<H2 id="examples">Examples</H2>

		<div class="space-y-3">
			<H3 id="basic" class="mt-0">Basic</H3>
			<PreviewComponent
				code={basicCode}
				frame
				isCentered={false}
				class="p-4 md:p-6"
			>
				<BasicEmptyPreview />
			</PreviewComponent>
		</div>

		<div class="space-y-3">
			<H3 id="with-an-action" class="mt-0">With an action</H3>
			<PreviewComponent
				code={actionCode}
				frame
				isCentered={false}
				class="p-4 md:p-6"
			>
				<ActionEmptyPreview />
			</PreviewComponent>
		</div>

		<div class="space-y-3">
			<H3 id="custom-icon" class="mt-0">Custom icon</H3>
			<PreviewComponent
				code={customIconCode}
				frame
				isCentered={false}
				class="p-4 md:p-6"
			>
				<CustomIconEmptyPreview />
			</PreviewComponent>
		</div>
	</section>

	<section>
		<H2 id="props">Props</H2>
		<div class="mt-3">
			<ApiTable data={propsTable} />
		</div>
	</section>
</div>
