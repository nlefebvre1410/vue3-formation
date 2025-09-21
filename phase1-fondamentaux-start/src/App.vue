<template>
  <div id="app">
    <!-- Header de l'application -->
    <header class="header">
      <div class="container">
        <h1>{{ appTitle }}</h1>
        <p>{{ appDescription }}</p>
      </div>
    </header>

    <div class="container">
      <!-- Statistiques -->
      <div class="stats">
        <div class="stat-card">
          <span class="stat-number">{{ totalMovies }}</span>
          <div class="stat-label">Films au total</div>
        </div>
        <div class="stat-card">
          <span class="stat-number">{{ filteredMovies.length }}</span>
          <div class="stat-label">Films affichés</div>
        </div>
        <div class="stat-card">
          <span class="stat-number">{{ uniqueCategories.length }}</span>
          <div class="stat-label">Catégories</div>
        </div>
      </div>

      <!-- Formulaire d'ajout de film -->
      <div class="card">
        <h2>{{ isEditing ? 'Modifier un film' : 'Ajouter un nouveau film' }}</h2>

        <form @submit.prevent="isEditing ? updateMovie() : addMovie()">
          <div class="form-group">
            <label for="title">Titre du film :</label>
            <input
                id="title"
                v-model="newMovie.title"
                type="text"
                placeholder="Entrez le titre du film"
                required
            >
          </div>

          <div class="form-group">
            <label for="category">Catégorie :</label>
            <select id="category" v-model="newMovie.category" required>
              <option value="">Sélectionnez une catégorie</option>
              <option v-for="category in availableCategories" :key="category" :value="category">
                {{ category }}
              </option>
            </select>
          </div>

          <div class="form-group">
            <label for="year">Année de sortie :</label>
            <input
                id="year"
                v-model.number="newMovie.year"
                type="number"
                min="1900"
                :max="currentYear"
                placeholder="Année de sortie"
                required
            >
          </div>

          <div class="form-group">
            <label for="description">Description :</label>
            <textarea
                id="description"
                v-model="newMovie.description"
                placeholder="Description du film (optionnel)"
                rows="3"
            ></textarea>
          </div>

          <div class="form-group">
            <label for="poster">URL de l'affiche :</label>
            <input
                id="poster"
                v-model="newMovie.poster"
                type="text"
                placeholder="/images/poster.jpg (optionnel)"
            >
          </div>

          <div class="form-actions">
            <button type="submit" class="btn">
              {{ isEditing ? '✅ Mettre à jour' : '➕ Ajouter le film' }}
            </button>
            <button v-if="isEditing" type="button" class="btn btn-secondary" @click="cancelEdit">
              Annuler
            </button>
            <button type="button" class="btn btn-secondary" @click="resetForm">
              🔄 Réinitialiser
            </button>
          </div>
        </form>
      </div>

      <!-- Filtres -->
      <div class="card">
        <h2>🔍 Filtres et recherche</h2>
        <div class="filters">
          <div class="filter-group">
            <label for="search">Recherche :</label>
            <input 
              id="search"
              v-model="searchTerm"
              type="text" 
              placeholder="Rechercher un film..."
              class="filter-input"
            >
          </div>

          <div class="filter-group">
            <label for="categoryFilter">Catégorie :</label>
            <select id="categoryFilter" v-model="selectedCategory" class="filter-select">
              <option value="">Toutes les catégories</option>
              <option v-for="category in uniqueCategories" :key="category" :value="category">
                {{ category }}
              </option>
            </select>
          </div>

          <div class="filter-group">
            <label for="yearFilter">Année :</label>
            <select id="yearFilter" v-model="selectedYear" class="filter-select">
              <option value="">Toutes les années</option>
              <option v-for="year in uniqueYears" :key="year" :value="year">
                {{ year }}
              </option>
            </select>
          </div>

          <button @click="clearFilters" class="btn btn-secondary">
            🗑️ Effacer les filtres
          </button>
        </div>
      </div>

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
      <div class="movies-grid">
        <div v-for="movie in filteredMovies" :key="movie.id" class="movie-card">
          <div class="movie-poster" v-if="movie.poster">
            <img :src="movie.poster" :alt="movie.title" class="poster-image">
          </div>
          <div class="movie-content">
            <div class="movie-header">
              <h3 class="movie-title">{{ movie.title }}</h3>
              <span class="movie-category">{{ movie.category }}</span>
            </div>
            <p class="movie-year">Année : {{ movie.year }}</p>
            <p class="movie-description" v-if="movie.description">
              {{ movie.description.length > 150 ? movie.description.substring(0, 150) + '...' : movie.description }}
            </p>
            <div class="movie-actions">
              <button @click="editMovie(movie)" class="btn">
                Modifier
              </button>
              <button @click="deleteMovie(movie.id)" class="btn btn-danger">
                Supprimer
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Message de feedback -->
      <div v-if="message.text" class="message" :class="message.type">
        {{ message.text }}
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, reactive } from 'vue'

