import type { CodeBlock } from "$lib/types/code";

export const filterPackages = [
  "date-fns",
  "runed",
  "@lucide/svelte",
  "@internationalized/date"
];

export const installReceiptPaths = [
  "data-table/components/*",
  "data-table/core/*",
  "data-table/utils/*",
  "data-table/locales/*",
  "hooks/use-data-table-filters.svelte.ts"
];

export const quickStartCards = [
  {
    title: "Client-side table",
    description:
      "Use local rows, a client strategy, and derived filtered output inside a Svelte component.",
    tags: ["client", "local data", "derived rows"]
  },
  {
    title: "Server-driven filters",
    description:
      "Pass declared options and faceted counts from your backend while keeping the UI responsive.",
    tags: ["server", "options", "faceted values"]
  },
  {
    title: "Typed column recipes",
    description:
      "Build text, number, date, option, and multi-option columns with the fluent helper.",
    tags: ["TypeScript", "columns", "builder"]
  }
];

export const columnTypeCode: CodeBlock = {
  name: "column-data-type.ts",
  lang: "typescript",
  hideLines: true,
  code: `type ColumnDataType =
  | "text"
  | "number"
  | "date"
  | "option"
  | "multiOption";`
};

export const filterModelCode: CodeBlock = {
  name: "filter-model.ts",
  hideLines: true,
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
  hideLines: true,
  lang: "typescript",
  code: `interface ColumnOption {
  label: string;
  value: string;
  icon?: Component | LucideIcon;
}`
};

