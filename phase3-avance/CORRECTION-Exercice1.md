# 🏪 CORRECTION - Exercice 1 : Store Pinia Avancé

## 📋 Objectif
Étendre le store Pinia avec des fonctionnalités avancées : gestion des catégories dynamiques, statistiques détaillées et actions asynchrones.

## ✅ Implémentation

### 1. Store movies.js étendu

**Fonctionnalités ajoutées :**
- 📊 Statistiques détaillées des films
- 🔄 Actions asynchrones avec gestion d'erreurs
- 🏷️ Gestion dynamique des catégories
- 💾 Cache intelligent
- ⚡ État de chargement et erreurs

### 2. Code de la correction

#### A. Extension du store (`src/stores/movies.js`)

```javascript
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import moviesData from '@/assets/data/movies.json'

// ... code existant pour les images et mapMovieData ...

export const useMoviesStore = defineStore('movies', () => {
  // État de base (existant)
  const movies = ref(moviesData.map(mapMovieData))
  const filters = ref({
    search: '',
    category: '',
    year: '',
    rating: '',
    favorites: ''
  })

  // NOUVEAUX ÉTATS pour l'exercice
  const isLoading = ref(false)
  const error = ref(null)
  const categories = ref([
    'Action', 'Comédie', 'Drame', 'Horreur', 'Romance', 
    'Science-Fiction', 'Thriller', 'Animation', 'Documentaire'
  ])

  // NOUVELLES STATISTIQUES AVANCÉES
  const movieStats = computed(() => {
    const total = movies.value.length
    const favorites = movies.value.filter(m => m.isFavorite).length
    const byCategory = {}
    const byYear = {}
    const byRating = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
    
    movies.value.forEach(movie => {
      // Compter par catégorie
      byCategory[movie.category] = (byCategory[movie.category] || 0) + 1
      
      // Compter par année
      byYear[movie.year] = (byYear[movie.year] || 0) + 1
      
      // Compter par note
      if (movie.rating) {
        byRating[movie.rating]++
      }
    })
    
    return {
      total,
      favorites,
      favoritesPercentage: total > 0 ? Math.round((favorites / total) * 100) : 0,
      byCategory,
      byYear,
      byRating,
      averageRating: averageRating.value,
      mostPopularCategory: Object.keys(byCategory).reduce((a, b) => 
        byCategory[a] > byCategory[b] ? a : b, 'Aucune'
      )
    }
  })

  // Top films par note
  const topRatedMovies = computed(() => {
    return movies.value
      .filter(movie => movie.rating >= 4)
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 5)
  })

  // Films récents (dernières années)
  const recentMovies = computed(() => {
    const currentYear = new Date().getFullYear()
    return movies.value
      .filter(movie => movie.year >= currentYear - 2)
      .sort((a, b) => b.year - a.year)
  })

  // Catégories utilisées dans les films
  const usedCategories = computed(() => {
    const used = new Set(movies.value.map(movie => movie.category))
    return Array.from(used).sort()
  })

  // ACTIONS POUR LES CATÉGORIES
  const addCategory = (categoryName) => {
    if (!categories.value.includes(categoryName)) {
      categories.value.push(categoryName)
      categories.value.sort()
    }
  }

  const removeCategory = (categoryName) => {
    // Ne peut pas supprimer si utilisée
    const isUsed = movies.value.some(movie => movie.category === categoryName)
    if (!isUsed) {
      const index = categories.value.indexOf(categoryName)
      if (index > -1) {
        categories.value.splice(index, 1)
      }
      return true
    }
    return false
  }

  // ACTIONS ASYNCHRONES
  const saveMoviesToAPI = async () => {
    isLoading.value = true
    error.value = null
    
    try {
      // Simuler un appel API
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // Simuler une chance d'erreur (10%)
      if (Math.random() < 0.1) {
        throw new Error('Erreur de sauvegarde sur le serveur')
      }
      
      console.log('Films sauvegardés avec succès')
      return { success: true, message: 'Sauvegarde réussie' }
      
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const loadMoviesFromAPI = async () => {
    isLoading.value = true
    error.value = null
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Simuler des données supplémentaires
      const additionalMovies = [
        {
          id: Date.now() + 1,
          title: 'Film API 1',
          category: 'Action',
          year: 2024,
          rating: 4,
          description: 'Film chargé depuis l\'API',
          director: 'Réalisateur API',
          duration: 120,
          isFavorite: false,
          poster: createPlaceholderSvg('Film API 1'),
          backdrop: createPlaceholderSvg('Film API 1 Backdrop')
        }
      ]
      
      // Ajouter aux films existants
      movies.value.push(...additionalMovies)
      
      return { success: true, count: additionalMovies.length }
      
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      isLoading.value = false
    }
  }

  // ... actions existantes (addMovie, updateMovie, etc.) ...

  return {
    // État existant
    movies,
    filters,
    
    // NOUVEAUX ÉTATS
    isLoading,
    error,
    categories,
    
    // Getters existants
    totalMovies,
    favoriteMovies,
    uniqueCategories,
    filteredMovies,
    averageRating,
    
    // NOUVEAUX GETTERS
    movieStats,
    topRatedMovies,
    recentMovies,
    usedCategories,
    
    // Actions existantes
    addMovie,
    updateMovie,
    deleteMovie,
    toggleFavorite,
    getMovieById,
    updateFilters,
    clearFilters,
    
    // NOUVELLES ACTIONS
    addCategory,
    removeCategory,
    saveMoviesToAPI,
    loadMoviesFromAPI
  }
})
```

