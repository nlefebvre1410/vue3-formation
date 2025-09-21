# 📊 EXERCICE 2 - Phase 1 : Système de tri des films

## 🎯 Objectif
Implémenter un système de tri pour organiser les films par titre, année ou note.

## 📋 Consignes

### 1. Ajouter les contrôles de tri
Créer une interface pour sélectionner le critère et la direction du tri.

### 2. Implémenter la logique de tri
Utiliser une propriété calculée pour trier les films selon les critères choisis.

### 3. Gérer les directions
Permettre un tri croissant et décroissant pour chaque critère.

### 4. Interface utilisateur
Créer une interface intuitive avec des indicateurs visuels.

## 🔧 Étapes détaillées

### Étape 1 : Ajouter les variables réactives
```javascript
// Dans setup()
const sortBy = ref('') // 'title', 'year', 'rating'
const sortDirection = ref('asc') // 'asc' ou 'desc'
```

### Étape 2 : Créer l'interface de tri
```vue
<div class="card">
  <h3>🔄 Trier les films</h3>
  <div class="sort-controls">
    <div class="form-group">
      <label for="sortBy">Trier par :</label>
      <select id="sortBy" v-model="sortBy">
        <option value="">Ordre d'ajout</option>
        <option value="title">Titre (A-Z)</option>
        <option value="year">Année</option>
        <option value="rating">Note</option>
      </select>
    </div>
    
    <div class="form-group" v-if="sortBy">
      <label for="sortDirection">Direction :</label>
      <select id="sortDirection" v-model="sortDirection">
        <option value="asc">
          {{ getSortLabel('asc') }}
        </option>
        <option value="desc">
          {{ getSortLabel('desc') }}
        </option>
      </select>
    </div>
    
    <button 
      v-if="sortBy" 
      @click="clearSort" 
      class="btn btn-secondary"
    >
      Réinitialiser
    </button>
  </div>
</div>
```

### Étape 3 : Implémenter la logique de tri
```javascript
const sortedMovies = computed(() => {
  if (!sortBy.value) {
    return filteredMovies.value
  }
  
  return [...filteredMovies.value].sort((a, b) => {
    let aValue = a[sortBy.value]
    let bValue = b[sortBy.value]
    
    // Gestion des valeurs manquantes
    if (aValue === undefined || aValue === null) aValue = ''
    if (bValue === undefined || bValue === null) bValue = ''
    
    // Conversion en minuscules pour le tri alphabétique
    if (typeof aValue === 'string') {
      aValue = aValue.toLowerCase()
      bValue = bValue.toLowerCase()
    }
    
    let result = 0
    if (aValue < bValue) result = -1
    else if (aValue > bValue) result = 1
    
    // Appliquer la direction
    return sortDirection.value === 'desc' ? -result : result
  })
})
```

### Étape 4 : Ajouter les méthodes utilitaires
```javascript
const getSortLabel = (direction) => {
  if (!sortBy.value) return ''
  
  const labels = {
    title: {
      asc: 'A → Z',
      desc: 'Z → A'
    },
    year: {
      asc: 'Plus ancien → Plus récent',
      desc: 'Plus récent → Plus ancien'
    },
    rating: {
      asc: 'Note croissante',
      desc: 'Note décroissante'
    }
  }
  
  return labels[sortBy.value]?.[direction] || ''
}

const clearSort = () => {
  sortBy.value = ''
  sortDirection.value = 'asc'
}
```

### Étape 5 : Modifier l'affichage des films
```vue
<!-- Remplacer filteredMovies par sortedMovies -->
<div class="movie-card" v-for="movie in sortedMovies" :key="movie.id">
  <!-- contenu de la carte -->
</div>
```

### Étape 6 : Ajouter les styles CSS
```css
.sort-controls {
  display: flex;
  gap: 1rem;
  align-items: end;
  flex-wrap: wrap;
}

.sort-controls .form-group {
  margin-bottom: 0;
  min-width: 200px;
}

.sort-indicator {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: #e8f5e8;
  border: 1px solid #42b883;
  border-radius: 6px;
  font-size: 0.9rem;
  color: #2d5a3d;
  margin-top: 1rem;
}

.sort-arrow {
  font-weight: bold;
}

@media (max-width: 768px) {
  .sort-controls {
    flex-direction: column;
    align-items: stretch;
  }
  
  .sort-controls .form-group {
    min-width: unset;
  }
}
```

### Étape 7 : Ajouter un indicateur de tri actif
```vue
<div v-if="sortBy" class="sort-indicator">
  <span>📊 Trié par {{ getSortCriteriaLabel() }}</span>
  <span class="sort-arrow">
    {{ sortDirection === 'asc' ? '↑' : '↓' }}
  </span>
</div>
```

```javascript
const getSortCriteriaLabel = () => {
  const labels = {
    title: 'titre',
    year: 'année',
    rating: 'note'
  }
  return labels[sortBy.value] || ''
}
```

## ✅ Critères de réussite

- [ ] Interface de tri avec select pour le critère
- [ ] Sélection de la direction (croissant/décroissant)
- [ ] Tri fonctionnel pour titre, année et note
- [ ] Gestion des valeurs manquantes (films sans note)
- [ ] Bouton de réinitialisation du tri
- [ ] Indicateur visuel du tri actif
- [ ] Labels adaptatifs selon le critère choisi
- [ ] Interface responsive

## 🎯 Résultat attendu

Après cet exercice, l'application devrait permettre :
1. De trier les films par titre alphabétique (A-Z ou Z-A)
2. De trier par année (ancien→récent ou récent→ancien)
3. De trier par note (croissant ou décroissant)
4. De voir clairement quel tri est appliqué
5. De revenir à l'ordre d'origine facilement

## 💡 Conseils

- Utilisez `computed()` pour que le tri soit réactif
- Pensez à cloner le tableau avec `[...array]` avant de trier
- Gérez les cas où les films n'ont pas de note
- Les labels doivent être explicites pour l'utilisateur
- Testez avec différents jeux de données

## 🚀 Bonus (optionnel)

- Ajouter un tri par catégorie
- Permettre un tri multi-critères (ex: année puis titre)
- Ajouter des animations lors du changement de tri
- Mémoriser le tri choisi dans le localStorage
- Ajouter des icônes pour les directions de tri
