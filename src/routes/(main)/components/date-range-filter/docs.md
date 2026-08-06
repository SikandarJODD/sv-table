# Date Range Filter

A controlled date-range picker with responsive calendars, optional presets, and explicit clear/apply actions.

## Installation

```txt
registry: https://sv-table.vercel.app/r/date-range-filter.json
npm: npx shadcn-svelte@latest add https://sv-table.vercel.app/r/date-range-filter.json
pnpm: pnpm dlx shadcn-svelte@latest add https://sv-table.vercel.app/r/date-range-filter.json
```

## Basic usage

```svelte
<script lang="ts">
  import DateRangeFilter, {
    type DateRangeFilterValue
  } from "$lib/components/table/date-range-filter";

  let range = $state<DateRangeFilterValue | undefined>();
</script>

<DateRangeFilter bind:value={range} title="Created" />
```

The component keeps calendar edits in a draft. The bound value changes only when Apply or Clear is selected.

## Connect a TanStack Table column

Register `filterFn_inDateRange`, then store `[start, end]` in the column filter:

```svelte
<script lang="ts">
  import DateRangeFilter, {
    type DateRangeFilterValue
  } from "$lib/components/table/date-range-filter";

  const dateColumn = table.getColumn("createdAt")!;
  let range = $state<DateRangeFilterValue | undefined>();

  function changeRange(value: DateRangeFilterValue | undefined) {
    range = value;
    dateColumn.setFilterValue(value ? [value.start, value.end] : undefined);
  }
</script>

<DateRangeFilter value={range} onValueChange={changeRange} title="Created" />
```

## Custom presets

```svelte
<script lang="ts">
  import type { DateRangeFilterPreset } from "$lib/components/table/date-range-filter";

  const presets: DateRangeFilterPreset[] = [
    {
      label: "Year to date",
      getValue: (today) => ({
        start: new Date(today.getFullYear(), 0, 1),
        end: today
      })
    }
  ];
</script>

<DateRangeFilter bind:value={range} {presets} />
```

Set `presets={false}` to display only the calendar.

## Calendar only and date limits

```svelte
<DateRangeFilter
  bind:value={range}
  title="Delivery"
  presets={false}
  min={new Date(2026, 0, 1)}
  max={new Date(2026, 11, 31)}
  numberOfMonths={1}
  weekStartsOn={1}
  locale="en-GB"
/>
```

This creates a single-month calendar without presets, limits selection to 2026, and starts weeks on Monday.

## Behavior

- The default presets are Today, Last 7 days, Last 30 days, and This month.
- Preset and calendar choices remain drafts until Apply is selected.
- Clear immediately removes the applied value and closes the popover.
- An active range can also be removed from the clear button beside the trigger.
- Dates are returned at local midnight and both range endpoints are inclusive.
- Two months are shown on desktop by default and one month on mobile.
- `min` and `max` constrain calendar dates and disable presets outside those limits.

## Main props

- `value`: bindable `{ start: Date | undefined, end: Date | undefined }`.
- `onValueChange`: called after Apply or Clear.
- `title`: trigger label; defaults to `"Date"`.
- `presets`: custom preset array, or `false` to hide presets.
- `min` / `max`: selectable date boundaries.
- `numberOfMonths`: desktop calendar count; defaults to `2`.
- `weekStartsOn`: first weekday from `0` (Sunday) through `6` (Saturday).
- `locale`: locale used by the calendar and trigger label.
- `open`: bindable popover state.
- `class` / `contentClass`: trigger and popover classes.
