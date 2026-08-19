# CSV Export

A dependency-free CSV download button for Svelte tables. You provide the rows to export and an explicit list of export columns, so the same component works with plain arrays and TanStack Table row models.

## Installation

```txt
registry: https://sv-table.vercel.app/r/data-table-export.json
npm: npx shadcn-svelte@latest add https://sv-table.vercel.app/r/data-table-export.json
pnpm: pnpm dlx shadcn-svelte@latest add https://sv-table.vercel.app/r/data-table-export.json
```

## Usage

Define the exported headers and values separately from your rendered cells.

```svelte
<script lang="ts">
  import DataTableExport, {
    type CsvExportColumn
  } from "$lib/components/table/data-table-export";

  type Project = {
    name: string;
    owner: string;
    budget: number;
  };

  let projects: Project[] = $state([]);

  const exportColumns: CsvExportColumn<Project>[] = [
    { id: "name", header: "Project", accessor: "name" },
    { id: "owner", header: "Owner", accessor: "owner" },
    { id: "budget", header: "Budget", accessor: "budget" }
  ];
</script>

<DataTableExport rows={projects} columns={exportColumns} filename="projects" />
```

## Exporting TanStack rows

Pass the row model that matches the user's current scope. For example, this exports the filtered and sorted rows currently returned by the table:

```svelte
<script lang="ts">
  const exportRows = $derived(
    table.getRowModel().rows.map((row) => row.original)
  );
</script>

<DataTableExport rows={exportRows} columns={exportColumns} />
```

If your table uses server-side pagination, the browser only knows about the loaded page. Fetch the complete filtered dataset before passing it to the component, or implement the export on your server.

## Formatting values

Use `format` when the downloaded value should differ from the raw accessor value:

```ts
type Project = {
  budget: number;
  owner: { name: string };
};

const exportColumns: CsvExportColumn<Project>[] = [
  {
    id: "budget",
    header: "Budget",
    accessor: "budget",
    format: (value) => `$${Number(value).toFixed(2)}`
  },
  {
    id: "owner",
    header: "Owner",
    accessor: (row) => row.owner.name
  }
];
```

Rendered Svelte cells, badges, checkboxes, and action menus are not serialized. Add only meaningful data columns to `exportColumns`.

## CSV behavior

- Values containing delimiters, quotes, or line breaks are escaped automatically.
- A UTF-8 byte order mark is included by default for better spreadsheet compatibility.
- `Date` values use ISO format.
- Strings beginning with spreadsheet formula characters are prefixed safely by default.
- The component uses browser download APIs and must be triggered in the browser.

## Props

- `rows` — rows included in the downloaded file.
- `columns` — ordered `CsvExportColumn<T>` definitions.
- `filename` — downloaded name; defaults to `"table-export.csv"`.
- `label` — button text; defaults to `"Export CSV"`.
- `delimiter` — column separator; defaults to `","`.
- `includeBom` — includes the UTF-8 BOM; defaults to `true`.
- `protectFormulas` — protects formula-like string values; defaults to `true`.
- `disabled` — disables the export button.
- `class` — classes applied to the button.
- `onExport` — callback receiving `{ filename, rowCount }` after download starts.

## CsvExportColumn fields

- `id` — stable column identifier.
- `header` — exported header text.
- `accessor` — row key or function returning a CSV value.
- `format` — optional function for transforming the accessor value.
