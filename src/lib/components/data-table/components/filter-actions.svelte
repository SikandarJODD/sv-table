<script lang="ts">
  import FilterXIcon from '@lucide/svelte/icons/filter-x'

  import { Button } from '$lib/components/ui/button'

  import type { DataTableFilterActions } from '../core/types'
  import { type Locale, t } from '../utils/i18n'

  interface Props {
    hasFilters: boolean
    actions?: DataTableFilterActions
    locale?: Locale
  }

  let { hasFilters, actions, locale = 'en' }: Props = $props()
</script>

{#if hasFilters}
  <Button
    variant="destructive"
    size="xs"
    class="h-7 px-2"
    onclick={actions?.removeAllFilters}
  >
    <FilterXIcon class="size-4" />
    <span class="hidden md:inline">{t('clear', locale)}</span>
  </Button>
{/if}
