import type { CodeBlock } from "$lib/types/code";

export type QuickStartCard = {
	title: string;
	description: string;
	tags: string[];
};

export type ColumnShowcase = {
	id: string;
	title: string;
	accessorType: string;
	required: string[];
	optional: string[];
	operators: string[];
	note: string;
	code: CodeBlock;
};

export const filterPackages = [
	"date-fns",
	"@lucide/svelte",
	"runed",
	"@internationalized/date"
];

export const installReceiptPaths = [
	"data-table/components/*",
	"data-table/core/*",
	"data-table/utils/*",
	"data-table/locales/*",
	"hooks/use-data-table-filters.svelte.ts"
];

export const quickStartCards: QuickStartCard[] = [
	{
		title: "Client-side issue table",
		description:
			"Placeholder for a minimal ui/table example that keeps filtering local in the browser.",
		tags: ["Client", "ui/table", "Coming soon"]
	},
	{
		title: "Server-driven filters",
		description:
			"Placeholder for a guide that keeps filter state in the UI while your backend owns the result set.",
		tags: ["Server", "API", "Coming soon"]
	},
	{
		title: "Localized filter bar",
		description:
			"Placeholder for a focused example that demonstrates locale switching and translated operator labels.",
		tags: ["Locales", "zh_CN", "Coming soon"]
	}
];

export const supportedLocales = ["en", "fr", "nl", "de", "zh_CN", "zh_TW"] as const;

export const columnTypeCode: CodeBlock = {
	name: "column-data-type.ts",
	lang: "typescript",
	code: `type ColumnDataType =
  | "text"
  | "number"
  | "date"
  | "option"
  | "multiOption";`
};

export const filterModelCode: CodeBlock = {
	name: "filter-model.ts",
	lang: "typescript",
	code: `type FilterModel<TType extends ColumnDataType = any> = {
  columnId: string;
  type: TType;
  operator: FilterOperators[TType];
  values: FilterValues<TType>;
};

type FiltersState = FilterModel[];`
};

export const columnOptionCode: CodeBlock = {
	name: "column-option.ts",
	lang: "typescript",
	code: `interface ColumnOption {
  label: string;
  value: string;
  icon?: Component | LucideIcon;
}`
};

export const configHelperCode: CodeBlock = {
	name: "column-config-helper.ts",
	lang: "typescript",
	code: `const dtf = createColumnConfigHelper<Issue>();

const columnsConfig = [
  dtf
    .text()
    .id("title")
    .accessor((row) => row.title)
    .displayName("Title")
    .icon(Heading1Icon)
    .build()
] as const;`
};

export const issueTypesCode: CodeBlock = {
	name: "issue-types.ts",
	lang: "typescript",
	code: `export type IssueStatus = "backlog" | "todo" | "in-progress" | "done";

export type IssueLabel =
  | "api"
  | "billing"
  | "design"
  | "docs"
  | "ops";

export type Issue = {
  id: string;
  title: string;
  status: IssueStatus;
  estimate: number;
  dueDate: Date;
  labels: IssueLabel[];
};`
};

export const columnsConfigCode: CodeBlock = {
	name: "columns.ts",
	lang: "typescript",
	code: `import Heading1Icon from "@lucide/svelte/icons/heading-1";
import BadgeCheckIcon from "@lucide/svelte/icons/badge-check";
import HashIcon from "@lucide/svelte/icons/hash";
import CalendarDaysIcon from "@lucide/svelte/icons/calendar-days";
import TagsIcon from "@lucide/svelte/icons/tags";

import { createColumnConfigHelper } from "$lib/components/data-table/core/filters";

const dtf = createColumnConfigHelper<Issue>();

export const statusOptions = [
  { label: "Backlog", value: "backlog" },
  { label: "Todo", value: "todo" },
  { label: "In Progress", value: "in-progress" },
  { label: "Done", value: "done" }
];

export const labelOptions = [
  { label: "API", value: "api" },
  { label: "Billing", value: "billing" },
  { label: "Design", value: "design" },
  { label: "Docs", value: "docs" },
  { label: "Ops", value: "ops" }
];

export const columnsConfig = [
  dtf
    .text()
    .id("title")
    .accessor((row) => row.title)
    .displayName("Title")
    .icon(Heading1Icon)
    .build(),
  dtf
    .option()
    .id("status")
    .accessor((row) => row.status)
    .displayName("Status")
    .icon(BadgeCheckIcon)
    .options(statusOptions)
    .build(),
  dtf
    .number()
    .id("estimate")
    .accessor((row) => row.estimate)
    .displayName("Estimate")
    .icon(HashIcon)
    .min(1)
    .max(24)
    .build(),
  dtf
    .date()
    .id("dueDate")
    .accessor((row) => row.dueDate)
    .displayName("Due date")
    .icon(CalendarDaysIcon)
    .build(),
  dtf
    .multiOption()
    .id("labels")
    .accessor((row) => row.labels)
    .displayName("Labels")
    .icon(TagsIcon)
    .options(labelOptions)
    .build()
] as const;`
};

