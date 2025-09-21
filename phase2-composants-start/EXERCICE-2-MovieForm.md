# 📝 EXERCICE 2 : Composant MovieForm

## 📋 Objectif
Extraire le formulaire d'ajout/modification de films dans un composant réutilisable avec validation avancée.

**Durée estimée** : 60-75 minutes

## 🎯 Fonctionnalités à implémenter

### 1. Composant MovieForm.vue
Créez un composant dans `src/components/MovieForm.vue` avec :

**Props :**
- `movie` (Object, optionnel) : Film à éditer (mode modification)
- `categories` (Array) : Liste des catégories disponibles
- `isLoading` (Boolean, défaut: false) : État de chargement

**Événements :**
- `submit` : Émis avec les données du film
- `cancel` : Émis quand l'utilisateur annule
- `reset` : Émis quand l'utilisateur réinitialise

**Fonctionnalités :**
- 📝 Formulaire complet avec tous les champs
- ✅ Validation en temps réel
- 🔄 Mode ajout et modification
- 🎨 Interface utilisateur moderne
- 📱 Design responsive
- ⚡ Feedback visuel des erreurs

### 2. Structure des données
```javascript
// Données du formulaire
const formData = reactive({
  title: '',
  category: '',
  year: new Date().getFullYear(),
  rating: 0,
  description: '',
  director: '',
  duration: 120,
  poster: '',
  backdrop: ''
})

// État de validation
const errors = reactive({
  title: '',
  category: '',
  year: '',
  rating: '',
  description: '',
  director: '',
  duration: ''
})
```

### 3. Template de base
```vue
<template>
  <div class="movie-form">
    <div class="form-header">
      <h2>{{ isEditing ? 'Modifier le film' : 'Ajouter un nouveau film' }}</h2>
      <p v-if="isEditing">Modifiez les informations du film</p>
      <p v-else>Remplissez les informations du nouveau film</p>
    </div>

    <form @submit.prevent="handleSubmit" class="form">
      <!-- Titre -->
      <div class="form-group" :class="{ error: errors.title }">
        <label for="title" class="required">Titre du film</label>
        <input
          id="title"
          v-model="formData.title"
          type="text"
          placeholder="Entrez le titre du film"
          :disabled="isLoading"
          @blur="validateTitle"
        >
        <span v-if="errors.title" class="error-message">{{ errors.title }}</span>
      </div>

      <!-- Catégorie -->
      <div class="form-group" :class="{ error: errors.category }">
        <label for="category" class="required">Catégorie</label>
        <select 
          id="category" 
          v-model="formData.category"
          :disabled="isLoading"
          @change="validateCategory"
        >
          <option value="">Sélectionnez une catégorie</option>
          <option v-for="cat in categories" :key="cat" :value="cat">
            {{ cat }}
          </option>
        </select>
        <span v-if="errors.category" class="error-message">{{ errors.category }}</span>
      </div>

      <!-- À COMPLÉTER : Autres champs -->

      <!-- Actions -->
      <div class="form-actions">
        <button 
          type="submit" 
          class="btn btn-primary"
          :disabled="!isFormValid || isLoading"
        >
          <span v-if="isLoading">⏳ Sauvegarde...</span>
          <span v-else>{{ isEditing ? '✅ Mettre à jour' : '➕ Ajouter' }}</span>
        </button>
        
        <button 
          type="button" 
          class="btn btn-secondary"
          @click="handleCancel"
          :disabled="isLoading"
        >
          Annuler
        </button>
        
        <button 
          type="button" 
          class="btn btn-outline"
          @click="handleReset"
          :disabled="isLoading"
        >
          🔄 Réinitialiser
        </button>
      </div>
    </form>
  </div>
</template>
```

## 🔧 Étapes de développement

### Étape 1 : Structure de base (20 min)
1. Créez le fichier `src/components/MovieForm.vue`
2. Implémentez la structure HTML du formulaire
3. Ajoutez les props et événements de base
4. Testez l'affichage du formulaire

### Étape 2 : Validation (25 min)
1. Implémentez les règles de validation pour chaque champ
2. Ajoutez la validation en temps réel
3. Créez les messages d'erreur contextuels
4. Testez la validation sur tous les champs

### Étape 3 : Logique métier (20 min)
1. Gérez les modes ajout/modification
2. Implémentez la soumission du formulaire
3. Ajoutez la gestion des états (loading, erreurs)
4. Testez les différents scénarios

### Étape 4 : Intégration (10 min)
1. Intégrez le composant dans l'application principale
2. Remplacez l'ancien formulaire
3. Testez l'intégration complète

## 💡 Logique de validation

### Règles de validation
```javascript
const validationRules = {
  title: {
    required: true,
    minLength: 2,
    maxLength: 100,
    unique: true // Vérifier l'unicité
  },
  category: {
    required: true
  },
  year: {
    required: true,
    min: 1900,
    max: new Date().getFullYear() + 2
  },
  rating: {
    min: 0,
    max: 5
  },
  director: {
    minLength: 2,
    maxLength: 50
  },
  duration: {
    min: 1,
    max: 500
  }
}
```

