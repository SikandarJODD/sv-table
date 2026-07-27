import { onDestroy } from 'svelte'

export function useUnmount(callback: () => void) {
  onDestroy(callback)
}
