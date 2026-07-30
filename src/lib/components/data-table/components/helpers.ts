import { format } from 'date-fns'
import type { FilterModel, FiltersState } from '../core/types'

export function getFilter(
  filters: FiltersState,
  columnId: string,
): FilterModel | undefined {
  return filters.find((filter) => filter.columnId === columnId)
}

export function pluralizeColumnName(name: string) {
  const normalized = name.trim().toLowerCase()

  if (normalized.endsWith('s')) {
    return `${normalized}es`
  }

  return `${normalized}s`
}

export function formatDateRangeLabel(start: Date, end: Date) {
  const sameMonth = start.getMonth() === end.getMonth()
  const sameYear = start.getFullYear() === end.getFullYear()

  if (sameMonth && sameYear) {
    return `${format(start, 'MMM d')} - ${format(end, 'd, yyyy')}`
  }

  if (sameYear) {
    return `${format(start, 'MMM d')} - ${format(end, 'MMM d, yyyy')}`
  }

  return `${format(start, 'MMM d, yyyy')} - ${format(end, 'MMM d, yyyy')}`
}

export function toDateInputValue(value?: Date) {
  return value ? format(value, 'yyyy-MM-dd') : ''
}

export function fromDateInputValue(value: string) {
  if (!value) return undefined

  const [year, month, day] = value.split('-').map(Number)

  if (
    Number.isNaN(year) ||
    Number.isNaN(month) ||
    Number.isNaN(day)
  ) {
    return undefined
  }

  return new Date(year, month - 1, day)
}
