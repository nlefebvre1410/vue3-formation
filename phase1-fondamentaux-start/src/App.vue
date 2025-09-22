<template>
  <div id="app">
    <!-- Header de l'application -->
    <header class="header">
      <div class="container">
        <h1>{{ appTitle }}</h1>
        <p>{{ appDescription }}</p>
      </div>
    </header>

    <div class="container">
      <!-- Statistiques -->
      <div class="stats">
        <div class="stat-card">
          <span class="stat-number">{{ totalMovies }}</span>
          <div class="stat-label">Films au total</div>
        </div>
        <div class="stat-card">
          <span class="stat-number">{{ filteredMovies.length }}</span>
          <div class="stat-label">Films affichés</div>
        </div>
        <div class="stat-card">
          <span class="stat-number">{{ uniqueCategories.length }}</span>
          <div class="stat-label">Catégories</div>
        </div>
         
      <div class="stat-card">
        <span class="stat-number">{{ averageRating }}</span>
        <div class="stat-label">Note moyenne</div>
      </div>

      <div class="stat-card">
        <span class="stat-number">{{ favoriteMovies.length }}</span>
        <div class="stat-label">Favoris</div>
        <button 
        v-if="favoriteMovies.length > 0" 
        @click="clearFavorites(favoriteMovies)" 
        class="btn btn-danger">Clear All Favorites
      </button>
      </div>
      </div>

      <!-- Formulaire d'ajout de film -->
      <div class="card">
        <h2>{{ isEditing ? 'Modifier un film' : 'Ajouter un nouveau film' }}</h2>
        <div v-if="Object.values(validationErrors).some(errors => errors.length > 0)" 
            class="form-summary invalid">
          <h4>⚠️ Erreurs à corriger :</h4>
          <ul>
            <template v-for="(errors, field) in validationErrors" :key="field">
              <li v-if="errors.length > 0">
                <span v-for="error in errors" :key="error">
                  {{ error }}
                </span>
              </li>
            </template>
          </ul>
        </div>
        <div v-if="isFormValid" class="form-summary valid">
          <h4>✅ Formulaire valide</h4>
          <p>Vous pouvez {{ isEditing ? 'mettre à jour' : 'ajouter' }} ce film.</p>
        </div>

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
            <select id="category" v-model="newMovie.category" :class="{ 'error': validationErrors.category.length > 0 }"
              @change="validateCategory">
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

          <div class="form-group">
            <label for="poster">URL de l'affiche :</label>
            <input
                id="poster"
                v-model="newMovie.poster"
                type="text"
                placeholder="/images/poster.jpg (optionnel)"
            >
          </div>

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

          <div class="form-actions">
            <button type="submit" class="btn" :disabled="!isFormValid"
            :class="{ 'disabled': !isFormValid }">
              {{ isEditing ? '✅ Mettre à jour' : '➕ Ajouter le film' }}
            </button>
            <button v-if="isEditing" type="button" class="btn btn-secondary" @click="cancelEdit">
              Annuler
            </button>
            <button type="button" class="btn btn-secondary" @click="resetForm">
              🔄 Réinitialiser
            </button>
          </div>
        </form>
      </div>

      <!-- Filtres -->
      <div class="card">
        <h2>🔍 Filtres et recherche</h2>
        <div class="filters">
          <div class="filter-group">
            <label for="search">Recherche :</label>
            <input 
              id="search"
              v-model="searchTerm"
              type="text" 
              placeholder="Rechercher un film..."
              class="filter-input"
            >
          </div>

          <div class="filter-group">
            <label for="categoryFilter">Catégorie :</label>
            <select id="categoryFilter" v-model="selectedCategory" class="filter-select">
              <option value="">Toutes les catégories</option>
              <option v-for="category in uniqueCategories" :key="category" :value="category">
                {{ category }}
              </option>
            </select>
          </div>

          <div class="filter-group">
            <label for="yearFilter">Année :</label>
            <select id="yearFilter" v-model="selectedYear" class="filter-select">
              <option value="">Toutes les années</option>
              <option v-for="year in uniqueYears" :key="year" :value="year">
                {{ year }}
              </option>
            </select>
          </div>

          <div class="filter-group">
            <label for="favoriteFilter">Favoris :</label>
            <select id="favoriteFilter" v-model="favoriteFilter" class="filter-select">
              <option value="">Tous les films</option>
              <option value="true">Favoris uniquement</option>
              <option value="false">Non favoris uniquement</option>
            </select>
          </div>

          <button @click="clearFilters" class="btn btn-secondary">
            🗑️ Effacer les filtres
          </button>
        </div>
      </div>

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

      <!-- Message si aucun film -->
      <div v-if="filteredMovies.length === 0" class="message info">
        <p v-if="movies.length === 0">
          🎬 Aucun film dans votre collection. Ajoutez votre premier film !
        </p>
        <p v-else>
          🔍 Aucun film ne correspond à vos critères de recherche.
        </p>
      </div>
     

      <!-- Liste des films -->
      <div v-if="sortBy" class="sort-indicator">
        <span>📊 Trié par {{ getSortCriteriaLabel() }}</span>
        <span class="sort-arrow">
          {{ sortDirection === 'asc' ? '↑' : '↓' }}
        </span>
      </div>
      <div class="movies-grid">
        <div class="movie-card" :class="{ 'is-favorite': movie.isFavorite }" v-for="movie in sortedMovies" :key="movie.id"> 
          <div class="movie-poster" v-if="movie.poster">
            <img :src="movie.poster" :alt="movie.title" class="poster-image">
          </div>
          <div class="movie-content">
            <div class="movie-header">
              <h3 class="movie-title">{{ movie.title }}</h3>
              <span v-if="movie.isFavorite" class="favorite-indicator">
                ❤️ Favori
              </span>
              <span class="movie-category">{{ movie.category }}</span>
            </div>
            <p class="movie-year">Année : {{ movie.year }}</p>
            <p class="movie-description" v-if="movie.description">
              {{ movie.description.length > 150 ? movie.description.substring(0, 150) + '...' : movie.description }}
            </p>

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
            
          </div>
        </div>
      </div>
      
        

      <!-- Message de feedback -->
      <div v-if="message.text" class="message" :class="message.type">
        {{ message.text }}
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, reactive, watch,
  onActivated, onDeactivated, onBeforeMount, onBeforeUnmount, onMounted, onUnmounted } from 'vue'
  // ref est la réactive
