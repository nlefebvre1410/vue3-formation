<template>
  <div>
    <!-- Hero Section -->
    <section class="hero">
      <div class="container">
        <h1>🎬 Annuaire de Films</h1>
        <p>
          Découvrez, gérez et organisez votre collection de films avec cette application 
          Vue.js 3 utilisant les dernières fonctionnalités : Composition API, Pinia et Vue Router.
        </p>
        <div class="hero-actions">
          <router-link to="/movies" class="btn btn-success">
            📚 Voir tous les films
          </router-link>
          <router-link to="/favorites" class="btn btn-outline">
            ❤️ Mes favoris
          </router-link>
        </div>
      </div>
    </section>

    <div class="container">
      <!-- Statistiques globales -->
      <div class="stats">
        <div class="stat-card">
          <span class="stat-number">{{ totalMovies }}</span>
          <div class="stat-label">Films au total</div>
        </div>
        <div class="stat-card">
          <span class="stat-number">{{ favoriteMovies.length }}</span>
          <div class="stat-label">Films favoris</div>
        </div>
        <div class="stat-card">
          <span class="stat-number">{{ uniqueCategories.length }}</span>
          <div class="stat-label">Catégories</div>
        </div>
        <div class="stat-card">
          <span class="stat-number">{{ averageRating }}</span>
          <div class="stat-label">Note moyenne</div>
        </div>
      </div>

      <!-- Sections d'aperçu -->
      <div class="hero-grid">
        <!-- Films récents -->
        <div class="card">
          <h2>🆕 Films récents</h2>
          <div v-if="recentMovies.length > 0">
            <div 
              v-for="movie in recentMovies" 
              :key="movie.id"
              class="movie-preview"
            >
              <router-link 
                :to="`/movies/${movie.id}`"
                class="movie-preview-link"
              >
                <strong>{{ movie.title }}</strong> ({{ movie.year }})
                <span class="movie-category">{{ movie.category }}</span>
              </router-link>
            </div>
            <router-link to="/movies" class="btn btn-outline">
              Voir tous les films →
            </router-link>
          </div>
          <p v-else class="text-muted">
            Aucun film dans votre collection.
          </p>
        </div>

        <!-- Films favoris -->
        <div class="card">
          <h2>❤️ Favoris</h2>
          <div v-if="favoriteMovies.length > 0">
            <div 
              v-for="movie in favoriteMovies.slice(0, 3)" 
              :key="movie.id"
              class="movie-preview"
            >
              <router-link 
                :to="`/movies/${movie.id}`"
                class="movie-preview-link"
              >
                <strong>{{ movie.title }}</strong>
                <div class="movie-rating">
                  <span 
                    v-for="star in 5" 
                    :key="star"
                    class="star"
                    :class="{ 'star-filled': star <= movie.rating }"
                  >
                    ★
                  </span>
                </div>
              </router-link>
            </div>
            <router-link to="/favorites" class="btn btn-outline">
              Voir tous les favoris →
            </router-link>
          </div>
          <p v-else class="text-muted">
            Aucun film favori pour le moment.
          </p>
        </div>

        <!-- Catégories populaires -->
        <div class="card">
          <h2>📊 Catégories</h2>
          <div class="category-list">
            <div 
              v-for="category in topCategories" 
              :key="category.name"
              class="category-item"
            >
              <span class="category-name">{{ category.name }}</span>
              <span class="category-count">{{ category.count }} films</span>
            </div>
          </div>
          <router-link to="/movies" class="btn btn-outline">
            Explorer par catégorie →
          </router-link>
        </div>

        <!-- Fonctionnalités -->
        <div class="card">
          <h2>✨ Fonctionnalités</h2>
          <ul class="feature-list">
            <li>🔍 Recherche avancée</li>
            <li>🏷️ Filtrage par catégorie</li>
            <li>⭐ Système de notation</li>
            <li>❤️ Gestion des favoris</li>
            <li>📱 Interface responsive</li>
            <li>🎨 Animations fluides</li>
          </ul>
          <router-link to="/about" class="btn btn-outline">
            En savoir plus →
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useMovies } from '@/composables/useMovies'

const { 
  movies, 
  favoriteMovies, 
  totalMovies, 
  uniqueCategories, 
  averageRating,
  getMoviesByCategory 
} = useMovies()

const recentMovies = computed(() => {
  if (!movies.value || !Array.isArray(movies.value)) return []
  return [...movies.value]
    .sort((a, b) => b.year - a.year)
    .slice(0, 3)
})

const topCategories = computed(() => {
  if (!movies.value || !Array.isArray(movies.value)) return []
  
  const categoryCount = {}
  movies.value.forEach(movie => {
    categoryCount[movie.category] = (categoryCount[movie.category] || 0) + 1
  })
  
  return Object.entries(categoryCount)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 4)
})
</script>

<style scoped>
.movie-preview {
  padding: 0.75rem 0;
  border-bottom: 1px solid #eee;
}

.movie-preview:last-child {
  border-bottom: none;
}

.movie-preview-link {
  display: flex;
  justify-content: space-between;
  align-items: center;
  text-decoration: none;
  color: #333;
  transition: color 0.2s ease;
}

.movie-preview-link:hover {
  color: #667eea;
}

.movie-category {
  background: #667eea;
  color: white;
  padding: 0.2rem 0.6rem;
  border-radius: 12px;
  font-size: 0.8rem;
}

.movie-rating {
  display: flex;
  gap: 2px;
}

.category-list {
  margin-bottom: 1rem;
}

.category-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0;
  border-bottom: 1px solid #eee;
}

.category-item:last-child {
  border-bottom: none;
}

.category-name {
  font-weight: 600;
  color: #333;
}

.category-count {
  color: #666;
  font-size: 0.9rem;
}

.feature-list {
  list-style: none;
  margin-bottom: 1rem;
}

.feature-list li {
  padding: 0.5rem 0;
  color: #555;
}

.text-muted {
  color: #666;
  font-style: italic;
  text-align: center;
  padding: 1rem 0;
}

@media (max-width: 768px) {
  .movie-preview-link {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
}
</style>
