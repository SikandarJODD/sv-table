<script lang="ts">
  import ArrowRightIcon from '@lucide/svelte/icons/arrow-right'
  import ChevronRightIcon from '@lucide/svelte/icons/chevron-right'
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
    CommandSeparator,
  } from '$lib/components/ui/command'
  import {
    Popover,
    PopoverContent,
    PopoverTrigger,
  } from '$lib/components/ui/popover'
  import { cn } from '$lib/utils'

  import type {
    Column,
    ColumnDataType,
    DataTableFilterActions,
    FilterStrategy,
    FiltersState,
  } from '../core/types'
  import { type Locale, t } from '../utils/i18n'
  import { getFilter } from './helpers'
  import FilterValue from './filter-value.svelte'
	import FunnelIcon from '@lucide/svelte/icons/funnel';

  interface Props {
    filters: FiltersState
    columns: Column<any>[]
    actions: DataTableFilterActions
    strategy: FilterStrategy
    locale?: Locale
  }

  let {
    filters,
    columns,
    actions,
    strategy,
    locale = 'en',
  }: Props = $props()

  let open = $state(false)
  let search = $state('')
  let propertyId = $state<string | undefined>(undefined)

  const hasFilters = $derived(filters.length > 0)

  const selectedColumn = $derived(
    propertyId ? columns.find((column) => column.id === propertyId) : undefined,
  )

  const selectedFilter = $derived(
    propertyId ? getFilter(filters, propertyId) : undefined,
  )

  const searchableOptionColumns = $derived(
    columns.filter((column) =>
      column.type === 'option' || column.type === 'multiOption',
    ),
  )

  watch(
    () => open,
    (isOpen) => {
      if (isOpen) return

      propertyId = undefined
      search = ''
    }
  )

  function prefetchColumn(column: Column<any, ColumnDataType>) {
    void column.prefetchOptions()
    void column.prefetchValues()
    void column.prefetchFacetedUniqueValues()
    void column.prefetchFacetedMinMaxValues()
  }

  function selectColumn(columnId: string) {
    propertyId = columnId
    search = ''
  }

  function toggleQuickFilter(
    column: Column<any, 'option' | 'multiOption'>,
    value: string,
    checked: boolean,
  ) {
    if (checked) {
      actions.addFilterValue(column, [value])
      return
    }

    actions.removeFilterValue(column, [value])
  }
</script>

<Popover bind:open={open}>
  <PopoverTrigger>
    {#snippet child({ props })}
      <Button
        {...props}
        variant="outline"
        size={hasFilters ? 'icon-sm' : 'sm'}
        class={cn('h-7 transition-none')}
      >
         <FunnelIcon class="size-4" />
        {#if !hasFilters}
          <span>{t('filter', locale)}</span>
        {/if}
      </Button>
    {/snippet}
  </PopoverTrigger>

  <PopoverContent align="start" class="w-fit p-0 gap-0">
    {#if selectedColumn}
      <div class="border-b border-border px-2 py-1.5">
        <Button
          variant="ghost"
          size="xs"
          class="h-7 px-2 text-xs"
          onclick={() => (propertyId = undefined)}
        >
          Change column
        </Button>
      </div>

      <FilterValue
        inline
        filter={selectedFilter}
        column={selectedColumn}
        {actions}
        {strategy}
        {locale}
      />
    {:else}
      <Command
        loop
        filter={(value, nextSearch, keywords) => {
          const haystack = `${value} ${keywords?.join(' ') ?? ''}`.toLowerCase()
          return haystack.includes(nextSearch.toLowerCase()) ? 1 : 0
        }}
      >
        <CommandInput bind:value={search} placeholder={t('search', locale)} />
        <CommandEmpty>{t('noresults', locale)}</CommandEmpty>

        <CommandList class="max-h-72">
          <CommandGroup>
            {#each columns as column (column.id)}
              <CommandItem
                value={column.id}
                keywords={[column.displayName]}
                onSelect={() => selectColumn(column.id)}
                onmouseenter={() => prefetchColumn(column)}
                class="group"
              >
                <div class="flex w-full items-center justify-between">
                  <span class="inline-flex items-center gap-1.5">
                    {#if column.icon}
                      {@const Icon = column.icon}
                      <Icon class="size-4" />
                    {/if}
                    <span>{column.displayName}</span>
                  </span>

                  <ArrowRightIcon class="size-4 opacity-0 transition-opacity group-data-[selected=true]:opacity-100" />
                </div>
              </CommandItem>
            {/each}
          </CommandGroup>

          {#if search.trim().length >= 2}
            <CommandSeparator />

            <CommandGroup heading="Quick filters">
              {#each searchableOptionColumns as column (column.id)}
                {@const optionCounts = column.getFacetedUniqueValues()}
                {@const matchingOptions = column
                  .getOptions()
                  .filter((option) =>
                    `${option.label} ${option.value}`.toLowerCase().includes(search.trim().toLowerCase()),
                  )}
                {@const activeFilter = getFilter(filters, column.id)}

                {#each matchingOptions as option (`${column.id}-${option.value}`)}
                  {@const checked = Boolean(activeFilter?.values.includes(option.value))}
                  {@const count = optionCounts?.get(option.value) ?? 0}

                  <CommandItem
                    value={`${column.id}:${option.value}`}
                    keywords={[column.displayName, option.label, option.value]}
                    onSelect={() =>
                      toggleQuickFilter(
                        column as Column<any, 'option' | 'multiOption'>,
                        option.value,
                        !checked,
                      )}
                    class="gap-3"
                  >
                    <Checkbox
                      checked={checked}
                      disabled
                      aria-hidden="true"
                      class="pointer-events-none"
                      tabindex={-1}
                    />

                    {#if option.icon}
                      {@const Icon = option.icon}
                      <Icon class="size-4 text-primary" />
                    {/if}

                    <span class="inline-flex items-center gap-1 text-sm">
                      <span class="text-muted-foreground">{column.displayName}</span>
                      <ChevronRightIcon class="size-3.5 text-muted-foreground/75" />
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
                    </span>
                  </CommandItem>
                {/each}
              {/each}
            </CommandGroup>
          {/if}
        </CommandList>
      </Command>
    {/if}
  </PopoverContent>
</Popover>
