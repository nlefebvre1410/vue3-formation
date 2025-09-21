# ✅ EXERCICE 4 - Phase 1 : Validation avancée du formulaire

## 🎯 Objectif
Améliorer la validation du formulaire avec des règles métier avancées et des messages d'erreur détaillés.

## 📋 Consignes

### 1. Validation en temps réel
Implémenter une validation qui s'exécute pendant la saisie.

### 2. Règles métier
Ajouter des règles spécifiques (titre unique, année valide, etc.).

### 3. Messages d'erreur
Afficher des messages d'erreur contextuels et utiles.

### 4. État du formulaire
Désactiver la soumission si le formulaire n'est pas valide.

## 🔧 Étapes détaillées

### Étape 1 : Créer un système de validation réactif
```javascript
// Dans setup()
const validationErrors = reactive({
  title: [],
  category: [],
  year: [],
  description: []
})

const isFormValid = computed(() => {
  return Object.values(validationErrors).every(errors => errors.length === 0) &&
         newMovie.title && 
         newMovie.category && 
         newMovie.year
})
```

### Étape 2 : Fonctions de validation
```javascript
const validateTitle = () => {
  const errors = []
  
  if (!newMovie.title) {
    errors.push('Le titre est obligatoire')
  } else if (newMovie.title.length < 2) {
    errors.push('Le titre doit contenir au moins 2 caractères')
  } else if (newMovie.title.length > 100) {
    errors.push('Le titre ne peut pas dépasser 100 caractères')
  }
  
  // Vérifier l'unicité (sauf en mode édition)
  const existingMovie = movies.value.find(movie => 
    movie.title.toLowerCase() === newMovie.title.toLowerCase() &&
    (!isEditing.value || movie.id !== editingId.value)
  )
  
  if (existingMovie) {
    errors.push('Un film avec ce titre existe déjà')
  }
  
  validationErrors.title = errors
}

const validateYear = () => {
  const errors = []
  const currentYear = new Date().getFullYear()
  
  if (!newMovie.year) {
    errors.push('L\'année est obligatoire')
  } else if (newMovie.year < 1888) {
    errors.push('L\'année ne peut pas être antérieure à 1888 (premier film)')
  } else if (newMovie.year > currentYear + 5) {
    errors.push(`L'année ne peut pas dépasser ${currentYear + 5}`)
  }
  
  validationErrors.year = errors
}

const validateCategory = () => {
  const errors = []
  
  if (!newMovie.category) {
    errors.push('La catégorie est obligatoire')
  } else if (!availableCategories.includes(newMovie.category)) {
    errors.push('Catégorie non valide')
  }
  
  validationErrors.category = errors
}

const validateDescription = () => {
  const errors = []
  
  if (newMovie.description && newMovie.description.length > 500) {
    errors.push('La description ne peut pas dépasser 500 caractères')
  }
  
  validationErrors.description = errors
}
```

### Étape 3 : Validation en temps réel
```javascript
// Watchers pour validation en temps réel
watch(() => newMovie.title, validateTitle)
watch(() => newMovie.year, validateYear)
watch(() => newMovie.category, validateCategory)
watch(() => newMovie.description, validateDescription)

// Validation complète
const validateForm = () => {
  validateTitle()
  validateYear()
  validateCategory()
  validateDescription()
}
```

### Étape 4 : Améliorer le template avec les erreurs
```vue
<form @submit.prevent="isEditing ? updateMovie() : addMovie()">
  <div class="form-group">
    <label for="title">Titre du film :</label>
    <input
      id="title"
      v-model="newMovie.title"
      type="text"
      placeholder="Entrez le titre du film"
      :class="{ 'error': validationErrors.title.length > 0 }"
      @blur="validateTitle"
    >
    <div v-if="validationErrors.title.length > 0" class="error-messages">
      <div v-for="error in validationErrors.title" :key="error" class="error-message">
        ⚠️ {{ error }}
      </div>
    </div>
  </div>

  <div class="form-group">
    <label for="category">Catégorie :</label>
    <select 
      id="category" 
      v-model="newMovie.category"
      :class="{ 'error': validationErrors.category.length > 0 }"
      @change="validateCategory"
    >
      <option value="">Sélectionnez une catégorie</option>
      <option v-for="category in availableCategories" :key="category" :value="category">
        {{ category }}
      </option>
    </select>
    <div v-if="validationErrors.category.length > 0" class="error-messages">
      <div v-for="error in validationErrors.category" :key="error" class="error-message">
        ⚠️ {{ error }}
      </div>
    </div>
  </div>

  <div class="form-group">
    <label for="year">Année de sortie :</label>
    <input
      id="year"
      v-model.number="newMovie.year"
      type="number"
      min="1888"
      :max="new Date().getFullYear() + 5"
      placeholder="Année de sortie"
      :class="{ 'error': validationErrors.year.length > 0 }"
      @blur="validateYear"
    >
    <div v-if="validationErrors.year.length > 0" class="error-messages">
      <div v-for="error in validationErrors.year" :key="error" class="error-message">
        ⚠️ {{ error }}
      </div>
    </div>
  </div>

  <div class="form-group">
    <label for="description">Description :</label>
    <textarea
      id="description"
      v-model="newMovie.description"
      placeholder="Description du film (optionnel)"
      rows="3"
      :class="{ 'error': validationErrors.description.length > 0 }"
      @blur="validateDescription"
    ></textarea>
    <div class="character-count">
      {{ newMovie.description?.length || 0 }}/500 caractères
    </div>
    <div v-if="validationErrors.description.length > 0" class="error-messages">
      <div v-for="error in validationErrors.description" :key="error" class="error-message">
        ⚠️ {{ error }}
      </div>
    </div>
  </div>

  <div class="form-actions">
    <button 
      type="submit" 
      class="btn"
      :disabled="!isFormValid"
      :class="{ 'disabled': !isFormValid }"
    >
      {{ isEditing ? '✅ Mettre à jour' : '➕ Ajouter le film' }}
    </button>
    
    <button 
      v-if="isEditing" 
      type="button" 
      class="btn btn-secondary" 
      @click="cancelEdit"
    >
      Annuler
    </button>
    
    <button 
      type="button" 
      class="btn btn-secondary" 
      @click="resetForm"
    >
      🔄 Réinitialiser
    </button>
  </div>
