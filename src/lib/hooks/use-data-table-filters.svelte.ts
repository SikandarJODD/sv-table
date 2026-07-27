import { DEFAULT_OPERATORS, determineNewOperator } from '../components/data-table/core/operator'
import { createColumns as createDataTableColumns } from '../components/data-table/core/filters'
import type {
  Column,
  ColumnConfig,
  ColumnDataType,
  ColumnOption,
  DataTableFilterActions,
  FilterModel,
  FilterStrategy,
  FiltersState,
  NumberColumnIds,
  OptionBasedColumnDataType,
  OptionColumnIds,
} from '../components/data-table/core/types'
import { addUniq, removeUniq, uniq } from '../components/data-table/utils/array'
import {
  createDateFilterValue,
  createNumberFilterValue,
  isColumnOptionArray,
  isColumnOptionMap,
  isMinMaxTuple,
} from '../components/data-table/utils/helphers'

export interface DataTableFiltersOptions<
  TData,
  TColumns extends ReadonlyArray<ColumnConfig<TData, any, any, any>>,
  TStrategy extends FilterStrategy,
> {
  strategy: TStrategy
  data: TData[]
  columnsConfig: TColumns
  defaultFilters?: FiltersState
  filters?: FiltersState
  options?: Partial<
    Record<OptionColumnIds<TColumns>, ColumnOption[] | undefined>
  >
  faceted?: Partial<
    | Record<OptionColumnIds<TColumns>, Map<string, number> | undefined>
    | Record<NumberColumnIds<TColumns>, [number, number] | undefined>
  >
}

export type SvelteDataTableFilterActions = DataTableFilterActions

type EnhancedColumn<TData> = ColumnConfig<TData, any, any, any>

function createColumns<
  TData,
>(
  columnsConfig: ReadonlyArray<ColumnConfig<TData, any, any, any>>,
  options?: Partial<Record<string, ColumnOption[] | undefined>>,
  faceted?: Partial<
    | Record<string, Map<string, number> | undefined>
    | Record<string, [number, number] | undefined>
  >,
): EnhancedColumn<TData>[] {
  return columnsConfig.map((config) => {
    let nextConfig: EnhancedColumn<TData> = config

    if (options && (config.type === 'option' || config.type === 'multiOption')) {
      const columnOptions = options[config.id]
      if (columnOptions && isColumnOptionArray(columnOptions)) {
        nextConfig = { ...nextConfig, options: columnOptions }
      }
    }

    if (faceted && (config.type === 'option' || config.type === 'multiOption')) {
      const facetedOptions = faceted[config.id]
      if (facetedOptions && isColumnOptionMap(facetedOptions)) {
        nextConfig = { ...nextConfig, facetedOptions }
      }
    }

    if (faceted && config.type === 'number') {
      const minMax = faceted[config.id]
      if (minMax && isMinMaxTuple(minMax)) {
        nextConfig = { ...nextConfig, min: minMax[0], max: minMax[1] }
      }
    }

    return nextConfig
  })
}

class DataTableFiltersController<
  TData,
  TColumns extends ReadonlyArray<ColumnConfig<TData, any, any, any>>,
  TStrategy extends FilterStrategy,
