<template>
  <div class="card">
    <h2>🔍 Filtres et recherche</h2>
    
    <div class="filters-grid">
      <!-- Recherche -->
      <div class="filter-group">
        <label for="search">Recherche :</label>
        <div class="search-input-container">
          <input 
            id="search"
            v-model="localFilters.search"
            type="text" 
            placeholder="Rechercher un film..."
            class="search-input"
            @input="debouncedSearch"
          >
          <button 
            v-if="localFilters.search"
            @click="clearSearch"
            class="clear-search-btn"
            type="button"
          >
            ✕
          </button>
        </div>
      </div>

      <!-- Catégorie -->
      <div class="filter-group">
        <label for="categoryFilter">Catégorie :</label>
        <select id="categoryFilter" v-model="localFilters.category" class="filter-select">
          <option value="">Toutes les catégories</option>
          <option v-for="category in availableCategories" :key="category" :value="category">
            {{ category }} ({{ getCategoryCount(category) }})
          </option>
        </select>
      </div>

      <!-- Année -->
      <div class="filter-group">
        <label for="yearFilter">Année :</label>
        <select id="yearFilter" v-model="localFilters.year" class="filter-select">
          <option value="">Toutes les années</option>
          <option v-for="year in availableYears" :key="year" :value="year">
            {{ year }}
          </option>
        </select>
      </div>

      <!-- Note minimum -->
      <div class="filter-group">
        <label for="ratingFilter">Note minimum :</label>
        <select id="ratingFilter" v-model="localFilters.rating" class="filter-select">
          <option value="">Toutes les notes</option>
          <option v-for="rating in 5" :key="rating" :value="rating">
            {{ rating }} étoile{{ rating > 1 ? 's' : '' }} et +
          </option>
        </select>
      </div>

      <!-- Favoris -->
      <div class="filter-group">
        <label for="favoritesFilter">Favoris :</label>
        <select id="favoritesFilter" v-model="localFilters.favorites" class="filter-select">
          <option value="">Tous les films</option>
          <option value="true">Favoris uniquement</option>
          <option value="false">Non favoris</option>
        </select>
      </div>

      <!-- Actions -->
      <div class="filter-actions">
        <button @click="clearAllFilters" class="btn btn-secondary">
          🗑️ Effacer les filtres
        </button>
        <div class="active-filters-count" v-if="activeFiltersCount > 0">
          {{ activeFiltersCount }} filtre{{ activeFiltersCount > 1 ? 's' : '' }} actif{{ activeFiltersCount > 1 ? 's' : '' }}
        </div>
      </div>
    </div>

    <!-- Filtres actifs -->
    <div v-if="activeFilters.length > 0" class="active-filters">
      <h3>Filtres actifs :</h3>
      <div class="filter-tags">
        <span 
          v-for="filter in activeFilters" 
          :key="filter.key"
          class="filter-tag"
        >
          <strong>{{ filter.label }} :</strong> {{ filter.value }}
          <button @click="removeFilter(filter.key)" class="remove-filter">✕</button>
        </span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, reactive, watch } from 'vue'

const props = defineProps({
  filters: {
    type: Object,
    required: true
  },
  movies: {
    type: Array,
    required: true
  }
})

const emit = defineEmits(['update-filter', 'clear-filters'])

const localFilters = reactive({
  search: '',
  category: '',
  year: '',
  rating: '',
  favorites: ''
})

// Fonction debounce personnalisée
const debounce = (func, delay) => {
  let timeoutId
  return (...args) => {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => func.apply(null, args), delay)
  }
}

// Synchroniser les filtres locaux avec les props
watch(() => props.filters, (newFilters) => {
  Object.assign(localFilters, newFilters)
}, { immediate: true })

// Debounce pour la recherche
const debouncedSearch = debounce(() => {
  emit('update-filter', { search: localFilters.search })
}, 300)

// Watchers pour les autres filtres
watch(() => localFilters.category, (newValue) => {
  emit('update-filter', { category: newValue })
})

watch(() => localFilters.year, (newValue) => {
  emit('update-filter', { year: newValue })
})

