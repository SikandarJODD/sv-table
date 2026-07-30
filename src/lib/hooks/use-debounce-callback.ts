import { debounce } from '../components/data-table/utils/debounce'
import { useUnmount } from './use-unmount'

export type DebounceOptions = {
  leading?: boolean
  trailing?: boolean
  maxWait?: number
}

type ControlFunctions = {
  cancel: () => void
  flush: () => void
  isPending: () => boolean
}

export type DebouncedState<T extends (...args: any[]) => ReturnType<T>> = ((
  ...args: Parameters<T>
) => ReturnType<T> | undefined) &
  ControlFunctions

export function useDebounceCallback<T extends (...args: any[]) => ReturnType<T>>(
  func: T,
  delay = 500,
  options: DebounceOptions = {},
): DebouncedState<T> {
  const debounced = debounce(func, delay, options) as DebouncedState<T>

  useUnmount(() => {
    debounced.cancel()
  })

  return debounced
}
