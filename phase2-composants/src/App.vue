<template>
  <div id="app">
    <!-- Header de l'application -->
    <AppHeader 
      :title="appTitle"
      :description="appDescription"
    />

    <div class="container">
      <!-- Statistiques -->
      <div class="stats">
        <StatsCard 
          :value="totalMovies"
          label="Films au total"
        />
        <StatsCard 
          :value="filteredMovies.length"
          label="Films affichés"
        />
        <StatsCard 
          :value="uniqueCategories.length"
          label="Catégories"
        />
        <StatsCard 
          :value="favoriteMovies.length"
          label="Favoris"
        />
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
        :filters="filters"
        :categories="uniqueCategories"
        :years="uniqueYears"
        :movies="movies"
        @update-filter="updateFilters"
        @clear-filters="clearFilters"
      />

      <!-- Messages -->
      <Transition name="fade">
        <div v-if="message.text" :class="['message', message.type]">
          {{ message.text }}
        </div>
      </Transition>

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
import StatsCard from './components/StatsCard.vue'
import MovieForm from './components/MovieForm.vue'
import MovieFilters from './components/MovieFilters.vue'
import MovieCard from './components/MovieCard.vue'

export default {
  name: 'App',
  components: {
    AppHeader,
    StatsCard,
    MovieForm,
    MovieFilters,
    MovieCard
  },
  setup() {
    // Données réactives
    const appTitle = ref('Annuaire de Films - Composants Vue.js 3')
    const appDescription = ref('Application modulaire avec des composants réutilisables')
    
    const movies = ref([
      {
        id: 1,
        title: 'Inception',
        category: 'Science-Fiction',
        year: 2010,
        rating: 5,
        description: 'Un voleur qui s\'infiltre dans les rêves des gens pour voler leurs secrets.',
        isFavorite: true
      },
      {
        id: 2,
        title: 'The Dark Knight',
        category: 'Action',
        year: 2008,
        rating: 5,
        description: 'Batman affronte le Joker dans cette suite épique.',
        isFavorite: false
      },
      {
        id: 3,
        title: 'Amélie',
        category: 'Romance',
        year: 2001,
        rating: 4,
        description: 'L\'histoire touchante d\'une jeune femme parisienne.',
        isFavorite: true
      },
      {
        id: 4,
        title: 'Parasite',
        category: 'Thriller',
        year: 2019,
        rating: 5,
        description: 'Une famille pauvre s\'infiltre dans la vie d\'une famille riche.',
        isFavorite: false
      }
    ])

    const filters = reactive({
      search: '',
      category: '',
      year: '',
      rating: '',
      favorites: ''
    })

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
        // Recherche textuelle
        const matchesSearch = !filters.search || 
          movie.title.toLowerCase().includes(filters.search.toLowerCase()) ||
          movie.description.toLowerCase().includes(filters.search.toLowerCase())
        
        // Filtre par catégorie
        const matchesCategory = !filters.category || movie.category === filters.category
        
        // Filtre par année
        const matchesYear = !filters.year || movie.year.toString() === filters.year
        
        // Filtre par note
        const matchesRating = !filters.rating || (movie.rating && movie.rating >= parseInt(filters.rating))
        
        // Filtre par favoris
        const matchesFavorites = !filters.favorites || 
          (filters.favorites === 'true' && movie.isFavorite) ||
          (filters.favorites === 'false' && !movie.isFavorite)
        
        return matchesSearch && matchesCategory && matchesYear && matchesRating && matchesFavorites
      })
    })

    // Méthodes
    const addMovie = (movieData) => {
      const movie = {
        id: Date.now(),
        ...movieData,
        isFavorite: false
      }
      
      movies.value.push(movie)
      showMessage(`Film "${movie.title}" ajouté avec succès !`, 'success')
    }

    const updateMovie = (movieData) => {
      const index = movies.value.findIndex(movie => movie.id === editingMovie.value.id)
      if (index !== -1) {
        movies.value[index] = {
          ...editingMovie.value,
          ...movieData
        }
        showMessage(`Film "${movieData.title}" mis à jour avec succès !`, 'success')
        cancelEdit()
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

    const updateFilters = (newFilters) => {
      Object.assign(filters, newFilters)
    }

    const clearFilters = () => {
      Object.assign(filters, {
        search: '',
        category: '',
        year: '',
        rating: '',
        favorites: ''
      })
      showMessage('Filtres effacés', 'info')
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
      filters,
      editingMovie,
      message,
      availableCategories,
      
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
      clearFilters
    }
  }
}
</script>
