# ⭐ EXERCICE 1 - Phase 1 : Ajouter un système de notes

## 🎯 Objectif
Ajouter un champ "note" (1-5 étoiles) aux films et l'afficher dans l'interface.

## 📋 Consignes

### 1. Modifier la structure des données
Ajouter un champ `rating` aux films existants et au formulaire.

### 2. Ajouter le champ au formulaire
Créer un select pour choisir une note de 1 à 5 étoiles.

### 3. Afficher les notes
Afficher les étoiles dans la liste des films avec un système visuel.

### 4. Statistiques
Ajouter une carte de statistique pour la note moyenne.

## 🔧 Étapes détaillées

### Étape 1 : Modifier les données existantes
```javascript
// Dans setup(), modifier les films existants
const movies = ref([
  {
    id: 1,
    title: "Inception",
    category: "Science-Fiction",
    year: 2010,
    description: "Un voleur qui s'infiltre dans les rêves...",
    rating: 5 // ⭐ AJOUTER
  },
  // ... autres films avec rating
])
```

### Étape 2 : Ajouter le champ au formulaire
```vue
<div class="form-group">
  <label for="rating">Note (1-5 étoiles) :</label>
  <select id="rating" v-model.number="newMovie.rating">
    <option value="">Pas de note</option>
    <option value="1">⭐ (1 étoile)</option>
    <option value="2">⭐⭐ (2 étoiles)</option>
    <option value="3">⭐⭐⭐ (3 étoiles)</option>
    <option value="4">⭐⭐⭐⭐ (4 étoiles)</option>
    <option value="5">⭐⭐⭐⭐⭐ (5 étoiles)</option>
  </select>
</div>
```

### Étape 3 : Afficher les étoiles dans la liste
```vue
<div class="movie-rating" v-if="movie.rating">
  <span class="rating-label">Note :</span>
  <div class="stars">
    <span 
      v-for="star in 5" 
      :key="star"
      class="star"
      :class="{ 'star-filled': star <= movie.rating }"
    >
      ⭐
    </span>
  </div>
</div>
```

### Étape 4 : Ajouter les styles CSS
```css
.movie-rating {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin: 0.5rem 0;
}

.rating-label {
  font-size: 0.9rem;
  color: #666;
}

.stars {
  display: flex;
  gap: 2px;
}

.star {
  font-size: 1rem;
  filter: grayscale(100%);
  opacity: 0.3;
  transition: all 0.2s ease;
}

.star-filled {
  filter: grayscale(0%);
  opacity: 1;
}
```

### Étape 5 : Calculer la note moyenne
```javascript
const averageRating = computed(() => {
  const ratedMovies = movies.value.filter(movie => movie.rating)
  if (ratedMovies.length === 0) return 0
  
  const sum = ratedMovies.reduce((acc, movie) => acc + movie.rating, 0)
  return (sum / ratedMovies.length).toFixed(1)
})
```

### Étape 6 : Ajouter la carte de statistique
```vue
<div class="stat-card">
  <span class="stat-number">{{ averageRating }}</span>
  <div class="stat-label">Note moyenne</div>
</div>
```

## ✅ Critères de réussite

- [ ] Le formulaire contient un champ de sélection de note
- [ ] Les films affichent leurs étoiles selon leur note
- [ ] Les étoiles sont visuellement distinctes (pleines/vides)
- [ ] La note moyenne est calculée et affichée
- [ ] Les films sans note n'affichent pas d'étoiles
- [ ] Le style est cohérent avec le reste de l'application

## 🎯 Résultat attendu

Après cet exercice, l'application devrait permettre :
1. D'attribuer une note de 1 à 5 étoiles à chaque film
2. De visualiser les notes avec des étoiles dans la liste
3. De voir la note moyenne dans les statistiques
4. De modifier la note d'un film existant

## 💡 Conseils

- Utilisez `v-model.number` pour convertir automatiquement en nombre
- Pensez à gérer le cas où un film n'a pas de note
- Utilisez `computed()` pour calculer la note moyenne de manière réactive
- Les étoiles peuvent être des emojis ⭐ ou des caractères Unicode ★

## 🚀 Bonus (optionnel)

- Ajouter un filtre par note minimum
- Permettre de trier les films par note
- Ajouter des couleurs différentes selon la note (rouge < 3, orange 3-4, vert 5)
- Afficher le nombre de films par note dans les statistiques