import { useValidation } from './useValidation.js'

  export default {
  name: 'App',
  setup() {
    // Données réactives
    const appTitle = ref('Annuaire de Films Vue.js 3')
    const appDescription = ref('Gérez votre collection de films avec Vue.js 3 et la Composition API')

    const movies = ref([
      {
        id: 1311031,
        title: "Demon Slayer: Kimetsu no Yaiba - La Forteresse infinie",
        category: "Animation",
        year: 2025,
        description: "L'équipe de chasseurs de démons est attiré dans le Château de l'Infini, où Tanjiro, Nezuko et le Hashira affrontent de terrifiants démons de rang supérieur dans un combat désespéré alors que la bataille finale contre Kibutsuji Muzan commence.",
        poster: "/images/1311031_poster.jpg",
        backdrop: "/images/1311031_backdrop.jpg",
        rating: 5,
        isFavorite: false
      },
      {
        id: 755898,
        title: "La Guerre des mondes",
        category: "Science-Fiction",
        year: 2025,
        description: "Une invasion gargantuesque approche dans cette nouvelle interprétation du légendaire roman homonyme devenu un classique de la science-fiction. La célèbre Eva Longoria partage l'affiche avec le rappeur/acteur Ice Cube.",
        poster: "/images/755898_poster.jpg",
        backdrop: "/images/755898_backdrop.jpg",
        rating: 3,
        isFavorite: false
      },
      {
        id: 1038392,
        title: "Conjuring : L'Heure du jugement",
        category: "Horreur",
        year: 2025,
        description: "Patrick Wilson et Vera Farmiga feront leur dernière apparition dans les rôles d'Ed et Lorraine Warren dans Conjuring : l'heure du jugement, inspiré de l'histoire vraie de la famille Smurl, hantée par un démon.",
        poster: "/images/1038392_poster.jpg",
        backdrop: "/images/1038392_backdrop.jpg",
        rating: 1,
        isFavorite: false
      }
    ])

    const searchTerm = ref('')
    const selectedCategory = ref('')
    const selectedYear = ref('')
    const sortBy = ref('')
    const sortDirection = ref('asc')
    const favoriteFilter = ref('')

    //ici c'est un objet réactif
    const newMovie = reactive({
      title: 'hello world 1',
      category: '',
      year: '',
      description: '',
      poster: '',
      rating: 0,
      isFavorite: false
    })
    
    // on atteint la valeur avec l'attribut et non .value
    //console.log(newMovie.title)

    const editingMovie = ref(null)
    // propriété calculée avant le render, puis c'est plus écouté, c'est écouté que au changement
    const isEditing = computed(() => editingMovie.value !== null)
    // si editingMovie a une valeur, on est en mode édition

    const message = reactive({
      text: '',
      type: 'success'
    })

    // Données statiques
    const availableCategories = [
      'Action',
      'Comédie',
      'Drame',
      'Horreur',
      'Romance',
      'Science-Fiction',
      'Thriller',
      'Animation',
      'Documentaire'
    ]

    const currentYear = new Date().getFullYear()

    // Propriétés calculées
    const totalMovies = computed(() => movies.value.length)

    const uniqueCategories = computed(() => {
      return [...new Set(movies.value.map(movie => movie.category))].sort()
    })

    const uniqueYears = computed(() => {
      return [...new Set(movies.value.map(movie => movie.year))].sort((a, b) => b - a)
    })

    const averageRating = computed(() => {
        const ratedMovies = movies.value.filter(movie => movie.rating)
        if (ratedMovies.length === 0) return 0
        
        const sum = ratedMovies.reduce((acc, movie) => acc + movie.rating, 0)
        return (sum / ratedMovies.length).toFixed(1)
      })

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

    const favoriteMovies = computed(() => {
      return movies.value.filter(movie => movie.isFavorite)
    })

    // Méthodes
    const addMovie = () => {
      validateForm()
      if (!isFormValid.value){
        showMessage('Veuillez corriger les erreurs dans le formulaire.', 'error')
        return
      }
      const movie = {
          id: Date.now(),
          title: newMovie.title.trim(),
          category: newMovie.category,
          year: newMovie.year,
          description: newMovie.description?.trim() || '',
          poster: newMovie.poster || '',
          rating: newMovie.rating || 0,
          isFavorite: newMovie.isFavorite || false
        }

        movies.value.push(movie)
        showMessage(`Film "${movie.title}" ajouté avec succès !`, 'success')
        resetForm()
    }
    
    const deleteMovie = (id) => {
      const movie = movies.value.find(m => m.id === id)
      if (movie && confirm(`Êtes-vous sûr de vouloir supprimer "${movie.title}" ?`)) {
        movies.value = movies.value.filter(movie => movie.id !== id)
        showMessage(`Film "${movie.title}" supprimé avec succès !`, 'success')
        
        if (editingMovie.value && editingMovie.value.id === id) {
          cancelEdit()
        }
      }
    }

    const editMovie = (movie) => {
      editingMovie.value = movie
      Object.assign(newMovie, {
        title: movie.title,
        category: movie.category,
        year: movie.year,
        description: movie.description || '',
        poster: movie.poster || '',
        rating: movie.rating || 0,
        isFavorite: newMovie.isFavorite || false
      })
    }

    const updateMovie = () => {
      if (editingMovie.value && newMovie.title && newMovie.category && newMovie.year) {
        Object.assign(editingMovie.value, {
          title: newMovie.title,
          category: newMovie.category,
          year: newMovie.year,
          description: newMovie.description || '',
          poster: newMovie.poster || '',
          rating: newMovie.rating || 0,
          isFavorite: newMovie.isFavorite || false
        })

        showMessage(`Film "${editingMovie.value.title}" modifié avec succès !`, 'success')
        cancelEdit()
      }
    }

    const clearFavorites = (movies) => {
      if (!confirm('Êtes-vous sûr de vouloir retirer tous les films des favoris ?')) return
      movies.forEach(movie => {
        movie.isFavorite = false
      })
    }

    const cancelEdit = () => {
      editingMovie.value = null
      resetForm()
    }

    const clearFilters = () => {
      searchTerm.value = ''
      selectedCategory.value = ''
      selectedYear.value = ''
      favoriteFilter.value = '' // ⭐ AJOUTER
    }

    const resetForm = () => {
      Object.assign(newMovie, {
        title: '',
        category: '',
        year: '',
        description: '',
        poster: '',
        rating: null,
        isFavorite: false
      })
      Object.keys(validationErrors).forEach(key => {
        validationErrors[key] = []
      })
    }

    const showMessage = (text, type = 'success') => {
      message.text = text
      message.type = type
      
      setTimeout(() => {
        message.text = ''
      }, 3000)
    }

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

    const getSortCriteriaLabel = () => {
      const labels = {
        title: 'titre',
        year: 'année',
        rating: 'note'
      }
      return labels[sortBy.value] || ''
    }

    const toggleFavorite = (id) => {
      const movie = movies.value.find(m => m.id === id)
      if (movie) {
        movie.isFavorite = !movie.isFavorite
        
        // Message de feedback
        const action = movie.isFavorite ? 'ajouté aux' : 'retiré des'
        showMessage(`"${movie.title}" ${action} favoris`, 'success')
      }
    }

    // Validation
    const { 
      validationErrors, validateTitle, validateYear, validateCategory, validateDescription, validateForm, isFormValid 
    } = useValidation(newMovie, availableCategories)

    return {
      // Données
      appTitle,
      appDescription,
      movies,
      searchTerm,
      selectedCategory,
      selectedYear,
      newMovie,
      editingMovie,
      isEditing,
      message,
      availableCategories,
      currentYear,
      sortBy,
      sortDirection,
      favoriteFilter,
      validationErrors,
      
      // Propriétés calculées
      totalMovies,
      uniqueCategories,
      uniqueYears,
      filteredMovies,
      averageRating,
      sortedMovies,
      favoriteMovies,
      isFormValid,
      
      // Méthodes
      addMovie,
      deleteMovie,
      editMovie,
      updateMovie,
      cancelEdit,
      clearFilters,
      resetForm,
      showMessage,
      getSortLabel,
      clearSort,
      getSortCriteriaLabel,
      toggleFavorite,
      clearFavorites,
    }
  }
}
</script>

