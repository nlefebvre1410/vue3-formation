import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import moviesData from '@/assets/data/movies.json'


const files = import.meta.glob('../assets/images/*.jpg', {eager: true, import: 'default'})

const byName = Object.fromEntries(
  Object.entries(files).map(([path, url]) => [path.split('/').pop(), url])
)
// Fonction pour créer une image SVG de fallback
const createPlaceholderSvg = (text, width = 300, height = 450) => {
  const svg = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="#667eea"/>
      <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="16" fill="white" text-anchor="middle" dominant-baseline="middle">
        ${text}
      </text>
    </svg>
  `
  return `data:image/svg+xml;base64,${btoa(svg)}`
}

// Fonction utilitaire avec fallback
const getSrc = (filename) => {
  if (byName[filename]) {
    
    return byName[filename]
  }
  
  // Créer un placeholder SVG avec le nom du film
  const movieId = filename.split('_')[0]
  return createPlaceholderSvg(`Film ${movieId}`)
}

// Fonction pour mapper les données vers notre format
const mapMovieData = (movie) => {
  // Extraire l'année de la date de sortie
  const year = new Date(movie.release_date).getFullYear()
  
  // Catégories disponibles (pour référence)
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
  
  return {
    id: movie.id,
    title: movie.title,
    original_title: movie.original_title,
    category: movie.category || 'Drame',
    year: year,
    rating: Math.round(movie.vote_average / 2), // Convertir /10 vers /5
    description: movie.overview,
    isFavorite: false, // Par défaut
    director: movie.director || 'Réalisateur inconnu',
    duration: Math.floor(Math.random() * 60) + 90, // Durée simulée entre 90-150 min
    poster: getSrc(movie.poster_path),
    backdrop: getSrc(movie.backdrop_path)
  }
}

export const useMoviesStore = defineStore('movies', () => {
  // State - Charger les données depuis le JSON
  const movies = ref(moviesData.map(mapMovieData))

  const filters = ref({
    search: '',
    category: '',
    year: '',
    rating: '',
    favorites: ''
  })

  const isLoading = ref(false)
  const error = ref(null)

  // Getters
  const totalMovies = computed(() => movies.value.length)
  
  const favoriteMovies = computed(() => 
    movies.value.filter(movie => movie.isFavorite)
  )
  
  const uniqueCategories = computed(() => 
    [...new Set(movies.value.map(movie => movie.category))].sort()
  )
  
  const uniqueYears = computed(() => 
    [...new Set(movies.value.map(movie => movie.year))].sort((a, b) => b - a)
  )

  const filteredMovies = computed(() => {
    return movies.value.filter(movie => {
      const matchesSearch = !filters.value.search || 
        movie.title.toLowerCase().includes(filters.value.search.toLowerCase()) ||
        movie.description.toLowerCase().includes(filters.value.search.toLowerCase()) ||
        movie.director.toLowerCase().includes(filters.value.search.toLowerCase())
      
      const matchesCategory = !filters.value.category || movie.category === filters.value.category
      const matchesYear = !filters.value.year || movie.year.toString() === filters.value.year
      const matchesRating = !filters.value.rating || (movie.rating && movie.rating >= parseInt(filters.value.rating))
      const matchesFavorites = !filters.value.favorites || 
        (filters.value.favorites === 'true' && movie.isFavorite) ||
        (filters.value.favorites === 'false' && !movie.isFavorite)
      
      return matchesSearch && matchesCategory && matchesYear && matchesRating && matchesFavorites
    })
  })

  const averageRating = computed(() => {
    const ratedMovies = movies.value.filter(movie => movie.rating)
    if (ratedMovies.length === 0) return 0
    const sum = ratedMovies.reduce((acc, movie) => acc + movie.rating, 0)
    return (sum / ratedMovies.length).toFixed(1)
  })

  // Actions
  const addMovie = (movieData) => {
    const movie = {
      id: Date.now(),
      ...movieData,
      isFavorite: false,
      poster: createPlaceholderSvg(movieData.title)
    }
    movies.value.push(movie)
    return movie
  }

  const updateMovie = (id, movieData) => {
    const index = movies.value.findIndex(movie => movie.id === id)
    if (index !== -1) {
      movies.value[index] = { ...movies.value[index], ...movieData }
      return movies.value[index]
    }
    return null
  }

  const deleteMovie = (id) => {
    const index = movies.value.findIndex(movie => movie.id === id)
    if (index !== -1) {
      const deletedMovie = movies.value[index]
      movies.value.splice(index, 1)
      return deletedMovie
    }
    return null
  }

  const toggleFavorite = (id) => {
    const movie = movies.value.find(m => m.id === id)
    if (movie) {
      movie.isFavorite = !movie.isFavorite
      return movie
    }
    return null
  }

  const getMovieById = (id) => {
    return movies.value.find(movie => movie.id === parseInt(id))
  }

  const updateFilters = (newFilters) => {
    Object.assign(filters.value, newFilters)
  }

  const clearFilters = () => {
    filters.value = {
      search: '',
      category: '',
      year: '',
      rating: '',
      favorites: ''
    }
  }

  const getMoviesByCategory = (category) => {
    return movies.value.filter(movie => movie.category === category)
  }

  const searchMovies = async (query) => {
    isLoading.value = true
    error.value = null
    
    try {
      // Simulation d'une recherche asynchrone
      await new Promise(resolve => setTimeout(resolve, 500))
      
      const results = movies.value.filter(movie =>
        movie.title.toLowerCase().includes(query.toLowerCase()) ||
        movie.description.toLowerCase().includes(query.toLowerCase()) ||
        movie.director.toLowerCase().includes(query.toLowerCase())
      )
      
      return results
    } catch (err) {
      error.value = 'Erreur lors de la recherche'
      return []
    } finally {
      isLoading.value = false
    }
  }

  return {
    // State
    movies,
    filters,
    isLoading,
    error,
    
    // Getters
    totalMovies,
    favoriteMovies,
    uniqueCategories,
    uniqueYears,
    filteredMovies,
    averageRating,
    
    // Actions
    addMovie,
    updateMovie,
    deleteMovie,
    toggleFavorite,
    getMovieById,
    updateFilters,
    clearFilters,
    getMoviesByCategory,
    searchMovies
  }
})
