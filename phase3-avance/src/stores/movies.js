import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useMoviesStore = defineStore('movies', () => {
  // State
  const movies = ref([
    {
      id: 1,
      title: 'Inception',
      category: 'Science-Fiction',
      year: 2010,
      rating: 5,
      description: 'Un voleur qui s\'infiltre dans les rêves des gens pour voler leurs secrets.',
      isFavorite: true,
      director: 'Christopher Nolan',
      duration: 148,
      poster: 'https://via.placeholder.com/300x450/667eea/ffffff?text=Inception'
    },
    {
      id: 2,
      title: 'The Dark Knight',
      category: 'Action',
      year: 2008,
      rating: 5,
      description: 'Batman affronte le Joker dans cette suite épique.',
      isFavorite: false,
      director: 'Christopher Nolan',
      duration: 152,
      poster: 'https://via.placeholder.com/300x450/42b883/ffffff?text=Dark+Knight'
    },
    {
      id: 3,
      title: 'Amélie',
      category: 'Romance',
      year: 2001,
      rating: 4,
      description: 'L\'histoire touchante d\'une jeune femme parisienne.',
      isFavorite: true,
      director: 'Jean-Pierre Jeunet',
      duration: 122,
      poster: 'https://via.placeholder.com/300x450/e74c3c/ffffff?text=Amélie'
    },
    {
      id: 4,
      title: 'Parasite',
      category: 'Thriller',
      year: 2019,
      rating: 5,
      description: 'Une famille pauvre s\'infiltre dans la vie d\'une famille riche.',
      isFavorite: false,
      director: 'Bong Joon-ho',
      duration: 132,
      poster: 'https://via.placeholder.com/300x450/f39c12/ffffff?text=Parasite'
    },
    {
      id: 5,
      title: 'Spirited Away',
      category: 'Animation',
      year: 2001,
      rating: 5,
      description: 'Une jeune fille découvre un monde magique peuplé d\'esprits.',
      isFavorite: true,
      director: 'Hayao Miyazaki',
      duration: 125,
      poster: 'https://via.placeholder.com/300x450/9b59b6/ffffff?text=Spirited+Away'
    }
  ])

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
      poster: `https://via.placeholder.com/300x450/667eea/ffffff?text=${encodeURIComponent(movieData.title)}`
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