#### B. Composant MovieStats.vue

```vue
<template>
  <div class="movie-stats">
    <h2>📊 Statistiques des Films</h2>
    
    <div class="stats-grid">
      <div class="stat-card">
        <h3>{{ movieStats.total }}</h3>
        <p>Films au total</p>
      </div>
      
      <div class="stat-card">
        <h3>{{ movieStats.favorites }}</h3>
        <p>Favoris ({{ movieStats.favoritesPercentage }}%)</p>
      </div>
      
      <div class="stat-card">
        <h3>{{ movieStats.averageRating }}/5</h3>
        <p>Note moyenne</p>
      </div>
      
      <div class="stat-card">
        <h3>{{ movieStats.mostPopularCategory }}</h3>
        <p>Catégorie populaire</p>
      </div>
    </div>
    
    <div class="stats-details">
      <div class="category-stats">
        <h4>Par catégorie</h4>
        <div class="category-list">
          <div 
            v-for="(count, category) in movieStats.byCategory" 
            :key="category"
            class="category-item"
          >
            <span>{{ category }}</span>
            <span class="count">{{ count }}</span>
          </div>
        </div>
      </div>
      
      <div class="rating-stats">
        <h4>Par note</h4>
        <div class="rating-bars">
          <div 
            v-for="(count, rating) in movieStats.byRating" 
            :key="rating"
            class="rating-bar"
          >
            <span>{{ rating }}⭐</span>
            <div class="bar">
              <div 
                class="fill" 
                :style="{ width: (count / movieStats.total * 100) + '%' }"
              ></div>
            </div>
            <span>{{ count }}</span>
          </div>
        </div>
      </div>
    </div>
    
    <div class="actions">
      <button 
        @click="saveToAPI" 
        :disabled="isLoading"
        class="btn btn-primary"
      >
        {{ isLoading ? 'Sauvegarde...' : '💾 Sauvegarder' }}
      </button>
      
      <button 
        @click="loadFromAPI" 
        :disabled="isLoading"
        class="btn btn-secondary"
      >
        {{ isLoading ? 'Chargement...' : '📥 Charger plus' }}
      </button>
    </div>
    
    <div v-if="error" class="error">
      ❌ {{ error }}
    </div>
  </div>
</template>

<script setup>
import { useMovies } from '@/composables/useMovies'

const { 
  movieStats, 
  isLoading, 
  error, 
  saveMoviesToAPI, 
  loadMoviesFromAPI 
} = useMovies()

const saveToAPI = async () => {
  try {
    await saveMoviesToAPI()
  } catch (err) {
    console.error('Erreur de sauvegarde:', err)
  }
}

const loadFromAPI = async () => {
  try {
    await loadMoviesFromAPI()
  } catch (err) {
    console.error('Erreur de chargement:', err)
  }
}
</script>

<style scoped>
.movie-stats {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
}

.stat-card {
  background: #f8f9fa;
  padding: 1.5rem;
  border-radius: 8px;
  text-align: center;
}

.stat-card h3 {
  font-size: 2rem;
  color: #667eea;
  margin: 0 0 0.5rem 0;
}

.stats-details {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  margin-bottom: 2rem;
}

.category-item {
  display: flex;
  justify-content: space-between;
  padding: 0.5rem 0;
  border-bottom: 1px solid #eee;
}

.rating-bar {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 0.5rem;
}

.bar {
  flex: 1;
  height: 20px;
  background: #eee;
  border-radius: 10px;
  overflow: hidden;
}

.fill {
  height: 100%;
  background: #667eea;
  transition: width 0.3s ease;
}

.actions {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
}

.error {
  color: #e74c3c;
  padding: 1rem;
  background: #ffeaea;
  border-radius: 4px;
}
</style>
```

