<template>
  <div class="sort-selector">
    <label class="sort-label">
      <span class="label-text">{{ label }}</span>
      <div class="sort-controls">
        <select 
          v-model="currentSortBy"
          class="sort-select"
          @change="updateSort"
        >
          <option value="">{{ defaultText }}</option>
          <option 
            v-for="option in sortOptions" 
            :key="option.value" 
            :value="option.value"
          >
            {{ option.label }}
          </option>
        </select>
        
        <button
          v-if="currentSortBy"
          type="button"
          class="sort-direction-btn"
          @click="toggleDirection"
          :title="`Trier par ${currentDirection === 'asc' ? 'ordre décroissant' : 'ordre croissant'}`"
        >
          <span class="sort-icon">
            {{ currentDirection === 'asc' ? '↑' : '↓' }}
          </span>
        </button>
        
        <button
          v-if="currentSortBy"
          type="button"
          class="sort-reset-btn"
          @click="resetSort"
          title="Supprimer le tri"
        >
          ✕
        </button>
      </div>
    </label>
    
    <!-- Indicateur de tri actif -->
    <div v-if="currentSortBy" class="sort-indicator">
      <span class="sort-info">
        Trié par <strong>{{ getCurrentOptionLabel() }}</strong>
        ({{ currentDirection === 'asc' ? 'croissant' : 'décroissant' }})
      </span>
    </div>
  </div>
</template>

<script>
import { ref, computed, watch } from 'vue'

export default {
  name: 'SortSelector',
  props: {
    // Valeur actuelle du tri (v-model)
    modelValue: {
      type: Object,
      default: () => ({ sortBy: '', direction: 'asc' })
    },
    // Options de tri disponibles
    options: {
      type: Array,
      required: true,
      validator(options) {
        return options.every(option => 
          option.value && option.label && typeof option.value === 'string'
        )
      }
    },
    // Label du composant
    label: {
      type: String,
      default: 'Trier par :'
    },
    // Texte par défaut
    defaultText: {
      type: String,
      default: 'Aucun tri'
    },
    // Direction par défaut
    defaultDirection: {
      type: String,
      default: 'asc',
      validator(value) {
        return ['asc', 'desc'].includes(value)
      }
    },
    // Afficher l'indicateur de tri
    showIndicator: {
      type: Boolean,
      default: true
    }
  },
  emits: ['update:modelValue', 'sort-change'],
  setup(props, { emit }) {
    const currentSortBy = ref(props.modelValue.sortBy || '')
    const currentDirection = ref(props.modelValue.direction || props.defaultDirection)

    // Options de tri avec validation
    const sortOptions = computed(() => {
      return props.options.filter(option => 
        option.value && option.label
      )
    })

    // Watcher pour les changements externes
    watch(() => props.modelValue, (newValue) => {
      if (newValue) {
        currentSortBy.value = newValue.sortBy || ''
        currentDirection.value = newValue.direction || props.defaultDirection
      }
    }, { deep: true })

    // Méthodes
    const updateSort = () => {
      const sortConfig = {
        sortBy: currentSortBy.value,
        direction: currentDirection.value
      }
      
      emit('update:modelValue', sortConfig)
      emit('sort-change', sortConfig)
    }

    const toggleDirection = () => {
      currentDirection.value = currentDirection.value === 'asc' ? 'desc' : 'asc'
      updateSort()
    }

    const resetSort = () => {
      currentSortBy.value = ''
      currentDirection.value = props.defaultDirection
      
      const sortConfig = {
        sortBy: '',
        direction: props.defaultDirection
      }
      
      emit('update:modelValue', sortConfig)
      emit('sort-change', sortConfig)
    }

    const getCurrentOptionLabel = () => {
      const option = sortOptions.value.find(opt => opt.value === currentSortBy.value)
      return option ? option.label : ''
    }

    // Watcher pour currentSortBy
    watch(currentSortBy, () => {
      updateSort()
    })

    return {
      currentSortBy,
      currentDirection,
      sortOptions,
      updateSort,
      toggleDirection,
      resetSort,
      getCurrentOptionLabel
    }
  }
}
</script>

<style scoped>
.sort-selector {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.sort-label {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  font-weight: 600;
  color: #555;
  font-size: 0.9rem;
}

.label-text {
  margin-bottom: 0.25rem;
}

.sort-controls {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.sort-select {
  flex: 1;
  padding: 0.5rem 0.75rem;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  font-size: 0.9rem;
  background: white;
  transition: all 0.2s ease;
  min-width: 150px;
}

.sort-select:focus {
  outline: none;
  border-color: #42b883;
  box-shadow: 0 0 0 3px rgba(66, 184, 131, 0.1);
}

.sort-select:hover {
  border-color: #42b883;
}

.sort-direction-btn {
  background: #42b883;
  color: white;
  border: none;
  border-radius: 6px;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 1.2rem;
}

.sort-direction-btn:hover {
  background: #369870;
  transform: scale(1.05);
}

.sort-direction-btn:active {
  transform: scale(0.95);
}

.sort-icon {
  font-weight: bold;
  line-height: 1;
}

.sort-reset-btn {
  background: #dc3545;
  color: white;
  border: none;
  border-radius: 6px;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 1rem;
}

.sort-reset-btn:hover {
  background: #c82333;
  transform: scale(1.05);
}

.sort-reset-btn:active {
  transform: scale(0.95);
}

.sort-indicator {
  padding: 0.5rem 0.75rem;
  background: #e8f5e8;
  border: 1px solid #42b883;
  border-radius: 6px;
  font-size: 0.85rem;
}

.sort-info {
  color: #2d5a3d;
}

.sort-info strong {
  color: #1e3a2a;
}

/* États désactivés */
.sort-direction-btn:disabled,
.sort-reset-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
}

.sort-direction-btn:disabled:hover,
.sort-reset-btn:disabled:hover {
  transform: none;
}

/* Responsive */
@media (max-width: 768px) {
  .sort-controls {
    flex-direction: column;
    align-items: stretch;
  }
  
  .sort-select {
    min-width: unset;
  }
  
  .sort-direction-btn,
  .sort-reset-btn {
    width: 100%;
    height: 40px;
    border-radius: 8px;
  }
  
  .sort-indicator {
    text-align: center;
  }
}

/* Animation pour les changements de direction */
.sort-icon {
  transition: transform 0.2s ease;
}

.sort-direction-btn:active .sort-icon {
  transform: scale(1.2);
}

/* Focus visible pour l'accessibilité */
.sort-direction-btn:focus-visible,
.sort-reset-btn:focus-visible {
  outline: 2px solid #42b883;
  outline-offset: 2px;
}

.sort-select:focus-visible {
  outline: 2px solid #42b883;
  outline-offset: 2px;
}
</style>
