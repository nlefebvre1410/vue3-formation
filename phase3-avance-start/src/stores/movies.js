import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import moviesData from '@/assets/data/movies.json'

// Chargement des images avec import.meta.glob
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

// Fonction utilitaire pour les images
const getSrc = (filename) => {
  return byName[filename] || createPlaceholderSvg(`Film ${filename.split('_')[0]}`)
}

// Fonction pour mapper les données vers notre format
const mapMovieData = (movie) => {
  const year = new Date(movie.release_date).getFullYear()
  
  return {
    id: movie.id,
    title: movie.title,
    original_title: movie.original_title,
    category: movie.category || 'Drame',
    year: year,
    rating: Math.round(movie.vote_average / 2),
    description: movie.overview,
    isFavorite: false,
    director: movie.director || 'Réalisateur inconnu',
    duration: Math.floor(Math.random() * 60) + 90,
    poster: getSrc(movie.poster_path),
    backdrop: getSrc(movie.backdrop_path)
  }
}

export const useMoviesStore = defineStore('movies', () => {
  // État de base - s'assurer que les données sont bien chargées
  const movies = ref([])
  const filters = ref({
    search: '',
    category: '',
    year: '',
    rating: '',
    favorites: ''
  })

  // Initialiser les films
  try {
    movies.value = moviesData.map(mapMovieData)
    console.log('Films chargés:', movies.value.length, 'films')
  } catch (error) {
    console.error('Erreur lors du chargement des données:', error)
    movies.value = []
  }

  // Getters de base avec protection
  const totalMovies = computed(() => movies.value?.length || 0)
  
  const favoriteMovies = computed(() => 
    movies.value?.filter(movie => movie.isFavorite) || []
  )
  
  const uniqueCategories = computed(() => 
    movies.value?.length > 0 
      ? [...new Set(movies.value.map(movie => movie.category))].sort()
      : []
  )

  const filteredMovies = computed(() => {
    if (!movies.value || !Array.isArray(movies.value)) return []
    
    return movies.value.filter(movie => {
      const matchesSearch = !filters.value.search || 
        movie.title.toLowerCase().includes(filters.value.search.toLowerCase())
      
      const matchesCategory = !filters.value.category || movie.category === filters.value.category
      const matchesYear = !filters.value.year || movie.year.toString() === filters.value.year
      const matchesRating = !filters.value.rating || (movie.rating && movie.rating >= parseInt(filters.value.rating))
      const matchesFavorites = !filters.value.favorites || 
        (filters.value.favorites === 'true' && movie.isFavorite) ||
        (filters.value.favorites === 'false' && !movie.isFavorite)
      
      return matchesSearch && matchesCategory && matchesYear && matchesRating && matchesFavorites
    })
  })

  // Actions de base
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
      movies.value.splice(index, 1)
      return true
    }
    return false
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

  // Retourner les propriétés et actions du store
  return {
    // État
    movies,
    filters,
    
    // Getters
    totalMovies,
    favoriteMovies,
    uniqueCategories,
    filteredMovies,
    
    // Actions
    addMovie,
    updateMovie,
    deleteMovie,
    toggleFavorite,
    getMovieById,
    updateFilters,
    clearFilters
  }
})
