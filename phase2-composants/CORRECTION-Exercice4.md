# 📊 CORRECTION - Exercice 4 : Composant SortSelector

## 📋 Objectif
Ajouter un composant `SortSelector` réutilisable pour trier les films par différents critères.

## ✅ Implémentation

### 1. Composant SortSelector.vue

**Fonctionnalités implémentées :**
- 📋 Sélection du critère de tri
- ↕️ Basculement ascendant/descendant
- 🔄 Réinitialisation du tri
- 📊 Indicateur de tri actif
- 🎨 Interface intuitive et responsive
- ✅ Validation des options

**Props :**
```javascript
{
  modelValue: Object,        // { sortBy: '', direction: 'asc' }
  options: Array,           // Options de tri disponibles
  label: String,            // Label du composant
  defaultText: String,      // Texte par défaut
  defaultDirection: String, // Direction par défaut
  showIndicator: Boolean    // Afficher l'indicateur
}
```

**Events :**
```javascript
emits: ['update:modelValue', 'sort-change']
```

### 2. Configuration des options de tri

#### **Options pour les films**
```javascript
const sortOptions = [
  { value: 'title', label: 'Titre' },
  { value: 'year', label: 'Année' },
  { value: 'rating', label: 'Note' },
  { value: 'category', label: 'Catégorie' },
  { value: 'popularity', label: 'Popularité' },
  { value: 'vote_count', label: 'Nombre de votes' }
]
```

#### **Utilisation dans l'application**
```vue
<SortSelector
  v-model="sortConfig"
  :options="sortOptions"
  label="Trier les films :"
  default-text="Ordre par défaut"
  :show-indicator="true"
  @sort-change="handleSortChange"
/>
```

### 3. Intégration dans App.vue

#### **Données réactives**
```javascript
const sortConfig = ref({
  sortBy: '',
  direction: 'asc'
})

const sortOptions = [
  { value: 'title', label: 'Titre alphabétique' },
  { value: 'year', label: 'Année de sortie' },
  { value: 'vote_average', label: 'Note moyenne' },
  { value: 'category', label: 'Catégorie' },
  { value: 'popularity', label: 'Popularité' }
]
```

#### **Logique de tri**
```javascript
const sortedMovies = computed(() => {
  if (!sortConfig.value.sortBy) {
    return filteredMovies.value
  }

  return [...filteredMovies.value].sort((a, b) => {
    const { sortBy, direction } = sortConfig.value
    let aValue = a[sortBy]
    let bValue = b[sortBy]

    // Gestion des chaînes de caractères
    if (typeof aValue === 'string') {
      aValue = aValue.toLowerCase()
      bValue = bValue.toLowerCase()
    }

    // Comparaison
    let result = 0
    if (aValue < bValue) result = -1
    else if (aValue > bValue) result = 1

    // Application de la direction
    return direction === 'desc' ? -result : result
  })
})
```

#### **Gestion des changements**
```javascript
const handleSortChange = (newSort) => {
  console.log('Nouveau tri:', newSort)
  // Logique supplémentaire si nécessaire
}
```

### 4. Interface utilisateur

#### **Contrôles de tri**
- **Select** : Choix du critère de tri
- **Bouton direction** : ↑ (croissant) / ↓ (décroissant)
- **Bouton reset** : ✕ pour supprimer le tri

#### **Indicateur de tri actif**
```vue
<div class="sort-indicator">
  Trié par <strong>Titre alphabétique</strong> (croissant)
</div>
```

#### **États visuels**
- **Aucun tri** : Select seul
- **Tri actif** : Select + boutons direction/reset
- **Hover/Focus** : Effets visuels appropriés

## 🎨 Fonctionnalités avancées

### **Basculement de direction intelligent**
```javascript
const toggleDirection = () => {
  currentDirection.value = currentDirection.value === 'asc' ? 'desc' : 'asc'
  updateSort()
}
```

### **Réinitialisation complète**
```javascript
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
```

### **Validation des options**
```javascript
validator(options) {
  return options.every(option => 
    option.value && option.label && typeof option.value === 'string'
  )
}
```

## 🚀 Exemples d'utilisation

### **Tri basique**
```vue
<SortSelector
  v-model="sort"
  :options="[
    { value: 'name', label: 'Nom' },
    { value: 'date', label: 'Date' }
  ]"
/>
```

### **Tri avancé avec indicateur**
```vue
<SortSelector
  v-model="movieSort"
  :options="movieSortOptions"
  label="Trier la collection :"
  default-text="Ordre d'ajout"
  default-direction="desc"
  :show-indicator="true"
  @sort-change="onSortChange"
/>
```

### **Tri personnalisé**
```vue
<SortSelector
  v-model="customSort"
  :options="customOptions"
  label="Organiser par :"
  default-text="Aucun classement"
  :show-indicator="false"
/>
```

## 🎯 Intégration complète

### **Dans MovieFilters.vue**
```vue
<template>
  <div class="filters-section">
    <!-- Autres filtres -->
    
    <div class="filter-group">
      <SortSelector
        v-model="sortConfig"
        :options="sortOptions"
        label="Trier par :"
        @sort-change="$emit('sort-change', $event)"
      />
    </div>
  </div>
</template>
```

### **Dans App.vue**
```vue
<template>
  <!-- Filtres avec tri -->
  <MovieFilters
    :sort-config="sortConfig"
    @sort-change="handleSortChange"
  />
  
  <!-- Films triés -->
  <div class="movies-grid">
    <MovieCard
      v-for="movie in sortedAndFilteredMovies"
      :key="movie.id"
      :movie="movie"
    />
  </div>
</template>
```

## 🚀 Avantages

### ✅ Expérience utilisateur
- **Tri intuitif** : Interface familière avec select + boutons
- **Feedback visuel** : Indicateurs clairs de l'état actuel
- **Contrôle total** : Direction et réinitialisation faciles

### ✅ Flexibilité
- **Options configurables** : Critères de tri personnalisables
- **Directions multiples** : Ascendant/descendant
- **Réutilisable** : Fonctionne avec tout type de données

### ✅ Performance
- **Tri optimisé** : Computed properties pour la réactivité
- **Validation** : Prévention des erreurs de configuration
- **Mémoire** : Garde l'état du tri entre les interactions

## 📚 Concepts Vue.js utilisés

- **Composition API** : `setup()`, `ref()`, `computed()`, `watch()`
- **v-model personnalisé** : Objet complexe avec `modelValue`
- **Props validation** : Validators personnalisés
- **Événements personnalisés** : `sort-change` pour logique métier
- **Computed properties** : Tri réactif des données
- **Watchers** : Synchronisation des changements
- **Styles scopés** : Interface cohérente

## 🎯 Résultat

Le composant SortSelector offre une solution complète de tri avec :
- Interface intuitive et professionnelle
- Flexibilité maximale pour différents types de données
- Performance optimisée avec la réactivité Vue
- Intégration seamless dans l'architecture existante

Les utilisateurs peuvent maintenant organiser leur collection comme ils le souhaitent ! 📈
