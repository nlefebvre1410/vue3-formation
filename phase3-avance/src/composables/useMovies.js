import { ref, computed, watch } from 'vue'
import { useMoviesStore } from '@/stores/movies'

export function useMovies() {
  const store = useMoviesStore()
  const message = ref('')
  const messageType = ref('success')

  const showMessage = (text, type = 'success') => {
    message.value = text
    messageType.value = type
    
    setTimeout(() => {
      message.value = ''
    }, 3000)
  }

  const addMovie = (movieData) => {
    try {
      const movie = store.addMovie(movieData)
      showMessage(`Film "${movie.title}" ajouté avec succès !`, 'success')
      return movie
    } catch (error) {
      showMessage('Erreur lors de l\'ajout du film', 'error')
      return null
    }
  }

  const updateMovie = (id, movieData) => {
    try {
      const movie = store.updateMovie(id, movieData)
      if (movie) {
        showMessage(`Film "${movie.title}" mis à jour avec succès !`, 'success')
        return movie
      } else {
        showMessage('Film non trouvé', 'error')
        return null
      }
    } catch (error) {
      showMessage('Erreur lors de la mise à jour du film', 'error')
      return null
    }
  }

  const deleteMovie = (id) => {
    try {
      const movie = store.deleteMovie(id)
      if (movie) {
        showMessage(`Film "${movie.title}" supprimé avec succès !`, 'success')
        return movie
      } else {
        showMessage('Film non trouvé', 'error')
        return null
      }
    } catch (error) {
      showMessage('Erreur lors de la suppression du film', 'error')
      return null
    }
  }

  const toggleFavorite = (id) => {
    try {
      const movie = store.toggleFavorite(id)
      if (movie) {
        const action = movie.isFavorite ? 'ajouté aux' : 'retiré des'
        showMessage(`"${movie.title}" ${action} favoris`, 'success')
        return movie
      } else {
        showMessage('Film non trouvé', 'error')
        return null
      }
    } catch (error) {
      showMessage('Erreur lors de la modification des favoris', 'error')
      return null
    }
  }

  return {
    // Store state
    movies: computed(() => store.movies),
    filteredMovies: computed(() => store.filteredMovies),
    favoriteMovies: computed(() => store.favoriteMovies),
    totalMovies: computed(() => store.totalMovies),
    uniqueCategories: computed(() => store.uniqueCategories),
    uniqueYears: computed(() => store.uniqueYears),
    averageRating: computed(() => store.averageRating),
    filters: computed(() => store.filters),
    isLoading: computed(() => store.isLoading),
    error: computed(() => store.error),
    
    // Local state
    message,
    messageType,
    
    // Actions
    addMovie,
    updateMovie,
    deleteMovie,
    toggleFavorite,
    getMovieById: store.getMovieById,
    updateFilters: store.updateFilters,
    clearFilters: store.clearFilters,
    getMoviesByCategory: store.getMoviesByCategory,
    searchMovies: store.searchMovies,
    showMessage
  }
}
