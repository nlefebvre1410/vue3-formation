<template>
  <div id="app">
    <!-- Messages de notification -->
    <Transition name="slide-down">
      <div v-if="message.text" :class="['notification', message.type]">
        <span>{{ message.text }}</span>
        <button @click="message.text = ''" class="notification-close">×</button>
      </div>
    </Transition>

    <!-- Header de l'application -->
    <AppHeader 
      :title="appTitle"
      :description="appDescription"
    />

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
          <span class="stat-number">{{ favoriteMovies.length }}</span>
          <div class="stat-label">Favoris</div>
        </div>
      </div>

      <!-- Formulaire d'ajout/modification de film -->
      <MovieForm 
        :movie="editingMovie"
        :categories="availableCategories"
        @submit="editingMovie ? updateMovie($event) : addMovie($event)"
        @cancel="cancelEdit"
      />

      <!-- Filtres -->
      <MovieFilters 
        :filters="{ 
          search: searchTerm, 
          category: selectedCategory, 
          year: selectedYear,
          rating: selectedRating,
          favorites: selectedFavorites
        }"
        :categories="uniqueCategories"
        :years="uniqueYears"
        :movies="movies"
        @update-filter="updateFilters"
        @clear-filters="clearFilters"
      />

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
      <TransitionGroup v-else name="slide" tag="div" class="movies-grid">
        <MovieCard 
          v-for="movie in filteredMovies" 
          :key="movie.id"
          :movie="movie"
          @edit="editMovie"
          @delete="deleteMovie"
          @toggle-favorite="toggleFavorite"
        />
      </TransitionGroup>
    </div>
  </div>
</template>

<script>
import { ref, computed, reactive } from 'vue'
import AppHeader from './components/AppHeader.vue'
import MovieForm from './components/MovieForm.vue'
import MovieFilters from './components/MovieFilters.vue'
import MovieCard from './components/MovieCard.vue'
import moviesData from './movies.json'

