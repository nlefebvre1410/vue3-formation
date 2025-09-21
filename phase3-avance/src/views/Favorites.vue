<template>
  <div class="container">
    <div class="page-header">
      <h1>❤️ Films favoris</h1>
      <p>Vos films préférés en un coup d'œil</p>
    </div>

    <!-- Statistiques des favoris -->
    <div class="stats">
      <div class="stat-card">
        <span class="stat-number">{{ favoriteMovies.length }}</span>
        <div class="stat-label">Films favoris</div>
      </div>
      <div class="stat-card">
        <span class="stat-number">{{ favoriteCategories.length }}</span>
        <div class="stat-label">Catégories favorites</div>
      </div>
      <div class="stat-card">
        <span class="stat-number">{{ averageFavoriteRating }}</span>
        <div class="stat-label">Note moyenne</div>
      </div>
      <div class="stat-card">
        <span class="stat-number">{{ favoritePercentage }}%</span>
        <div class="stat-label">% de la collection</div>
      </div>
    </div>

    <!-- Filtres pour les favoris -->
    <div class="card" v-if="favoriteMovies.length > 0">
      <h2>🔍 Filtrer vos favoris</h2>
      <div class="filters">
        <div class="filter-group">
          <label for="search">Recherche :</label>
          <input 
            id="search"
            v-model="localFilters.search"
            type="text" 
            placeholder="Rechercher dans vos favoris..."
          >
        </div>

        <div class="filter-group">
          <label for="categoryFilter">Catégorie :</label>
          <select id="categoryFilter" v-model="localFilters.category">
            <option value="">Toutes les catégories</option>
            <option v-for="category in favoriteCategories" :key="category" :value="category">
              {{ category }}
            </option>
          </select>
        </div>

        <div class="filter-group">
          <label for="ratingFilter">Note minimum :</label>
          <select id="ratingFilter" v-model="localFilters.rating">
            <option value="">Toutes les notes</option>
            <option v-for="rating in 5" :key="rating" :value="rating">
              {{ rating }} étoile{{ rating > 1 ? 's' : '' }} et +
            </option>
          </select>
        </div>

        <div class="filter-group">
          <label>&nbsp;</label>
          <button class="btn btn-secondary" @click="clearLocalFilters">
            🗑️ Effacer les filtres
          </button>
        </div>
      </div>
    </div>

    <!-- Messages -->
    <Transition name="fade">
      <div v-if="message" :class="['message', messageType]">
        {{ message }}
      </div>
    </Transition>

    <!-- Message si aucun favori -->
    <div v-if="favoriteMovies.length === 0" class="empty-state">
      <div class="empty-icon">💔</div>
      <h2>Aucun film favori</h2>
      <p>Vous n'avez pas encore ajouté de films à vos favoris.</p>
      <p>Parcourez votre collection et marquez vos films préférés !</p>
      <router-link to="/movies" class="btn">
        🎬 Découvrir les films
      </router-link>
    </div>

    <!-- Message si aucun résultat après filtrage -->
    <div v-else-if="filteredFavorites.length === 0" class="message info">
      <p>🔍 Aucun film favori ne correspond à vos critères de recherche.</p>
    </div>

    <!-- Liste des films favoris -->
    <TransitionGroup v-else name="slide" tag="div" class="movies-grid">
      <MovieCard 
        v-for="movie in filteredFavorites" 
        :key="movie.id"
        :movie="movie"
        @edit="editMovie"
        @delete="handleDeleteMovie"
        @toggle-favorite="handleToggleFavorite"
        @view-details="viewMovieDetails"
      />
    </TransitionGroup>

    <!-- Suggestions -->
    <div v-if="favoriteMovies.length > 0 && suggestedMovies.length > 0" class="suggestions">
      <div class="card">
        <h2>💡 Suggestions basées sur vos favoris</h2>
        <p>Ces films pourraient vous plaire :</p>
        <div class="suggestions-grid">
          <div 
            v-for="movie in suggestedMovies" 
            :key="movie.id"
            class="suggestion-card"
            @click="viewMovieDetails(movie)"
          >
            <img 
              :src="movie.poster" 
              :alt="movie.title"
              class="suggestion-poster"
            >
            <div class="suggestion-info">
              <h3>{{ movie.title }}</h3>
              <p>{{ movie.category }} • {{ movie.year }}</p>
              <div v-if="movie.rating" class="movie-rating">
                <span 
                  v-for="star in 5" 
                  :key="star"
                  class="star"
                  :class="{ 'star-filled': star <= movie.rating }"
                >
                  ★
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useMovies } from '@/composables/useMovies'
import MovieCard from '@/components/MovieCard.vue'

