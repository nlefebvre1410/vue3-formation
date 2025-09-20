<template>
  <div class="movie-card">
    <div class="movie-poster" v-if="movie.poster_path">
      <img
        :src="movie.poster_path"
        :alt="`Poster de ${movie.title}`"
        @error="handleImageError"
      >
    </div>
    <div class="movie-content">
      <div class="movie-header">
        <h3 class="movie-title">{{ movie.title.length > 30 ? movie.title.substring(0, 30) + '...' : movie.title }}</h3>
        <span class="movie-category">{{ movie.category }}</span>
      </div>
      <p class="movie-original-title" v-if="movie.original_title && movie.original_title !== movie.title">
        <em>{{ movie.original_title }}</em>
      </p>
      <div class="movie-meta">
        <span class="movie-year">Année : {{ movie.year }}</span>
        <div v-if="movie.vote_average" class="movie-rating">
          <span class="rating-label">Note :</span>
          <div class="stars">
            <span 
              v-for="star in 5" 
              :key="star"
              class="star"
              :class="{ 'star-filled': star <= Math.round(movie.vote_average / 2) }"
            >
              ★
            </span>
          </div>
        </div>
      </div>
      <p class="movie-overview" v-if="movie.overview">
        {{ movie.overview.length > 120 ? movie.overview.substring(0, 120) + '...' : movie.overview }}
      </p>
      <div class="movie-stats">
        <small>{{ movie.vote_count }} votes • Popularité: {{ Math.round(movie.popularity) }}</small>
      </div>

      <div class="movie-actions">
        <button class="btn" @click="$emit('edit', movie)">
          Modifier
        </button>
        <button class="btn btn-danger" @click="$emit('delete', movie.id)">
          Supprimer
        </button>
      </div>
      <button 
        class="btn btn-outline btn-favorite" 
        @click="$emit('toggle-favorite', movie.id)"
      >
        {{ movie.isFavorite ? '❤️' : '🤍' }} 
        {{ movie.isFavorite ? 'Favori' : 'Ajouter aux favoris' }}
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MovieCard',
  props: {
    movie: {
      type: Object,
      required: true,
      validator(movie) {
        return movie.id && movie.title
      }
    }
  },
  emits: ['edit', 'delete', 'toggle-favorite'],
  methods: {
    handleImageError(event) {
      // Cache l'image si elle ne peut pas être chargée
      event.target.style.display = 'none'
    }
  }
}
</script>

