<template>
  <div class="container">
    <div v-if="movie" class="movie-detail">
      <!-- Navigation -->
      <div class="movie-nav">
        <button @click="$router.go(-1)" class="btn btn-secondary">
          ← Retour
        </button>
        <div class="movie-actions">
          <button 
            @click="toggleFavorite(movie.id)"
            :class="['btn', movie.isFavorite ? 'btn-danger' : 'btn-outline']"
          >
            {{ movie.isFavorite ? '❤️ Retirer des favoris' : '🤍 Ajouter aux favoris' }}
          </button>
          <button @click="editMovie" class="btn">
            ✏️ Modifier
          </button>
          <button @click="deleteMovie" class="btn btn-danger">
            🗑️ Supprimer
          </button>
        </div>
      </div>

      <!-- Contenu principal -->
      <div class="movie-content">
        <!-- Image et informations principales -->
        <div class="movie-hero">
          <div class="movie-poster-container">
            <img 
              :src="movie.poster" 
              :alt="movie.title"
              class="movie-poster-large"
              @error="handleImageError"
            >
          </div>
          
          <div class="movie-info">
            <h1 class="movie-title">{{ movie.title }}</h1>
            
            <div class="movie-meta-grid">
              <div class="meta-item">
                <strong>Catégorie :</strong>
                <span class="movie-category">{{ movie.category }}</span>
              </div>
              
              <div class="meta-item">
                <strong>Année :</strong>
                <span>{{ movie.year }}</span>
              </div>
              
              <div class="meta-item">
                <strong>Réalisateur :</strong>
                <span>{{ movie.director }}</span>
              </div>
              
              <div class="meta-item">
                <strong>Durée :</strong>
                <span>{{ movie.duration }} minutes</span>
              </div>
              
              <div v-if="movie.rating" class="meta-item">
                <strong>Note :</strong>
                <div class="movie-rating">
                  <div class="stars">
                    <span 
                      v-for="star in 5" 
                      :key="star"
                      class="star"
                      :class="{ 'star-filled': star <= movie.rating }"
                    >
                      ★
                    </span>
                  </div>
                  <span class="rating-text">{{ movie.rating }}/5</span>
                </div>
              </div>
              
              <div class="meta-item">
                <strong>Statut :</strong>
                <span :class="['status', movie.isFavorite ? 'favorite' : 'normal']">
                  {{ movie.isFavorite ? '❤️ Favori' : '🤍 Normal' }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Description -->
        <div v-if="movie.description" class="movie-description-section">
          <h2>📖 Synopsis</h2>
          <p class="movie-description">{{ movie.description }}</p>
        </div>

        <!-- Films similaires -->
        <div v-if="similarMovies.length > 0" class="similar-movies">
          <h2>🎬 Films similaires</h2>
          <div class="similar-movies-grid">
            <div 
              v-for="similarMovie in similarMovies" 
              :key="similarMovie.id"
              class="similar-movie-card"
              @click="navigateToMovie(similarMovie.id)"
            >
              <img 
                :src="similarMovie.poster" 
                :alt="similarMovie.title"
                class="similar-movie-poster"
              >
              <div class="similar-movie-info">
                <h3>{{ similarMovie.title }}</h3>
                <p>{{ similarMovie.year }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Film non trouvé -->
    <div v-else class="not-found">
      <h1>😕</h1>
      <h2>Film non trouvé</h2>
      <p>Le film que vous recherchez n'existe pas ou a été supprimé.</p>
      <router-link to="/movies" class="btn">
        ← Retour aux films
      </router-link>
    </div>

    <!-- Messages -->
    <Transition name="fade">
      <div v-if="message" :class="['message', messageType]">
        {{ message }}
      </div>
    </Transition>
  </div>
</template>

<script>
import { computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useMovies } from '@/composables/useMovies'

export default {
  name: 'MovieDetail',
  props: {
    id: {
      type: String,
      required: true
    }
  },
  setup(props) {
    const route = useRoute()
    const router = useRouter()
    const {
      movies,
      getMovieById,
      deleteMovie,
      toggleFavorite,
      message,
      messageType
    } = useMovies()

    const movie = computed(() => getMovieById(props.id))

    const similarMovies = computed(() => {
      if (!movie.value) return []
      
      return movies.value
        .filter(m => 
          m.id !== movie.value.id && 
          (m.category === movie.value.category || m.director === movie.value.director)
        )
        .slice(0, 4)
    })

    const editMovie = () => {
      router.push({ name: 'Movies', query: { edit: movie.value.id } })
    }

    const handleDeleteMovie = () => {
      if (movie.value && confirm(`Êtes-vous sûr de vouloir supprimer "${movie.value.title}" ?`)) {
        deleteMovie(movie.value.id)
        router.push('/movies')
      }
    }

    const navigateToMovie = (movieId) => {
      router.push(`/movies/${movieId}`)
    }

    const handleImageError = (event) => {
      event.target.src = `https://via.placeholder.com/300x450/667eea/ffffff?text=${encodeURIComponent(movie.value.title)}`
    }

    // Surveiller les changements d'ID pour recharger le film
    watch(() => props.id, (newId) => {
      if (!getMovieById(newId)) {
        router.push('/movies')
      }
    })

    return {
      movie,
      similarMovies,
      message,
      messageType,
      editMovie,
      deleteMovie: handleDeleteMovie,
      toggleFavorite,
      navigateToMovie,
      handleImageError
    }
  }
}
</script>

<style scoped>
.movie-detail {
  max-width: 1000px;
  margin: 0 auto;
}

.movie-nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  gap: 1rem;
}

.movie-actions {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.movie-hero {
  display: grid;
  grid-template-columns: 300px 1fr;
  gap: 2rem;
  margin-bottom: 2rem;
}

.movie-poster-container {
  position: sticky;
  top: 2rem;
}

.movie-poster-large {
  width: 100%;
  height: 450px;
  object-fit: cover;
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
}

.movie-info {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.movie-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: #333;
  margin: 0;
}

.movie-meta-grid {
  display: grid;
  gap: 1rem;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.75rem;
  background: #f8f9fa;
  border-radius: 8px;
}

.meta-item strong {
  min-width: 100px;
  color: #555;
}

.movie-category {
  background: #667eea;
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.875rem;
}

.movie-rating {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.stars {
  display: flex;
  gap: 2px;
}

.star {
  color: #ddd;
  font-size: 1.2rem;
}

.star-filled {
  color: #ffc107;
}

.rating-text {
  font-weight: 600;
  color: #333;
}

.status.favorite {
  color: #dc3545;
  font-weight: 600;
}

.status.normal {
  color: #6c757d;
}

.movie-description-section {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
}

.movie-description-section h2 {
  color: #667eea;
  margin-bottom: 1rem;
}

.movie-description {
  font-size: 1.1rem;
  line-height: 1.6;
  color: #555;
}

.similar-movies {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.similar-movies h2 {
  color: #667eea;
  margin-bottom: 1.5rem;
}

.similar-movies-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.similar-movie-card {
  background: #f8f9fa;
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.similar-movie-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.similar-movie-poster {
  width: 100%;
  height: 120px;
  object-fit: cover;
}

.similar-movie-info {
  padding: 1rem;
}

.similar-movie-info h3 {
  font-size: 1rem;
  margin-bottom: 0.5rem;
  color: #333;
}

.similar-movie-info p {
  color: #666;
  font-size: 0.9rem;
}

@media (max-width: 768px) {
  .movie-nav {
    flex-direction: column;
    align-items: stretch;
  }
  
  .movie-actions {
    justify-content: center;
  }
  
  .movie-hero {
    grid-template-columns: 1fr;
    text-align: center;
  }
  
  .movie-poster-container {
    position: static;
    max-width: 300px;
    margin: 0 auto;
  }
  
  .movie-title {
    font-size: 2rem;
  }
  
  .meta-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
  
  .meta-item strong {
    min-width: auto;
  }
  
  .similar-movies-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 480px) {
  .similar-movies-grid {
    grid-template-columns: 1fr;
  }
}
</style>