</form>
```

### Étape 5 : Styles CSS pour la validation
```css
.form-group input.error,
.form-group select.error,
.form-group textarea.error {
  border-color: #dc3545;
  box-shadow: 0 0 0 0.2rem rgba(220, 53, 69, 0.25);
}

.error-messages {
  margin-top: 0.25rem;
}

.error-message {
  color: #dc3545;
  font-size: 0.875rem;
  display: flex;
  align-items: center;
  gap: 0.25rem;
  margin-bottom: 0.25rem;
}

.character-count {
  font-size: 0.8rem;
  color: #666;
  text-align: right;
  margin-top: 0.25rem;
}

.character-count.warning {
  color: #ff9800;
}

.character-count.error {
  color: #dc3545;
}

.btn.disabled {
  opacity: 0.6;
  cursor: not-allowed;
  background-color: #6c757d;
  border-color: #6c757d;
}

.btn.disabled:hover {
  background-color: #6c757d;
  border-color: #6c757d;
}

.form-summary {
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1rem;
}

.form-summary.valid {
  background: #d4edda;
  border: 1px solid #c3e6cb;
  color: #155724;
}

.form-summary.invalid {
  background: #f8d7da;
  border: 1px solid #f5c6cb;
  color: #721c24;
}
```

### Étape 6 : Améliorer les fonctions de soumission
```javascript
const addMovie = () => {
  validateForm()
  
  if (!isFormValid.value) {
    showMessage('Veuillez corriger les erreurs du formulaire', 'error')
    return
  }

  const movie = {
    id: Date.now(),
    title: newMovie.title.trim(),
    category: newMovie.category,
    year: newMovie.year,
    description: newMovie.description?.trim() || '',
    rating: newMovie.rating || null,
    isFavorite: newMovie.isFavorite || false
  }

  movies.value.push(movie)
  showMessage(`Film "${movie.title}" ajouté avec succès !`, 'success')
  resetForm()
}

const resetForm = () => {
  Object.assign(newMovie, {
    title: '',
    category: '',
    year: '',
    description: '',
    rating: null,
    isFavorite: false
  })
  
  // Réinitialiser les erreurs
  Object.keys(validationErrors).forEach(key => {
    validationErrors[key] = []
  })
}
```

### Étape 7 : Ajouter un résumé de validation
```vue
<div v-if="Object.values(validationErrors).some(errors => errors.length > 0)" 
     class="form-summary invalid">
  <h4>⚠️ Erreurs à corriger :</h4>
  <ul>
    <li v-for="errors in validationErrors" v-for="error in errors" :key="error">
      {{ error }}
    </li>
  </ul>
</div>

<div v-else-if="newMovie.title && newMovie.category && newMovie.year" 
     class="form-summary valid">
  <h4>✅ Formulaire valide</h4>
  <p>Vous pouvez {{ isEditing ? 'mettre à jour' : 'ajouter' }} ce film.</p>
</div>
```

## ✅ Critères de réussite

- [ ] Validation en temps réel pendant la saisie
- [ ] Messages d'erreur spécifiques et utiles
- [ ] Vérification de l'unicité du titre
- [ ] Validation des années (1888 à aujourd'hui + 5 ans)
- [ ] Limitation de caractères avec compteur
- [ ] Bouton désactivé si formulaire invalide
- [ ] Styles visuels pour les erreurs
- [ ] Réinitialisation propre du formulaire
- [ ] Gestion des cas d'édition

## 🎯 Résultat attendu

Après cet exercice, l'application devrait :
1. Valider chaque champ en temps réel
2. Empêcher la soumission de données invalides
3. Guider l'utilisateur avec des messages clairs
4. Gérer les cas limites (années, longueurs, doublons)
5. Offrir une expérience utilisateur fluide

## 💡 Conseils

- Utilisez `watch()` pour la validation en temps réel
- Les messages d'erreur doivent être explicites et actionables
- Pensez à l'accessibilité (aria-labels, couleurs)
- Testez tous les cas limites
- La validation côté client ne remplace pas la validation serveur

## 🚀 Bonus (optionnel)

- Validation asynchrone (simulation d'API)
- Sauvegarde automatique en brouillon
- Historique des modifications
- Validation par étapes (wizard)
- Suggestions automatiques pour les titres
- Import/export de données avec validation