watch(() => localFilters.rating, (newValue) => {
  emit('update-filter', { rating: newValue })
})

watch(() => localFilters.favorites, (newValue) => {
  emit('update-filter', { favorites: newValue })
})

// Computed properties
const availableCategories = computed(() => {
  return [...new Set(props.movies.map(movie => movie.category))].sort()
})

const availableYears = computed(() => {
  return [...new Set(props.movies.map(movie => movie.year))].sort((a, b) => b - a)
})

const activeFiltersCount = computed(() => {
  return Object.values(localFilters).filter(value => value !== '').length
})

const activeFilters = computed(() => {
  const filters = []
  
  if (localFilters.search) {
    filters.push({
      key: 'search',
      label: 'Recherche',
      value: localFilters.search
    })
  }
  
  if (localFilters.category) {
    filters.push({
      key: 'category',
      label: 'Catégorie',
      value: localFilters.category
    })
  }
  
  if (localFilters.year) {
    filters.push({
      key: 'year',
      label: 'Année',
      value: localFilters.year
    })
  }
  
  if (localFilters.rating) {
    filters.push({
      key: 'rating',
      label: 'Note minimum',
      value: `${localFilters.rating} étoile${localFilters.rating > 1 ? 's' : ''}`
    })
  }
  
  if (localFilters.favorites) {
    filters.push({
      key: 'favorites',
      label: 'Favoris',
      value: localFilters.favorites === 'true' ? 'Favoris uniquement' : 'Non favoris'
    })
  }
  
  return filters
})

// Methods
const getCategoryCount = (category) => {
  return props.movies.filter(movie => movie.category === category).length
}

const clearSearch = () => {
  localFilters.search = ''
  emit('update-filter', { search: '' })
}

const clearAllFilters = () => {
  Object.assign(localFilters, {
    search: '',
    category: '',
    year: '',
    rating: '',
    favorites: ''
  })
  emit('clear-filters')
}

const removeFilter = (filterKey) => {
  localFilters[filterKey] = ''
  emit('update-filter', { [filterKey]: '' })
}
</script>

<style scoped>
.filters-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
  align-items: end;
}

.filter-group {
  display: flex;
  flex-direction: column;
}

.filter-group label {
  font-weight: 600;
  color: #555;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
}

.search-input-container {
  position: relative;
}

.search-input,
.filter-select {
  width: 100%;
  padding: 0.75rem;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  font-size: 1rem;
  background: white;
  transition: all 0.2s ease;
}

.search-input {
  padding-right: 2.5rem;
}

.search-input:focus,
.filter-select:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.search-input::placeholder {
  color: #a0aec0;
  font-style: italic;
}

.clear-search-btn {
  position: absolute;
  right: 0.5rem;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: #666;
  cursor: pointer;
  padding: 0.25rem;
  border-radius: 4px;
  transition: all 0.2s ease;
}

.clear-search-btn:hover {
  background: #f1f5f9;
  color: #dc3545;
}

.filter-select {
  cursor: pointer;
  appearance: none;
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e");
  background-position: right 0.75rem center;
  background-repeat: no-repeat;
  background-size: 1.5em 1.5em;
  padding-right: 2.5rem;
}

.filter-actions {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  align-items: flex-start;
}

.active-filters-count {
  font-size: 0.875rem;
  color: #667eea;
  font-weight: 600;
}

.active-filters {
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid #e2e8f0;
}

.active-filters h3 {
  font-size: 1rem;
  color: #555;
  margin-bottom: 0.75rem;
}

.filter-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.filter-tag {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: #667eea;
  color: white;
  padding: 0.5rem 0.75rem;
  border-radius: 20px;
  font-size: 0.875rem;
}

.remove-filter {
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  padding: 0;
  width: 1.25rem;
  height: 1.25rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s ease;
}

.remove-filter:hover {
  background: rgba(255, 255, 255, 0.2);
}

@media (max-width: 768px) {
  .filters-grid {
    grid-template-columns: 1fr;
  }
  
  .filter-actions {
    align-items: stretch;
  }
  
  .filter-tags {
    justify-content: center;
  }
}
</style>
