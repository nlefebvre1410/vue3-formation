import { computed } from 'vue'
import { useMoviesStore } from '@/stores/movies'

export function useMovies() {
  const store = useMoviesStore()
  
  // Ajouter les propriétés manquantes
  const averageRating = computed(() => {
    if (!store.movies || !Array.isArray(store.movies)) return 0
    const ratedMovies = store.movies.filter(movie => movie.rating)
    if (ratedMovies.length === 0) return 0
    const sum = ratedMovies.reduce((acc, movie) => acc + movie.rating, 0)
    return (sum / ratedMovies.length).toFixed(1)
  })
  
  const getMoviesByCategory = (category) => {
    if (!store.movies || !Array.isArray(store.movies)) return []
    return store.movies.filter(movie => movie.category === category)
  }
  
  return {
    // État
    movies: store.movies,
    filters: store.filters,
    
    // Getters
    totalMovies: store.totalMovies,
    filteredMovies: store.filteredMovies,
    favoriteMovies: store.favoriteMovies,
    uniqueCategories: store.uniqueCategories,
    averageRating,
    
    // Actions
    addMovie: store.addMovie,
    updateMovie: store.updateMovie,
    deleteMovie: store.deleteMovie,
    toggleFavorite: store.toggleFavorite,
    getMovieById: store.getMovieById,
    updateFilters: store.updateFilters,
    clearFilters: store.clearFilters,
    getMoviesByCategory
  }
}