<style>
/* Styles globaux */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  min-height: 100vh;
}

#app {
  min-height: 100vh;
}

.header {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  padding: 2rem 0;
  margin-bottom: 2rem;
  box-shadow: 0 2px 20px rgba(0, 0, 0, 0.1);
}

.header h1 {
  color: #42b883;
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
  text-align: center;
}

.header p {
  color: #666;
  text-align: center;
  font-size: 1.1rem;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

.stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
}

.stat-card {
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  text-align: center;
  border: 1px solid #e0e0e0;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
}

.stat-number {
  display: block;
  font-size: 2.5rem;
  font-weight: bold;
  color: #42b883;
  margin-bottom: 0.5rem;
}

.stat-label {
  color: #666;
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.card {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  margin-bottom: 2rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  border: 1px solid #e0e0e0;
}

.card h2 {
  color: #333;
  margin-bottom: 1.5rem;
  font-size: 1.5rem;
}

.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: #333;
}

.form-group input,
.form-group select,
.form-group textarea {
  width: 100%;
  padding: 0.75rem;
  border: 2px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.3s ease;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #42b883;
  box-shadow: 0 0 0 3px rgba(66, 184, 131, 0.1);
}

.form-actions {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  background: #42b883;
  color: white;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}

.btn:hover {
  background: #369870;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(66, 184, 131, 0.3);
}

