# Data Table Faceted Filter

A searchable multi-select filter with live facet counts for categorical TanStack Table columns.

## Installation

```txt
registry: https://sv-table.vercel.app/r/data-table-faceted-filter.json
npm: npx shadcn-svelte@latest add https://sv-table.vercel.app/r/data-table-faceted-filter.json
pnpm: pnpm dlx shadcn-svelte@latest add https://sv-table.vercel.app/r/data-table-faceted-filter.json
```

## Table setup

Enable filtering and faceting, then use `filterFn_arrHas` so a scalar column matches any selected value.

```ts
import {
  columnFacetingFeature,
  columnFilteringFeature,
  createFacetedRowModel,
  createFacetedUniqueValues,
  createFilteredRowModel,
  createTable,
  filterFn_arrHas,
  tableFeatures
} from "@tanstack/svelte-table";

const features = tableFeatures({
  columnFilteringFeature,
  columnFacetingFeature,
  filteredRowModel: createFilteredRowModel(),
  facetedRowModel: createFacetedRowModel(),
  facetedUniqueValues: createFacetedUniqueValues(),
  filterFns: { arrHas: filterFn_arrHas }
});

const columns = [
  {
    accessorKey: "status",
    header: "Status",
    filterFn: "arrHas"
  }
];

const table = createTable({
  features,
  columns,
  get data() {
    return rows;
  }
});
```

## Usage

```svelte
<script lang="ts">
  import DataTableFacetedFilter from "$lib/components/table/data-table-faceted-filter";

  const options = [
    { label: "Active", value: "active" },
    { label: "Pending", value: "pending" },
    { label: "Inactive", value: "inactive" }
  ];

  const statusColumn = table.getColumn("status")!;
</script>

<DataTableFacetedFilter column={statusColumn} title="Status" {options} />
```

Multiple values in one filter use OR matching. Filters on separate columns combine with AND. Facet counts are calculated after other column filters are applied but before the current column filters itself.

## Server counts

Pass `facets={new Map([...])}` to override counts with backend-provided values.

## Main props

- `column`: filterable TanStack-compatible column.
- `title`: trigger label.
- `options`: `{ label, value, icon? }[]`.
- `facets`: optional `Map<string, number>` count override.
- `showCounts`: show option counts and the selected result total when available; defaults to `true`.
- `open`: bindable popover state.
- `class`: trigger classes.
- `contentClass`: popover content classes.
