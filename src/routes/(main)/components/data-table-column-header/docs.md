# Column Header

A TanStack Table column heading with sorting, pinning, ordering, and visibility actions.

## Installation

```txt
registry: https://sv-table.vercel.app/r/data-table-column-header.json
npm: npx shadcn-svelte@latest add https://sv-table.vercel.app/r/data-table-column-header.json
pnpm: pnpm dlx shadcn-svelte@latest add https://sv-table.vercel.app/r/data-table-column-header.json
```

## Usage

The menu detects the features configured on the table. Add only the actions your table needs.

```svelte
<script lang="ts">
  import {
    columnOrderingFeature,
    columnPinningFeature,
    columnVisibilityFeature,
    createSortedRowModel,
    rowSortingFeature,
    tableFeatures
  } from "@tanstack/svelte-table";
  import DataTableColumnHeader from "$lib/components/table/data-table-column-header";

  const features = tableFeatures({
    columnOrderingFeature,
    columnPinningFeature,
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

Click the title to cycle from ascending to descending to unsorted. The action menu provides:

- Asc, Desc, and Reset sort with `rowSortingFeature`
- Pin left, Pin right, and Unpin with `columnPinningFeature`
- Move left and Move right with `columnOrderingFeature`
- Hide with `columnVisibilityFeature`

Move actions reorder the column within its current start, center, or end pinning region. TanStack v9 uses logical `start` and `end` pinning internally; the menu presents these as left and right for the default left-to-right layout.

Pinning updates TanStack's column regions. Sticky positioning and offsets remain the responsibility of the table renderer.

Shift-clicking the title supports multi-column sorting when multi-sort is enabled.

## Props

### `column`

- Type: TanStack column
- Required: yes
- Available actions are inferred from the features configured on the column's table.

### `title`

- Type: `string`
- Required: yes
- Visible label used by the header and its accessible control names.

### `class`

- Type: `string`
- Optional classes for the root header controls.
