# Data Table Column Header

A sortable TanStack Table column heading with a direct sort toggle and an action menu for ascending, descending, reset, and hide commands.

## Installation

```txt
registry: https://sv-table.vercel.app/r/data-table-column-header.json
npm: npx shadcn-svelte@latest add https://sv-table.vercel.app/r/data-table-column-header.json
pnpm: pnpm dlx shadcn-svelte@latest add https://sv-table.vercel.app/r/data-table-column-header.json
```

## Usage

Configure TanStack Table with `rowSortingFeature`. Add `columnVisibilityFeature` when the Hide action should be available.

```svelte
<script lang="ts">
  import {
    columnVisibilityFeature,
    createSortedRowModel,
    rowSortingFeature,
    tableFeatures
  } from "@tanstack/svelte-table";
  import DataTableColumnHeader from "$lib/components/table/data-table-column-header";

  const features = tableFeatures({
    columnVisibilityFeature,
    rowSortingFeature,
    sortedRowModel: createSortedRowModel()
  });
</script>

<Table.Head
  aria-sort={header.column.getIsSorted() === "asc"
    ? "ascending"
    : header.column.getIsSorted() === "desc"
      ? "descending"
      : "none"}
>
  <DataTableColumnHeader column={header.column} title="Project" />
</Table.Head>
```

Click the title to cycle from ascending to descending to unsorted. The menu provides exact Asc and Desc actions, Reset sort removes the column from the sorting state, and Hide toggles its visibility off.

Shift-clicking the title supports multi-column sorting when multi-sort is enabled.

## Props

### `column`

- Type: TanStack column with `rowSortingFeature`
- Required: yes
- Add `columnVisibilityFeature` to make the Hide action available.

### `title`

- Type: `string`
- Required: yes
- Visible label used by the header and its accessible control names.

### `class`

- Type: `string`
- Optional classes for the root header controls.
