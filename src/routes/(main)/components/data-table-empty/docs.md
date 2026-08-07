# Data Table Empty

A table row for displaying a clear empty or filtered-results state.

## Preview

Filter the table rows and render the empty state when the filtered array has no matches.

```svelte
<Input bind:value={query} placeholder="Search people..." />

<Table.Body>
  {#each filteredPeople as person (person.email)}
    <Table.Row>
      <Table.Cell>{person.name}</Table.Cell>
      <Table.Cell>{person.email}</Table.Cell>
      <Table.Cell>{person.role}</Table.Cell>
    </Table.Row>
  {:else}
    <DataTableEmpty
      colspan={3}
      title="No people found"
      description="No rows match your search."
    />
  {/each}
</Table.Body>
```

## Installation

```txt
registry: https://sv-table.vercel.app/r/data-table-empty.json
pnpm: pnpm dlx shadcn-svelte@latest add https://sv-table.vercel.app/r/data-table-empty.json
```

## Usage

Render the component in the `{:else}` branch of the table rows.

```svelte
<Table.Body>
  {#each rows as row (row.id)}
    <Table.Row>
      {#each row.getAllCells() as cell (cell.id)}
        <Table.Cell>{cell.getValue()}</Table.Cell>
      {/each}
    </Table.Row>
  {:else}
    <DataTableEmpty colspan={table.getVisibleLeafColumns().length} />
  {/each}
</Table.Body>
```

## Examples

### Basic

```svelte
<Table.Body>
  <DataTableEmpty colspan={3} />
</Table.Body>
```

### With an action

```svelte
<DataTableEmpty
  colspan={columns.length}
  title="No matching rows"
  description="Try clearing the current filters."
>
  {#snippet actions()}
    <Button onclick={clearFilters}>Clear filters</Button>
  {/snippet}
</DataTableEmpty>
```

### Custom icon

```svelte
<DataTableEmpty colspan={columns.length} title="No rows in this view">
  {#snippet icon()}
    <ListFilterIcon />
  {/snippet}
</DataTableEmpty>
```

## Props

- `colspan` — required number of visible table columns.
- `title` — empty-state heading.
- `description` — supporting text.
- `icon` — optional icon snippet.
- `actions` — optional action snippet.
- `class` — classes applied to the empty-state container.
