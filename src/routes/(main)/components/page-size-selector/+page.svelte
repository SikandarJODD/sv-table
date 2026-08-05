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
	import PageSizeSelectorCode from "$table/page-size-selector/page-size-selector.svelte?raw";
	import PageSizeSelectorIndexCode from "$table/page-size-selector/index.ts?raw";
	import PageSizeSelectorPreview from "./examples/page-size-selector-preview.svelte";
	import PageSizeSelectorPreviewCode from "./examples/page-size-selector-preview.svelte?raw";

	const title = "Page Size Selector";
	const description =
		"A controlled rows-per-page selector for TanStack Table pagination.";

	const previewCode: CodeBlock = {
		name: "page-size-selector-preview.svelte",
		lang: "svelte",
		code: PageSizeSelectorPreviewCode
	};

	const usageCode: CodeBlock = {
		name: "usage.svelte",
		lang: "svelte",
		code: `<script lang="ts">
  import {
    createPaginatedRowModel,
    createTable,
    rowPaginationFeature,
    tableFeatures
  } from "@tanstack/svelte-table";
  import type { ColumnDef } from "@tanstack/svelte-table";
  import PageSizeSelector from "$lib/components/table/page-size-selector";

  type Row = { id: number };
  const data: Row[] = [{ id: 1 }];

  const features = tableFeatures({
    rowPaginationFeature,
    paginatedRowModel: createPaginatedRowModel()
  });

  const columns: ColumnDef<typeof features, Row>[] = [
    { accessorKey: "id" }
  ];

  const table = createTable({
    features,
    columns,
    get data() {
      return data;
    },
    initialState: {
      pagination: { pageIndex: 0, pageSize: 10 }
    }
  });

  const pagination = $derived(table.atoms.pagination.get());
${"</" + "script>"}

<PageSizeSelector
  pageSize={pagination.pageSize}
  setPageSize={(pageSize) => table.setPageSize(pageSize)}
/>

<!-- Optional custom sizes -->
<PageSizeSelector
  pageSize={pagination.pageSize}
  options={[10, 20, 50, 100]}
  setPageSize={(pageSize) => table.setPageSize(pageSize)}
/>`
	};

	const folderStructure = [
		"src/",
		"`-- lib/",
		"    `-- components/",
		"        `-- table/",
		"            `-- page-size-selector/",
		"                |-- index.ts",
		"                `-- page-size-selector.svelte"
	].join("\n");

	const propsTable: PropsTable = {
		name: "Page size selector props",
		props: [
			{
				name: "pageSize",
				type: "number",
				default: "required",
				required: true,
				description: "The currently selected number of rows per page."
			},
			{
				name: "options",
				type: "number[]",
				default: "[5, 10, 25, 50]",
				description: "Page sizes displayed in the select menu."
			},
			{
				name: "setPageSize",
				type: "(pageSize: number) => void",
				default: "required",
				required: true,
				description:
					"Called with the selected page size. Update your table or other pagination state here."
			},
			{
				name: "class",
				type: "string",
				default: '""',
				description: "Optional classes for the root wrapper."
			}
		]
	};

	const getURLPath = (url: string) => url.split("?")[0].split("#")[0];

	const installUrl = $derived(
		`${page.url.origin}/r/page-size-selector.json`
	);
	const llmsTxtUrl = $derived(`${getURLPath(page.url.href)}/llms.txt`);
</script>

<Seo
	{title}
	description="A rows-per-page selector for TanStack Table v9 and Svelte 5."
	keywords={[
		"page size selector",
		"svelte table",
		"tanstack table",
		"table pagination"
	]}
/>

<div class="space-y-8 md:space-y-10">
	<section class="space-y-3">
		<div
			class="flex flex-col justify-between gap-3 md:flex-row md:items-center md:gap-4"
		>
			<H1 id="page-size-selector">{title}</H1>
			<CopyPageDropdown componentName={title} {llmsTxtUrl} />
		</div>

		<div class="max-w-2xl">
			<Paragraph>{description}</Paragraph>
			<Paragraph>
				Pass the current <CodeSpan>pageSize</CodeSpan> and a
				<CodeSpan>setPageSize</CodeSpan> callback. Use
				<CodeSpan>options</CodeSpan> to customize the available sizes.
			</Paragraph>
		</div>
	</section>

	<section>
		<PreviewComponent code={previewCode} frame>
			<PageSizeSelectorPreview />
		</PreviewComponent>
	</section>

	<section>
		<H2 id="installation">Installation</H2>
		<InstallComponent
			{installUrl}
			codeBlocks={[
				{
					name: "table/page-size-selector/page-size-selector.svelte",
					lang: "svelte",
					code: PageSizeSelectorCode,
					isExpand: true
				},
				{
					name: "table/page-size-selector/index.ts",
					lang: "typescript",
					code: PageSizeSelectorIndexCode
				}
			]}
			{folderStructure}
			class="mt-4"
		/>
	</section>

	<section class="space-y-3">
		<H2 id="usage">Usage</H2>
		<Paragraph>
			Keep the TanStack-specific pagination logic in the parent and pass only
			the current value and setter to the selector.
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
