# ❤️ EXERCICE 3 - Phase 1 : Système de favoris

## 🎯 Objectif
Ajouter un système de films favoris avec un bouton cœur et des filtres dédiés.

## 📋 Consignes

### 1. Ajouter le champ favoris
Modifier la structure des données pour inclure un statut de favori.

### 2. Interface de gestion
Ajouter un bouton cœur sur chaque film pour basculer le statut.

### 3. Filtrage par favoris
Permettre d'afficher uniquement les favoris ou les non-favoris.

### 4. Statistiques
Afficher le nombre de films favoris dans les statistiques.

## 🔧 Étapes détaillées

### Étape 1 : Modifier la structure des données
```javascript
// Dans setup(), ajouter isFavorite aux films existants
const movies = ref([
  {
    id: 1,
    title: "Inception",
    category: "Science-Fiction",
    year: 2010,
    description: "Un voleur qui s'infiltre dans les rêves...",
    rating: 5,
    isFavorite: false // ⭐ AJOUTER
  },
  // ... autres films
])

// Ajouter au newMovie
const newMovie = reactive({
  title: '',
  category: '',
  year: '',
  description: '',
  rating: null,
  isFavorite: false // ⭐ AJOUTER
})
```

### Étape 2 : Ajouter le bouton cœur dans les cartes
```vue
<div class="movie-actions">
  <button @click="editMovie(movie)" class="btn">
    Modifier
  </button>
  <button @click="deleteMovie(movie.id)" class="btn btn-danger">
    Supprimer
  </button>
  <button 
    @click="toggleFavorite(movie.id)" 
    class="btn btn-favorite"
    :class="{ 'is-favorite': movie.isFavorite }"
  >
    {{ movie.isFavorite ? '❤️' : '🤍' }}
    {{ movie.isFavorite ? 'Favori' : 'Ajouter aux favoris' }}
  </button>
</div>
```

### Étape 3 : Implémenter la fonction toggleFavorite
```javascript
const toggleFavorite = (id) => {
  const movie = movies.value.find(m => m.id === id)
  if (movie) {
    movie.isFavorite = !movie.isFavorite
    
    // Message de feedback
    const action = movie.isFavorite ? 'ajouté aux' : 'retiré des'
    showMessage(`"${movie.title}" ${action} favoris`, 'success')
  }
}
```

### Étape 4 : Ajouter le filtre par favoris
```vue
<div class="form-group">
  <label for="favoriteFilter">Favoris :</label>
  <select id="favoriteFilter" v-model="favoriteFilter">
    <option value="">Tous les films</option>
    <option value="true">Favoris uniquement</option>
    <option value="false">Non favoris uniquement</option>
  </select>
</div>
```

```javascript
// Ajouter la variable réactive
const favoriteFilter = ref('')

// Modifier filteredMovies pour inclure le filtre favoris
const filteredMovies = computed(() => {
  return movies.value.filter(movie => {
    const matchesSearch = movie.title.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
        (movie.description && movie.description.toLowerCase().includes(searchTerm.value.toLowerCase()))
    const matchesCategory = !selectedCategory.value || movie.category === selectedCategory.value
    const matchesYear = !selectedYear.value || movie.year === parseInt(selectedYear.value)
    
    // ⭐ AJOUTER le filtre favoris
    const matchesFavorites = !favoriteFilter.value || 
      (favoriteFilter.value === 'true' && movie.isFavorite) ||
      (favoriteFilter.value === 'false' && !movie.isFavorite)

    return matchesSearch && matchesCategory && matchesYear && matchesFavorites
  })
})
```

### Étape 5 : Ajouter les statistiques des favoris
```javascript
const favoriteMovies = computed(() => {
  return movies.value.filter(movie => movie.isFavorite)
})
```

```vue
<div class="stat-card">
  <span class="stat-number">{{ favoriteMovies.length }}</span>
  <div class="stat-label">Favoris</div>
</div>
```

### Étape 6 : Ajouter une option au formulaire
```vue
<div class="form-group">
  <label class="checkbox-label">
    <input 
      type="checkbox" 
      v-model="newMovie.isFavorite"
    >
    <span class="checkmark"></span>
    Ajouter aux favoris
  </label>
</div>
```

### Étape 7 : Styles CSS pour les favoris
```css
.btn-favorite {
  background: #fff;
  border: 2px solid #ddd;
  color: #666;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 0.5rem;
}

.btn-favorite:hover {
  border-color: #ff6b6b;
  color: #ff6b6b;
}

.btn-favorite.is-favorite {
  background: #ff6b6b;
  border-color: #ff6b6b;
  color: white;
}

.btn-favorite.is-favorite:hover {
  background: #ff5252;
  border-color: #ff5252;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  font-weight: normal;
}

.checkbox-label input[type="checkbox"] {
  margin: 0;
  transform: scale(1.2);
}

.favorite-indicator {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.9rem;
  color: #ff6b6b;
  margin-left: 0.5rem;
}

/* Badge favori sur les cartes */
.movie-card.is-favorite {
  border-left: 4px solid #ff6b6b;
}

.movie-card.is-favorite .movie-title::after {
  content: " ❤️";
  font-size: 0.8em;
}
```

### Étape 8 : Ajouter des indicateurs visuels
```vue
<!-- Dans la carte de film -->
<div class="movie-card" :class="{ 'is-favorite': movie.isFavorite }">
  <div class="movie-header">
    <h3 class="movie-title">{{ movie.title }}</h3>
    <span v-if="movie.isFavorite" class="favorite-indicator">
      ❤️ Favori
    </span>
  </div>
  <!-- reste du contenu -->
</div>
```

### Étape 9 : Fonction de nettoyage des filtres
```javascript
const clearFilters = () => {
  searchTerm.value = ''
  selectedCategory.value = ''
  selectedYear.value = ''
  favoriteFilter.value = '' // ⭐ AJOUTER
}
```

## ✅ Critères de réussite

- [ ] Bouton cœur sur chaque film (vide/plein selon le statut)
- [ ] Clic sur le cœur bascule le statut de favori
- [ ] Filtre pour afficher favoris/non-favoris/tous
- [ ] Statistique du nombre de favoris
- [ ] Option dans le formulaire d'ajout
- [ ] Indicateurs visuels sur les cartes favorites
- [ ] Messages de feedback lors des changements
- [ ] Styles cohérents et attractifs

## 🎯 Résultat attendu

Après cet exercice, l'application devrait permettre :
1. De marquer/démarquer un film comme favori d'un clic
2. De filtrer pour voir uniquement les favoris
3. De voir le nombre de favoris dans les statistiques
4. D'identifier visuellement les films favoris
5. D'ajouter un film directement en favori

## 💡 Conseils

- Utilisez des emojis pour les cœurs : ❤️ (plein) et 🤍 (vide)
- Pensez aux transitions CSS pour les changements d'état
- Les messages de feedback améliorent l'expérience utilisateur
- Testez le comportement avec les autres filtres
- Gardez une cohérence visuelle avec le reste de l'app

## 🚀 Bonus (optionnel)

- Ajouter une page dédiée aux favoris
- Permettre de supprimer tous les favoris d'un coup
- Ajouter des animations lors du changement de statut
- Tri par favoris (favoris en premier)
- Export de la liste des favoris
- Statistiques avancées (% de favoris par catégorie)
