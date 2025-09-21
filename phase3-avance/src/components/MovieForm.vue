<template>
  <div class="card">
    <h2>{{ isEditing ? 'Modifier un film' : 'Ajouter un nouveau film' }}</h2>
    
    <form @submit.prevent="handleSubmit">
      <div class="form-grid">
        <div class="form-group">
          <label for="title">Titre du film :</label>
          <input 
            id="title"
            v-model="formData.title" 
            type="text" 
            placeholder="Entrez le titre du film"
            required
            :class="{ 'error': errors.title }"
          >
          <span v-if="errors.title" class="error-message">{{ errors.title }}</span>
        </div>

        <div class="form-group">
          <label for="originalTitle">Titre original :</label>
          <input 
            id="originalTitle"
            v-model="formData.original_title" 
            type="text" 
            placeholder="Titre original (optionnel)"
          >
        </div>

        <div class="form-group">
          <label for="category">Catégorie :</label>
          <select id="category" v-model="formData.category" required>
            <option value="">Sélectionnez une catégorie</option>
            <option v-for="category in availableCategories" :key="category" :value="category">
              {{ category }}
            </option>
          </select>
        </div>

        <div class="form-group">
          <label for="year">Année :</label>
          <input 
            id="year"
            v-model.number="formData.year" 
            type="number" 
            min="1900" 
            :max="currentYear"
            placeholder="Année de sortie"
            required
          >
        </div>

        <div class="form-group">
          <label for="director">Réalisateur :</label>
          <input 
            id="director"
            v-model="formData.director" 
            type="text" 
            placeholder="Nom du réalisateur"
          >
        </div>

        <div class="form-group">
          <label for="duration">Durée (minutes) :</label>
          <input 
            id="duration"
            v-model.number="formData.duration" 
            type="number" 
            min="1"
            placeholder="Durée en minutes"
          >
        </div>

        <div class="form-group">
          <label for="rating">Note (1-5 étoiles) :</label>
          <div class="rating-input">
            <select id="rating" v-model.number="formData.rating">
              <option value="">Pas de note</option>
              <option v-for="rating in 5" :key="rating" :value="rating">
                {{ rating }} étoile{{ rating > 1 ? 's' : '' }}
              </option>
            </select>
            <div v-if="formData.rating" class="rating-preview">
              <span 
                v-for="star in 5" 
                :key="star"
                class="star"
                :class="{ 'star-filled': star <= formData.rating }"
              >
                ★
              </span>
            </div>
          </div>
        </div>

        <div class="form-group">
          <label for="poster">URL de l'affiche :</label>
          <input 
            id="poster"
            v-model="formData.poster" 
            type="text" 
            placeholder="https://example.com/poster.jpg"
          >
        </div>
      </div>

      <div class="form-group full-width">
        <label for="description">Synopsis :</label>
        <textarea 
          id="description"
          v-model="formData.description" 
          placeholder="Synopsis du film"
          rows="4"
        ></textarea>
      </div>

      <div class="form-actions">
        <button type="submit" class="btn" :disabled="!isFormValid || isSubmitting">
          <span v-if="isSubmitting">⏳</span>
          <span v-else>{{ isEditing ? '✅ Mettre à jour' : '➕ Ajouter le film' }}</span>
        </button>
        
        <button 
          v-if="isEditing" 
          type="button" 
          class="btn btn-secondary" 
          @click="emit('cancel')"
        >
          ❌ Annuler
        </button>
        
        <button 
          type="button" 
          class="btn btn-outline" 
          @click="resetForm"
        >
          🔄 Réinitialiser
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { computed, watch, reactive, ref } from 'vue'

const props = defineProps({
  movie: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['submit', 'cancel'])

const currentYear = new Date().getFullYear()
const isSubmitting = ref(false)

const availableCategories = [
  'Action',
  'Comédie',
  'Drame',
  'Horreur',
  'Romance',
  'Science-Fiction',
  'Thriller',
  'Animation',
  'Documentaire',
  'Aventure',
  'Fantastique',
  'Guerre',
  'Musical',
  'Western'
]

const formData = reactive({
  title: '',
  original_title: '',
  category: '',
  year: currentYear,
  director: '',
  duration: null,
  rating: null,
  description: '',
  poster: ''
})

const errors = reactive({
  title: ''
})

const isEditing = computed(() => !!props.movie)

const isFormValid = computed(() => {
  return formData.title.trim() && 
         formData.category && 
         formData.year >= 1900 && 
         formData.year <= currentYear &&
         !errors.title
})

// Validation en temps réel du titre
watch(() => formData.title, (newTitle) => {
  if (newTitle.trim().length < 2) {
    errors.title = 'Le titre doit contenir au moins 2 caractères'
  } else if (newTitle.trim().length > 100) {
    errors.title = 'Le titre ne peut pas dépasser 100 caractères'
  } else {
    errors.title = ''
  }
})

// Surveiller les changements de props.movie pour remplir le formulaire
watch(() => props.movie, (newMovie) => {
  if (newMovie) {
    Object.assign(formData, {
      title: newMovie.title || '',
      original_title: newMovie.original_title || '',
      category: newMovie.category || '',
      year: newMovie.year || currentYear,
      director: newMovie.director || '',
      duration: newMovie.duration || null,
      rating: newMovie.rating || null,
      description: newMovie.description || '',
      poster: newMovie.poster || ''
    })
  }
}, { immediate: true })

const handleSubmit = async () => {
  if (!isFormValid.value || isSubmitting.value) return
  
  isSubmitting.value = true
  
  try {
    const movieData = {
      title: formData.title.trim(),
      original_title: formData.original_title.trim() || formData.title.trim(),
      category: formData.category,
      year: formData.year,
      director: formData.director.trim(),
      duration: formData.duration,
      rating: formData.rating,
      description: formData.description.trim(),
      poster: formData.poster.trim()
    }
    
    emit('submit', movieData)
    
    if (!isEditing.value) {
      resetForm()
    }
  } finally {
    isSubmitting.value = false
  }
}

const resetForm = () => {
  Object.assign(formData, {
    title: '',
    original_title: '',
    category: '',
    year: currentYear,
    director: '',
    duration: null,
    rating: null,
    description: '',
    poster: ''
  })
  
  // Reset errors
  errors.title = ''
}
</script>

<style scoped>
.form-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1rem;
  margin-bottom: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-group.full-width {
  grid-column: 1 / -1;
}

.form-group label {
  font-weight: 600;
  color: #555;
  margin-bottom: 0.5rem;
}

.form-group input,
.form-group select,
.form-group textarea {
  padding: 0.75rem;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
  font-family: inherit;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.form-group input.error {
  border-color: #dc3545;
}

.form-group textarea {
  resize: vertical;
  min-height: 100px;
}

.rating-input {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.rating-input select {
  flex: 1;
}

.rating-preview {
  display: flex;
  gap: 2px;
}

.star {
  color: #ddd;
  font-size: 1.2rem;
  transition: color 0.2s ease;
}

.star-filled {
  color: #ffc107;
}

.error-message {
  color: #dc3545;
  font-size: 0.875rem;
  margin-top: 0.25rem;
}

.form-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid #e9ecef;
}

.form-actions .btn {
  flex: 1;
  min-width: fit-content;
}

@media (max-width: 768px) {
  .form-grid {
    grid-template-columns: 1fr;
  }
  
  .form-actions {
    flex-direction: column;
  }
  
  .form-actions .btn {
    flex: none;
  }
  
  .rating-input {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
