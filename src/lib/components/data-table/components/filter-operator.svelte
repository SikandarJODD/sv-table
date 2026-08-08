<script lang="ts">
  import { Button } from '$lib/components/ui/button'
  import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
  } from '$lib/components/ui/command'
  import {
    Popover,
    PopoverContent,
    PopoverTrigger,
  } from '$lib/components/ui/popover'

  import { filterTypeOperatorDetails } from '../core/operator'
  import type {
    Column,
    ColumnDataType,
    DataTableFilterActions,
    FilterModel,
  } from '../core/types'
  import { type Locale, t } from '../utils/i18n'

  interface OperatorOption {
    key: string
    target: string
    value: string
  }

  interface Props {
    column: Column<any, ColumnDataType>
    filter: FilterModel
    actions: DataTableFilterActions
    locale?: Locale
  }

  let { column, filter, actions, locale = 'en' }: Props = $props()

  let open = $state(false)
  let triggerRef = $state<HTMLButtonElement | null>(null)

  const currentOperator = $derived.by(() => {
    const operatorMap = filterTypeOperatorDetails[column.type] as Record<
      string,
      OperatorOption
    >

    return operatorMap[filter.operator]
  })

  const relatedOperators = $derived.by(() => {
    const operatorMap = filterTypeOperatorDetails[column.type] as Record<
      string,
      OperatorOption
    >

    const target = operatorMap[filter.operator]?.target

    return Object.values(operatorMap).filter((item) => item.target === target)
  })

  function changeOperator(value: string) {
    actions.setFilterOperator(filter.columnId, value as never)
    open = false
  }

  function handleCloseAutoFocus(event: Event) {
    if (!triggerRef) return

    event.preventDefault()
    triggerRef.focus({ preventScroll: true })
  }
</script>

<Popover bind:open={open}>
  <PopoverTrigger bind:ref={triggerRef}>
    {#snippet child({ props })}
      <Button
        {...props}
        variant="ghost"
        size="xs"
        class="h-full rounded-none px-2 text-xs"
      >
        <span class="text-muted-foreground">
          {t(currentOperator?.key ?? filter.operator, locale)}
        </span>
      </Button>
    {/snippet}
  </PopoverTrigger>

  <PopoverContent
    align="start"
    class="w-56 p-0"
    onCloseAutoFocus={handleCloseAutoFocus}
  >
    <Command loop disableInitialScroll>
      <CommandInput placeholder={t('search', locale)} />
      <CommandEmpty>{t('noresults', locale)}</CommandEmpty>
      <CommandList class="max-h-64">
        <CommandGroup heading={t('operators', locale)}>
          {#each relatedOperators as operator (operator.value)}
            <CommandItem
              value={operator.value}
              onSelect={() => changeOperator(operator.value)}
            >
              {t(operator.key, locale)}
            </CommandItem>
          {/each}
        </CommandGroup>
      </CommandList>
    </Command>
  </PopoverContent>
</Popover>
