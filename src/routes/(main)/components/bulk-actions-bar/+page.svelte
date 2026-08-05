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
	import { CodeSpan, H1, H2, Paragraph, Step, Steps } from "$markdown";
	import BulkActionsBarCode from "$table/bulk-actions-bar/bulk-actions-bar.svelte?raw";
	import BulkActionsBarIndexCode from "$table/bulk-actions-bar/index.ts?raw";
	import BulkActionsBarPreview from "./examples/bulk-actions-bar-preview.svelte";
	import BulkActionsBarPreviewCode from "./examples/bulk-actions-bar-preview.svelte?raw";

	const title = "Bulk Actions Bar";
	const description =
		"A floating action bar that appears when table rows are selected and renders any actions your application needs.";

	const previewCode: CodeBlock = {
		name: "bulk-actions-bar-preview.svelte",
		lang: "svelte",
		code: BulkActionsBarPreviewCode,
		highlight: [13, [78, 82], [132, 152]]
	};

	const usageCode: CodeBlock = {
		name: "usage.svelte",
		lang: "svelte",
		code: `<script lang="ts">
  import BulkActionsBar from "$lib/components/table/bulk-actions-bar";
  import { Button } from "$lib/components/ui/button";

  // Add this after creating your TanStack table instance.
  const selectedIds = $derived.by(() =>
    Object.entries(table.atoms.rowSelection.get())
      .filter(([, selected]) => selected)
      .map(([id]) => id)
  );

  function archiveSelected() {
    archiveProjects(selectedIds);
    table.resetRowSelection(true);
  }
${"</" + "script>"}

<BulkActionsBar
  selectedCount={selectedIds.length}
  onClear={() => table.resetRowSelection(true)}
>
  <Button variant="ghost" size="sm" onclick={archiveSelected}>
    Archive
  </Button>
  <Button variant="destructive" size="sm" onclick={() => deleteProjects(selectedIds)}>
    Delete
  </Button>
</BulkActionsBar>`,
		highlight: [2, [6, 10], [18, 28]]
	};

	const selectionSetupCode: CodeBlock = {
		name: "table.svelte",
		lang: "typescript",
		code: `import {
  createTable,
  rowSelectionFeature,
  tableFeatures
} from "@tanstack/svelte-table";

const features = tableFeatures({ rowSelectionFeature });

const table = createTable({
  features,
  columns,
  get data() {
    return projects;
  },
  getRowId: (row) => row.id
});`,
		highlight: [3, 7, 10, 15]
	};

	const selectedIdsCode: CodeBlock = {
		name: "table.svelte",
		lang: "typescript",
		code: `const selectedIds = $derived.by(() =>
  Object.entries(table.atoms.rowSelection.get())
    .filter(([, selected]) => selected)
    .map(([id]) => id)
);

const selectedCount = $derived(selectedIds.length);`,
		highlight: [[1, 5], 7]
	};

	const renderActionsCode: CodeBlock = {
		name: "table.svelte",
		lang: "svelte",
		code: `<BulkActionsBar
  selectedCount={selectedIds.length}
  onClear={() => table.resetRowSelection(true)}
>
  <!-- Use any buttons, menus, dialogs, or permission checks here. -->
  <Button onclick={() => exportProjects(selectedIds)}>Export</Button>
  <Button variant="destructive" onclick={() => deleteProjects(selectedIds)}>
    Delete
  </Button>
</BulkActionsBar>`,
		highlight: [
			[1, 4],
			[6, 9]
		]
	};

	const folderStructure = [
		"src/",
		"`-- lib/",
		"    `-- components/",
		"        `-- table/",
		"            `-- bulk-actions-bar/",
		"                |-- index.ts",
		"                `-- bulk-actions-bar.svelte"
	].join("\n");

	const propsTable: PropsTable = {
		name: "Bulk actions bar props",
		props: [
			{
				name: "selectedCount",
				type: "number",
				default: "required",
				required: true,
				description:
					"Number of selected items. The bar is rendered only when this is greater than zero."
			},
			{
				name: "onClear",
				type: "() => void",
				default: "required",
				required: true,
				description:
					"Called when the built-in clear-selection button is pressed."
			},
			{
				name: "children",
				type: "Snippet",
				default: "required",
				required: true,
				description:
					"Custom action buttons, menus, dialogs, or other controls."
			},
			{
				name: "summary",
				type: "Snippet<[number]>",
				default: '"{count} items selected"',
				description:
					"Optional custom selected-count content for localization or richer markup."
			},
			{
				name: "clearLabel",
				type: "string",
				default: '"Clear selection"',
				description:
					"Accessible label and tooltip for the clear button."
			},
			{
				name: "class",
				type: "string",
				default: '""',
				description:
					"Optional classes for the visible action bar surface."
			},
			{
				name: "...restProps",
				type: "HTMLAttributes<HTMLDivElement>",
				default: "—",
				description:
					"Additional HTML attributes forwarded to the action bar region."
			}
		]
	};

	const getURLPath = (url: string) => url.split("?")[0].split("#")[0];

	const installUrl = $derived(`${page.url.origin}/r/bulk-actions-bar.json`);
	const llmsTxtUrl = $derived(`${getURLPath(page.url.href)}/llms.txt`);
