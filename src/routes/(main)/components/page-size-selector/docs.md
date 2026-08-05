# Page Size Selector

A controlled rows-per-page selector. The parent owns the pagination state and passes the current page size and setter to the component.

## Installation

```txt
registry: https://sv-table.vercel.app/r/page-size-selector.json
npm: npx shadcn-svelte@latest add https://sv-table.vercel.app/r/page-size-selector.json
pnpm: pnpm dlx shadcn-svelte@latest add https://sv-table.vercel.app/r/page-size-selector.json
```

## Usage

The table must be a TanStack Table v9 instance configured with `rowPaginationFeature`.

```svelte
<script lang="ts">
  import {
    createPaginatedRowModel,
    createTable,
    rowPaginationFeature,
    tableFeatures
  } from "@tanstack/svelte-table";
  import type { ColumnDef } from "@tanstack/svelte-table";
  import PageSizeSelector from "$lib/components/table/page-size-selector";

  type Row = { id: number };
  const data: Row[] = [{ id: 1 }];

  const features = tableFeatures({
    rowPaginationFeature,
    paginatedRowModel: createPaginatedRowModel()
  });

  const columns: ColumnDef<typeof features, Row>[] = [
    { accessorKey: "id" }
  ];

  const table = createTable({
    features,
    columns,
    get data() {
      return data;
    },
    initialState: {
      pagination: { pageIndex: 0, pageSize: 10 }
    }
  });

  const pagination = $derived(table.atoms.pagination.get());
</script>

<PageSizeSelector
  pageSize={pagination.pageSize}
  setPageSize={(pageSize) => table.setPageSize(pageSize)}
/>

<!-- Optional custom sizes -->
<PageSizeSelector
  pageSize={pagination.pageSize}
  options={[10, 20, 50, 100]}
  setPageSize={(pageSize) => table.setPageSize(pageSize)}
/>
```

## Props

### `pageSize`

- Type: `number`
- Required: yes
- The currently selected number of rows per page.

### `options`

- Type: `number[]`
- Default: `[5, 10, 25, 50]`
- Controls the page sizes displayed in the select menu.

### `setPageSize`

- Type: `(pageSize: number) => void`
- Required: yes
- Called with the selected page size. Use it to update the parent pagination state or call `table.setPageSize()`.

### `class`

- Type: `string`
- Optional classes for the root wrapper.
