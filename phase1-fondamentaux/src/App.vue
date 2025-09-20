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
            <label for="original_title">Titre original :</label>
            <input
                id="original_title"
                v-model="newMovie.original_title"
                type="text"
                placeholder="Titre original du film"
            >
          </div>

          <div class="form-group">
            <label for="overview">Synopsis :</label>
            <textarea
                id="overview"
                v-model="newMovie.overview"
                placeholder="Synopsis du film"
                rows="3"
            ></textarea>
          </div>

          <div class="form-group">
            <label for="release_date">Date de sortie :</label>
            <input
                id="release_date"
                v-model="newMovie.release_date"
                type="date"
                required
            >
          </div>

          <div class="form-group">
            <label for="vote_average">Note moyenne :</label>
            <input
                id="vote_average"
                v-model.number="newMovie.vote_average"
                type="number"
                min="0"
                max="10"
                step="0.1"
                placeholder="Note sur 10"
            >
          </div>

          <div class="form-group">
            <label for="poster_path">Image du film (URL) :</label>
            <input
                id="poster_path"
                v-model="newMovie.poster_path"
                type="url"
                placeholder="https://exemple.com/image.jpg ou /src/assets/images/nom-image.jpg"
            >
            <small class="form-help">
              Vous pouvez utiliser une URL web ou un chemin vers une image locale dans le dossier assets/images/
            </small>
          </div>

          <div v-if="isEditing && newMovie.backdrop_path" class="form-group">
            <label>Image de couverture (backdrop) :</label>
            <div class="backdrop-preview">
              <img
                  :src="newMovie?.backdrop_path"
                  :alt="`Backdrop de ${newMovie.title}`"
                  @error="handleImageError"
              >
            </div>
            <small class="form-help">
              Image de couverture actuelle du film
            </small>
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
                class="filter-input"
            >
          </div>

          <div class="filter-group">
            <label for="categoryFilter">Filtrer par catégorie :</label>
            <select id="categoryFilter" v-model="selectedCategory" class="filter-select">
              <option value="">Toutes les catégories</option>
              <option v-for="category in uniqueCategories" :key="category" :value="category">
                {{ category }} ({{ getMovieCountByCategory(category) }})
              </option>
            </select>
          </div>

          <div class="filter-group">
            <label for="yearFilter">Filtrer par année :</label>
            <select id="yearFilter" v-model="selectedYear" class="filter-select">
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
          <div class="movie-poster" v-if="movie.poster_path">
            <img
                :src="movie.poster_path"
                :alt="`Poster de ${movie.title}`"
                @error="handleImageError"
            >

          </div>
          <div class="movie-content">
            <h3 class="movie-title">{{ movie.title }}</h3>
            <p class="movie-original-title" v-if="movie.original_title && movie.original_title !== movie.title">
              <em>{{ movie.original_title }}</em>
            </p>
            <div class="movie-info">
              <span class="movie-category">{{ movie.category }}</span>
              <span class="movie-year">{{ movie.year }}</span>
              <span class="movie-rating">⭐ {{ movie.vote_average }}/10</span>
            </div>
            <p class="movie-overview" v-if="movie.overview">
              {{ movie.overview.length > 120 ? movie.overview.substring(0, 120) + '...' : movie.overview }}
            </p>
            <div class="movie-stats">
              <small>{{ movie.vote_count }} votes • Popularité: {{ Math.round(movie.popularity) }}</small>
            </div>

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
  </div>
</template>

<script>
import {ref, computed, reactive} from 'vue'
import moviesData from './movies.json'