.btn-secondary {
  background: #6c757d;
}

.btn-secondary:hover {
  background: #5a6268;
  box-shadow: 0 4px 12px rgba(108, 117, 125, 0.3);
}

.btn-danger {
  background: #dc3545;
}

.btn-danger:hover {
  background: #c82333;
  box-shadow: 0 4px 12px rgba(220, 53, 69, 0.3);
}

.filters {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
  align-items: end;
}

.filter-group {
  display: flex;
  flex-direction: column;
}

.filter-input,
.filter-select {
  padding: 0.5rem;
  border: 2px solid #ddd;
  border-radius: 6px;
  font-size: 0.9rem;
}

.movies-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.movie-card {
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  border: 1px solid #e0e0e0;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  display: flex;
  flex-direction: row;
}

.movie-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
}

.movie-poster {
  flex-shrink: 0;
  width: 120px;
  height: 180px;
  overflow: hidden;
}

.poster-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 0;
}

.movie-content {
  flex: 1;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
}

.movie-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.movie-title {
  margin: 0;
  color: #333;
  font-size: 1.1rem;
  line-height: 1.3;
  flex: 1;
  min-width: 200px;
}

.movie-category {
  background: #42b883;
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 500;
  white-space: nowrap;
}

.movie-year {
  color: #666;
  margin: 0.5rem 0;
  font-size: 0.9rem;
}

.movie-description {
  color: #555;
  line-height: 1.4;
  margin: 1rem 0;
  font-size: 0.9rem;
  flex: 1;
}

.movie-actions {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
  margin-top: auto;
}

.message {
  padding: 1rem;
  border-radius: 8px;
  margin: 1rem 0;
  font-weight: 500;
}

.message.success {
  background: #d4edda;
  color: #155724;
  border: 1px solid #c3e6cb;
}

.message.info {
  background: #cce7ff;
  color: #004085;
  border: 1px solid #99d6ff;
}

.message.error {
  background: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
}
.movie-rating {
  background: #f9f9f9 !important;
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

@media (max-width: 768px) {
  .header h1 {
    font-size: 2rem;
  }
  
  .stats {
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  }
  
  .movies-grid {
    grid-template-columns: 1fr;
  }
  
  .movie-card {
    flex-direction: column;
  }
  
  .movie-poster {
    width: 100%;
    height: 200px;
  }
  
  .movie-content {
    padding: 1rem;
  }
  
  .filters {
    grid-template-columns: 1fr;
  }
  
  .form-actions {
    flex-direction: column;
  }

  .sort-controls {
    flex-direction: column;
    align-items: stretch;
  }
  
  .sort-controls .form-group {
    min-width: unset;
  }
}

</style>