> {
  columns: Column<TData>[]
  filters = $state<FiltersState>([])
  strategy: TStrategy

  constructor({
    strategy,
    data,
    columnsConfig,
    defaultFilters,
    filters,
    options,
    faceted,
  }: DataTableFiltersOptions<TData, TColumns, TStrategy>) {
    this.strategy = strategy
    const enhancedColumns = createColumns(columnsConfig, options, faceted)
    this.columns = createDataTableColumns(data, enhancedColumns, strategy)
    this.filters = [...(filters ?? defaultFilters ?? [])]
  }

  updateFilters = (updater: (filters: FiltersState) => FiltersState) => {
    this.filters = updater(this.filters)
  }

  actions: SvelteDataTableFilterActions = {
    addFilterValue: (column, values) => {
      if (column.type !== 'option' && column.type !== 'multiOption') {
        throw new Error(
          '[data-table-filter] addFilterValue() is only supported for option columns',
        )
      }

      this.updateFilters((current) => {
        const filter = current.find((item) => item.columnId === column.id)
        if (!filter || filter.values.length === 0) {
          return [
            ...current,
            {
              columnId: column.id,
              type: column.type,
              operator:
                values.length > 1
                  ? DEFAULT_OPERATORS[column.type].multiple
                  : DEFAULT_OPERATORS[column.type].single,
              values,
            },
          ]
        }

        const newValues = addUniq(filter.values, values)
        const newOperator = determineNewOperator(
          column.type,
          filter.values as any,
          newValues as any,
          filter.operator as any,
        )

        if (column.type === 'multiOption' && newValues.length === 0) {
          return current.filter((item) => item.columnId !== column.id)
        }

        return current.map((item) =>
          item.columnId === column.id
            ? {
                columnId: column.id,
                type: column.type,
                operator: newOperator,
                values: newValues,
              }
            : item,
        )
      })
    },
    removeFilterValue: (column, value) => {
      if (column.type !== 'option' && column.type !== 'multiOption') {
        throw new Error(
          '[data-table-filter] removeFilterValue() is only supported for option columns',
        )
      }

      this.updateFilters((current) => {
        const filter = current.find((item) => item.columnId === column.id)
        if (!filter || filter.values.length === 0) {
          return current
        }

        const newValues = removeUniq(filter.values, value)
        const newOperator = determineNewOperator(
          column.type,
          filter.values as any,
          newValues as any,
          filter.operator as any,
        )

        if (newValues.length === 0) {
          return current.filter((item) => item.columnId !== column.id)
        }

        return current.map((item) =>
          item.columnId === column.id
            ? {
                columnId: column.id,
                type: column.type,
                operator: newOperator,
                values: newValues,
              }
            : item,
        )
      })
    },
    setFilterValue: (column, values) => {
      this.updateFilters((current) => {
        const filter = current.find((item) => item.columnId === column.id)
        const newValues =
          column.type === 'number'
            ? createNumberFilterValue(values as number[])
            : column.type === 'date'
              ? createDateFilterValue(
                  values as [Date, Date] | [Date] | [] | undefined,
                )
              : uniq(values)

        if (newValues.length === 0) {
          return current
        }

        if (!filter || filter.values.length === 0) {
          return [
            ...current,
            {
              columnId: column.id,
              type: column.type,
              operator:
                values.length > 1
                  ? DEFAULT_OPERATORS[column.type].multiple
                  : DEFAULT_OPERATORS[column.type].single,
              values: newValues as FilterModel<typeof column.type>['values'],
            },
          ]
        }

        const newOperator = determineNewOperator(
          column.type,
          filter.values as any,
          newValues as any,
          filter.operator as any,
        )

        return current.map((item) =>
          item.columnId === column.id
            ? {
                columnId: column.id,
                type: column.type,
                operator: newOperator,
                values: newValues,
              }
            : item,
        )
      })
    },
    setFilterOperator: (columnId, operator) => {
      this.updateFilters((current) =>
        current.map((item) =>
          item.columnId === columnId ? { ...item, operator } : item,
        ),
      )
    },
    removeFilter: (columnId) => {
      this.updateFilters((current) =>
        current.filter((item) => item.columnId !== columnId),
      )
    },
    removeAllFilters: () => {
      this.filters = []
    },
  }
}

export function createFilters<
  TData,
  TColumns extends ReadonlyArray<ColumnConfig<TData, any, any, any>>,
  TStrategy extends FilterStrategy,
>(options: DataTableFiltersOptions<TData, TColumns, TStrategy>) {
  return new DataTableFiltersController(options)
}
