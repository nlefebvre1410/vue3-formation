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
      </div>

      <!-- Formulaire d'ajout de film -->
      <div class="card">
        <h2>{{ isEditing ? 'Modifier un film' : 'Ajouter un nouveau film' }}</h2>
        
        <form @submit.prevent="isEditing ? updateMovie() : addMovie()">
          <div class="form-group">
            <label for="title">Titre du film :</label>
            <input 
              id="title"
              v-model="newMovie.title" 
              type="text" 
              placeholder="Entrez le titre du film"
              required
            >
          </div>

          <div class="form-group">
            <label for="category">Catégorie :</label>
            <select id="category" v-model="newMovie.category" required>
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
              v-model.number="newMovie.year" 
              type="number" 
              min="1900" 
              :max="currentYear"
              placeholder="Année de sortie"
              required
            >
          </div>

          <div class="form-group">
            <label for="description">Description :</label>
            <input 
              id="description"
              v-model="newMovie.description" 
              type="text" 
              placeholder="Description du film"
            >
          </div>

          <button type="submit" class="btn">
            {{ isEditing ? 'Mettre à jour' : 'Ajouter le film' }}
          </button>
          
          <button 
            v-if="isEditing" 
            type="button" 
            class="btn btn-secondary" 
            @click="cancelEdit"
          >
            Annuler
          </button>
        </form>
      </div>

      <!-- Filtres -->
      <div class="card">
        <h2>Filtres</h2>
        <div class="filters">
          <div class="filter-group">
            <label for="search">Recherche :</label>
            <input 
              id="search"
              v-model="searchTerm" 
              type="text" 
              placeholder="Rechercher un film..."
            >
          </div>

          <div class="filter-group">
            <label for="categoryFilter">Filtrer par catégorie :</label>
            <select id="categoryFilter" v-model="selectedCategory">
              <option value="">Toutes les catégories</option>
              <option v-for="category in uniqueCategories" :key="category" :value="category">
                {{ category }} ({{ getMovieCountByCategory(category) }})
              </option>
            </select>
          </div>

          <div class="filter-group">
            <label for="yearFilter">Filtrer par année :</label>
            <select id="yearFilter" v-model="selectedYear">
              <option value="">Toutes les années</option>
              <option v-for="year in uniqueYears" :key="year" :value="year">
                {{ year }}
              </option>
            </select>
          </div>

          <button class="btn btn-secondary" @click="clearFilters">
            Effacer les filtres
          </button>
        </div>
      </div>

      <!-- Message si aucun film -->
      <div v-if="filteredMovies.length === 0" class="message">
        <p v-if="movies.length === 0">
          Aucun film dans votre collection. Ajoutez votre premier film !
        </p>
        <p v-else>
          Aucun film ne correspond à vos critères de recherche.
        </p>
      </div>

      <!-- Liste des films -->
      <div v-else class="movies-grid">
        <div 
          v-for="movie in filteredMovies" 
          :key="movie.id" 
          class="movie-card"
        >
          <h3 class="movie-title">{{ movie.title }}</h3>
          <span class="movie-category">{{ movie.category }}</span>
          <div class="movie-year">Année : {{ movie.year }}</div>
          <p class="movie-description" v-if="movie.description">
            {{ movie.description }}
          </p>
          
          <div class="movie-actions">
            <button class="btn" @click="editMovie(movie)">
              Modifier
            </button>
            <button class="btn btn-danger" @click="deleteMovie(movie.id)">
              Supprimer
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, reactive } from 'vue'

export default {
  name: 'App',
  setup() {
    // Données réactives
    const appTitle = ref('Annuaire de Films Vue.js 3')
    const appDescription = ref('Gérez votre collection de films avec Vue.js 3 et la Composition API')
    
    const movies = ref([
      {
        id: 1,
        title: 'Inception',
        category: 'Science-Fiction',
        year: 2010,
        description: 'Un voleur qui s\'infiltre dans les rêves des gens pour voler leurs secrets.'
      },
      {
        id: 2,
        title: 'The Dark Knight',
        category: 'Action',
        year: 2008,
        description: 'Batman affronte le Joker dans cette suite épique.'
      },
      {
        id: 3,
        title: 'Amélie',
        category: 'Romance',
        year: 2001,
        description: 'L\'histoire touchante d\'une jeune femme parisienne.'
      }
    ])

    const newMovie = reactive({
      title: '',
      category: '',
      year: new Date().getFullYear(),
      description: ''
    })

    const searchTerm = ref('')
    const selectedCategory = ref('')
    const selectedYear = ref('')
    const isEditing = ref(false)
    const editingMovieId = ref(null)

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

    const filteredMovies = computed(() => {
      return movies.value.filter(movie => {
        const matchesSearch = movie.title.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
                             movie.description.toLowerCase().includes(searchTerm.value.toLowerCase())
        const matchesCategory = !selectedCategory.value || movie.category === selectedCategory.value
        const matchesYear = !selectedYear.value || movie.year === selectedYear.value
        
        return matchesSearch && matchesCategory && matchesYear
      })
    })

    // Méthodes
    const addMovie = () => {
      if (newMovie.title && newMovie.category && newMovie.year) {
        const movie = {
          id: Date.now(), // Simple ID basé sur le timestamp
          title: newMovie.title,
          category: newMovie.category,
          year: newMovie.year,
          description: newMovie.description || ''
        }
        
        movies.value.push(movie)
        resetForm()
      }
    }

    const deleteMovie = (id) => {
      if (confirm('Êtes-vous sûr de vouloir supprimer ce film ?')) {
        movies.value = movies.value.filter(movie => movie.id !== id)
      }
    }

    const editMovie = (movie) => {
      isEditing.value = true
      editingMovieId.value = movie.id
      newMovie.title = movie.title
      newMovie.category = movie.category
      newMovie.year = movie.year
      newMovie.description = movie.description
    }

    const updateMovie = () => {
      const index = movies.value.findIndex(movie => movie.id === editingMovieId.value)
      if (index !== -1) {
        movies.value[index] = {
          id: editingMovieId.value,
          title: newMovie.title,
          category: newMovie.category,
          year: newMovie.year,
          description: newMovie.description
        }
        cancelEdit()
      }
    }

    const cancelEdit = () => {
      isEditing.value = false
      editingMovieId.value = null
      resetForm()
    }

    const resetForm = () => {
      newMovie.title = ''
      newMovie.category = ''
      newMovie.year = currentYear
      newMovie.description = ''
    }

    const clearFilters = () => {
      searchTerm.value = ''
      selectedCategory.value = ''
      selectedYear.value = ''
    }

    const getMovieCountByCategory = (category) => {
      return movies.value.filter(movie => movie.category === category).length
    }

    return {
      // Données
      appTitle,
      appDescription,
      movies,
      newMovie,
      searchTerm,
      selectedCategory,
      selectedYear,
      isEditing,
      availableCategories,
      currentYear,
      
      // Propriétés calculées
      totalMovies,
      uniqueCategories,
      uniqueYears,
      filteredMovies,
      
      // Méthodes
      addMovie,
      deleteMovie,
      editMovie,
      updateMovie,
      cancelEdit,
      clearFilters,
      getMovieCountByCategory
    }
  }
}
</script>
