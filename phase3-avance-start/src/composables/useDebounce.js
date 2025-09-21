import { ref, watch } from 'vue'

export function useDebounce(value, delay = 300) {
  const debouncedValue = ref(value.value)

  watch(value, (newValue) => {
    const timer = setTimeout(() => {
      debouncedValue.value = newValue
    }, delay)

    return () => clearTimeout(timer)
  })

  return debouncedValue
}

export function useDebouncedFunction(fn, delay = 300) {
  let timeoutId = null

  return (...args) => {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => fn(...args), delay)
  }
}
