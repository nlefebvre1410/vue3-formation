<template>
  <div class="container">
    <div class="page-header">
      <h1>🎬 Tous les films</h1>
      <p>Gérez votre collection de films</p>
    </div>

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

    <!-- Formulaire d'ajout -->
    <MovieForm 
      :movie="editingMovie"
      @submit="editingMovie ? handleUpdateMovie($event) : handleAddMovie($event)"
      @cancel="cancelEdit"
    />

    <!-- Filtres -->
    <MovieFilters 
      :filters="filters"
      :movies="movies"
      @update-filter="updateFilters"
      @clear-filters="clearFilters"
    />

    <!-- Messages -->
    <Transition name="fade">
      <div v-if="message" :class="['message', messageType]">
        {{ message }}
      </div>
    </Transition>

    <!-- Loading -->
    <div v-if="isLoading" class="loading">
      <div class="spinner"></div>
    </div>

    <!-- Message si aucun film -->
    <div v-else-if="filteredMovies.length === 0" class="message info">
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
        @delete="handleDeleteMovie"
        @toggle-favorite="handleToggleFavorite"
        @view-details="viewMovieDetails"
      />
    </TransitionGroup>
  </div>
</template>

<script>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useMovies } from '@/composables/useMovies'
import MovieForm from '@/components/MovieForm.vue'
import MovieFilters from '@/components/MovieFilters.vue'
import MovieCard from '@/components/MovieCard.vue'

export default {
  name: 'Movies',
  components: {
    MovieForm,
    MovieFilters,
    MovieCard
  },
  setup() {
    const router = useRouter()
    const {
      movies,
      filteredMovies,
      favoriteMovies,
      totalMovies,
      uniqueCategories,
      filters,
      isLoading,
      message,
      messageType,
      addMovie,
      updateMovie,
      deleteMovie,
      toggleFavorite,
      getMovieById,
      updateFilters,
      clearFilters
    } = useMovies()

    const editingMovie = ref(null)

    const handleAddMovie = (movieData) => {
      addMovie(movieData)
    }

    const handleUpdateMovie = (movieData) => {
      if (editingMovie.value) {
        updateMovie(editingMovie.value.id, movieData)
        editingMovie.value = null
      }
    }

    const handleDeleteMovie = (id) => {
      const movie = getMovieById(id)
      if (movie && confirm(`Êtes-vous sûr de vouloir supprimer "${movie.title}" ?`)) {
        deleteMovie(id)
        
        // Annuler l'édition si le film supprimé était en cours d'édition
        if (editingMovie.value && editingMovie.value.id === id) {
          editingMovie.value = null
        }
      }
    }

    const handleToggleFavorite = (id) => {
      toggleFavorite(id)
    }

    const editMovie = (movie) => {
      editingMovie.value = { ...movie }
    }

    const cancelEdit = () => {
      editingMovie.value = null
    }

    const viewMovieDetails = (movie) => {
      router.push(`/movies/${movie.id}`)
    }

    return {
      movies,
      filteredMovies,
      favoriteMovies,
      totalMovies,
      uniqueCategories,
      filters,
      isLoading,
      message,
      messageType,
      editingMovie,
      handleAddMovie,
      handleUpdateMovie,
      handleDeleteMovie,
      handleToggleFavorite,
      editMovie,
      cancelEdit,
      viewMovieDetails,
      updateFilters,
      clearFilters
    }
  }
}
</script>

<style scoped>
.page-header {
  text-align: center;
  margin-bottom: 2rem;
}

.page-header h1 {
  font-size: 2.5rem;
  color: #333;
  margin-bottom: 0.5rem;
}

.page-header p {
  font-size: 1.2rem;
  color: #666;
}
</style>
