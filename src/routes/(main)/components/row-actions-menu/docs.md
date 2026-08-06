# Row Actions Menu

An accessible dropdown menu for actions on an individual table row. It renders a compact ellipsis trigger and supports icons, shortcuts, separators, destructive actions, and row-aware hidden or disabled states.

## Installation

```txt
registry: https://sv-table.vercel.app/r/row-actions-menu.json
npm: npx shadcn-svelte@latest add https://sv-table.vercel.app/r/row-actions-menu.json
pnpm: pnpm dlx shadcn-svelte@latest add https://sv-table.vercel.app/r/row-actions-menu.json
```

## Usage

Define actions once and pass the current row from a TanStack Table cell.

```svelte
<script lang="ts">
  import PencilIcon from "@lucide/svelte/icons/pencil";
  import Trash2Icon from "@lucide/svelte/icons/trash-2";
  import RowActionsMenu, {
    type RowAction
  } from "$lib/components/table/row-actions-menu";

  type Project = { id: string; name: string; archived: boolean };

  const actions: RowAction<Project>[] = [
    {
      id: "edit",
      label: "Edit project",
      icon: PencilIcon,
      onSelect: (project) => editProject(project.id)
    },
    {
      id: "delete",
      label: "Delete project",
      icon: Trash2Icon,
      variant: "destructive",
      separatorBefore: true,
      disabled: (project) => project.archived,
      onSelect: (project) => deleteProject(project.id)
    }
  ];
</script>

<RowActionsMenu
  row={project}
  {actions}
  label={`Open actions for ${project.name}`}
/>
```

For a TanStack Table column, return it with `renderComponent`:

```ts
{
  id: "actions",
  cell: ({ row }) =>
    renderComponent(RowActionsMenu, {
      row: row.original,
      actions,
      label: `Open actions for ${row.original.name}`
    })
}
```

## Accessibility

The trigger has a configurable accessible label. The underlying dropdown handles focus management, arrow-key navigation, Escape, and focus restoration. Supply a row-specific `label` when multiple menus appear in one table.

The `shortcut` field is a visual hint only; register the actual keyboard shortcut in your application.

## Props

- `row` — current row value passed to action callbacks and state functions.
- `actions` — array of `RowAction<T>` definitions.
- `label` — trigger label; defaults to `"Open row actions"`.
- `menuLabel` — optional heading above the actions.
- `disabled` — disables the trigger.
- `align` — menu alignment: `"start"`, `"center"`, or `"end"`.
- `sideOffset` — distance from the trigger in pixels; defaults to `4`.
- `class` — classes for the trigger button.
- `contentClass` — classes for the dropdown content.
- `open` — bindable open state.

## RowAction fields

- `id` — stable key for the action.
- `label` — visible action text.
- `onSelect` — callback receiving the current row.
- `icon` — optional Svelte icon component.
- `shortcut` — optional visual shortcut hint.
- `variant` — `"default"` or `"destructive"`.
- `disabled` / `hidden` — boolean or function receiving the row.
- `separatorBefore` — adds a divider before the action.