export default {
  name: 'App',
  setup() {
    // Données réactives
    const appTitle = ref('Annuaire de Films Vue.js 3')
    const appDescription = ref('Gérez votre collection de films avec Vue.js 3 et la Composition API')

    const movies = ref([
      {
        id: 1311031,
        title: "Demon Slayer: Kimetsu no Yaiba - La Forteresse infinie",
        category: "Animation",
        year: 2025,
        description: "L'équipe de chasseurs de démons est attiré dans le Château de l'Infini, où Tanjiro, Nezuko et le Hashira affrontent de terrifiants démons de rang supérieur dans un combat désespéré alors que la bataille finale contre Kibutsuji Muzan commence.",
        poster: "/images/1311031_poster.jpg",
        backdrop: "/images/1311031_backdrop.jpg"
      },
      {
        id: 755898,
        title: "La Guerre des mondes",
        category: "Science-Fiction",
        year: 2025,
        description: "Une invasion gargantuesque approche dans cette nouvelle interprétation du légendaire roman homonyme devenu un classique de la science-fiction. La célèbre Eva Longoria partage l'affiche avec le rappeur/acteur Ice Cube.",
        poster: "/images/755898_poster.jpg",
        backdrop: "/images/755898_backdrop.jpg"
      },
      {
        id: 1038392,
        title: "Conjuring : L'Heure du jugement",
        category: "Horreur",
        year: 2025,
        description: "Patrick Wilson et Vera Farmiga feront leur dernière apparition dans les rôles d'Ed et Lorraine Warren dans Conjuring : l'heure du jugement, inspiré de l'histoire vraie de la famille Smurl, hantée par un démon.",
        poster: "/images/1038392_poster.jpg",
        backdrop: "/images/1038392_backdrop.jpg"
      }
    ])

    const searchTerm = ref('')
    const selectedCategory = ref('')
    const selectedYear = ref('')

    const newMovie = reactive({
      title: '',
      category: '',
      year: '',
      description: '',
      poster: ''
    })

    const editingMovie = ref(null)
    const isEditing = computed(() => editingMovie.value !== null)

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

    const currentYear = new Date().getFullYear()

    // Propriétés calculées
    const totalMovies = computed(() => movies.value.length)

    const uniqueCategories = computed(() => {
      return [...new Set(movies.value.map(movie => movie.category))].sort()
    })

    const uniqueYears = computed(() => {
      return [...new Set(movies.value.map(movie => movie.year))].sort((a, b) => b - a)
    })

    const filteredMovies = computed(() => {
      return movies.value.filter(movie => {
        const matchesSearch = movie.title.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
            (movie.description && movie.description.toLowerCase().includes(searchTerm.value.toLowerCase()))
        const matchesCategory = !selectedCategory.value || movie.category === selectedCategory.value
        const matchesYear = !selectedYear.value || movie.year === parseInt(selectedYear.value)

        return matchesSearch && matchesCategory && matchesYear
      })
    })

    // Méthodes
    const addMovie = () => {
      if (newMovie.title && newMovie.category && newMovie.year) {
        const movie = {
          id: Date.now(),
          title: newMovie.title,
          category: newMovie.category,
          year: newMovie.year,
          description: newMovie.description || '',
          poster: newMovie.poster || ''
        }

        movies.value.push(movie)
        showMessage(`Film "${movie.title}" ajouté avec succès !`, 'success')
        resetForm()
      }
    }

    const deleteMovie = (id) => {
      const movie = movies.value.find(m => m.id === id)
      if (movie && confirm(`Êtes-vous sûr de vouloir supprimer "${movie.title}" ?`)) {
        movies.value = movies.value.filter(movie => movie.id !== id)
        showMessage(`Film "${movie.title}" supprimé avec succès !`, 'success')
        
        if (editingMovie.value && editingMovie.value.id === id) {
          cancelEdit()
        }
      }
    }

    const editMovie = (movie) => {
      editingMovie.value = movie
      Object.assign(newMovie, {
        title: movie.title,
        category: movie.category,
        year: movie.year,
        description: movie.description || '',
        poster: movie.poster || ''
      })
    }

    const updateMovie = () => {
      if (editingMovie.value && newMovie.title && newMovie.category && newMovie.year) {
        Object.assign(editingMovie.value, {
          title: newMovie.title,
          category: newMovie.category,
          year: newMovie.year,
          description: newMovie.description || '',
          poster: newMovie.poster || ''
        })

        showMessage(`Film "${editingMovie.value.title}" modifié avec succès !`, 'success')
        cancelEdit()
      }
    }

    const cancelEdit = () => {
      editingMovie.value = null
      resetForm()
    }

    const clearFilters = () => {
      searchTerm.value = ''
      selectedCategory.value = ''
      selectedYear.value = ''
    }

    const resetForm = () => {
      Object.assign(newMovie, {
        title: '',
        category: '',
        year: '',
        description: '',
        poster: ''
      })
    }

    const showMessage = (text, type = 'success') => {
      message.text = text
      message.type = type
      
      setTimeout(() => {
        message.text = ''
      }, 3000)
    }

    return {
      // Données
      appTitle,
      appDescription,
      movies,
      searchTerm,
      selectedCategory,
      selectedYear,
      newMovie,
      editingMovie,
      isEditing,
      message,
      availableCategories,
      currentYear,
      
      // Propriétés calculées
      totalMovies,
      uniqueCategories,
      uniqueYears,
      filteredMovies,
      
      // Méthodes
      addMovie,
      deleteMovie,
      editMovie,
      updateMovie,
      cancelEdit,
      clearFilters,
      resetForm,
      showMessage
    }
  }
}
</script>

