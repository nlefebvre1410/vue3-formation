# 🔄 CORRECTION - Exercice 2 : Composables Personnalisés

## 📋 Objectif
Créer des composables réutilisables pour abstraire la logique métier et améliorer la maintenabilité du code.

## ✅ Implémentation

### 1. Composables créés

**Fonctionnalités implémentées :**
- 💖 Gestion des favoris avec `useFavorites`
- 🔍 Recherche avancée avec `useSearch`
- 🔔 Système de notifications avec `useNotifications`
- 🎨 Interface de recherche sophistiquée

### 2. Code de la correction

#### A. Composable useFavorites.js

```javascript
import { computed, ref } from 'vue'
import { useMoviesStore } from '@/stores/movies'

export function useFavorites() {
  const store = useMoviesStore()
  const isProcessing = ref(false)
  
  // État des favoris
  const favorites = computed(() => 
    store.movies.filter(movie => movie.isFavorite)
  )
  
  const favoritesCount = computed(() => favorites.value.length)
  
  const hasFavorites = computed(() => favoritesCount.value > 0)
  
  // Actions sur les favoris
  const toggleFavorite = async (movieId) => {
    isProcessing.value = true
    
    try {
      // Simuler un délai d'API
      await new Promise(resolve => setTimeout(resolve, 300))
      
      store.toggleFavorite(movieId)
      
      // Notification optionnelle
      const movie = store.getMovieById(movieId)
      const message = movie?.isFavorite 
        ? `"${movie.title}" ajouté aux favoris` 
        : `"${movie.title}" retiré des favoris`
      
      return { success: true, message }
      
    } catch (error) {
      return { success: false, error: error.message }
    } finally {
      isProcessing.value = false
    }
  }
  
  const addToFavorites = async (movieId) => {
    const movie = store.getMovieById(movieId)
    if (movie && !movie.isFavorite) {
      return await toggleFavorite(movieId)
    }
    return { success: false, error: 'Film déjà en favoris' }
  }
  
  const removeFromFavorites = async (movieId) => {
    const movie = store.getMovieById(movieId)
    if (movie && movie.isFavorite) {
      return await toggleFavorite(movieId)
    }
    return { success: false, error: 'Film pas en favoris' }
  }
  
  const clearAllFavorites = async () => {
    isProcessing.value = true
    
    try {
      const favoriteIds = favorites.value.map(movie => movie.id)
      
      for (const id of favoriteIds) {
        store.toggleFavorite(id)
        // Petit délai pour l'effet visuel
        await new Promise(resolve => setTimeout(resolve, 50))
      }
      
      return { 
        success: true, 
        message: `${favoriteIds.length} favoris supprimés` 
      }
      
    } catch (error) {
      return { success: false, error: error.message }
    } finally {
      isProcessing.value = false
    }
  }
  
  // Utilitaires
  const isFavorite = (movieId) => {
    const movie = store.getMovieById(movieId)
    return movie?.isFavorite || false
  }
  
  const getFavoritesByCategory = (category) => {
    return favorites.value.filter(movie => movie.category === category)
  }
  
  const getFavoritesStats = computed(() => {
    const byCategory = {}
    const byRating = {}
    let totalRating = 0
    
    favorites.value.forEach(movie => {
      // Par catégorie
      byCategory[movie.category] = (byCategory[movie.category] || 0) + 1
      
      // Par note
      if (movie.rating) {
        byRating[movie.rating] = (byRating[movie.rating] || 0) + 1
        totalRating += movie.rating
      }
    })
    
    return {
      total: favoritesCount.value,
      byCategory,
      byRating,
      averageRating: favoritesCount.value > 0 
        ? (totalRating / favoritesCount.value).toFixed(1) 
        : 0
    }
  })
  
  return {
    // État
    favorites,
    favoritesCount,
    hasFavorites,
    isProcessing,
    
    // Actions
    toggleFavorite,
    addToFavorites,
    removeFromFavorites,
    clearAllFavorites,
    
    // Utilitaires
    isFavorite,
    getFavoritesByCategory,
    getFavoritesStats
  }
}
```

#### B. Composable useSearch.js

