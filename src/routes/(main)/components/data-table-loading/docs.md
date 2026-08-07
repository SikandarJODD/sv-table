# Data Table Loading

Skeleton rows that preserve a table layout while its data is loading.

## Installation

```txt
registry: https://sv-table.vercel.app/r/data-table-loading.json
pnpm: pnpm dlx shadcn-svelte@latest add https://sv-table.vercel.app/r/data-table-loading.json
```

## Usage

```svelte
<Table.Body aria-busy={isLoading}>
  {#if isLoading}
    <DataTableLoading columnCount={columns.length} rowCount={5} />
  {:else}
    {#each rows as row (row.id)}
      <!-- Render table rows -->
    {/each}
  {/if}
</Table.Body>
```

## Props

- `columnCount` — required number of skeleton cells per row.
- `rowCount` — number of skeleton rows; defaults to `5`.
- `class` — classes applied to every skeleton bar.
