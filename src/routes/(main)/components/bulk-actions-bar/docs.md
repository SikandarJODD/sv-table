# Bulk Actions Bar

A floating action bar that appears when one or more items are selected. The parent owns selection and action behavior; the component handles visibility, positioning, animation, responsive overflow, and clearing the selection.

## Installation

```txt
registry: https://sv-table.vercel.app/r/bulk-actions-bar.json
npm: npx shadcn-svelte@latest add https://sv-table.vercel.app/r/bulk-actions-bar.json
pnpm: pnpm dlx shadcn-svelte@latest add https://sv-table.vercel.app/r/bulk-actions-bar.json
```

## Usage

```svelte
<script lang="ts">
  import BulkActionsBar from "$lib/components/table/bulk-actions-bar";
  import { Button } from "$lib/components/ui/button";

  const selectedIds = $derived.by(() =>
    Object.entries(table.atoms.rowSelection.get())
      .filter(([, selected]) => selected)
      .map(([id]) => id)
  );
</script>

<BulkActionsBar
  selectedCount={selectedIds.length}
  onClear={() => table.resetRowSelection(true)}
>
  <Button onclick={() => exportProjects(selectedIds)}>Export</Button>
  <Button variant="destructive" onclick={() => deleteProjects(selectedIds)}>
    Delete
  </Button>
</BulkActionsBar>
```

## Add it to a table

### Step 1: Enable row selection and stable row IDs

Register `rowSelectionFeature` and set `getRowId` to a stable database or application ID.

```ts
const features = tableFeatures({ rowSelectionFeature });

const table = createTable({
  features,
  columns,
  get data() {
    return projects;
  },
  getRowId: (row) => row.id
});
```

### Step 2: Derive selected IDs

Filter for truthy values before counting because selection records can retain keys whose value is `false`.

```ts
const selectedIds = $derived.by(() =>
  Object.entries(table.atoms.rowSelection.get())
    .filter(([, selected]) => selected)
    .map(([id]) => id)
);
```

### Step 3: Add custom actions

Pass the selected count and clear callback, then compose any buttons, menus, dialogs, permission checks, or loading states as children.

```svelte
<BulkActionsBar
  selectedCount={selectedIds.length}
  onClear={() => table.resetRowSelection(true)}
>
  <Button onclick={() => exportProjects(selectedIds)}>Export</Button>
  <Button variant="destructive" onclick={() => deleteProjects(selectedIds)}>
    Delete
  </Button>
</BulkActionsBar>
```

For manual/server pagination, use selected IDs from row-selection state for bulk API calls. The selected row model can only contain rows currently loaded by the client.

## Props

### `selectedCount`

- Type: `number`
- Required: yes
- Controls visibility and the default selected-items summary.

### `onClear`

- Type: `() => void`
- Required: yes
- Called from the built-in clear-selection button.

### `children`

- Type: `Snippet`
- Required: yes
- Custom action controls rendered inside the bar.

### `summary`

- Type: `Snippet<[number]>`
- Optional custom summary content for localization or richer markup.

### `clearLabel`

- Type: `string`
- Default: `"Clear selection"`
- Accessible label and tooltip for the clear button.

### `class`

- Type: `string`
- Optional classes for the visible bar surface.

All remaining `HTMLAttributes<HTMLDivElement>` props are forwarded to the action bar region.
