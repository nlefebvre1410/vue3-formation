<template>
    <div class="movie-filters">
      <div class="filters-header">
        <h2>🔍 Filtres et recherche</h2>
        <div class="filters-summary">
          {{ filteredCount }} film(s) trouvé(s) sur {{ totalCount }}
        </div>
      </div>
  
      <div class="filters-content">
        <!-- Recherche textuelle -->
        <div class="filter-section">
          <div class="filter-group search-group">
            <label for="search">Recherche</label>
            <div class="search-input-wrapper">
              <input
                id="search"
                v-model="filters.search"
                type="text"
                placeholder="Rechercher dans les titres et descriptions..."
                class="search-input"
              >
              <button 
                v-if="filters.search"
                @click="clearSearch"
                class="clear-search"
                type="button"
              >
                ✕
              </button>
            </div>
          </div>
        </div>
  
        <!-- Filtres principaux -->
        <div class="filter-section">
          <div class="filters-grid">
            <!-- Catégorie -->
            <div class="filter-group">
              <label for="category">Catégorie</label>
              <select id="category" v-model="filters.category">
                <option value="">Toutes les catégories</option>
                <option v-for="cat in categories" :key="cat" :value="cat">
                  {{ cat }}
                </option>
              </select>
            </div>
  
            <!-- Année -->
            <div class="filter-group">
              <label>Année</label>
              <div class="year-range">
                <input
                  v-model.number="filters.yearFrom"
                  type="number"
                  placeholder="De"
                  min="1900"
                  :max="currentYear"
                >
                <span>à</span>
                <input
                  v-model.number="filters.yearTo"
                  type="number"
                  placeholder="À"
                  min="1900"
                  :max="currentYear"
                >
              </div>
            </div>
  
            <!-- Note minimale -->
            <div class="filter-group">
              <label for="minRating">Note minimale</label>
              <div class="rating-filter">
                <StarRating
                  v-model="filters.minRating"
                  :interactive="true"
                  :show-label="true"
                />
              </div>
            </div>
  
            <!-- Favoris -->
            <div class="filter-group">
              <label class="checkbox-label">
                <input
                  v-model="filters.favoritesOnly"
                  type="checkbox"
                >
                <span class="checkbox-text">Favoris uniquement</span>
              </label>
            </div>
          </div>
        </div>
  
        <!-- Tri -->
        <div class="filter-section">
          <div class="sort-controls">
            <div class="filter-group">
              <label for="sortBy">Trier par</label>
              <select id="sortBy" v-model="filters.sortBy">
                <option value="title">Titre</option>
                <option value="year">Année</option>
                <option value="rating">Note</option>
                <option value="category">Catégorie</option>
              </select>
            </div>
  
            <div class="filter-group">
              <label for="sortOrder">Ordre</label>
              <select id="sortOrder" v-model="filters.sortOrder">
                <option value="asc">Croissant</option>
                <option value="desc">Décroissant</option>
              </select>
            </div>
          </div>
        </div>
  
        <!-- Actions -->
        <div class="filter-actions">
          <button @click="resetFilters" class="btn btn-secondary">
            🔄 Réinitialiser
          </button>
          <button @click="toggleAdvanced" class="btn btn-outline">
            {{ showAdvanced ? 'Masquer' : 'Afficher' }} les options avancées
          </button>
        </div>
  
        <!-- Filtres avancés -->
        <div v-if="showAdvanced" class="advanced-filters">
          <!-- À COMPLÉTER : Filtres avancés -->
        </div>
      </div>
    </div>
  </template>
  <script>
    import { ref, reactive, computed, watch } from 'vue'
    import StarRating from './StarRating.vue'
    
    export default {
        name: 'MovieFilters',
        props: {
            initialFilters: {
                type: Object,
                required: false
            },
            categories: {
                type: Array,
                required: true
            },
            currentYear: {
                type: Number,
                required: false,
                default: () => new Date().getFullYear()
            },
            movies: {
                type: Array,
                required: true
            },
            
        },
        components: { StarRating },
        emits: ['update:filters', 'reset'],
        setup(props, {emit}) {
            const filters = reactive({
                search: props.initialFilters.search || '',
                category: props.initialFilters.category || '',
                yearFrom: props.initialFilters.yearFrom || null,
                yearTo: props.initialFilters.yearTo || null,
                minRating: props.initialFilters.minRating || 0,
                favoritesOnly: props.initialFilters.favoritesOnly || false,
                sortBy: props.initialFilters.sortBy || 'title', // 'title', 'year', 'rating', 'category'
                sortOrder: props.initialFilters.sortOrder || 'asc' // 'asc', 'desc'
                })
           
            const showAdvanced = ref(false)
            const applyFilters = computed(() => {
                let result = [...props.movies]

                // Recherche textuelle
                if (filters.search) {
                    const searchTerm = filters.search.toLowerCase()
                    result = result.filter(movie =>
                    movie.title.toLowerCase().includes(searchTerm) ||
                    (movie.description && movie.description.toLowerCase().includes(searchTerm)) ||
                    (movie.director && movie.director.toLowerCase().includes(searchTerm))
                    )
                }

                // Filtrage par catégorie
                if (filters.category) {
                    result = result.filter(movie => movie.category === filters.category)
                }

                // Filtrage par année
                if (filters.yearFrom) {
                    result = result.filter(movie => movie.year >= filters.yearFrom)
                }
                if (filters.yearTo) {
                    result = result.filter(movie => movie.year <= filters.yearTo)
                }

                // Filtrage par note
                if (filters.minRating > 0) {
                    result = result.filter(movie => (movie.vote_average || 0) >= filters.minRating)
                }

                // Filtrage favoris
                if (filters.favoritesOnly) {
                    result = result.filter(movie => movie.isFavorite)
                }

                // Tri
                result.sort((a, b) => {
                    let aValue = a[filters.sortBy]
                    let bValue = b[filters.sortBy]

                    // Gestion des valeurs nulles/undefined
                    if (aValue == null) aValue = ''
                    if (bValue == null) bValue = ''

                    // Tri numérique pour année et note
                    if (filters.sortBy === 'year' || filters.sortBy === 'rating') {
                    aValue = Number(aValue) || 0
                    bValue = Number(bValue) || 0
                    } else {
                    // Tri alphabétique pour les autres
                    aValue = String(aValue).toLowerCase()
                    bValue = String(bValue).toLowerCase()
                    }

                    let comparison = 0
                    if (aValue < bValue) comparison = -1
                    if (aValue > bValue) comparison = 1

                    return filters.sortOrder === 'desc' ? -comparison : comparison
                })
                
            return result
            })
            // Émettre les filtres initiaux au montage
            emit('update:filters', {
                filters: { ...filters },
                results: applyFilters.value
            })
            // Émettre les changements de filtres
            watch(filters, (newFilters) => {
            emit('update:filters', {
                filters: { ...newFilters },
                results: applyFilters.value
            })
            }, { deep: true })

            // Validation des plages d'années
            watch(() => filters.yearFrom, (newValue) => {
            if (newValue && filters.yearTo && newValue > filters.yearTo) {
                filters.yearTo = newValue
            }
            })

            watch(() => filters.yearTo, (newValue) => {
            if (newValue && filters.yearFrom && newValue < filters.yearFrom) {
                filters.yearFrom = newValue
            }
            })

            const clearSearch = () => {
                filters.search = ''
            }

            const resetFilters = () => {
                filters.search = ''
                filters.category = ''
                filters.yearFrom = null
                filters.yearTo = null
                filters.minRating = 0
                filters.favoritesOnly = false
                filters.sortBy = 'title'
                filters.sortOrder = 'asc'
                emit('reset')
            }

            const toggleAdvanced = () => {
                showAdvanced.value = !showAdvanced.value
            }

            const totalCount = computed(() => props.movies.length)
            const filteredCount = computed(() => applyFilters.value.length)
            return {
                showAdvanced,
                filters,
                applyFilters,
                totalCount,
                filteredCount,
                clearSearch,
                resetFilters,
                toggleAdvanced,
            }
        }

            
            
    }

  </script>
  <style >
  .movie-filters {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
}