#### C. Mise à jour du composable useMovies.js

```javascript
export function useMovies() {
  const store = useMoviesStore()
  
  return {
    // État existant
    movies: store.movies,
    filters: store.filters,
    
    // NOUVEAUX ÉTATS
    isLoading: store.isLoading,
    error: store.error,
    categories: store.categories,
    
    // Getters existants
    totalMovies: store.totalMovies,
    filteredMovies: store.filteredMovies,
    favoriteMovies: store.favoriteMovies,
    uniqueCategories: store.uniqueCategories,
    
    // NOUVEAUX GETTERS
    movieStats: store.movieStats,
    topRatedMovies: store.topRatedMovies,
    recentMovies: store.recentMovies,
    usedCategories: store.usedCategories,
    
    // Actions existantes
    addMovie: store.addMovie,
    updateMovie: store.updateMovie,
    deleteMovie: store.deleteMovie,
    toggleFavorite: store.toggleFavorite,
    getMovieById: store.getMovieById,
    updateFilters: store.updateFilters,
    clearFilters: store.clearFilters,
    
    // NOUVELLES ACTIONS
    addCategory: store.addCategory,
    removeCategory: store.removeCategory,
    saveMoviesToAPI: store.saveMoviesToAPI,
    loadMoviesFromAPI: store.loadMoviesFromAPI
  }
}
```

## 🎯 Points clés de la correction

### 1. Architecture
- **Séparation claire** entre état, getters et actions
- **Computed réactifs** pour les statistiques
- **Gestion d'erreurs** robuste

### 2. Fonctionnalités avancées
- **Statistiques en temps réel** qui se mettent à jour automatiquement
- **Actions asynchrones** avec états de chargement
- **Gestion des catégories** dynamique
- **Interface utilisateur** réactive

### 3. Bonnes pratiques
- **Try/catch** pour la gestion d'erreurs
- **Loading states** pour l'UX
- **Computed properties** pour la performance
- **Modularité** du code

## ✅ Validation

- [ ] Les statistiques s'affichent correctement
- [ ] Les actions asynchrones fonctionnent avec loading
- [ ] La gestion d'erreur est opérationnelle
- [ ] Les catégories dynamiques sont gérées
- [ ] L'interface est responsive et attractive
- [ ] Le code est propre et commenté

## 🎓 Compétences acquises

- **Store Pinia avancé** avec état complexe
- **Actions asynchrones** et gestion d'erreurs
- **Computed properties** pour les statistiques
- **Interface réactive** avec Vue 3
- **Architecture modulaire** et maintenable

---

**🎯 Cette correction montre comment créer un store Pinia sophistiqué pour des applications réelles !**
