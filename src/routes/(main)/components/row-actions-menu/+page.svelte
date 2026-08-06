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
	import RowActionsMenuCode from "$table/row-actions-menu/row-actions-menu.svelte?raw";
	import RowActionsMenuIndexCode from "$table/row-actions-menu/index.ts?raw";
	import RowActionsMenuPreview from "./examples/row-actions-menu-preview.svelte";
	import RowActionsMenuPreviewCode from "./examples/row-actions-menu-preview.svelte?raw";

	const title = "Row Actions Menu";
	const description =
		"An accessible dropdown menu for actions on an individual table row.";

	const previewCode: CodeBlock = {
		name: "row-actions-menu-preview.svelte",
		lang: "svelte",
		code: RowActionsMenuPreviewCode,
		highlight: [
			[13, 15],
			[57, 90],
			[115, 122]
		]
	};

	const usageCode: CodeBlock = {
		name: "columns.ts",
		lang: "typescript",
		code: `import PencilIcon from "@lucide/svelte/icons/pencil";
import Trash2Icon from "@lucide/svelte/icons/trash-2";
import { renderComponent, type ColumnDef } from "@tanstack/svelte-table";
import RowActionsMenu, {
  type RowAction
} from "$lib/components/table/row-actions-menu";

type Project = { id: string; name: string; archived: boolean };

const actions: RowAction<Project>[] = [
  {
    id: "edit",
    label: "Edit project",
    icon: PencilIcon,
    onSelect: (project) => editProject(project.id)
  },
  {
    id: "delete",
    label: "Delete project",
    icon: Trash2Icon,
    variant: "destructive",
    separatorBefore: true,
    disabled: (project) => project.archived,
    onSelect: (project) => deleteProject(project.id)
  }
];

export const columns: ColumnDef<typeof features, Project>[] = [
  // Your data columns...
  {
    id: "actions",
    cell: ({ row }) =>
      renderComponent(RowActionsMenu, {
        row: row.original,
        actions,
        label: "Open actions for " + row.original.name
      })
  }
];`,
		highlight: [
			[4, 6],
			[10, 27],
			[31, 40]
		]
	};

	const directUsageCode: CodeBlock = {
		name: "project-row.svelte",
		lang: "svelte",
		code: `<script lang="ts">
  import RowActionsMenu from "$lib/components/table/row-actions-menu";
${"</" + "script>"}

<RowActionsMenu
  row={project}
  {actions}
  label={\`Open actions for \${project.name}\`}
  menuLabel="Project actions"
/>`,
		highlight: [[5, 10]]
	};

	const folderStructure = [
		"src/",
		"`-- lib/",
		"    `-- components/",
		"        `-- table/",
		"            `-- row-actions-menu/",
		"                |-- index.ts",
		"                `-- row-actions-menu.svelte"
	].join("\n");

	const propsTable: PropsTable = {
		name: "Row actions menu props",
		props: [
			{
				name: "row",
				type: "T",
				default: "required",
				required: true,
				description:
					"Current row value passed to action callbacks and state functions."
			},
			{
				name: "actions",
				type: "RowAction<T>[]",
				default: "required",
				required: true,
				description: "Actions rendered in the dropdown menu."
			},
			{
				name: "label",
				type: "string",
				default: '"Open row actions"',
				description:
					"Accessible label and tooltip for the ellipsis trigger."
			},
			{
				name: "menuLabel",
				type: "string",
				default: "undefined",
				description: "Optional heading displayed above the actions."
			},
			{
				name: "disabled",
				type: "boolean",
				default: "false",
				description:
					"Disables the trigger. It is also disabled when no visible actions remain."
			},
			{
				name: "align",
				type: '"start" | "center" | "end"',
				default: '"end"',
				description:
					"Alignment of the dropdown relative to its trigger."
			},
			{
				name: "sideOffset",
				type: "number",
				default: "4",
				description: "Distance between the trigger and menu in pixels."
			},
			{
				name: "open",
				type: "boolean",
				default: "false",
				description: "Bindable open state for controlled usage."
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
				description: "Classes applied to the dropdown content."
			}
		]
	};

	const actionTable: PropsTable = {
		name: "RowAction<T>",
		props: [
			{
				name: "id",
				type: "string",
				default: "required",
				required: true,
				description: "Stable key for the action."
			},
			{
				name: "label",
				type: "string",
				default: "required",
				required: true,
				description: "Visible menu item text."
			},
			{
				name: "onSelect",
				type: "(row: T) => void",
				default: "required",
				required: true,
				description: "Runs with the current row when selected."
			},
			{
				name: "icon",
				type: "Component",
				default: "undefined",
				description: "Optional Svelte icon component."
			},
			{
				name: "shortcut",
				type: "string",
				default: "undefined",
				description:
					"Visual shortcut hint; keyboard behavior remains application-owned."
			},
			{
				name: "variant",
				type: '"default" | "destructive"',
				default: '"default"',
				description: "Visual treatment for the menu item."
			},
			{
				name: "disabled",
				type: "boolean | ((row: T) => boolean)",
				default: "false",
				description:
					"Disables the action globally or for the current row."
			},
			{
				name: "hidden",
				type: "boolean | ((row: T) => boolean)",
				default: "false",
				description: "Hides the action globally or for the current row."
			},
			{
				name: "separatorBefore",
				type: "boolean",
				default: "false",
				description: "Adds a separator before this action."
			}
		]
	};

	const getURLPath = (url: string) => url.split("?")[0].split("#")[0];
	const installUrl = $derived(`${page.url.origin}/r/row-actions-menu.json`);
	const llmsTxtUrl = $derived(`${getURLPath(page.url.href)}/llms.txt`);
