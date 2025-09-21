# 🔍 EXERCICE 3 : Composant MovieFilters

## 📋 Objectif
Créer un composant de filtrage avancé pour rechercher et trier les films avec une interface utilisateur sophistiquée.

**Durée estimée** : 60-75 minutes

## 🎯 Fonctionnalités à implémenter

### 1. Composant MovieFilters.vue
Créez un composant dans `src/components/MovieFilters.vue` avec :

**Props :**
- `movies` (Array) : Liste complète des films
- `categories` (Array) : Catégories disponibles
- `initialFilters` (Object, optionnel) : Filtres par défaut

**Événements :**
- `update:filters` : Émis quand les filtres changent
- `reset` : Émis quand les filtres sont réinitialisés

**Fonctionnalités :**
- 🔍 Recherche textuelle dans titre/description
- 📂 Filtrage par catégorie
- 📅 Filtrage par année ou plage d'années
- ⭐ Filtrage par note minimale
- ❤️ Filtrage favoris/non-favoris
- 📊 Tri par différents critères
- 🔄 Réinitialisation rapide
- 📱 Interface responsive et moderne

### 2. Structure des filtres
```javascript
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
```

### 3. Template de base
```vue
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
```

## 🔧 Étapes de développement

### Étape 1 : Structure de base (20 min)
1. Créez le fichier `src/components/MovieFilters.vue`
2. Implémentez la structure HTML des filtres
3. Ajoutez les props et la logique de base
4. Testez l'affichage du composant

### Étape 2 : Logique de filtrage (25 min)
1. Implémentez la fonction de filtrage principale
2. Ajoutez la logique de recherche textuelle
3. Gérez les filtres par catégorie, année, note
4. Testez chaque filtre individuellement

### Étape 3 : Système de tri (15 min)
1. Implémentez les fonctions de tri
2. Gérez l'ordre croissant/décroissant
3. Combinez tri et filtrage
4. Testez les différents critères de tri

### Étape 4 : Interface avancée (15 min)
1. Ajoutez les styles CSS modernes
2. Implémentez l'interface responsive
3. Ajoutez les animations et transitions
4. Testez sur différentes tailles d'écran

## 💡 Logique de filtrage

### Fonction principale de filtrage
```javascript
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
    result = result.filter(movie => (movie.rating || 0) >= filters.minRating)
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
```

### Watchers pour les filtres
```javascript
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
```

## 🎨 Styles CSS

### Styles principaux
```css
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
```

### Animations et transitions
```css
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
```

## 🧪 Tests à effectuer

### Tests de filtrage
- [ ] Recherche textuelle fonctionne dans titre/description
- [ ] Filtrage par catégorie isole les bons films
- [ ] Filtrage par année respecte les plages
- [ ] Filtrage par note minimale fonctionne
- [ ] Filtrage favoris affiche les bons films
- [ ] Combinaison de filtres fonctionne

### Tests de tri
- [ ] Tri par titre (alphabétique)
- [ ] Tri par année (numérique)
- [ ] Tri par note (numérique)
- [ ] Tri par catégorie (alphabétique)
- [ ] Ordre croissant/décroissant
- [ ] Tri avec filtres combinés

### Tests d'interface
- [ ] Interface responsive sur mobile
- [ ] Réinitialisation vide tous les filtres
- [ ] Validation des plages d'années
- [ ] Feedback visuel en temps réel

## 🔄 Intégration dans l'application

### Dans App.vue
```vue
<template>
  <div id="app">
    <!-- Autres composants -->
    
    <MovieFilters
      :movies="movies"
      :categories="uniqueCategories"
      :initial-filters="defaultFilters"
      @update:filters="handleFiltersUpdate"
      @reset="handleFiltersReset"
    />
    
    <div class="movies-grid">
      <MovieCard
        v-for="movie in filteredMovies"
        :key="movie.id"
        :movie="movie"
      />
    </div>
  </div>
</template>

<script setup>
import MovieFilters from './components/MovieFilters.vue'

const filteredMovies = ref([])

const handleFiltersUpdate = ({ filters, results }) => {
  filteredMovies.value = results
  // Optionnel : sauvegarder les filtres dans localStorage
  localStorage.setItem('movieFilters', JSON.stringify(filters))
}

const handleFiltersReset = () => {
  filteredMovies.value = movies.value
  localStorage.removeItem('movieFilters')
}
</script>
```

## 🚀 Améliorations optionnelles

### Fonctionnalités avancées
- **Sauvegarde des filtres** : Persistance dans localStorage
- **Filtres prédéfinis** : "Mes favoris", "Films récents", etc.
- **Recherche avancée** : Recherche par réalisateur, acteur
- **Filtres par durée** : Films courts/longs
- **Historique de recherche** : Suggestions basées sur l'historique
- **Export des résultats** : Export CSV/JSON des films filtrés

### Interface avancée
```vue
<!-- Filtres prédéfinis -->
<div class="preset-filters">
  <button
    v-for="preset in presetFilters"
    :key="preset.name"
    @click="applyPreset(preset)"
    class="preset-btn"
  >
    {{ preset.icon }} {{ preset.name }}
  </button>
</div>

<!-- Statistiques en temps réel -->
<div class="filter-stats">
  <div class="stat">
    <span class="stat-value">{{ averageRating }}</span>
    <span class="stat-label">Note moyenne</span>
  </div>
  <div class="stat">
    <span class="stat-value">{{ uniqueCategories.length }}</span>
    <span class="stat-label">Catégories</span>
  </div>
</div>
```

## ✅ Critères de validation

### Fonctionnalités minimales
- ✅ Composant MovieFilters créé et fonctionnel
- ✅ Tous les filtres implémentés et testés
- ✅ Système de tri complet
- ✅ Interface utilisateur moderne
- ✅ Intégration dans l'application

### Qualité du code
- ✅ Code propre et performant
- ✅ Logique de filtrage optimisée
- ✅ Interface responsive
- ✅ Gestion d'erreurs
- ✅ Accessibilité respectée

## 🎓 Compétences acquises

À la fin de cet exercice, vous maîtriserez :
- **Filtrage et tri** de données complexes
- **Computed properties** avancées
- **Watchers** pour la réactivité
- **Interface utilisateur** sophistiquée
- **Performance** et optimisation
- **Intégration** de composants complexes

---

**🎯 Cet exercice vous apprend à créer des interfaces de filtrage professionnelles avec Vue.js !**