```javascript
import { ref, computed, watch } from 'vue'
import { useMoviesStore } from '@/stores/movies'

export function useSearch(options = {}) {
  const {
    debounceMs = 300,
    minLength = 2,
    caseSensitive = false
  } = options
  
  const store = useMoviesStore()
  
  // État de recherche
  const searchQuery = ref('')
  const searchHistory = ref([])
  const isSearching = ref(false)
  const searchResults = ref([])
  
  // Debounce pour la recherche
  let debounceTimer = null
  
  const debouncedSearch = (query) => {
    isSearching.value = true
    
    clearTimeout(debounceTimer)
    debounceTimer = setTimeout(() => {
      performSearch(query)
      isSearching.value = false
    }, debounceMs)
  }
  
  // Fonction de recherche
  const performSearch = (query) => {
    if (!query || query.length < minLength) {
      searchResults.value = []
      return
    }
    
    const searchTerm = caseSensitive ? query : query.toLowerCase()
    
    const results = store.movies.filter(movie => {
      const title = caseSensitive ? movie.title : movie.title.toLowerCase()
      const description = caseSensitive ? movie.description : movie.description.toLowerCase()
      const director = caseSensitive ? movie.director : movie.director.toLowerCase()
      const category = caseSensitive ? movie.category : movie.category.toLowerCase()
      
      return title.includes(searchTerm) ||
             description.includes(searchTerm) ||
             director.includes(searchTerm) ||
             category.includes(searchTerm) ||
             movie.year.toString().includes(searchTerm)
    })
    
    searchResults.value = results
    
    // Ajouter à l'historique si pas déjà présent
    if (!searchHistory.value.includes(query)) {
      searchHistory.value.unshift(query)
      // Limiter l'historique à 10 éléments
      if (searchHistory.value.length > 10) {
        searchHistory.value = searchHistory.value.slice(0, 10)
      }
    }
  }
  
  // Watcher pour la recherche automatique
  watch(searchQuery, (newQuery) => {
    if (newQuery) {
      debouncedSearch(newQuery)
    } else {
      searchResults.value = []
      isSearching.value = false
    }
  })
  
  // Computed pour les statistiques de recherche
  const searchStats = computed(() => ({
    totalResults: searchResults.value.length,
    hasResults: searchResults.value.length > 0,
    isEmpty: searchQuery.value.length === 0,
    isMinLength: searchQuery.value.length >= minLength
  }))
  
  // Suggestions basées sur l'historique
  const suggestions = computed(() => {
    if (!searchQuery.value) return []
    
    return searchHistory.value.filter(item =>
      item.toLowerCase().includes(searchQuery.value.toLowerCase()) &&
      item !== searchQuery.value
    ).slice(0, 5)
  })
  
  // Actions
  const clearSearch = () => {
    searchQuery.value = ''
    searchResults.value = []
    isSearching.value = false
  }
  
  const clearHistory = () => {
    searchHistory.value = []
  }
  
  const searchByCategory = (category) => {
    searchQuery.value = category
  }
  
  const searchByDirector = (director) => {
    searchQuery.value = director
  }
  
  const searchByYear = (year) => {
    searchQuery.value = year.toString()
  }
  
  // Recherche avancée avec critères multiples
  const advancedSearch = (criteria) => {
    const {
      title,
      category,
      director,
      yearFrom,
      yearTo,
      minRating,
      maxRating,
      favorites
    } = criteria
    
    let results = store.movies
    
    if (title) {
      const titleTerm = caseSensitive ? title : title.toLowerCase()
      results = results.filter(movie => {
        const movieTitle = caseSensitive ? movie.title : movie.title.toLowerCase()
        return movieTitle.includes(titleTerm)
      })
    }
    
    if (category) {
      results = results.filter(movie => movie.category === category)
    }
    
    if (director) {
      const directorTerm = caseSensitive ? director : director.toLowerCase()
      results = results.filter(movie => {
        const movieDirector = caseSensitive ? movie.director : movie.director.toLowerCase()
        return movieDirector.includes(directorTerm)
      })
    }
    
    if (yearFrom) {
      results = results.filter(movie => movie.year >= yearFrom)
    }
    
    if (yearTo) {
      results = results.filter(movie => movie.year <= yearTo)
    }
    
    if (minRating) {
      results = results.filter(movie => movie.rating >= minRating)
    }
    
    if (maxRating) {
      results = results.filter(movie => movie.rating <= maxRating)
    }
    
    if (favorites !== undefined) {
      results = results.filter(movie => movie.isFavorite === favorites)
    }
    
    searchResults.value = results
    return results
  }
  
  return {
    // État
    searchQuery,
    searchResults,
    searchHistory,
    isSearching,
    searchStats,
    suggestions,
    
    // Actions
    clearSearch,
    clearHistory,
    searchByCategory,
    searchByDirector,
    searchByYear,
    advancedSearch,
    
    // Configuration
    debounceMs,
    minLength,
    caseSensitive
  }
}
```

