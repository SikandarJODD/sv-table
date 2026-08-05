# Row Checkbox

A controlled checkbox for selecting an individual table row.

## Installation

```txt
registry: https://sv-table.vercel.app/r/row-checkbox.json
pnpm: pnpm dlx shadcn-svelte@latest add https://sv-table.vercel.app/r/row-checkbox.json
```

## Column definition

Register `rowSelectionFeature`, then return the component from the cell definition with `renderComponent`.

```ts
import {
  renderComponent,
  rowSelectionFeature,
  tableFeatures,
  type ColumnDef
} from "@tanstack/svelte-table";
import RowCheckbox from "$lib/components/table/row-checkbox";

type Project = { id: string; name: string };
const features = tableFeatures({ rowSelectionFeature });

const columns: ColumnDef<typeof features, Project>[] = [
  {
    id: "select",
    cell: ({ row }) =>
      renderComponent(RowCheckbox, {
        checked: row.getIsSelected(),
        onCheckedChange: (checked) => row.toggleSelected(checked),
        "aria-label": `Select ${row.original.name}`
      })
  },
  { accessorKey: "name", header: "Project" }
];
```

Render each cell with `<FlexRender {cell} />`.

## Props

- `checked: boolean` — whether the row is selected.
- `onCheckedChange: (checked: boolean) => void` — updates row selection.
- `aria-label?: string` — defaults to `"Select row"`.
- All remaining `ui/checkbox` props, including `class` and `disabled`, are forwarded.