export default {
  name: 'App',
  components: {
    AppHeader,
    MovieForm,
    MovieFilters,
    MovieCard
  },
  setup() {
    // Données réactives
    const appTitle = ref('Annuaire de Films Vue.js 3')
    const appDescription = ref('Gérez votre collection de films avec Vue.js 3 et la Composition API')

    const files = import.meta.glob('./assets/images/*', {eager: true, import: 'default'})

    // Crée une map simple : { "fichier.jpg": "url" }
    const byName = Object.fromEntries(
        Object.entries(files).map(([path, url]) => [path.split('/').pop(), url])
    )

    // Fonction utilitaire avec fallback
    const getSrc = (filename) =>
        byName[filename] ?? new URL('./assets/placeholder.png', import.meta.url).href

    // Construire les films en ajoutant directement les URLs
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
          category: movie.category,
          isFavorite: false
        }))
    )

    const searchTerm = ref('')
    const selectedCategory = ref('')
    const selectedYear = ref('')
    const selectedRating = ref('')
    const selectedFavorites = ref('')

    const editingMovie = ref(null)
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

    const favoriteMovies = computed(() => {
      return movies.value.filter(movie => movie.isFavorite)
    })

    const filteredMovies = computed(() => {
      return movies.value.filter(movie => {
        const matchesSearch = movie.title.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
            (movie.overview && movie.overview.toLowerCase().includes(searchTerm.value.toLowerCase())) ||
            (movie.original_title && movie.original_title.toLowerCase().includes(searchTerm.value.toLowerCase()))
        const matchesCategory = !selectedCategory.value || movie.category === selectedCategory.value
        const matchesYear = !selectedYear.value || movie.year === parseInt(selectedYear.value)
        
        // Filtre par note (convertir la note sur 10 en étoiles sur 5)
        const matchesRating = !selectedRating.value || (movie.vote_average && Math.round(movie.vote_average / 2) >= parseInt(selectedRating.value))
        
        // Filtre par favoris
        const matchesFavorites = !selectedFavorites.value || 
          (selectedFavorites.value === 'true' && movie.isFavorite) ||
          (selectedFavorites.value === 'false' && !movie.isFavorite)

        return matchesSearch && matchesCategory && matchesYear && matchesRating && matchesFavorites
      })
    })

    // Méthodes
    const addMovie = (movieData) => {
      if (movieData.title && movieData.category && movieData.year) {
        const movie = {
          id: Date.now(), // Simple ID basé sur le timestamp
          title: movieData.title,
          original_title: movieData.original_title || movieData.title,
          overview: movieData.overview || '',
          release_date: movieData.release_date,
          year: movieData.year,
          vote_average: movieData.vote_average,
          vote_count: movieData.vote_count,
          popularity: movieData.popularity,
          category: movieData.category,
          poster_path: movieData.poster_path || '',
          backdrop_path: ''
        }

        movies.value.push(movie)
        showMessage(`Film "${movie.title}" ajouté avec succès !`, 'success')
      }
    }

    const deleteMovie = (id) => {
      const movie = movies.value.find(m => m.id === id)
      if (movie && confirm(`Êtes-vous sûr de vouloir supprimer "${movie.title}" ?`)) {
        movies.value = movies.value.filter(movie => movie.id !== id)
        showMessage(`Film "${movie.title}" supprimé avec succès !`, 'success')
        
        // Annuler l'édition si le film supprimé était en cours d'édition
        if (editingMovie.value && editingMovie.value.id === id) {
          cancelEdit()
        }
      }
    }

    const editMovie = (movie) => {
      editingMovie.value = { ...movie }
      showMessage(`Édition du film "${movie.title}"`, 'info')
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

    const updateMovie = (movieData) => {
      const index = movies.value.findIndex(movie => movie.id === editingMovie.value.id)
      if (index !== -1) {
        movies.value[index] = {
          id: editingMovie.value.id,
          title: movieData.title,
          original_title: movieData.original_title,
          overview: movieData.overview,
          release_date: movieData.release_date,
          year: movieData.year,
          vote_average: movieData.vote_average,
          vote_count: movieData.vote_count,
          popularity: movieData.popularity,
          category: movieData.category,
          poster_path: movieData.poster_path || movies.value[index].poster_path,
          backdrop_path: movieData.backdrop_path || movies.value[index].backdrop_path,
        }
        cancelEdit()
        showMessage(`Film "${movieData.title}" mis à jour avec succès !`, 'success')
      }
    }

    const cancelEdit = () => {
      editingMovie.value = null
      showMessage('Édition annulée', 'info')
    }

    const toggleFavorite = (id) => {
      const movie = movies.value.find(m => m.id === id)
      if (movie) {
        movie.isFavorite = !movie.isFavorite
        const action = movie.isFavorite ? 'ajouté aux' : 'retiré des'
        showMessage(`"${movie.title}" ${action} favoris`, 'success')
      }
    }

    const clearFilters = () => {
      searchTerm.value = ''
      selectedCategory.value = ''
      selectedYear.value = ''
      selectedRating.value = ''
      selectedFavorites.value = ''
    }

    const updateFilters = (newFilters) => {
      if (newFilters.search !== undefined) searchTerm.value = newFilters.search
      if (newFilters.category !== undefined) selectedCategory.value = newFilters.category
      if (newFilters.year !== undefined) selectedYear.value = newFilters.year
      if (newFilters.rating !== undefined) selectedRating.value = newFilters.rating
      if (newFilters.favorites !== undefined) selectedFavorites.value = newFilters.favorites
    }

    const getMovieCountByCategory = (category) => {
      return movies.value.filter(movie => movie.category === category).length
    }

    const handleImageError = (event) => {
      // Cache l'image si elle ne peut pas être chargée
      event.target.style.display = 'none'
    }

    const showMessage = (text, type = 'success') => {
      message.text = text
      message.type = type
      
      // Effacer le message après 3 secondes
      setTimeout(() => {
        message.text = ''
      }, 3000)
    }

    return {
      // Données
      appTitle,
      appDescription,
      movies,
      searchTerm,
      selectedCategory,
      selectedYear,
      selectedRating,
      selectedFavorites,
      editingMovie,
      message,
      availableCategories,
      currentYear,
      
      // Propriétés calculées
      totalMovies,
      uniqueCategories,
      uniqueYears,
      favoriteMovies,
      filteredMovies,
      
      // Méthodes
      addMovie,
      updateMovie,
      deleteMovie,
      editMovie,
      cancelEdit,
      toggleFavorite,
      updateFilters,
      clearFilters,
      getMovieCountByCategory,
      handleImageError
    }
  }
}
</script>