#### C. Composable useNotifications.js

```javascript
import { ref } from 'vue'

export function useNotifications() {
  const notifications = ref([])
  
  const defaultOptions = {
    duration: 3000,
    type: 'info', // 'success', 'error', 'warning', 'info'
    position: 'top-right'
  }
  
  const addNotification = (message, options = {}) => {
    const notification = {
      id: Date.now() + Math.random(),
      message,
      ...defaultOptions,
      ...options,
      timestamp: new Date()
    }
    
    notifications.value.push(notification)
    
    // Auto-suppression
    if (notification.duration > 0) {
      setTimeout(() => {
        removeNotification(notification.id)
      }, notification.duration)
    }
    
    return notification.id
  }
  
  const removeNotification = (id) => {
    const index = notifications.value.findIndex(n => n.id === id)
    if (index > -1) {
      notifications.value.splice(index, 1)
    }
  }
  
  const clearAll = () => {
    notifications.value = []
  }
  
  // Méthodes de convenance
  const success = (message, options = {}) => {
    return addNotification(message, { ...options, type: 'success' })
  }
  
  const error = (message, options = {}) => {
    return addNotification(message, { ...options, type: 'error', duration: 5000 })
  }
  
  const warning = (message, options = {}) => {
    return addNotification(message, { ...options, type: 'warning' })
  }
  
  const info = (message, options = {}) => {
    return addNotification(message, { ...options, type: 'info' })
  }
  
  return {
    notifications,
    addNotification,
    removeNotification,
    clearAll,
    success,
    error,
    warning,
    info
  }
}
```

#### D. Composant AdvancedSearch.vue