export default {
  name: 'App',
  setup() {
    // Données réactives
    const appTitle = ref('Annuaire de Films Vue.js 3')
    const appDescription = ref('Gérez votre collection de films avec Vue.js 3 et la Composition API')

    const files = import.meta.glob('./assets/images/*', {eager: true, import: 'default'})

// 2) Crée une map simple : { "fichier.jpg": "url" }
    const byName = Object.fromEntries(
        Object.entries(files).map(([path, url]) => [path.split('/').pop(), url])
    )

// 3) Fonction utilitaire avec fallback
    const getSrc = (filename) =>
        byName[filename] ?? new URL('./assets/placeholder.png', import.meta.url).href

// 4) Construire tes films en ajoutant directement les URLs
    const movies = ref(
        moviesData.map(movie => ({
          id: movie.id,
          title: movie.title,
          original_title: movie.original_title,
          overview: movie.overview,
          release_date: movie.release_date,
          year: new Date(movie.release_date).getFullYear(),
          vote_average: movie.vote_average,
          vote_count: movie.vote_count,
          popularity: movie.popularity,

          poster_path: getSrc(movie.poster_path),
          backdrop_path: getSrc(movie.backdrop_path),
          category:
              movie.vote_average >= 7 ? 'Excellent'
                  : movie.vote_average >= 6 ? 'Bon'
                      : movie.vote_average >= 5 ? 'Moyen'
                          : 'Décevant'
        }))
    )

    const newMovie = reactive({
      title: '',
      original_title: '',
      overview: '',
      release_date: new Date().toISOString().split('T')[0],
      year: new Date().getFullYear(),
      vote_average: 5,
      vote_count: 0,
      popularity: 0,
      category: 'Moyen',
      poster_path: ''
    })

    const searchTerm = ref('')
    const selectedCategory = ref('')
    const selectedYear = ref('')
    const isEditing = ref(false)
    const editingMovieId = ref(null)

    // Données statiques
    const availableCategories = [
      'Excellent',
      'Bon',
      'Moyen',
      'Décevant'
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
            (movie.overview && movie.overview.toLowerCase().includes(searchTerm.value.toLowerCase())) ||
            (movie.original_title && movie.original_title.toLowerCase().includes(searchTerm.value.toLowerCase()))
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
          original_title: newMovie.original_title || newMovie.title,
          overview: newMovie.overview || '',
          release_date: newMovie.release_date,
          year: newMovie.year,
          vote_average: newMovie.vote_average,
          vote_count: newMovie.vote_count,
          popularity: newMovie.popularity,
          category: newMovie.category,
          poster_path: newMovie.poster_path || '',
          backdrop_path: ''
        }

        movies.value.push(movie)
        resetForm()
      }
    }

    const deleteMovie = (id) => {
      movies.value = movies.value.filter(movie => movie.id !== id)
    }

    const editMovie = (movie) => {
      isEditing.value = true
      editingMovieId.value = movie.id
      newMovie.title = movie.title
      newMovie.original_title = movie.original_title
      newMovie.overview = movie.overview
      newMovie.release_date = movie.release_date
      newMovie.year = movie.year
      newMovie.vote_average = movie.vote_average
      newMovie.vote_count = movie.vote_count
      newMovie.popularity = movie.popularity
      newMovie.category = movie.category
      newMovie.poster_path = movie.poster_path
      newMovie.backdrop_path = movie.backdrop_path

      // Scroll vers le formulaire de modification
      setTimeout(() => {
        const formElement = document.querySelector('.card h2')
        if (formElement) {
          formElement.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          })
        }
      }, 100)
    }

    const updateMovie = () => {
      const index = movies.value.findIndex(movie => movie.id === editingMovieId.value)
      if (index !== -1) {
        movies.value[index] = {
          id: editingMovieId.value,
          title: newMovie.title,
          original_title: newMovie.original_title,
          overview: newMovie.overview,
          release_date: newMovie.release_date,
          year: newMovie.year,
          vote_average: newMovie.vote_average,
          vote_count: newMovie.vote_count,
          popularity: newMovie.popularity,
          category: newMovie.category,
          poster_path: newMovie.poster_path || movies.value[index].poster_path,
          backdrop_path: movies.backdrop_path || movies.value[index].backdrop_path,
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
      newMovie.original_title = ''
      newMovie.overview = ''
      newMovie.release_date = new Date().toISOString().split('T')[0]
      newMovie.year = currentYear
      newMovie.vote_average = 5
      newMovie.vote_count = 0
      newMovie.popularity = 0
      newMovie.category = 'Moyen'
      newMovie.poster_path = ''
    }

    const clearFilters = () => {
      searchTerm.value = ''
      selectedCategory.value = ''
      selectedYear.value = ''
    }

    const getMovieCountByCategory = (category) => {
      return movies.value.filter(movie => movie.category === category).length
    }

    const handleImageError = (event) => {
      // Cache l'image si elle ne peut pas être chargée
      event.target.style.display = 'none'
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
      getMovieCountByCategory,
      handleImageError
    }
  }
}
</script>

<style>

</style>
