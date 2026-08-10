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
	import RowCheckboxCode from "$table/row-checkbox/row-checkbox.svelte?raw";
	import RowCheckboxIndexCode from "$table/row-checkbox/index.ts?raw";
	import RowCheckboxPreview from "./examples/row-checkbox-preview.svelte";
	import RowCheckboxPreviewCode from "./examples/row-checkbox-preview.svelte?raw";

	const title = "Row Checkbox";
	const description =
		"A controlled checkbox for selecting an individual table row.";

	const previewCode: CodeBlock = {
		name: "row-checkbox-preview.svelte",
		lang: "svelte",
		code: RowCheckboxPreviewCode,
		highlight: [6, 27, [30, 39], 99]
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
import RowCheckbox from "$lib/components/table/row-checkbox";

type Project = { id: string; name: string };

export const features = tableFeatures({ rowSelectionFeature });

export const columns: ColumnDef<typeof features, Project>[] = [
  {
    id: "select",
    header: "Select",
    cell: ({ row }) =>
      renderComponent(RowCheckbox, {
        checked: row.getIsSelected(),
        onCheckedChange: (checked) => row.toggleSelected(checked),
        "aria-label": \`Select \${row.original.name}\`
      })
  },
  { accessorKey: "name", header: "Project" }
];`,
		highlight: [11, [13, 23]]
	};

	const renderCode: CodeBlock = {
		name: "data-table.svelte",
		lang: "svelte",
		code: `<script lang="ts">
  import { FlexRender } from "@tanstack/svelte-table";
${"</" + "script>"}

{#each table.getRowModel().rows as row (row.id)}
  <Table.Row data-state={row.getIsSelected() ? "selected" : undefined}>
    {#each row.getAllCells() as cell (cell.id)}
      <Table.Cell><FlexRender {cell} /></Table.Cell>
    {/each}
  </Table.Row>
{/each}`,
		highlight: [8]
	};

	const folderStructure = `src/
└── lib/
    └── components/
        └── table/
            └── row-checkbox/
                ├── row-checkbox.svelte
                └── index.ts`;

	const propsTable: PropsTable = {
		name: "Row checkbox props",
		props: [
			{
				name: "checked",
				type: "boolean",
				default: "required",
				required: true,
				description: "Whether the row is selected."
			},
			{
				name: "onCheckedChange",
				type: "(checked: boolean) => void",
				default: "required",
				required: true,
				description: "Called when the user changes the checkbox."
			},
			{
				name: "aria-label",
				type: "string",
				default: '"Select row"',
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
	const installUrl = $derived(`${page.url.origin}/r/row-checkbox.json`);
	const llmsTxtUrl = $derived(`${getURLPath(page.url.href)}/llms.txt`);
</script>

<Seo
	{title}
	{description}
	keywords={[
		"row checkbox",
		"svelte table row selection",
		"tanstack table",
		"data table checkbox"
	]}
/>

<div class="space-y-8 md:space-y-10">
	<section class="space-y-3">
		<div
			class="flex flex-col justify-between gap-3 md:flex-row md:items-center md:gap-4"
		>
			<H1 id="row-checkbox">{title}</H1>
			<CopyPageDropdown componentName={title} {llmsTxtUrl} />
		</div>

		<div class="max-w-2xl">
			<Paragraph>{description}</Paragraph>
			<Paragraph>
				Connect <CodeSpan>checked</CodeSpan> and
				<CodeSpan>onCheckedChange</CodeSpan> to the row selection API.
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
			<RowCheckboxPreview />
		</PreviewComponent>
	</section>

	<section>
		<H2 id="installation">Installation</H2>
		<InstallComponent
			{installUrl}
			codeBlocks={[
				{
					name: "table/row-checkbox/row-checkbox.svelte",
					lang: "svelte",
					code: RowCheckboxCode,
					isExpand: true
				},
				{
					name: "table/row-checkbox/index.ts",
					lang: "typescript",
					code: RowCheckboxIndexCode
				}
			]}
			{folderStructure}
			class="mt-4"
		/>
	</section>

	<section class="space-y-3">
		<H2 id="column-definition">Column definition</H2>
		<Paragraph>
			Use <CodeSpan>renderComponent</CodeSpan> inside the cell definition. Keep
			<CodeSpan>getRowId</CodeSpan> stable when rows can reorder.
		</Paragraph>
		<SingleFile code={usageCode} />
	</section>

	<section class="space-y-3">
		<H2 id="flex-render">Render the cell</H2>
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