```vue
<template>
  <div class="advanced-search">
    <div class="search-header">
      <h3>🔍 Recherche Avancée</h3>
      <button @click="toggleExpanded" class="toggle-btn">
        {{ isExpanded ? '▼' : '▶' }}
      </button>
    </div>
    
    <div v-if="isExpanded" class="search-form">
      <div class="search-row">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Rechercher dans tous les champs..."
          class="search-input"
        >
        <button @click="clearSearch" class="clear-btn">✕</button>
      </div>
      
      <div v-if="suggestions.length > 0" class="suggestions">
        <div
          v-for="suggestion in suggestions"
          :key="suggestion"
          @click="searchQuery = suggestion"
          class="suggestion-item"
        >
          {{ suggestion }}
        </div>
      </div>
      
      <div class="filters-grid">
        <select v-model="advancedCriteria.category">
          <option value="">Toutes les catégories</option>
          <option v-for="cat in categories" :key="cat" :value="cat">
            {{ cat }}
          </option>
        </select>
        
        <input
          v-model="advancedCriteria.director"
          type="text"
          placeholder="Réalisateur"
        >
        
        <input
          v-model.number="advancedCriteria.yearFrom"
          type="number"
          placeholder="Année min"
          min="1900"
          max="2030"
        >
        
        <input
          v-model.number="advancedCriteria.yearTo"
          type="number"
          placeholder="Année max"
          min="1900"
          max="2030"
        >
        
        <select v-model.number="advancedCriteria.minRating">
          <option value="">Note min</option>
          <option v-for="n in 5" :key="n" :value="n">{{ n }}⭐</option>
        </select>
        
        <select v-model="advancedCriteria.favorites">
          <option value="">Tous les films</option>
          <option :value="true">Favoris uniquement</option>
          <option :value="false">Non-favoris uniquement</option>
        </select>
      </div>
      
      <div class="search-actions">
        <button @click="performAdvancedSearch" class="btn btn-primary">
          Rechercher ({{ searchStats.totalResults }})
        </button>
        <button @click="resetFilters" class="btn btn-secondary">
          Réinitialiser
        </button>
      </div>
      
      <div v-if="searchHistory.length > 0" class="search-history">
        <h4>Historique</h4>
        <div class="history-items">
          <span
            v-for="item in searchHistory.slice(0, 5)"
            :key="item"
            @click="searchQuery = item"
            class="history-item"
          >
            {{ item }}
          </span>
        </div>
        <button @click="clearHistory" class="clear-history">
          Effacer l'historique
        </button>
      </div>
    </div>
    
    <div v-if="isSearching" class="loading">
      Recherche en cours...
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, watch } from 'vue'
import { useSearch } from '@/composables/useSearch'
import { useMoviesStore } from '@/stores/movies'

const store = useMoviesStore()
const isExpanded = ref(false)

const {
  searchQuery,
  searchResults,
  searchHistory,
  isSearching,
  searchStats,
  suggestions,
  clearSearch,
  clearHistory,
  advancedSearch
} = useSearch({ debounceMs: 500, minLength: 1 })

const categories = computed(() => store.uniqueCategories)

const advancedCriteria = reactive({
  category: '',
  director: '',
  yearFrom: null,
  yearTo: null,
  minRating: null,
  maxRating: null,
  favorites: ''
})

const emit = defineEmits(['search-results'])

const toggleExpanded = () => {
  isExpanded.value = !isExpanded.value
}

const performAdvancedSearch = () => {
  const results = advancedSearch(advancedCriteria)
  emit('search-results', results)
}

const resetFilters = () => {
  Object.keys(advancedCriteria).forEach(key => {
    advancedCriteria[key] = ''
  })
  clearSearch()
}

// Émettre les résultats quand ils changent
watch(() => searchResults.value, (results) => {
  emit('search-results', results)
})
</script>

<style scoped>
.advanced-search {
  background: white;
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 1rem;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.search-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
}

.search-form {
  margin-top: 1rem;
}

.search-row {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.search-input {
  flex: 1;
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.suggestions {
  background: #f8f9fa;
  border-radius: 4px;
  margin-bottom: 1rem;
}

.suggestion-item {
  padding: 0.5rem;
  cursor: pointer;
  border-bottom: 1px solid #eee;
}

.suggestion-item:hover {
  background: #e9ecef;
}

.filters-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;
  margin-bottom: 1rem;
}

.filters-grid input,
.filters-grid select {
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.search-actions {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
}

.search-history {
  border-top: 1px solid #eee;
  padding-top: 1rem;
}

.history-items {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}

.history-item {
  background: #e9ecef;
  padding: 0.25rem 0.5rem;
  border-radius: 12px;
  cursor: pointer;
  font-size: 0.875rem;
}

.history-item:hover {
  background: #dee2e6;
}

.loading {
  text-align: center;
  color: #666;
  font-style: italic;
}
</style>
```

## 🎯 Points clés de la correction

### 1. Réutilisabilité
- **Composables indépendants** utilisables dans plusieurs composants
- **Configuration flexible** avec options
- **API cohérente** entre les composables

### 2. Séparation des préoccupations
- **Logique métier** dans les composables
- **Interface utilisateur** dans les composants
- **État global** dans le store

### 3. Performance
- **Debounce** pour la recherche
- **Computed properties** pour les calculs
- **Lazy evaluation** pour les suggestions

## ✅ Validation

- [ ] Les composables sont réutilisables
- [ ] La recherche avancée fonctionne
- [ ] Les favoris sont gérés correctement
- [ ] Les notifications s'affichent
- [ ] L'historique de recherche est persistant
- [ ] Le code est bien structuré

## 🎓 Compétences acquises

- **Composition API** avancée avec composables
- **Logique réutilisable** et modulaire
- **Gestion d'état** distribuée
- **Debouncing** et optimisations
- **Architecture** scalable

---

**🎯 Cette correction montre comment créer des composables puissants pour structurer vos applications Vue.js 3 !**
