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
	import HeaderCheckboxCode from "$table/header-checkbox/header-checkbox.svelte?raw";
	import HeaderCheckboxIndexCode from "$table/header-checkbox/index.ts?raw";
	import HeaderCheckboxPreview from "./examples/header-checkbox-preview.svelte";
	import HeaderCheckboxPreviewCode from "./examples/header-checkbox-preview.svelte?raw";

	const title = "Header Checkbox";
	const description =
		"A select-all checkbox with support for an indeterminate state.";

	const previewCode: CodeBlock = {
		name: "header-checkbox-preview.svelte",
		lang: "svelte",
		code: HeaderCheckboxPreviewCode,
		highlight: [6, 28, [33, 43], 91]
	};

	const usageCode: CodeBlock = {
		name: "columns.ts",
		lang: "typescript",
		code: `import {
  renderComponent,
  rowSelectionFeature,
  tableFeatures,
  type ColumnDef
} from "@tanstack/svelte-table";
import HeaderCheckbox from "$lib/components/table/header-checkbox";

type Project = { id: string; name: string };

export const features = tableFeatures({ rowSelectionFeature });

export const columns: ColumnDef<typeof features, Project>[] = [
  {
    id: "select",
    header: ({ table }) => {
      const allSelected = table.getIsAllRowsSelected();

      return renderComponent(HeaderCheckbox, {
        checked: allSelected,
        indeterminate:
          table.getIsSomeRowsSelected() && !allSelected,
        onCheckedChange: (checked) =>
          table.toggleAllRowsSelected(checked)
      });
    }
  },
  { accessorKey: "name", header: "Project" }
];`,
		highlight: [11, [13, 27]]
	};

	const renderCode: CodeBlock = {
		name: "data-table.svelte",
		lang: "svelte",
		code: `<script lang="ts">
  import { FlexRender } from "@tanstack/svelte-table";
${"</" + "script>"}

<Table.Header>
  {#each table.getLeafHeaders() as header (header.id)}
    <Table.Head><FlexRender {header} /></Table.Head>
  {/each}
</Table.Header>`,
		highlight: [7]
	};

	// const folderStructure = [
	// 	"src/",
	// 	"`-- lib/",
	// 	"    `-- components/",
	// 	"        `-- table/",
	// 	"            `-- header-checkbox/",
	// 	"                |-- header-checkbox.svelte",
	// 	"                `-- index.ts"
	// ].join("\n");
	let folderStructure = `src/
└── lib/
    └── components/
        └── table/
            └── header-checkbox/
                ├── header-checkbox.svelte
                └── index.ts`;

	const propsTable: PropsTable = {
		name: "Header checkbox props",
		props: [
			{
				name: "checked",
				type: "boolean",
				default: "required",
				required: true,
				description: "Whether all target rows are selected."
			},
			{
				name: "indeterminate",
				type: "boolean",
				default: "false",
				description:
					"Shows that some, but not all, target rows are selected."
			},
			{
				name: "onCheckedChange",
				type: "(checked: boolean) => void",
				default: "required",
				required: true,
				description: "Called when the user toggles select all."
			},
			{
				name: "aria-label",
				type: "string",
				default: '"Select all rows"',
				description: "Accessible label for the checkbox."
			},
			{
				name: "class",
				type: "string",
				default: "undefined",
				description: "Classes forwarded to the underlying checkbox."
			},
			{
				name: "...restProps",
				type: "Checkbox props",
				default: "undefined",
				description:
					"Forwards supported checkbox props such as disabled, name, and value."
			}
		]
	};

	const getURLPath = (url: string) => url.split("?")[0].split("#")[0];
	const installUrl = $derived(`${page.url.origin}/r/header-checkbox.json`);
	const llmsTxtUrl = $derived(`${getURLPath(page.url.href)}/llms.txt`);
</script>

<Seo
	{title}
	{description}
	keywords={[
		"header checkbox",
		"select all rows",
		"svelte table row selection",
		"tanstack table"
	]}
/>

<div class="space-y-8 md:space-y-10">
	<section class="space-y-3">
		<div
			class="flex flex-col justify-between gap-3 md:flex-row md:items-center md:gap-4"
		>
			<H1 id="header-checkbox">{title}</H1>
			<CopyPageDropdown componentName={title} {llmsTxtUrl} />
		</div>

		<div class="max-w-2xl">
			<Paragraph>{description}</Paragraph>
			<Paragraph>
				Pass <CodeSpan>indeterminate</CodeSpan> when some rows are selected
				and <CodeSpan>checked</CodeSpan> when all rows are selected.
			</Paragraph>
		</div>
	</section>

	<section>
		<PreviewComponent
			code={previewCode}
			frame
			isCentered={false}
			class="min-h-80 p-4 md:p-6"
		>
			<HeaderCheckboxPreview />
		</PreviewComponent>
	</section>

	<section>
		<H2 id="installation">Installation</H2>
		<InstallComponent
			{installUrl}
			codeBlocks={[
				{
					name: "table/header-checkbox/header-checkbox.svelte",
					lang: "svelte",
					code: HeaderCheckboxCode,
					isExpand: true
				},
				{
					name: "table/header-checkbox/index.ts",
					lang: "typescript",
					code: HeaderCheckboxIndexCode
				}
			]}
			{folderStructure}
			class="mt-4"
		/>
	</section>

	<section class="space-y-3">
		<H2 id="column-definition">Column definition</H2>
		<Paragraph>
			The example selects all filtered rows. For page-only selection, use
			<CodeSpan>getIsAllPageRowsSelected</CodeSpan> and
			<CodeSpan>toggleAllPageRowsSelected</CodeSpan> instead.
		</Paragraph>
		<SingleFile code={usageCode} />
	</section>

	<section class="space-y-3">
		<H2 id="flex-render">Render the header</H2>
		<Paragraph>
			TanStack Table v9 renders the component configuration with
			<CodeSpan>FlexRender</CodeSpan>.
		</Paragraph>
		<SingleFile code={renderCode} />
	</section>

	<section>
		<H2 id="props">Props</H2>
		<div class="mt-3">
			<ApiTable data={propsTable} />
		</div>
	</section>
</div>
