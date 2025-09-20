<template>
  <div class="card">
    <h2>{{ isEditing ? 'Modifier un film' : 'Ajouter un nouveau film' }}</h2>
    
    <form @submit.prevent="handleSubmit">
      <div class="form-group">
        <label for="title">Titre du film :</label>
        <input 
          id="title"
          v-model="formData.title" 
          type="text" 
          placeholder="Entrez le titre du film"
          required
        >
      </div>

      <div class="form-group">
        <label for="category">Catégorie :</label>
        <select id="category" v-model="formData.category" required>
          <option value="">Sélectionnez une catégorie</option>
          <option v-for="category in categories" :key="category" :value="category">
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
        <label for="rating">Note (1-5 étoiles) :</label>
        <select id="rating" v-model.number="formData.rating">
          <option value="">Pas de note</option>
          <option v-for="rating in 5" :key="rating" :value="rating">
            {{ rating }} étoile{{ rating > 1 ? 's' : '' }}
          </option>
        </select>
      </div>

      <div class="form-group">
        <label for="description">Description :</label>
        <textarea 
          id="description"
          v-model="formData.description" 
          placeholder="Description du film"
          rows="3"
        ></textarea>
      </div>

      <div class="form-actions">
        <button type="submit" class="btn" :disabled="!isFormValid">
          {{ isEditing ? '✅ Mettre à jour' : '➕ Ajouter le film' }}
        </button>
        
        <button 
          v-if="isEditing" 
          type="button" 
          class="btn btn-secondary" 
          @click="$emit('cancel')"
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

<script>
import { computed, watch, reactive } from 'vue'

export default {
  name: 'MovieForm',
  props: {
    movie: {
      type: Object,
      default: null
    },
    categories: {
      type: Array,
      required: true
    }
  },
  emits: ['submit', 'cancel'],
  setup(props, { emit }) {
    const currentYear = new Date().getFullYear()
    
    const formData = reactive({
      title: '',
      category: '',
      year: currentYear,
      rating: null,
      description: ''
    })

    const isEditing = computed(() => !!props.movie)

    const isFormValid = computed(() => {
      return formData.title.trim() && 
             formData.category && 
             formData.year >= 1900 && 
             formData.year <= currentYear
    })

    // Surveiller les changements de props.movie pour remplir le formulaire
    watch(() => props.movie, (newMovie) => {
      if (newMovie) {
        formData.title = newMovie.title
        formData.category = newMovie.category
        formData.year = newMovie.year
        formData.rating = newMovie.rating || null
        formData.description = newMovie.description || ''
      }
    }, { immediate: true })

    const handleSubmit = () => {
      if (isFormValid.value) {
        const movieData = {
          title: formData.title.trim(),
          category: formData.category,
          year: formData.year,
          rating: formData.rating || null,
          description: formData.description.trim()
        }
        
        emit('submit', movieData)
        
        if (!isEditing.value) {
          resetForm()
        }
      }
    }

    const resetForm = () => {
      formData.title = ''
      formData.category = ''
      formData.year = currentYear
      formData.rating = null
      formData.description = ''
    }

    return {
      formData,
      isEditing,
      isFormValid,
      currentYear,
      handleSubmit,
      resetForm
    }
  }
}
</script>

<style scoped>
.form-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 1rem;
}

.form-actions .btn {
  flex: 1;
  min-width: fit-content;
}

@media (max-width: 768px) {
  .form-actions {
    flex-direction: column;
  }
  
  .form-actions .btn {
    flex: none;
  }
}
</style>
