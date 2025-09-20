<template>
  <div class="movie-card">
    <div class="movie-header">
      <h3 class="movie-title">{{ movie.title }}</h3>
      <span class="movie-category">{{ movie.category }}</span>
    </div>
    
    <div class="movie-meta">
      <div class="movie-year">Année : {{ movie.year }}</div>
      <div v-if="movie.rating" class="movie-rating">
        <span class="rating-label">Note :</span>
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
      </div>
    </div>
    
    <p v-if="movie.description" class="movie-description">
      {{ movie.description }}
    </p>
    
    <div class="movie-actions">
      <button class="btn" @click="$emit('edit', movie)">
        ✏️ Modifier
      </button>
      <button class="btn btn-danger" @click="$emit('delete', movie.id)">
        🗑️ Supprimer
      </button>
      <button 
        class="btn btn-outline" 
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
        return movie.id && movie.title && movie.category && movie.year
      }
    }
  },
  emits: ['edit', 'delete', 'toggle-favorite']
}
</script>

<style scoped>
.movie-card {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  height: fit-content;
}

.movie-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 15px rgba(0, 0, 0, 0.15);
}

.movie-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
  gap: 1rem;
}

.movie-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: #333;
  margin: 0;
  flex: 1;
}

.movie-category {
  display: inline-block;
  background: #42b883;
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.875rem;
  white-space: nowrap;
  flex-shrink: 0;
}

.movie-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.movie-year {
  color: #666;
  font-size: 0.95rem;
}

.movie-rating {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.rating-label {
  font-size: 0.9rem;
  color: #666;
}

.stars {
  display: flex;
  gap: 2px;
}

.star {
  color: #ddd;
  font-size: 1.2rem;
  transition: color 0.2s ease;
}

.star-filled {
  color: #ffc107;
}

.movie-description {
  color: #555;
  line-height: 1.5;
  margin-bottom: 1.5rem;
  font-size: 0.95rem;
}

.movie-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.movie-actions .btn {
  flex: 1;
  min-width: fit-content;
  justify-content: center;
}

@media (max-width: 768px) {
  .movie-header {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .movie-category {
    align-self: flex-start;
  }
  
  .movie-meta {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .movie-actions {
    flex-direction: column;
  }
  
  .movie-actions .btn {
    flex: none;
  }
}
</style>
