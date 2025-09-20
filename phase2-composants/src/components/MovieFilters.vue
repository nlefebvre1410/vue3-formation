<template>
  <div class="card">
    <h2>🔍 Filtres et recherche</h2>
    <div class="filters">
      <div class="filter-group">
        <label for="search">Recherche :</label>
        <input 
          id="search"
          :value="filters.search"
          @input="updateFilter('search', $event.target.value)"
          type="text" 
          placeholder="Rechercher un film..."
        >
      </div>

      <div class="filter-group">
        <label for="categoryFilter">Catégorie :</label>
        <select 
          id="categoryFilter" 
          :value="filters.category"
          @change="updateFilter('category', $event.target.value)"
        >
          <option value="">Toutes les catégories</option>
          <option v-for="category in categories" :key="category" :value="category">
            {{ category }} ({{ getCategoryCount(category) }})
          </option>
        </select>
      </div>

      <div class="filter-group">
        <label for="yearFilter">Année :</label>
        <select 
          id="yearFilter" 
          :value="filters.year"
          @change="updateFilter('year', $event.target.value)"
        >
          <option value="">Toutes les années</option>
          <option v-for="year in years" :key="year" :value="year">
            {{ year }}
          </option>
        </select>
      </div>

      <div class="filter-group">
        <label for="ratingFilter">Note minimum :</label>
        <select 
          id="ratingFilter" 
          :value="filters.rating"
          @change="updateFilter('rating', $event.target.value)"
        >
          <option value="">Toutes les notes</option>
          <option v-for="rating in 5" :key="rating" :value="rating">
            {{ rating }} étoile{{ rating > 1 ? 's' : '' }} et +
          </option>
        </select>
      </div>

      <div class="filter-group">
        <label for="favoritesFilter">Favoris :</label>
        <select 
          id="favoritesFilter" 
          :value="filters.favorites"
          @change="updateFilter('favorites', $event.target.value)"
        >
          <option value="">Tous les films</option>
          <option value="true">Favoris uniquement</option>
          <option value="false">Non favoris uniquement</option>
        </select>
      </div>

      <div class="filter-group">
        <label>&nbsp;</label>
        <button class="btn btn-secondary" @click="clearAllFilters">
          🗑️ Effacer les filtres
        </button>
      </div>
    </div>

    <!-- Résumé des filtres actifs -->
    <div v-if="hasActiveFilters" class="active-filters">
      <h3>Filtres actifs :</h3>
      <div class="filter-tags">
        <span v-if="filters.search" class="filter-tag">
          Recherche: "{{ filters.search }}"
          <button @click="updateFilter('search', '')" class="remove-filter">×</button>
        </span>
        <span v-if="filters.category" class="filter-tag">
          Catégorie: {{ filters.category }}
          <button @click="updateFilter('category', '')" class="remove-filter">×</button>
        </span>
        <span v-if="filters.year" class="filter-tag">
          Année: {{ filters.year }}
          <button @click="updateFilter('year', '')" class="remove-filter">×</button>
        </span>
        <span v-if="filters.rating" class="filter-tag">
          Note: {{ filters.rating }}+ étoiles
          <button @click="updateFilter('rating', '')" class="remove-filter">×</button>
        </span>
        <span v-if="filters.favorites === 'true'" class="filter-tag">
          Favoris uniquement
          <button @click="updateFilter('favorites', '')" class="remove-filter">×</button>
        </span>
        <span v-if="filters.favorites === 'false'" class="filter-tag">
          Non favoris uniquement
          <button @click="updateFilter('favorites', '')" class="remove-filter">×</button>
        </span>
      </div>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue'

export default {
  name: 'MovieFilters',
  props: {
    filters: {
      type: Object,
      required: true
    },
    categories: {
      type: Array,
      required: true
    },
    years: {
      type: Array,
      required: true
    },
    movies: {
      type: Array,
      required: true
    }
  },
  emits: ['update-filter', 'clear-filters'],
  setup(props, { emit }) {
    const hasActiveFilters = computed(() => {
      return props.filters.search || 
             props.filters.category || 
             props.filters.year || 
             props.filters.rating ||
             props.filters.favorites
    })

    const getCategoryCount = (category) => {
      return props.movies.filter(movie => movie.category === category).length
    }

    const updateFilter = (filterName, value) => {
      emit('update-filter', { [filterName]: value })
    }

    const clearAllFilters = () => {
      emit('clear-filters')
    }

    return {
      hasActiveFilters,
      getCategoryCount,
      updateFilter,
      clearAllFilters
    }
  }
}
</script>

<style scoped>
.active-filters {
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid #e9ecef;
}

.active-filters h3 {
  color: #42b883;
  margin-bottom: 0.75rem;
  font-size: 1rem;
}

.filter-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.filter-tag {
  background: #42b883;
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.875rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.remove-filter {
  background: none;
  border: none;
  color: white;
  font-size: 1.2rem;
  cursor: pointer;
  padding: 0;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s ease;
}

.remove-filter:hover {
  background: rgba(255, 255, 255, 0.2);
}
</style>
