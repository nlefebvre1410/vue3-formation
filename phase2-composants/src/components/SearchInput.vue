<template>
  <div class="search-input">
    <div class="search-wrapper">
      <input
        ref="searchInputRef"
        v-model="searchValue"
        type="text"
        :placeholder="placeholder"
        class="search-field"
        @focus="isFocused = true"
        @blur="isFocused = false"
        @keyup.escape="clearSearch"
      >
      <div class="search-icons">
        <span v-if="!searchValue" class="search-icon">🔍</span>
        <button
          v-else
          type="button"
          class="clear-button"
          @click="clearSearch"
          title="Effacer la recherche"
        >
          ✕
        </button>
      </div>
    </div>
    
    <!-- Indicateur de recherche active -->
    <div v-if="isSearching" class="search-indicator">
      <span class="loading-spinner"></span>
      <span>Recherche en cours...</span>
    </div>
    
    <!-- Résultats de recherche -->
    <div v-if="searchValue && showResults" class="search-results">
      <div class="results-header">
        <span class="results-count">{{ resultsCount }} résultat{{ resultsCount > 1 ? 's' : '' }}</span>
        <button 
          type="button" 
          class="close-results" 
          @click="showResults = false"
          title="Fermer les résultats"
        >
          ✕
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, watch } from 'vue'

export default {
  name: 'SearchInput',
  props: {
    // Valeur de recherche (v-model)
    modelValue: {
      type: String,
      default: ''
    },
    // Placeholder du champ
    placeholder: {
      type: String,
      default: 'Rechercher...'
    },
    // Délai de debounce en millisecondes
    debounceDelay: {
      type: Number,
      default: 300,
      validator(value) {
        return value >= 0 && value <= 2000
      }
    },
    // Nombre minimum de caractères pour déclencher la recherche
    minLength: {
      type: Number,
      default: 2,
      validator(value) {
        return value >= 0 && value <= 10
      }
    },
    // Nombre de résultats trouvés (pour affichage)
    resultsCount: {
      type: Number,
      default: 0
    },
    // Afficher l'indicateur de chargement
    loading: {
      type: Boolean,
      default: false
    }
  },
  emits: ['update:modelValue', 'search', 'clear'],
  setup(props, { emit }) {
    const searchInputRef = ref(null)
    const searchValue = ref(props.modelValue)
    const isFocused = ref(false)
    const showResults = ref(false)
    const debounceTimer = ref(null)

    // État de recherche en cours
    const isSearching = computed(() => {
      return props.loading && searchValue.value.length >= props.minLength
    })

    // Fonction de debounce
    const debouncedSearch = (value) => {
      // Annuler le timer précédent
      if (debounceTimer.value) {
        clearTimeout(debounceTimer.value)
      }

      // Créer un nouveau timer
      debounceTimer.value = setTimeout(() => {
        if (value.length >= props.minLength) {
          emit('search', value)
          showResults.value = true
        } else if (value.length === 0) {
          emit('clear')
          showResults.value = false
        }
      }, props.debounceDelay)
    }

    // Watcher pour la valeur de recherche
    watch(searchValue, (newValue) => {
      // Émettre immédiatement pour v-model
      emit('update:modelValue', newValue)
      
      // Déclencher la recherche avec debounce
      debouncedSearch(newValue)
    })

    // Watcher pour les changements externes (v-model)
    watch(() => props.modelValue, (newValue) => {
      if (newValue !== searchValue.value) {
        searchValue.value = newValue
      }
    })

    // Méthodes
    const clearSearch = () => {
      searchValue.value = ''
      showResults.value = false
      emit('clear')
      
      // Remettre le focus sur l'input
      if (searchInputRef.value) {
        searchInputRef.value.focus()
      }
    }

    const focusInput = () => {
      if (searchInputRef.value) {
        searchInputRef.value.focus()
      }
    }

    return {
      searchInputRef,
      searchValue,
      isFocused,
      showResults,
      isSearching,
      clearSearch,
      focusInput
    }
  }
}
</script>

<style scoped>
.search-input {
  position: relative;
  width: 100%;
}

.search-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.search-field {
  width: 100%;
  padding: 0.75rem 3rem 0.75rem 1rem;
  border: 2px solid #e9ecef;
  border-radius: 10px;
  font-size: 1rem;
  transition: all 0.3s ease;
  background: white;
}

.search-field:focus {
  outline: none;
  border-color: #42b883;
  box-shadow: 0 0 0 3px rgba(66, 184, 131, 0.1);
}

.search-field:hover {
  border-color: #42b883;
}

.search-icons {
  position: absolute;
  right: 1rem;
  display: flex;
  align-items: center;
}

.search-icon {
  color: #6c757d;
  font-size: 1.1rem;
}

.clear-button {
  background: #dc3545;
  color: white;
  border: none;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 0.8rem;
  transition: all 0.2s ease;
}

.clear-button:hover {
  background: #c82333;
  transform: scale(1.1);
}

.search-indicator {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 0.5rem;
  padding: 0.5rem;
  background: #f8f9fa;
  border-radius: 8px;
  font-size: 0.9rem;
  color: #6c757d;
}

.loading-spinner {
  width: 16px;
  height: 16px;
  border: 2px solid #e9ecef;
  border-top: 2px solid #42b883;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.search-results {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: white;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  margin-top: 0.25rem;
}

.results-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 1rem;
  border-bottom: 1px solid #e9ecef;
  background: #f8f9fa;
  border-radius: 8px 8px 0 0;
}

.results-count {
  font-size: 0.9rem;
  color: #6c757d;
  font-weight: 500;
}

.close-results {
  background: none;
  border: none;
  color: #6c757d;
  cursor: pointer;
  font-size: 1.2rem;
  padding: 0;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  transition: all 0.2s ease;
}

.close-results:hover {
  background: #e9ecef;
  color: #495057;
}

/* Responsive */
@media (max-width: 768px) {
  .search-field {
    padding: 0.6rem 2.5rem 0.6rem 0.8rem;
    font-size: 0.9rem;
  }
  
  .search-icons {
    right: 0.8rem;
  }
}
</style>