const router = useRouter()
const {
  movies,
  favoriteMovies,
  totalMovies,
  deleteMovie,
  toggleFavorite,
  message,
  messageType
} = useMovies()

const localFilters = ref({
  search: '',
  category: '',
  rating: ''
})

const favoriteCategories = computed(() => {
  return [...new Set(favoriteMovies.value.map(movie => movie.category))].sort()
})

const averageFavoriteRating = computed(() => {
  const ratedFavorites = favoriteMovies.value.filter(movie => movie.rating)
  if (ratedFavorites.length === 0) return '0'
  const sum = ratedFavorites.reduce((acc, movie) => acc + movie.rating, 0)
  return (sum / ratedFavorites.length).toFixed(1)
})

const favoritePercentage = computed(() => {
  if (totalMovies.value === 0) return 0
  return Math.round((favoriteMovies.value.length / totalMovies.value) * 100)
})

const filteredFavorites = computed(() => {
  return favoriteMovies.value.filter(movie => {
    const matchesSearch = !localFilters.value.search || 
      movie.title.toLowerCase().includes(localFilters.value.search.toLowerCase()) ||
      movie.description.toLowerCase().includes(localFilters.value.search.toLowerCase())
    
    const matchesCategory = !localFilters.value.category || movie.category === localFilters.value.category
    const matchesRating = !localFilters.value.rating || (movie.rating && movie.rating >= parseInt(localFilters.value.rating))
    
    return matchesSearch && matchesCategory && matchesRating
  })
})

const suggestedMovies = computed(() => {
  if (favoriteMovies.value.length === 0) return []
  
  // Obtenir les catégories favorites
  const favoriteCategories = [...new Set(favoriteMovies.value.map(m => m.category))]
  
  // Trouver des films non favoris dans ces catégories
  return movies.value
    .filter(movie => 
      !movie.isFavorite && 
      favoriteCategories.includes(movie.category) &&
      movie.rating >= 4
    )
    .slice(0, 3)
})

const clearLocalFilters = () => {
  localFilters.value = {
    search: '',
    category: '',
    rating: ''
  }
}

const handleDeleteMovie = (id) => {
  const movie = favoriteMovies.value.find(m => m.id === id)
  if (movie && confirm(`Êtes-vous sûr de vouloir supprimer "${movie.title}" ?`)) {
    deleteMovie(id)
  }
}

const handleToggleFavorite = (id) => {
  toggleFavorite(id)
}

const editMovie = (movie) => {
  router.push({ name: 'Movies', query: { edit: movie.id } })
}

const viewMovieDetails = (movie) => {
  router.push(`/movies/${movie.id}`)
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

.empty-state {
  text-align: center;
  padding: 4rem 2rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.empty-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
}

.empty-state h2 {
  font-size: 2rem;
  color: #333;
  margin-bottom: 1rem;
}

.empty-state p {
  font-size: 1.1rem;
  color: #666;
  margin-bottom: 1rem;
  max-width: 500px;
  margin-left: auto;
  margin-right: auto;
}

.suggestions {
  margin-top: 3rem;
}

.suggestions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
}

.suggestion-card {
  background: #f8f9fa;
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.suggestion-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.suggestion-poster {
  width: 100%;
  height: 150px;
  object-fit: cover;
}

.suggestion-info {
  padding: 1rem;
}

.suggestion-info h3 {
  font-size: 1.1rem;
  margin-bottom: 0.5rem;
  color: #333;
}

.suggestion-info p {
  color: #666;
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
}

.movie-rating {
  display: flex;
  gap: 2px;
}

.star {
  color: #ddd;
  font-size: 1rem;
}

.star-filled {
  color: #ffc107;
}

@media (max-width: 768px) {
  .suggestions-grid {
    grid-template-columns: 1fr;
  }
  
  .empty-state {
    padding: 2rem 1rem;
  }
  
  .empty-icon {
    font-size: 3rem;
  }
  
  .empty-state h2 {
    font-size: 1.5rem;
  }
}
</style>