export const controllerCode: CodeBlock = {
	name: "filters-controller.ts",
	lang: "typescript",
	code: `import { createFilters } from "$lib/hooks";

const filtersController = createFilters({
  strategy: "client",
  data: issues,
  columnsConfig
});

const { columns, filters, actions, strategy } = filtersController;`
};

export const filterBarCode: CodeBlock = {
	name: "filter-bar.svelte",
	lang: "svelte",
	code: `<script lang="ts">
  import { DataTableFilter } from "$lib/components/data-table/components";

  let { columns, filters, actions, strategy } = filtersController;
</script>

<DataTableFilter
  {columns}
  {filters}
  {actions}
  {strategy}
  locale="en"
/>`
};

export const tableRenderCode: CodeBlock = {
	name: "issue-table.svelte",
	lang: "svelte",
	code: `<script lang="ts">
  import * as Table from "$lib/components/ui/table";
</script>

<Table.Root>
  <Table.Header>
    <Table.Row>
      <Table.Head>Title</Table.Head>
      <Table.Head>Status</Table.Head>
      <Table.Head>Estimate</Table.Head>
      <Table.Head>Due date</Table.Head>
      <Table.Head>Labels</Table.Head>
    </Table.Row>
  </Table.Header>

  <Table.Body>
    {#each filteredIssues as issue (issue.id)}
      <Table.Row>
        <Table.Cell>{issue.title}</Table.Cell>
        <Table.Cell>{issue.status}</Table.Cell>
        <Table.Cell>{issue.estimate}h</Table.Cell>
        <Table.Cell>{issue.dueDate.toDateString()}</Table.Cell>
        <Table.Cell>{issue.labels.join(", ")}</Table.Cell>
      </Table.Row>
    {/each}
  </Table.Body>
</Table.Root>`
};

export const localeUsageCode: CodeBlock = {
	name: "locale-usage.svelte",
	lang: "svelte",
	code: `<script lang="ts">
  import type { Locale } from "$lib/components/data-table/utils/i18n";

  let locale: Locale = $state("en");
</script>

<DataTableFilter
  columns={filtersController.columns}
  filters={filtersController.filters}
  actions={filtersController.actions}
  strategy={filtersController.strategy}
  {locale}
/>

<button onclick={() => (locale = "zh_CN")}>简体中文</button>`
};

export const fullExampleCode: CodeBlock[] = [
	{
		name: "types.ts",
		lang: "typescript",
		code: `export type IssueStatus = "backlog" | "todo" | "in-progress" | "done";

export type IssueLabel =
  | "api"
  | "billing"
  | "design"
  | "docs"
  | "ops";

export type Issue = {
  id: string;
  title: string;
  status: IssueStatus;
  estimate: number;
  dueDate: Date;
  labels: IssueLabel[];
};`
	},
	{
		name: "columns.ts",
		lang: "typescript",
		code: `import Heading1Icon from "@lucide/svelte/icons/heading-1";
import BadgeCheckIcon from "@lucide/svelte/icons/badge-check";
import HashIcon from "@lucide/svelte/icons/hash";
import CalendarDaysIcon from "@lucide/svelte/icons/calendar-days";
import TagsIcon from "@lucide/svelte/icons/tags";

import { createColumnConfigHelper } from "$lib/components/data-table/core/filters";

const dtf = createColumnConfigHelper<Issue>();

export const columnsConfig = [
  dtf.text().id("title").accessor((row) => row.title).displayName("Title").icon(Heading1Icon).build(),
  dtf.option().id("status").accessor((row) => row.status).displayName("Status").icon(BadgeCheckIcon).options(statusOptions).build(),
  dtf.number().id("estimate").accessor((row) => row.estimate).displayName("Estimate").icon(HashIcon).min(1).max(24).build(),
  dtf.date().id("dueDate").accessor((row) => row.dueDate).displayName("Due date").icon(CalendarDaysIcon).build(),
  dtf.multiOption().id("labels").accessor((row) => row.labels).displayName("Labels").icon(TagsIcon).options(labelOptions).build()
] as const;`
	},
	{
		name: "IssueFiltersDemo.svelte",
		lang: "svelte",
		code: `<script lang="ts">
  import * as Table from "$lib/components/ui/table";
  import { DataTableFilter } from "$lib/components/data-table/components";
  import { createFilters } from "$lib/hooks";

  const filtersController = createFilters({
    strategy: "client",
    data: issues,
    columnsConfig
  });

  let locale = $state("en");

  const filteredIssues = $derived.by(() =>
    issues.filter((issue) => matchesAllFilters(issue, filtersController.filters))
  );
</script>

<DataTableFilter
  columns={filtersController.columns}
  filters={filtersController.filters}
  actions={filtersController.actions}
  strategy={filtersController.strategy}
  {locale}
/>

<Table.Root>
  <Table.Header>
    <Table.Row>
      <Table.Head>Title</Table.Head>
      <Table.Head>Status</Table.Head>
      <Table.Head>Estimate</Table.Head>
      <Table.Head>Due date</Table.Head>
      <Table.Head>Labels</Table.Head>
    </Table.Row>
  </Table.Header>

  <Table.Body>
    {#each filteredIssues as issue (issue.id)}
      <Table.Row>
        <Table.Cell>{issue.title}</Table.Cell>
        <Table.Cell>{issue.status}</Table.Cell>
        <Table.Cell>{issue.estimate}h</Table.Cell>
        <Table.Cell>{issue.dueDate.toDateString()}</Table.Cell>
        <Table.Cell>{issue.labels.join(", ")}</Table.Cell>
      </Table.Row>
    {/each}
  </Table.Body>
</Table.Root>`
	}
];

