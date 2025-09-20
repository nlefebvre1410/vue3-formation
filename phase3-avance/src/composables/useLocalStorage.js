import { ref, watch } from 'vue'

export function useLocalStorage(key, defaultValue) {
  const storedValue = localStorage.getItem(key)
  const initialValue = storedValue ? JSON.parse(storedValue) : defaultValue
  
  const value = ref(initialValue)

  // Surveiller les changements et sauvegarder dans localStorage
  watch(
    value,
    (newValue) => {
      localStorage.setItem(key, JSON.stringify(newValue))
    },
    { deep: true }
  )

  // Fonction pour réinitialiser à la valeur par défaut
  const reset = () => {
    value.value = defaultValue
    localStorage.removeItem(key)
  }

  return {
    value,
    reset
  }
}
