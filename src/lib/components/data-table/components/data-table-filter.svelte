<script lang="ts">
  import type {
    Column,
    DataTableFilterActions,
    FilterStrategy,
    FiltersState,
  } from '../core/types'
  import type { Locale } from '../utils/i18n'
  import ActiveFilters from './active-filters.svelte'
  import FilterActions from './filter-actions.svelte'
  import FilterSelector from './filter-selector.svelte'

  interface Props {
    columns: Column<any>[]
    filters: FiltersState
    actions: DataTableFilterActions
    strategy: FilterStrategy
    locale?: Locale
  }

  let {
    columns,
    filters,
    actions,
    strategy,
    locale = 'en',
  }: Props = $props()

  const hasFilters = $derived(filters.length > 0)
</script>

<div class="flex w-full flex-col gap-2 md:flex-row md:items-start md:justify-between">
  <div class="flex min-w-0 flex-1 flex-wrap items-start gap-2">
    <FilterSelector {columns} {filters} {actions} {strategy} {locale} />

    <div class="flex min-w-0 flex-1 gap-2 overflow-x-auto pb-1 md:flex-wrap md:overflow-visible md:pb-0">
      <ActiveFilters {columns} {filters} {actions} {strategy} {locale} />
    </div>
  </div>

  <FilterActions hasFilters={hasFilters} {actions} {locale} />
</div>
