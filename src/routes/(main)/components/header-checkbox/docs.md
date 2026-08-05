# Header Checkbox

A select-all checkbox with support for an indeterminate state.

## Installation

```txt
registry: https://sv-table.vercel.app/r/header-checkbox.json
pnpm: pnpm dlx shadcn-svelte@latest add https://sv-table.vercel.app/r/header-checkbox.json
```

## Column definition

Register `rowSelectionFeature`, then return the component from the header definition with `renderComponent`.

```ts
import {
  renderComponent,
  rowSelectionFeature,
  tableFeatures,
  type ColumnDef
} from "@tanstack/svelte-table";
import HeaderCheckbox from "$lib/components/table/header-checkbox";

type Project = { id: string; name: string };
const features = tableFeatures({ rowSelectionFeature });

const columns: ColumnDef<typeof features, Project>[] = [
  {
    id: "select",
    header: ({ table }) => {
      const allSelected = table.getIsAllRowsSelected();

      return renderComponent(HeaderCheckbox, {
        checked: allSelected,
        indeterminate: table.getIsSomeRowsSelected() && !allSelected,
        onCheckedChange: (checked) => table.toggleAllRowsSelected(checked)
      });
    }
  },
  { accessorKey: "name", header: "Project" }
];
```

Render each header with `<FlexRender {header} />`. For page-only selection, use the matching `getIsAllPageRowsSelected`, `getIsSomePageRowsSelected`, and `toggleAllPageRowsSelected` APIs.

## Props

- `checked: boolean` — whether all target rows are selected.
- `indeterminate?: boolean` — whether some, but not all, target rows are selected.
- `onCheckedChange: (checked: boolean) => void` — updates select-all state.
- `aria-label?: string` — defaults to `"Select all rows"`.
- All remaining `ui/checkbox` props, including `class` and `disabled`, are forwarded.
