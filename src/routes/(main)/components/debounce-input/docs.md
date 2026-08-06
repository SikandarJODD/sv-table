# Debounce Input

A search input with a search icon, a clear button, and an optional debounce delay powered by Runed's `Debounced` utility.

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

> **Immediate by default:** `debounce` defaults to `0`, so value updates are effectively immediate. Set a positive delay, such as `debounce={300}`, to debounce updates.

- The visible input always responds immediately. With a positive delay, only `value` and `onChange` wait.
- The clear button uses the same configured delay as typed input, keeping search and filter updates consistent.
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
- Default: `0`
- Delay in milliseconds before updating `value` and calling `onChange`. Use a positive value to debounce updates.
