<script lang="ts">
  import XIcon from '@lucide/svelte/icons/x'

  import { Button } from '$lib/components/ui/button'
  import { Separator } from '$lib/components/ui/separator'

  import { getColumn } from '../utils/helphers'
  import type {
    Column,
    DataTableFilterActions,
    FilterStrategy,
    FiltersState,
  } from '../core/types'
  import type { Locale } from '../utils/i18n'
  import FilterOperator from './filter-operator.svelte'
  import FilterSubject from './filter-subject.svelte'
  import FilterValue from './filter-value.svelte'

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
</script>

{#each filters as filter (filter.columnId)}
  {@const column = getColumn(columns, filter.columnId)}

  <div class="flex h-7 items-center rounded-2xl border border-border bg-background text-xs shadow-xs">
    <FilterSubject {column} />
    <Separator orientation="vertical" />
    <FilterOperator {column} {filter} {actions} {locale} />
    <Separator orientation="vertical" />
    <FilterValue {column} {filter} {actions} {strategy} {locale} />
    <Separator orientation="vertical" />
    <Button
      variant="ghost"
      size="icon-xs"
      class="h-full rounded-none rounded-r-2xl"
      onclick={() => actions.removeFilter(filter.columnId)}
    >
      <XIcon class="size-4" />
    </Button>
  </div>
{/each}