export const configHelperCode: CodeBlock = {
  name: "column-config-helper.ts",
  hideLines: true,
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

export const guideFileStructureCode: CodeBlock = {
  name: "file-structure",
  lang: 'markdown',
  hideLines: true,
  code: `src/lib/issues/
  types.ts
  columns.ts
  filters.svelte.ts
  IssueTable.svelte`
};

export const issueTypesCode: CodeBlock = {
  name: "types.ts",
  lang: "typescript",
  code: `export type IssueStatus = "backlog" | "todo" | "in-progress" | "done";

export type IssueLabel =
  | "api"
  | "billing"
  | "design"
  | "docs"
  | "ops";

export type User = {
  id: string;
  name: string;
  picture: string;
};

export type Issue = {
  id: string;
  title: string;
  status: IssueStatus;
  estimate: number;
  dueDate: Date;
  labels: IssueLabel[];
  assignee?: User;
};`
};

export const columnsHelperCode: CodeBlock = {
  name: "columns.ts",
  lang: "typescript",
  code: `import { createColumnConfigHelper } from "$lib/components/data-table/core/filters";
import type { Issue } from "./types";

const dtf = createColumnConfigHelper<Issue>();`
};

export const textColumnCode: CodeBlock = {
  name: "title-column.ts",
  lang: "typescript",
  code: `import Heading1Icon from "@lucide/svelte/icons/heading-1";

const titleColumn = dtf
  .text()
  .id("title")
  .accessor((row) => row.title)
  .displayName("Title")
  .icon(Heading1Icon)
  .build();`
};

export const declaredOptionsCode: CodeBlock = {
  name: "status-column.ts",
  highlight: [16],
  lang: "typescript",
  code: `import BadgeCheckIcon from "@lucide/svelte/icons/badge-check";

export const statusOptions = [
  { label: "Backlog", value: "backlog" },
  { label: "Todo", value: "todo" },
  { label: "In Progress", value: "in-progress" },
  { label: "Done", value: "done" }
];

const statusColumn = dtf
  .option()
  .id("status")
  .accessor((row) => row.status)
  .displayName("Status")
  .icon(BadgeCheckIcon)
  .options(statusOptions)
  .build();`
};

export const inferredOptionsCode: CodeBlock = {
  name: "assignee-column.ts",
  highlight: [[10, 14]],
  lang: "typescript",
  code: `import UserCheckIcon from "@lucide/svelte/icons/user-check";
import UserAvatar from "./UserAvatar.svelte";

const assigneeColumn = dtf
  .option()
  .id("assignee")
  .accessor((row) => row.assignee)
  .displayName("Assignee")
  .icon(UserCheckIcon)
  .transformOptionFn((user) => ({
    value: user.id,
    label: user.name,
    icon: UserAvatar
  }))
  .build();`
};

export const numberBoundariesCode: CodeBlock = {
  name: "estimate-column.ts",
  lang: "typescript",
  highlight: [9, 10],
  code: `import HashIcon from "@lucide/svelte/icons/hash";

const estimateColumn = dtf
  .number()
  .id("estimate")
  .accessor((row) => row.estimate)
  .displayName("Estimate")
  .icon(HashIcon)
  .min(1)
  .max(24)
  .build();`
};

export const columnsConfigCode: CodeBlock = {
  name: "columns.ts",
  lang: "typescript",
  code: `import BadgeCheckIcon from "@lucide/svelte/icons/badge-check";
import CalendarDaysIcon from "@lucide/svelte/icons/calendar-days";
import HashIcon from "@lucide/svelte/icons/hash";
import Heading1Icon from "@lucide/svelte/icons/heading-1";
import TagsIcon from "@lucide/svelte/icons/tags";

import { createColumnConfigHelper } from "$lib/components/data-table/core/filters";
import type { Issue } from "./types";

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
  name: "filters.svelte.ts",
  lang: "typescript",
  highlight: [1, [24, 28]],
  code: `import { createFilters } from "$lib/hooks";
import { columnsConfig } from "./columns";
import type { Issue } from "./types";

export const issues: Issue[] = [
  {
    id: "ISS-101",
    title: "Ship localized filter toolbar",
    status: "in-progress",
    estimate: 8,
    dueDate: new Date("2026-08-04"),
    labels: ["docs", "design"]
  },
  {
    id: "ISS-102",
    title: "Backfill server-side status counts",
    status: "backlog",
    estimate: 13,
    dueDate: new Date("2026-08-12"),
    labels: ["api", "ops"]
  }
];

export const filterController = createFilters({
  strategy: "client",
  data: issues,
  columnsConfig
});`
};

export const defaultFiltersCode: CodeBlock = {
  name: "filters.svelte.ts",
  lang: "typescript",
  code: `export const filterController = createFilters({
  strategy: "client",
  data: issues,
  columnsConfig,
  defaultFilters: [
    {
      columnId: "status",
      type: "option",
      operator: "is",
      values: ["backlog"]
    }
  ]
});`
};

export const remoteOptionsCode: CodeBlock = {
  name: "server-filters.svelte.ts",
  lang: "typescript",
  code: `export const filterController = createFilters({
  strategy: "server",
  data: issues,
  columnsConfig,
  options: {
    status: statusOptions,
    labels: labelOptions
  },
  faceted: {
    status: new Map([
      ["backlog", 12],
      ["todo", 7],
      ["in-progress", 4],
      ["done", 19]
    ]),
    labels: new Map([
      ["api", 8],
      ["billing", 2],
      ["design", 6],
      ["docs", 10],
      ["ops", 5]
    ]),
    estimate: [1, 40]
  }
});`
};

export const componentCode: CodeBlock = {
  name: "IssueTable.svelte",
  lang: "svelte",
  code: `<script lang="ts">
  import { format } from "date-fns";
  import { DataTableFilter } from "$lib/components/data-table/components";
  import * as Table from "$lib/components/ui/table";
  import type {
    Column,
    FilterModel
  } from "$lib/components/data-table/core/types";
  import {
    dateFilterFn,
    multiOptionFilterFn,
    numberFilterFn,
    optionFilterFn,
    textFilterFn
  } from "$lib/components/data-table/utils/filter-fns";

  import { filterController, issues } from "./filters.svelte";
  import type { Issue } from "./types";

  let locale = $state("en");

  const columnsById = new Map(
    filterController.columns.map((column) => [column.id, column] as const)
  );

  const filteredIssues = $derived.by(() =>
    issues.filter((issue) =>
      filterController.filters.every((filter) => matchesFilter(issue, filter))
    )
  );

  function matchesFilter(issue: Issue, filter: FilterModel) {
    const column = columnsById.get(filter.columnId) as Column<Issue> | undefined;

    if (!column) return true;

    const value = column.accessor(issue) as unknown;

    switch (filter.type) {
      case "text":
        return textFilterFn(String(value ?? ""), filter as FilterModel<"text">);
      case "number":
        return numberFilterFn(Number(value ?? 0), filter as FilterModel<"number">);
      case "date":
        return dateFilterFn(value as Date, filter as FilterModel<"date">);
      case "option":
        return optionFilterFn(String(value ?? ""), filter as FilterModel<"option">);
      case "multiOption":
        return multiOptionFilterFn(
          Array.isArray(value) ? (value as string[]) : [],
          filter as FilterModel<"multiOption">
        );
      default:
        return true;
    }
  }
</script>

<DataTableFilter
  columns={filterController.columns}
  filters={filterController.filters}
  actions={filterController.actions}
  strategy={filterController.strategy}
  {locale}
/>

<div class="rounded-lg border">
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
          <Table.Cell>{format(issue.dueDate, "MMM d, yyyy")}</Table.Cell>
          <Table.Cell>{issue.labels.join(", ")}</Table.Cell>
        </Table.Row>
      {/each}
    </Table.Body>
  </Table.Root>
</div>`
};

export const localeUsageCode: CodeBlock = {
  name: "locale.ts",
  lang: "typescript",
  code: `type Locale =
  | "en"
  | "fr"
  | "nl"
  | "de"
  | "zh_CN"
  | "zh_TW";

// <DataTableFilter locale="fr" />`
};

export const fullExampleCode: CodeBlock[] = [
  issueTypesCode,
  columnsConfigCode,
  controllerCode,
  componentCode
];
