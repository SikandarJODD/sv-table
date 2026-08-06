# Number Range Filter

A number range picker with exact inputs, an optional slider, and explicit Apply and Clear actions.

## Installation

```txt
registry: https://sv-table.vercel.app/r/number-range-filter.json
npm: npx shadcn-svelte@latest add https://sv-table.vercel.app/r/number-range-filter.json
pnpm: pnpm dlx shadcn-svelte@latest add https://sv-table.vercel.app/r/number-range-filter.json
```

## Basic usage

```svelte
<script lang="ts">
  import NumberRangeFilter, {
    type NumberRangeFilterValue
  } from "$lib/components/table/number-range-filter";

  let range = $state<NumberRangeFilterValue | undefined>();
</script>

<NumberRangeFilter
  bind:value={range}
  title="Price"
  min={0}
  max={5000}
  step={100}
/>
```

Typed values move the slider on blur or Enter. A committed slider change updates both inputs.

## Connect a table column

```svelte
<script lang="ts">
  const priceColumn = table.getColumn("price")!;

  function changeRange(value: NumberRangeFilterValue | undefined) {
    range = value;
    priceColumn.setFilterValue(value ? [value.min, value.max] : undefined);
  }
</script>

<NumberRangeFilter value={range} onValueChange={changeRange} title="Price" />
```

Use TanStack Table's inclusive `filterFn_inNumberRange` filter for the column.

## Inputs only

```svelte
<NumberRangeFilter
  bind:value={range}
  title="Score"
  min={0}
  max={100}
  showSlider={false}
/>
```

Either input may be left empty for an open-ended range.

## Main props

- `value`: bindable `{ min, max }` applied range.
- `min` / `max`: allowed boundaries. Both are needed to show the slider.
- `step`: input and slider increment. Defaults to `1`.
- `showSlider`: shows the slider when boundaries are available.
- `formatValue`: formats numbers in the trigger and slider labels.
- `onValueChange`: called after Apply or Clear.
