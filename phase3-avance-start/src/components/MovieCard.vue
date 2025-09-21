<template>
  <div class="movie-card">
    <div class="movie-poster-container">
      <img 
        :src="movie.poster" 
        :alt="movie.title"
        class="movie-poster"
        @error="handleImageError"
      >
      <div class="movie-overlay">
        <button 
          @click="$emit('view-details', movie)"
          class="btn btn-outline overlay-btn"
        >
          👁️ Voir détails
        </button>
      </div>
    </div>
    
    <div class="movie-content">
      <div class="movie-header">
        <h3 class="movie-title">{{ movie.title }}</h3>
        <span class="movie-category">{{ movie.category }}</span>
      </div>
      
      <div class="movie-meta">
        <div class="movie-year">{{ movie.year }}</div>
        <div v-if="movie.rating" class="movie-rating">
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
      
      <div v-if="movie.director" class="movie-director">
        <strong>Réalisateur :</strong> {{ movie.director }}
      </div>
      
      <p v-if="movie.description" class="movie-description">
        {{ truncatedDescription }}
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
          {{ movie.isFavorite ? 'Favori' : 'Favoris' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  movie: {
    type: Object,
    required: true,
    validator(movie) {
      return movie.id && movie.title && movie.category && movie.year
    }
  }
})

const emit = defineEmits(['edit', 'delete', 'toggle-favorite', 'view-details'])

const truncatedDescription = computed(() => {
  if (!props.movie.description) return ''
  return props.movie.description.length > 120 
    ? props.movie.description.substring(0, 120) + '...'
    : props.movie.description
})

const handleImageError = (event) => {
  // Créer un SVG de fallback local
  const createPlaceholderSvg = (text, width = 300, height = 450) => {
    const svg = `
      <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="#667eea"/>
        <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="14" fill="white" text-anchor="middle" dominant-baseline="middle">
          ${text}
        </text>
      </svg>
    `
    return `data:image/svg+xml;base64,${btoa(svg)}`
  }
  
  event.target.src = createPlaceholderSvg(props.movie.title)
}
</script>

<style scoped>
.movie-card {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  height: fit-content;
}

.movie-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15);
}

.movie-poster-container {
  position: relative;
  overflow: hidden;
}

.movie-poster {
  width: 100%;
  height: 200px;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.movie-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.movie-card:hover .movie-overlay {
  opacity: 1;
}

.movie-card:hover .movie-poster {
  transform: scale(1.05);
}

.overlay-btn {
  background: white;
  color: #333;
  border: 2px solid white;
}

.overlay-btn:hover {
  background: transparent;
  color: white;
}

.movie-content {
  padding: 1.5rem;
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
  line-height: 1.3;
}

.movie-category {
  background: #667eea;
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
  font-weight: 500;
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
  font-size: 1.1rem;
  transition: color 0.2s ease;
}

.star-filled {
  color: #ffc107;
}

.movie-director {
  color: #555;
  font-size: 0.9rem;
  margin-bottom: 1rem;
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
  font-size: 0.9rem;
  padding: 0.6rem 1rem;
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