</script>

<Seo
	{title}
	description="A typed, accessible row actions dropdown for TanStack Table and Svelte 5."
	keywords={[
		"row actions menu",
		"svelte table",
		"tanstack table",
		"dropdown menu",
		"table actions"
	]}
/>

<div class="space-y-8 md:space-y-10">
	<section class="space-y-3">
		<div
			class="flex flex-col justify-between gap-3 md:flex-row md:items-center md:gap-4"
		>
			<H1 id="row-actions-menu">{title}</H1>
			<CopyPageDropdown componentName={title} {llmsTxtUrl} />
		</div>

		<div class="max-w-2xl">
			<Paragraph>{description}</Paragraph>
			<Paragraph>
				Define typed actions once, then pass each row to the menu.
				Actions can be hidden or disabled from the current row without
				coupling the component to TanStack Table.
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
			<RowActionsMenuPreview />
		</PreviewComponent>
	</section>

	<section>
		<H2 id="installation">Installation</H2>
		<InstallComponent
			{installUrl}
			packages={["@lucide/svelte"]}
			codeBlocks={[
				{
					name: "table/row-actions-menu/row-actions-menu.svelte",
					lang: "svelte",
					code: RowActionsMenuCode,
					isExpand: true
				},
				{
					name: "table/row-actions-menu/index.ts",
					lang: "typescript",
					code: RowActionsMenuIndexCode
				}
			]}
			{folderStructure}
			class="mt-4"
		/>
	</section>

	<section class="space-y-3">
		<H2 id="column-definition">Column definition</H2>
		<Paragraph>
			Create a typed <CodeSpan>RowAction&lt;T&gt;[]</CodeSpan>, then use
			<CodeSpan>renderComponent</CodeSpan> in the actions column. The current
			row is passed into every callback and state function.
		</Paragraph>
		<SingleFile code={usageCode} />
	</section>

	<section class="space-y-3">
		<H2 id="direct-usage">Direct usage</H2>
		<Paragraph>
			The component can also be rendered in any list or custom table. Use
			a row-specific label when the page contains multiple menus.
		</Paragraph>
		<SingleFile code={directUsageCode} />
	</section>

	<section class="space-y-3">
		<H2 id="accessibility">Accessibility</H2>
		<Paragraph>
			The dropdown manages focus, arrow-key navigation, Escape, and focus
			restoration. The trigger stops click propagation so it can safely
			sit inside a clickable row. <CodeSpan>shortcut</CodeSpan> is only a visual
			hint; register keyboard commands in your application.
		</Paragraph>
	</section>

	<section>
		<H2 id="props">Props</H2>
		<div class="mt-3 space-y-6">
			<ApiTable data={propsTable} />
			<ApiTable data={actionTable} />
		</div>
	</section>
</div>