</script>

<Seo
	{title}
	description="A composable floating bulk actions bar for TanStack Table row selection in Svelte 5."
	keywords={[
		"bulk actions bar",
		"svelte table selection",
		"tanstack table",
		"selected rows",
		"data table actions"
	]}
/>

<div class="space-y-8 md:space-y-10">
	<section class="space-y-3">
		<div
			class="flex flex-col justify-between gap-3 md:flex-row md:items-center md:gap-4"
		>
			<H1 id="bulk-actions-bar">{title}</H1>
			<CopyPageDropdown componentName={title} {llmsTxtUrl} />
		</div>

		<div class="max-w-2xl">
			<Paragraph>{description}</Paragraph>
			<Paragraph>
				The parent owns row selection and action behavior. The bar
				handles visibility, positioning, responsive overflow, animation,
				and the clear-selection control.
			</Paragraph>
		</div>
	</section>

	<section>
		<PreviewComponent code={previewCode} frame>
			<BulkActionsBarPreview />
		</PreviewComponent>
	</section>

	<section>
		<H2 id="installation">Installation</H2>
		<InstallComponent
			{installUrl}
			packages={["@lucide/svelte"]}
			codeBlocks={[
				{
					name: "table/bulk-actions-bar/bulk-actions-bar.svelte",
					lang: "svelte",
					code: BulkActionsBarCode,
					isExpand: true
				},
				{
					name: "table/bulk-actions-bar/index.ts",
					lang: "typescript",
					code: BulkActionsBarIndexCode
				}
			]}
			{folderStructure}
			class="mt-4"
		/>
	</section>

	<section class="space-y-3">
		<H2 id="usage">Usage</H2>
		<Paragraph>
			Derive stable selected row IDs from the table selection state, then
			place your own controls inside <CodeSpan>BulkActionsBar</CodeSpan>.
		</Paragraph>
		<SingleFile code={usageCode} />
	</section>

	<section class="space-y-4">
		<H2 id="guide">Add it to a table</H2>
		<Paragraph>
			Follow these steps after your columns and table data are ready.
		</Paragraph>

		<Steps class="mt-6 mb-0">
			<Step title="Enable row selection and stable row IDs">
				<Paragraph>
					Register <CodeSpan>rowSelectionFeature</CodeSpan> and use a database
					ID or another stable value for <CodeSpan>getRowId</CodeSpan
					>. Stable IDs are important when sorting, filtering, or
					paginating rows.
				</Paragraph>
				<div class="mt-3">
					<SingleFile code={selectionSetupCode} />
				</div>
			</Step>

			<Step title="Derive only the selected IDs">
				<Paragraph>
					Filter for truthy values before counting. A row-selection
					record can retain keys whose value is <CodeSpan
						>false</CodeSpan
					>.
				</Paragraph>
				<div class="mt-3">
					<SingleFile code={selectedIdsCode} />
				</div>
			</Step>

			<Step title="Render the actions your app needs" class="pb-0">
				<Paragraph>
					Pass the count and clear callback, then compose normal
					Svelte controls as children. Keep confirmations, loading
					states, permissions, and API calls in the parent.
				</Paragraph>
				<div class="mt-3">
					<SingleFile code={renderActionsCode} />
				</div>
			</Step>
		</Steps>
	</section>

	<section>
		<H2 id="props">Props</H2>
		<div class="mt-3">
			<ApiTable data={propsTable} />
		</div>
	</section>
</div>