<style>
/* Styles globaux */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  min-height: 100vh;
}

#app {
  min-height: 100vh;
}

.header {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  padding: 2rem 0;
  margin-bottom: 2rem;
  box-shadow: 0 2px 20px rgba(0, 0, 0, 0.1);
}

.header h1 {
  color: #42b883;
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
  text-align: center;
}

.header p {
  color: #666;
  text-align: center;
  font-size: 1.1rem;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

.stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
}

.stat-card {
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  text-align: center;
  border: 1px solid #e0e0e0;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
}

.stat-number {
  display: block;
  font-size: 2.5rem;
  font-weight: bold;
  color: #42b883;
  margin-bottom: 0.5rem;
}

.stat-label {
  color: #666;
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.card {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  margin-bottom: 2rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  border: 1px solid #e0e0e0;
}

.card h2 {
  color: #333;
  margin-bottom: 1.5rem;
  font-size: 1.5rem;
}

.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: #333;
}

.form-group input,
.form-group select,
.form-group textarea {
  width: 100%;
  padding: 0.75rem;
  border: 2px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.3s ease;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #42b883;
  box-shadow: 0 0 0 3px rgba(66, 184, 131, 0.1);
}

.form-actions {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  background: #42b883;
  color: white;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}

.btn:hover {
  background: #369870;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(66, 184, 131, 0.3);
}

.btn-secondary {
  background: #6c757d;
}

.btn-secondary:hover {
  background: #5a6268;
  box-shadow: 0 4px 12px rgba(108, 117, 125, 0.3);
}

.btn-danger {
  background: #dc3545;
}

.btn-danger:hover {
  background: #c82333;
  box-shadow: 0 4px 12px rgba(220, 53, 69, 0.3);
}

.filters {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
  align-items: end;
}

.filter-group {
  display: flex;
  flex-direction: column;
}

.filter-input,
.filter-select {
  padding: 0.5rem;
  border: 2px solid #ddd;
  border-radius: 6px;
  font-size: 0.9rem;
}

.movies-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.movie-card {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  border: 1px solid #e0e0e0;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  display: flex;
  flex-direction: row;
}

.movie-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
}

.movie-poster {
  flex-shrink: 0;
  width: 120px;
  height: 180px;
  overflow: hidden;
}

.poster-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 0;
}

.movie-content {
  flex: 1;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
}

.movie-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.movie-title {
  margin: 0;
  color: #333;
  font-size: 1.1rem;
  line-height: 1.3;
  flex: 1;
  min-width: 200px;
}

.movie-category {
  background: #42b883;
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 500;
  white-space: nowrap;
}

.movie-year {
  color: #666;
  margin: 0.5rem 0;
  font-size: 0.9rem;
}

.movie-description {
  color: #555;
  line-height: 1.4;
  margin: 1rem 0;
  font-size: 0.9rem;
  flex: 1;
}

.movie-actions {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
  margin-top: auto;
}

.message {
  padding: 1rem;
  border-radius: 8px;
  margin: 1rem 0;
  font-weight: 500;
}

.message.success {
  background: #d4edda;
  color: #155724;
  border: 1px solid #c3e6cb;
}

.message.info {
  background: #cce7ff;
  color: #004085;
  border: 1px solid #99d6ff;
}

.message.error {
  background: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
}

@media (max-width: 768px) {
  .header h1 {
    font-size: 2rem;
  }
  
  .stats {
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  }
  
  .movies-grid {
    grid-template-columns: 1fr;
  }
  
  .movie-card {
    flex-direction: column;
  }
  
  .movie-poster {
    width: 100%;
    height: 200px;
  }
  
  .movie-content {
    padding: 1rem;
  }
  
  .filters {
    grid-template-columns: 1fr;
  }
  
  .form-actions {
    flex-direction: column;
  }
}
</style>
