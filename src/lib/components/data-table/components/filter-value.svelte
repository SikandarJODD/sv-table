<script lang="ts">
  import {
    getLocalTimeZone,
    parseDate,
    type DateValue,
  } from '@internationalized/date'
  import EllipsisIcon from '@lucide/svelte/icons/ellipsis'
  import { format } from 'date-fns'
  import { watch } from 'runed'

  import { Button } from '$lib/components/ui/button'
  import { Checkbox } from '$lib/components/ui/checkbox'
  import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
  } from '$lib/components/ui/command'
  import DebouncedInput from '$lib/components/ui/debounced-input'
  import {
    Popover,
    PopoverContent,
    PopoverTrigger,
  } from '$lib/components/ui/popover'
  import { RangeCalendar } from '$lib/components/ui/range-calendar'
  import { Slider } from '$lib/components/ui/slider'
  import { cn } from '$lib/utils'

  import { numberFilterOperators } from '../core/operator'
  import type {
    Column,
    ColumnDataType,
    ColumnOption,
    DataTableFilterActions,
    FilterModel,
    FilterStrategy,
  } from '../core/types'
  import { createDateRange, createNumberRange } from '../utils/helphers'
  import { type Locale, t } from '../utils/i18n'
  import {
    formatDateRangeLabel,
    pluralizeColumnName,
  } from './helpers'

  interface Props {
    filter?: FilterModel
    column: Column<any, ColumnDataType>
    actions: DataTableFilterActions
    strategy: FilterStrategy
    locale?: Locale
    inline?: boolean
  }

  let {
    filter,
    column,
    actions,
    strategy,
    locale = 'en',
    inline = false,
  }: Props = $props()

  let optionSearch = $state('')
  let numberSingle = $state('')
  let numberMin = $state('')
  let numberMax = $state('')
  let dateRangeValue = $state<{
    start: DateValue | undefined
    end: DateValue | undefined
  }>({
    start: undefined,
    end: undefined,
  })
  let datePlaceholder = $state<DateValue | undefined>(undefined)
  let numberSliderValue = $state(0)
  let numberRangeSliderValue = $state([0, 0])

  const values = $derived((filter?.values ?? []) as Array<string | number | Date>)

  const allOptions = $derived.by(() => {
    if (column.type !== 'option' && column.type !== 'multiOption') {
      return [] as ColumnOption[]
    }

    return column.getOptions()
  })

  const selectedOptions = $derived.by(() => {
    if (column.type !== 'option' && column.type !== 'multiOption') {
      return [] as ColumnOption[]
    }

    const selectedValues = new Set((filter?.values ?? []) as string[])

    return column
      .getOptions()
      .filter((option) => selectedValues.has(option.value))
  })

  const optionCounts = $derived.by(() => {
    if (column.type !== 'option' && column.type !== 'multiOption') {
      return undefined
    }

    return column.getFacetedUniqueValues()
  })

  const filteredOptions = $derived.by(() => {
    if (column.type !== 'option' && column.type !== 'multiOption') {
      return [] as ColumnOption[]
    }

    const search = optionSearch.trim().toLowerCase()

    if (!search) {
      return allOptions
    }

    return allOptions.filter((option) =>
      `${option.label} ${option.value}`.toLowerCase().includes(search),
    )
  })

  const numberMinMax = $derived.by(() => {
    if (column.type !== 'number') {
      return undefined
    }

    return column.getFacetedMinMaxValues()
  })

  const numberSliderStep = $derived.by(() => {
    if (!numberMinMax) {
      return 1
    }

    return getSliderStep(numberMinMax[0], numberMinMax[1])
  })

  const isNumberRange = $derived.by(() => {
    if (column.type !== 'number' || !filter) {
      return false
    }

    return numberFilterOperators[filter.operator as keyof typeof numberFilterOperators].target === 'multiple'
  })

  // Keep the inline form controls in sync when external filter state changes.
  watch(
    () => [column.type, filter?.values],
    () => {
      if (column.type === 'date') {
        const dateValues = (filter?.values ?? []) as Date[]
        dateRangeValue = {
          start: toDateValue(dateValues[0]),
          end: toDateValue(dateValues[1]),
        }
        datePlaceholder = toDateValue(dateValues[0])
      }

      if (column.type === 'number') {
        const numberValues = (filter?.values ?? []) as number[]
        numberSingle = numberValues[0]?.toString() ?? ''
        numberMin = numberValues[0]?.toString() ?? ''
        numberMax = numberValues[1]?.toString() ?? ''
        numberSliderValue = numberValues[0] ?? numberMinMax?.[0] ?? 0
        numberRangeSliderValue =
          numberValues.length >= 2
            ? createNumberRange(numberValues)
            : createNumberRange([
                numberValues[0] ?? numberMinMax?.[0] ?? 0,
                numberMinMax?.[1] ?? numberValues[0] ?? 0,
              ])
      }
    },
    { lazy: false }
  )

  function toDateValue(value?: Date) {
    return value ? parseDate(format(value, 'yyyy-MM-dd')) : undefined
  }

  function fromDateValue(value?: DateValue) {
    return value ? value.toDate(getLocalTimeZone()) : undefined
  }

  function toggleOption(value: string, checked: boolean) {
    if (checked) {
      actions.addFilterValue(
        column as Column<any, 'option' | 'multiOption'>,
        [value],
      )
      return
    }

    actions.removeFilterValue(
      column as Column<any, 'option' | 'multiOption'>,
      [value],
    )
  }

  function changeText(value: string | number | undefined) {
    const nextValue = String(value ?? '')

    if (!nextValue.trim()) {
      actions.removeFilter(column.id)
      return
    }

    actions.setFilterValue(column as Column<any, 'text'>, [nextValue])
  }

  function changeDateValue(value: {
    start: DateValue | undefined
    end: DateValue | undefined
  }) {
    dateRangeValue = value
    datePlaceholder = value.start ?? value.end ?? datePlaceholder

    const start = fromDateValue(value.start)
    const end = fromDateValue(value.end)

    if (!start && !end) {
      actions.removeFilter(column.id)
      return
    }

    if (start && end) {
      const nextValues = createDateRange([start, end])
      actions.setFilterValue(column as Column<any, 'date'>, nextValues)
      return
    }

    actions.setFilterValue(
      column as Column<any, 'date'>,
      [start ?? end].filter(Boolean) as Date[],
    )
  }

  function changeSingleNumber(value: string | number | undefined) {
    const nextValue = String(value ?? '').trim()

    numberSingle = nextValue

    if (!nextValue) {
      actions.removeFilter(column.id)
      return
    }

    const resolved = Number(nextValue)
    numberSliderValue = resolved
    actions.setFilterValue(column as Column<any, 'number'>, [resolved])
  }

  function changeRangeNumber(nextMin: string, nextMax: string) {
    numberMin = nextMin
    numberMax = nextMax

    const resolvedValues = [nextMin, nextMax]
      .filter((value) => value.trim() !== '')
      .map((value) => Number(value))

    if (resolvedValues.length === 0) {
      actions.removeFilter(column.id)
      return
    }

    const nextValues =
      resolvedValues.length === 1
        ? resolvedValues
        : createNumberRange(resolvedValues)

    if (nextValues.length >= 2) {
      numberRangeSliderValue = createNumberRange(nextValues)
    }

    actions.setFilterValue(column as Column<any, 'number'>, nextValues)
  }

  function changeSingleSlider(value: number) {
    numberSliderValue = value
    numberSingle = value.toString()
    actions.setFilterValue(column as Column<any, 'number'>, [value])
  }

  function changeRangeSlider(value: number[]) {
    const nextValues = createNumberRange(value)
    numberRangeSliderValue = nextValues
    numberMin = nextValues[0].toString()
    numberMax = nextValues[1].toString()
    actions.setFilterValue(column as Column<any, 'number'>, nextValues)
  }

  function setNumberMode(mode: 'single' | 'range') {
    const currentValues = (filter?.values ?? []) as number[]

    if (mode === 'single') {
      const value =
        currentValues[0] ??
        (numberSingle ? Number(numberSingle) : undefined) ??
        numberMinMax?.[0]

      actions.setFilterOperator(column.id, 'is')

      if (typeof value === 'number') {
        numberSingle = value.toString()
        numberSliderValue = value
        actions.setFilterValue(column as Column<any, 'number'>, [value])
      } else {
        actions.removeFilter(column.id)
      }

      return
    }

    const nextValues =
      currentValues.length >= 2
        ? createNumberRange(currentValues)
        : createNumberRange([
            currentValues[0] ?? numberMinMax?.[0] ?? 0,
            numberMinMax?.[1] ?? currentValues[0] ?? 0,
          ])

    numberMin = nextValues[0].toString()
    numberMax = nextValues[1].toString()
    numberRangeSliderValue = nextValues

    actions.setFilterOperator(column.id, 'is between')
    actions.setFilterValue(column as Column<any, 'number'>, nextValues)
  }

  function getSliderStep(min: number, max: number) {
    const range = Math.abs(max - min)

    if (!Number.isFinite(range) || range <= 0) {
      return 1
    }

    const roughStep = Math.max(1, Math.ceil(range / 200))
    const magnitude = 10 ** Math.max(0, Math.floor(Math.log10(roughStep)))
    const normalizedStep = roughStep / magnitude

    if (normalizedStep <= 1) return magnitude
    if (normalizedStep <= 2) return magnitude * 2
    if (normalizedStep <= 5) return magnitude * 5
    return magnitude * 10
  }