.filters-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #eee;
}

.filters-header h2 {
  margin: 0;
  color: #333;
}

.filters-summary {
  color: #666;
  font-size: 0.9rem;
  font-weight: 500;
}

.filter-section {
  margin-bottom: 1.5rem;
}

.filters-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.filter-group label {
  font-weight: 600;
  color: #333;
  font-size: 0.9rem;
}

.search-input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.search-input {
  width: 100%;
  padding: 0.75rem;
  padding-right: 2.5rem;
  border: 2px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.3s ease;
}

.search-input:focus {
  outline: none;
  border-color: #42b883;
  box-shadow: 0 0 0 3px rgba(66, 184, 131, 0.1);
}

.clear-search {
  position: absolute;
  right: 0.5rem;
  background: none;
  border: none;
  color: #999;
  cursor: pointer;
  padding: 0.25rem;
  border-radius: 50%;
  transition: background-color 0.2s ease;
}

.clear-search:hover {
  background: #f5f5f5;
  color: #666;
}

.year-range {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.year-range input {
  flex: 1;
  padding: 0.5rem;
  border: 2px solid #ddd;
  border-radius: 6px;
}

.year-range span {
  color: #666;
  font-size: 0.9rem;
}

.rating-filter {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  font-weight: normal;
}

.checkbox-label input[type="checkbox"] {
  width: auto;
  margin: 0;
}

.sort-controls {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.filter-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  padding-top: 1rem;
  border-top: 1px solid #eee;
}

.advanced-filters {
  margin-top: 1rem;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 8px;
  border: 1px solid #e9ecef;
}

@media (max-width: 768px) {
  .filters-grid {
    grid-template-columns: 1fr;
  }
  
  .sort-controls {
    grid-template-columns: 1fr;
  }
  
  .filter-actions {
    flex-direction: column;
  }
  
  .filters-header {
    flex-direction: column;
    gap: 0.5rem;
    text-align: center;
  }
}
.filter-section {
  transition: all 0.3s ease;
}

.advanced-filters {
  animation: slideDown 0.3s ease;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.filters-summary {
  transition: color 0.3s ease;
}

.filters-summary.updating {
  color: #42b883;
}
  </style>