# 🏪 Exercice 1 : Store Pinia Avancé

**Durée estimée : 45-60 minutes**

## 🎯 Objectif

Étendre le store Pinia avec des fonctionnalités avancées : gestion des catégories dynamiques, statistiques détaillées et actions asynchrones.

## 📋 Prérequis

- Compréhension du store Pinia existant
- Maîtrise des computed et reactive
- Notions d'API asynchrone

## 🎬 Contexte

Le store actuel gère les films de base. Nous allons l'enrichir avec :
- Gestion dynamique des catégories
- Statistiques avancées des films
- Simulation d'API asynchrone
- Cache intelligent

## 📝 Tâches à réaliser

### **Étape 1 : Statistiques avancées (15 min)**

Ajoutez ces getters au store `movies.js` :

```javascript
// Statistiques détaillées
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
```

### **Étape 2 : Gestion des catégories dynamiques (15 min)**

Ajoutez la gestion des catégories :

```javascript
// État pour les catégories
const categories = ref([
  'Action', 'Comédie', 'Drame', 'Horreur', 'Romance', 
  'Science-Fiction', 'Thriller', 'Animation', 'Documentaire'
])

// Catégories utilisées dans les films
const usedCategories = computed(() => {
  const used = new Set(movies.value.map(movie => movie.category))
  return Array.from(used).sort()
})

// Actions pour les catégories
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
```

### **Étape 3 : Actions asynchrones simulées (15 min)**

Ajoutez des actions asynchrones :

```javascript
// État de chargement
const isLoading = ref(false)
const error = ref(null)

// Simulation d'API - Sauvegarde
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

// Simulation d'API - Chargement
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
        poster: createPlaceholderSvg('Film API 1')
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
```

## 🎨 Interface utilisateur

### **Étape 4 : Composant de statistiques (15 min)**

Créez `src/components/MovieStats.vue` :

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

## 🧪 Tests et validation

### **Étape 5 : Intégration (10 min)**

1. **Ajoutez le composant** dans `Movies.vue` :
```vue
<template>
  <div class="movies-page">
    <MovieStats />
    <!-- Reste du contenu existant -->
  </div>
</template>

<script setup>
import MovieStats from '@/components/MovieStats.vue'
// ... autres imports
</script>
```

2. **Mettez à jour** `useMovies.js` pour exposer les nouvelles fonctionnalités :
```javascript
export function useMovies() {
  const store = useMoviesStore()
  
  return {
    // ... propriétés existantes
    movieStats: store.movieStats,
    topRatedMovies: store.topRatedMovies,
    recentMovies: store.recentMovies,
    categories: store.categories,
    usedCategories: store.usedCategories,
    isLoading: store.isLoading,
    error: store.error,
    
    // ... actions existantes
    addCategory: store.addCategory,
    removeCategory: store.removeCategory,
    saveMoviesToAPI: store.saveMoviesToAPI,
    loadMoviesFromAPI: store.loadMoviesFromAPI
  }
}
```

## ✅ Critères de validation

- [ ] Les statistiques s'affichent correctement
- [ ] Les actions asynchrones fonctionnent avec loading
- [ ] La gestion d'erreur est opérationnelle
- [ ] Les catégories dynamiques sont gérées
- [ ] L'interface est responsive et attractive
- [ ] Le code est propre et commenté

## 🎯 Bonus (optionnel)

- Ajoutez une **persistance locale** avec localStorage
- Créez un **système de cache** intelligent
- Implémentez des **notifications** pour les actions
- Ajoutez des **graphiques** avec une librairie comme Chart.js

## 💡 Points clés à retenir

- **Computed avancés** pour les statistiques complexes
- **Actions asynchrones** avec gestion d'état
- **Gestion d'erreurs** robuste
- **Réactivité** de Pinia pour l'UI
- **Séparation** logique/présentation

---

**🎓 Cet exercice vous apprend à créer des stores Pinia sophistiqués pour des applications réelles !**
