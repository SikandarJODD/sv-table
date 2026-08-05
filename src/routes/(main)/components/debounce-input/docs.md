# Debounce Input

A search input with a search icon, a clear button, and a debounced value powered by Runed's `Debounced` utility.

## Installation

```txt
registry: https://sv-table.vercel.app/r/debounce-input.json
npm: npx shadcn-svelte@latest add https://sv-table.vercel.app/r/debounce-input.json
pnpm: pnpm dlx shadcn-svelte@latest add https://sv-table.vercel.app/r/debounce-input.json
```

## Usage

```svelte
<script lang="ts">
  import DebounceInput from "$lib/components/table/debounce-input";

  let value = $state("");
</script>

<DebounceInput
  bind:value
  placeholder="Search tables..."
  onChange={(value) => console.log(value)}
/>
```

## Notes

> **Instant updates:** Set `debounce={0}` when you want effectively immediate updates without changing components.

- The visible input responds immediately. Only `value` and `onChange` wait for the debounce delay.
- The clear button uses the same delay as typing, keeping search and filter updates consistent.
- External changes to `value` sync into the input immediately and do not call `onChange` again.

## Props

### `value`

- Type: `string`
- Default: `""`
- The controlled value, updated after the debounce delay.

### `onChange`

- Type: `(value: string) => void`
- Called with the value after the debounce delay.

### `class`

- Type: `string`
- Optional classes for the root input group.

### `placeholder`

- Type: `string`
- Default: `"Search..."`
- Placeholder text for the input.

### `debounce`

- Type: `number`
- Default: `500`
- Delay in milliseconds before updating `value` and calling `onChange`.
