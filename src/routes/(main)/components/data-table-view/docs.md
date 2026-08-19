# Column Visibility

A compact column visibility dropdown for TanStack Table that lets users check or uncheck every hideable column without leaving the table view.

## Installation

```txt
registry: https://sv-table.vercel.app/r/data-table-view.json
npm: npx shadcn-svelte@latest add https://sv-table.vercel.app/r/data-table-view.json
pnpm: pnpm dlx shadcn-svelte@latest add https://sv-table.vercel.app/r/data-table-view.json
```

## Usage

Configure `columnVisibilityFeature`, then pass the table instance to the component.

```svelte
<script lang="ts">
  import {
    columnVisibilityFeature,
    createTable,
    tableFeatures
  } from "@tanstack/svelte-table";
  import DataTableView from "$lib/components/table/data-table-view";

  const features = tableFeatures({ columnVisibilityFeature });

  const table = createTable({
    features,
    columns,
    get data() {
      return data;
    }
  });
</script>

<DataTableView {table} />
```

## Props

### `table`

- Type: TanStack table
- Required: yes
- The table instance containing columns configured with `columnVisibilityFeature`.

### `label`

- Type: `string`
- Default: `"View"`
- Text displayed in the dropdown trigger.

### `class`

- Type: `string`
- Optional classes for the dropdown trigger.
