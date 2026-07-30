<script lang="ts">
  import type { Column, ColumnDataType } from '../core/types'

  interface Props {
    column: Column<any, ColumnDataType>
  }

  let { column }: Props = $props()
</script>

<span class="flex select-none items-center gap-1 whitespace-nowrap px-2 font-medium">
  {#if column.icon}
    {@const Icon = column.icon}
    <Icon class="size-4 stroke-[2.25px]" />
  {/if}
  <span>{column.displayName}</span>
</span>