</script>

{#snippet ValueDisplay()}
  {#if column.type === 'option' || column.type === 'multiOption'}
    {#if selectedOptions.length === 0}
      <EllipsisIcon class="size-4 text-muted-foreground" />
    {:else if selectedOptions.length === 1}
      {@const option = selectedOptions[0]}

      <span class="inline-flex items-center gap-1.5">
        {#if option.icon}
          {@const Icon = option.icon}
          <Icon class="size-4 text-primary" />
        {/if}
        <span>{option.label}</span>
      </span>
    {:else}
      {@const hasIcons = selectedOptions.every((option) => option.icon)}

      <span class="inline-flex items-center gap-1.5">
        {#if hasIcons}
          <span class="inline-flex items-center gap-0.5">
            {#each selectedOptions.slice(0, 3) as option (option.value)}
              {@const Icon = option.icon!}
              <Icon class="size-4 text-primary" />
            {/each}
          </span>
        {/if}

        <span class={cn(hasIcons && 'ml-1')}>
          {selectedOptions.length} {column.type === 'option'
            ? pluralizeColumnName(column.displayName)
            : column.displayName.toLowerCase()}
        </span>
      </span>
    {/if}
  {:else if column.type === 'date'}
    {#if values.length === 0}
      <EllipsisIcon class="size-4 text-muted-foreground" />
    {:else if values.length === 1}
      <span>{format(values[0] as Date, 'MMM d, yyyy')}</span>
    {:else}
      <span>{formatDateRangeLabel(values[0] as Date, values[1] as Date)}</span>
    {/if}
  {:else if column.type === 'text'}
    {#if values.length === 0 || !String(values[0] ?? '').trim()}
      <EllipsisIcon class="size-4 text-muted-foreground" />
    {:else}
      <span>{String(values[0])}</span>
    {/if}
  {:else if column.type === 'number'}
    {#if values.length === 0}
      <EllipsisIcon class="size-4 text-muted-foreground" />
    {:else if isNumberRange && values.length > 1}
      <span class="tabular-nums tracking-tight">
        {values[0]} {t('and', locale)} {values[1]}
      </span>
    {:else}
      <span class="tabular-nums tracking-tight">{values[0]}</span>
    {/if}
  {/if}
{/snippet}

{#snippet ValueController()}
  {#if column.type === 'option' || column.type === 'multiOption'}
    <Command loop shouldFilter={false}>
      <CommandInput bind:value={optionSearch} placeholder={t('search', locale)} />
        <CommandEmpty>{t('noresults', locale)}</CommandEmpty>
      <CommandList class="max-h-64">
        <CommandGroup>
          {#each filteredOptions as option (option.value)}
            {@const checked = (filter?.values ?? []).includes(option.value)}
            {@const count = optionCounts?.get(option.value) ?? 0}

            <CommandItem
              value={option.value}
              keywords={[option.label, option.value]}
              onSelect={() => toggleOption(option.value, !checked)}
              class="gap-3"
            >
              <Checkbox
                checked={checked}
                aria-hidden="true"
                class="pointer-events-none"
                tabindex={-1}
              />

              {#if option.icon}
                {@const Icon = option.icon}
                <Icon class="size-4 text-primary" />
              {/if}

              <span>
                {option.label}
                <sup
                  class={cn(
                    'ml-0.5 tabular-nums tracking-tight text-muted-foreground',
                    count === 0 && 'slashed-zero',
                  )}
                >
                  {count < 100 ? count : '100+'}
                </sup>
              </span>
            </CommandItem>
          {/each}
        </CommandGroup>
      </CommandList>
    </Command>
  {:else if column.type === 'date'}
    <div class="flex w-fit flex-col gap-3 p-0">
      <RangeCalendar
        bind:value={dateRangeValue}
        bind:placeholder={datePlaceholder}
        numberOfMonths={1}
        onValueChange={changeDateValue}
      />
    </div>
  {:else if column.type === 'text'}
    <div class="w-72 p-2">
      <DebouncedInput
        autofocus
        placeholder={t('search', locale)}
        value={String(values[0] ?? '')}
        onChange={changeText}
      />
    </div>
  {:else if column.type === 'number'}
    <div class="flex w-72 flex-col gap-3 p-3">
      <div class="inline-flex rounded-md border border-border p-1">
        <Button
          variant={isNumberRange ? 'ghost' : 'secondary'}
          size="xs"
          class="flex-1"
          onclick={() => setNumberMode('single')}
        >
          {t('single', locale)}
        </Button>
        <Button
          variant={isNumberRange ? 'secondary' : 'ghost'}
          size="xs"
          class="flex-1"
          onclick={() => setNumberMode('range')}
        >
          {t('range', locale)}
        </Button>
      </div>

      {#if numberMinMax}
        <p class="text-xs text-muted-foreground">
          {t('min', locale)}: {numberMinMax[0]} - {t('max', locale)}: {numberMinMax[1]}
        </p>
      {/if}

      <div hidden={!isNumberRange} aria-hidden={!isNumberRange} class="grid grid-cols-2 gap-3">
          {#if numberMinMax}
            <div class="col-span-2">
              <Slider
                type="multiple"
                min={numberMinMax[0]}
                max={numberMinMax[1]}
                step={numberSliderStep}
                bind:value={numberRangeSliderValue}
                onValueCommit={changeRangeSlider}
              />
            </div>
          {/if}

          <div class="grid gap-1.5">
            <span class="text-xs font-medium text-muted-foreground">{t('min', locale)}</span>
            <DebouncedInput
              type="number"
              value={numberMin}
              onChange={(value: string | number | undefined) =>
                changeRangeNumber(String(value ?? ''), numberMax)}
            />
          </div>

          <div class="grid gap-1.5">
            <span class="text-xs font-medium text-muted-foreground">{t('max', locale)}</span>
            <DebouncedInput
              type="number"
              value={numberMax}
              onChange={(value: string | number | undefined) =>
                changeRangeNumber(numberMin, String(value ?? ''))}
            />
          </div>
      </div>

      <div hidden={isNumberRange} aria-hidden={isNumberRange} class="grid gap-1.5">
          {#if numberMinMax}
            <Slider
              type="single"
              min={numberMinMax[0]}
              max={numberMinMax[1]}
              step={numberSliderStep}
              bind:value={numberSliderValue}
              onValueCommit={changeSingleSlider}
            />
          {/if}

          <span class="text-xs font-medium text-muted-foreground">{t('value', locale)}</span>
          <DebouncedInput
            type="number"
            value={numberSingle}
            onChange={changeSingleNumber}
          />
      </div>
    </div>
  {/if}
{/snippet}

{#if inline}
  {@render ValueController()}
{:else}
  <Popover>
    <PopoverTrigger>
      {#snippet child({ props })}
        <Button
          {...props}
          variant="ghost"
          size="xs"
          class="h-full rounded-none px-2 text-xs"
        >
          {@render ValueDisplay()}
        </Button>
      {/snippet}
    </PopoverTrigger>

    <PopoverContent align="start" class="w-fit p-0">
      {@render ValueController()}
    </PopoverContent>
  </Popover>
{/if}
