# 🔍 CORRECTION - Exercice 2 : Composant SearchInput

## 📋 Objectif
Extraire la recherche dans un composant `SearchInput` réutilisable avec debounce.

## ✅ Implémentation

### 1. Composant SearchInput.vue

**Fonctionnalités implémentées :**
- 🔍 Champ de recherche avec icône
- ⏱️ Debounce configurable (défaut: 300ms)
- 🎯 Longueur minimum configurable (défaut: 2 caractères)
- ✕ Bouton de suppression avec raccourci Escape
- 📊 Indicateur de recherche en cours
- 📈 Affichage du nombre de résultats
- 🎨 Interface moderne et responsive

**Props :**
```javascript
{
  modelValue: String,        // Valeur de recherche (v-model)
  placeholder: String,       // Placeholder (défaut: "Rechercher...")
  debounceDelay: Number,     // Délai debounce en ms (défaut: 300)
  minLength: Number,         // Longueur min pour recherche (défaut: 2)
  resultsCount: Number,      // Nombre de résultats trouvés
  loading: Boolean          // État de chargement
}
```

**Events :**
```javascript
emits: ['update:modelValue', 'search', 'clear']
```

### 2. Fonctionnalités avancées

#### **Debounce intelligent**
```javascript
const debouncedSearch = (value) => {
  if (debounceTimer.value) {
    clearTimeout(debounceTimer.value)
  }

  debounceTimer.value = setTimeout(() => {
    if (value.length >= props.minLength) {
      emit('search', value)
    } else if (value.length === 0) {
      emit('clear')
    }
  }, props.debounceDelay)
}
```

#### **Gestion des états**
- **Vide** : Icône de recherche 🔍
- **Avec texte** : Bouton de suppression ✕
- **En recherche** : Spinner + "Recherche en cours..."
- **Avec résultats** : Compteur de résultats

#### **Accessibilité**
- Support de la touche Escape
- Focus management
- ARIA labels appropriés
- Contraste des couleurs respecté

### 3. Utilisation

#### **Utilisation basique**
```vue
<SearchInput 
  v-model="searchTerm"
  placeholder="Rechercher un film..."
  @search="handleSearch"
  @clear="handleClear"
/>
```

#### **Utilisation avancée**
```vue
<SearchInput 
  v-model="searchTerm"
  :debounce-delay="500"
  :min-length="3"
  :results-count="filteredMovies.length"
  :loading="isSearching"
  placeholder="Rechercher dans la collection..."
  @search="performSearch"
  @clear="clearSearch"
/>
```

#### **Intégration dans MovieFilters**
```vue
<!-- Remplace l'ancien input -->
<SearchInput 
  v-model="filters.search"
  placeholder="Rechercher un film..."
  :results-count="movies.length"
  @search="updateFilter('search', $event)"
  @clear="updateFilter('search', '')"
/>
```

## 🎨 Styles et UX

### **Design moderne**
- Bordures arrondies (10px)
- Transitions fluides (0.3s)
- États de focus avec ombre colorée
- Icônes intuitives

### **Responsive**
- Adaptation mobile
- Boutons tactiles appropriés
- Layout flexible

### **Feedback visuel**
- Spinner animé pendant la recherche
- Compteur de résultats en temps réel
- Boutons avec effets hover/active

## 🚀 Avantages

### ✅ Performance
- **Debounce** : Évite les requêtes excessives
- **Seuil minimum** : Pas de recherche sur 1 caractère
- **Annulation** : Annule les recherches précédentes

### ✅ UX améliorée
- **Feedback immédiat** : Indicateurs visuels
- **Raccourcis clavier** : Escape pour effacer
- **États clairs** : Vide, recherche, résultats

### ✅ Réutilisabilité
- **Configurable** : Délais, seuils, textes
- **Générique** : Utilisable partout
- **v-model** : Intégration native Vue

## 📚 Concepts Vue.js utilisés

- **Composition API** : `setup()`, `ref()`, `computed()`, `watch()`
- **v-model personnalisé** : `modelValue` + `update:modelValue`
- **Timers JavaScript** : `setTimeout()`, `clearTimeout()`
- **Watchers** : Surveillance des changements
- **Événements personnalisés** : Communication parent-enfant
- **Lifecycle hooks** : `onMounted()`, `onUnmounted()`
- **Styles scopés** : Isolation CSS

## 🎯 Résultat

Le composant SearchInput offre une expérience de recherche moderne et performante avec :
- Debounce pour optimiser les performances
- Interface intuitive et accessible
- Feedback visuel en temps réel
- Réutilisabilité maximale

Parfait pour remplacer les inputs de recherche basiques ! 🎉