### Fonctions de validation
```javascript
const validateTitle = () => {
  if (!formData.title) {
    errors.title = 'Le titre est obligatoire'
    return false
  }
  if (formData.title.length < 2) {
    errors.title = 'Le titre doit contenir au moins 2 caractères'
    return false
  }
  if (formData.title.length > 100) {
    errors.title = 'Le titre ne peut pas dépasser 100 caractères'
    return false
  }
  
  // Vérifier l'unicité (sauf en mode édition)
  if (!isEditing.value && existingTitles.includes(formData.title)) {
    errors.title = 'Ce titre existe déjà'
    return false
  }
  
  errors.title = ''
  return true
}

const validateYear = () => {
  const currentYear = new Date().getFullYear()
  if (!formData.year) {
    errors.year = 'L\'année est obligatoire'
    return false
  }
  if (formData.year < 1900 || formData.year > currentYear + 2) {
    errors.year = `L'année doit être entre 1900 et ${currentYear + 2}`
    return false
  }
  
  errors.year = ''
  return true
}
```

## 🎨 Styles CSS

### Styles de base
```css
.movie-form {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  max-width: 600px;
  margin: 0 auto;
}

.form-header {
  text-align: center;
  margin-bottom: 2rem;
}

.form-header h2 {
  color: #333;
  margin-bottom: 0.5rem;
}

.form-header p {
  color: #666;
  font-size: 0.9rem;
}

.form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group.error input,
.form-group.error select,
.form-group.error textarea {
  border-color: #e74c3c;
  box-shadow: 0 0 0 3px rgba(231, 76, 60, 0.1);
}

.form-group label {
  font-weight: 600;
  color: #333;
  font-size: 0.9rem;
}

.form-group label.required::after {
  content: ' *';
  color: #e74c3c;
}

.form-group input,
.form-group select,
.form-group textarea {
  padding: 0.75rem;
  border: 2px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.3s ease;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #42b883;
  box-shadow: 0 0 0 3px rgba(66, 184, 131, 0.1);
}

.error-message {
  color: #e74c3c;
  font-size: 0.8rem;
  margin-top: 0.25rem;
}

.form-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
  margin-top: 1rem;
}
```

### Styles des champs spéciaux
```css
.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.rating-field {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.url-preview {
  margin-top: 0.5rem;
}

.url-preview img {
  max-width: 100px;
  max-height: 150px;
  border-radius: 4px;
  border: 1px solid #ddd;
}

@media (max-width: 768px) {
  .form-row {
    grid-template-columns: 1fr;
  }
  
  .form-actions {
    flex-direction: column;
  }
}
```

## 🧪 Tests à effectuer

### Tests de validation
- [ ] Champs obligatoires bloquent la soumission
- [ ] Validation en temps réel fonctionne
- [ ] Messages d'erreur sont contextuels
- [ ] Validation de l'unicité des titres
- [ ] Limites de caractères respectées
- [ ] Validation des années cohérente

### Tests d'intégration
- [ ] Mode ajout fonctionne correctement
- [ ] Mode modification pré-remplit les champs
- [ ] Soumission émet les bonnes données
- [ ] Annulation vide le formulaire
- [ ] États de chargement affichés

### Tests UX
- [ ] Interface responsive sur mobile
- [ ] Feedback visuel des erreurs
- [ ] Navigation clavier possible
- [ ] Accessibilité respectée

## 🔄 Intégration dans l'application

### Dans App.vue
```vue
<template>
  <div id="app">
    <!-- Autres composants -->
    
    <MovieForm
      :movie="editingMovie"
      :categories="availableCategories"
      :is-loading="isSubmitting"
      @submit="handleMovieSubmit"
      @cancel="handleFormCancel"
      @reset="handleFormReset"
    />
  </div>
</template>

<script setup>
import MovieForm from './components/MovieForm.vue'

const handleMovieSubmit = (movieData) => {
  if (editingMovie.value) {
    updateMovie(movieData)
  } else {
    addMovie(movieData)
  }
}

const handleFormCancel = () => {
  editingMovie.value = null
}

const handleFormReset = () => {
  // Logique de réinitialisation
}
</script>
```

## 🚀 Améliorations optionnelles

### Fonctionnalités avancées
- **Auto-sauvegarde** : Sauvegarde automatique en brouillon
- **Upload d'images** : Téléchargement de posters
- **Suggestions** : Auto-complétion pour réalisateurs
- **Prévisualisation** : Aperçu du film en temps réel
- **Import** : Import depuis API externe (TMDB)

### Validation avancée
```javascript
// Validation asynchrone
const validateTitleUniqueness = async (title) => {
  if (!title) return true
  
  const exists = await checkTitleExists(title)
  if (exists && !isEditing.value) {
    errors.title = 'Ce titre existe déjà'
    return false
  }
  return true
}

// Validation de format d'URL
const validateImageUrl = (url) => {
  if (!url) return true
  
  const urlPattern = /^https?:\/\/.+\.(jpg|jpeg|png|gif|webp)$/i
  if (!urlPattern.test(url)) {
    return 'URL d\'image invalide'
  }
  return true
}
```

## ✅ Critères de validation

### Fonctionnalités minimales
- ✅ Composant MovieForm créé et fonctionnel
- ✅ Validation complète implémentée
- ✅ Modes ajout/modification gérés
- ✅ Interface utilisateur moderne
- ✅ Intégration dans l'application

### Qualité du code
- ✅ Code propre et organisé
- ✅ Validation robuste et sécurisée
- ✅ Gestion d'erreurs complète
- ✅ Styles responsive
- ✅ Accessibilité respectée

## 🎓 Compétences acquises

À la fin de cet exercice, vous maîtriserez :
- **Formulaires complexes** avec Vue.js
- **Validation en temps réel** avancée
- **Gestion d'état** de formulaire
- **Props et événements** sophistiqués
- **UX/UI** de formulaires professionnels
- **Intégration** de composants complexes

---

**🎯 Cet exercice vous apprend à créer des formulaires Vue.js robustes et professionnels !**
