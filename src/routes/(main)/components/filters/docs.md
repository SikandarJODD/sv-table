# Data Table Filters

Composable table filters for Svelte apps with `text`, `number`, `date`, `option`, and `multiOption` columns.

## Packages

```txt
date-fns
runed
@lucide/svelte
@internationalized/date
```

## Installation

```txt
registry: https://sv-table.vercel.app/r/filters.json
npm: npx shadcn-svelte@latest add https://sv-table.vercel.app/r/filters.json
pnpm: pnpm dlx shadcn-svelte@latest add https://sv-table.vercel.app/r/filters.json
yarn: yarn dlx shadcn-svelte@latest add https://sv-table.vercel.app/r/filters.json
bun: bunx shadcn-svelte@latest add https://sv-table.vercel.app/r/filters.json
```

## Column Types

```ts
type ColumnDataType =
  | "text"
  | "number"
  | "date"
  | "option"
  | "multiOption";
```

## Columns Config Guide

```txt
builder order:
1. pick type: .text() | .number() | .date() | .option() | .multiOption()
2. .id("columnId")
3. .accessor((row) => row.field)
4. .displayName("Label")
5. .icon(IconComponent)
6. optional config by type
7. .build()
```

```txt
type-specific:
text: no extra config required
number: .min(number), .max(number)
date: no extra config required
option: .options([...]) or .transformOptionFn(...)
multiOption: .options([...]) or .transformOptionFn(...)
```

## Columns

```ts
import BadgeCheckIcon from "@lucide/svelte/icons/badge-check";
import CalendarDaysIcon from "@lucide/svelte/icons/calendar-days";
import HashIcon from "@lucide/svelte/icons/hash";
import Heading1Icon from "@lucide/svelte/icons/heading-1";
import TagsIcon from "@lucide/svelte/icons/tags";

import { createColumnConfigHelper } from "$lib/components/data-table/core/filters";

type Issue = {
  title: string;
  status: "backlog" | "todo" | "in-progress" | "done";
  estimate: number;
  dueDate: Date;
  labels: string[];
};

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
] as const;
```

## Columns Notes

```txt
use createColumnConfigHelper<TData>() once per row type
keep ids stable
export final array as const
use .options() when values are known ahead of time
use .transformOptionFn() when accessor returns objects
use .min() and .max() for number columns when range is known
```

## Instance

```txt
createFilters(...) creates the filter controller instance
main outputs:
- columns
- filters
- actions
- strategy
```

### Client Instance

```ts
import { createFilters } from "$lib/hooks";
import { columnsConfig } from "./columns";

export const issues = [
  {
    id: "ISS-101",
    title: "Ship localized filter toolbar",
    status: "in-progress",
    estimate: 8,
    dueDate: new Date("2026-08-04"),
    labels: ["docs", "design"]
  }
];

export const filterController = createFilters({
  strategy: "client",
  data: issues,
  columnsConfig
});
```

### Default Filters

```ts
export const filterController = createFilters({
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
});
```

### Server Instance

```ts
export const filterController = createFilters({
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
});
```

## Instance Notes

```txt
client strategy: filter local rows in the app
server strategy: UI state lives in the controller, filtering lives in backend
use defaultFilters for initial state
server mode should pass options and faceted values when available
```

## DataTableFilter Component

```ts
type RequiredProps = {
  columns: typeof filterController.columns;
  filters: typeof filterController.filters;
  actions: typeof filterController.actions;
  strategy: typeof filterController.strategy;
};
```

```svelte
<script lang="ts">
  import { DataTableFilter } from "$lib/components/data-table/components";
  import { filterController } from "./filters.svelte";

  let locale = $state("en");
</script>

<DataTableFilter
  columns={filterController.columns}
  filters={filterController.filters}
  actions={filterController.actions}
  strategy={filterController.strategy}
  {locale}
/>
```

## Component Notes

```txt
DataTableFilter renders only the filter UI
for client mode, apply filterController.filters to local data
for server mode, send filterController.filters to your fetch layer
columns must come from the same controller instance
```

## Internationalization

```ts
type Locale =
  | "en"
  | "fr"
  | "nl"
  | "de"
  | "zh_CN"
  | "zh_TW";
```

```svelte
<DataTableFilter
  columns={filterController.columns}
  filters={filterController.filters}
  actions={filterController.actions}
  strategy={filterController.strategy}
  locale="fr"
/>
```

## Suggested Structure

```md
src/lib/issues/
  types.ts
  columns.ts
  filters.svelte.ts
  IssueTable.svelte
```

## Build Order

```txt
1. define row types
2. create column helper
3. export columnsConfig
4. createFilters({ strategy, data, columnsConfig })
5. render <DataTableFilter />
6. apply filters locally or send them to backend
```