export const columnShowcases: ColumnShowcase[] = [
	{
		id: "text",
		title: "Text column",
		accessorType: "string",
		required: ["id", "accessor", "displayName", "icon"],
		optional: [],
		operators: ["contains", "does not contain"],
		note: "Use text columns for free-form labels such as issue titles or owner names.",
		code: {
			name: "text-column.ts",
			lang: "typescript",
			code: `dtf
  .text()
  .id("title")
  .accessor((row) => row.title)
  .displayName("Title")
  .icon(Heading1Icon)
  .build()`
		}
	},
	{
		id: "number",
		title: "Number column",
		accessorType: "number",
		required: ["id", "accessor", "displayName", "icon"],
		optional: ["min", "max"],
		operators: [
			"is",
			"is not",
			"is greater than",
			"is less than",
			"is between"
		],
		note: "Add min and max when you want server-safe slider bounds or explicit guardrails.",
		code: {
			name: "number-column.ts",
			lang: "typescript",
			code: `dtf
  .number()
  .id("estimate")
  .accessor((row) => row.estimate)
  .displayName("Estimate")
  .icon(HashIcon)
  .min(1)
  .max(24)
  .build()`
		}
	},
	{
		id: "date",
		title: "Date column",
		accessorType: "Date",
		required: ["id", "accessor", "displayName", "icon"],
		optional: [],
		operators: [
			"is",
			"is before",
			"is after",
			"is on or before",
			"is between"
		],
		note: "Date filters expect real Date objects so the operator logic can compare day ranges correctly.",
		code: {
			name: "date-column.ts",
			lang: "typescript",
			code: `dtf
  .date()
  .id("dueDate")
  .accessor((row) => row.dueDate)
  .displayName("Due date")
  .icon(CalendarDaysIcon)
  .build()`
		}
	},
	{
		id: "option",
		title: "Option column",
		accessorType: "string",
		required: ["id", "accessor", "displayName", "icon"],
		optional: ["options", "transformOptionFn", "orderFn", "facetedOptions"],
		operators: ["is", "is not", "is any of", "is none of"],
		note: "Use option columns for single-value categorical data such as status, priority, or owner.",
		code: {
			name: "option-column.ts",
			lang: "typescript",
			code: `dtf
  .option()
  .id("status")
  .accessor((row) => row.status)
  .displayName("Status")
  .icon(BadgeCheckIcon)
  .options(statusOptions)
  .build()`
		}
	},
	{
		id: "multi-option",
		title: "Multi option column",
		accessorType: "string[]",
		required: ["id", "accessor", "displayName", "icon"],
		optional: ["options", "transformOptionFn", "orderFn", "facetedOptions"],
		operators: [
			"include",
			"exclude",
			"include any of",
			"include all of",
			"exclude if any of"
		],
		note: "Use multiOption when a row can expose many tags and the filter needs set-based matching.",
		code: {
			name: "multi-option-column.ts",
			lang: "typescript",
			code: `dtf
  .multiOption()
  .id("labels")
  .accessor((row) => row.labels)
  .displayName("Labels")
  .icon(TagsIcon)
  .options(labelOptions)
  .build()`
		}
	}
];
