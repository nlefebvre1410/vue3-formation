<template>
  <div class="movie-filters">
    <div class="filters-header">
      <h2>🔍 Filtres et recherche</h2>
      <div class="filters-summary">
        {{ filteredCount }} film(s) trouvé(s) sur {{ totalCount }}
      </div>
    </div>

    <div class="filters-content">

      <slot name="filters-section"></slot>

      <!-- Actions -->
    <div class="filter-actions">
        <button @click="resetFilters" class="btn btn-secondary">
          🔄 Réinitialiser
        </button>
        <button @click="toggleAdvanced" class="btn btn-outline">
          {{ showAdvanced ? 'Masquer' : 'Afficher' }} les options avancées
        </button>
      </div>

      <div v-if="showAdvanced" class="advanced-filters">
         À COMPLÉTER : Filtres avancés 
      </div>
    </div>
  </div>
</template>

<script>
import { computed,reactive,ref } from 'vue'

export default {
  name: 'MovieFilters',
  props: {    
    movies: {
      type: Array,
      required: true
    },
  },
  emits:['reset'],
  setup(props, {emit}) {


    const filteredCount=computed(()=>!!props.movies.length)
    const totalCount=ref(0)

     const resetFilters = ()=>{
            emit('reset',props.movies)

        }
        
        const showAdvanced=ref(true);
        const toggleAdvanced=()=>{
            showAdvanced.value=!showAdvanced.value
        }

    const hasActiveFilters = computed(() => {
      return props.filters.search || 
             props.filters.category || 
             props.filters.year || 
             props.filters.rating ||
             props.filters.favorites
    })
    const filters = reactive({
      search: '',
      category: '',
      yearFrom: null,
      yearTo: null,
      minRating: 0,
      favoritesOnly: false,
      sortBy: 'title', // 'title', 'year', 'rating', 'category'
      sortOrder: 'asc' // 'asc', 'desc'
    })

    return {
      hasActiveFilters,
      filters,
      filteredCount,
      totalCount,
      resetFilters,
      toggleAdvanced,
      showAdvanced
    }
  }
}
</script>

<style scoped>
.filters {
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
