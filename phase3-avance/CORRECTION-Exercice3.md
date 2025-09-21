# 🛣️ CORRECTION - Exercice 3 : Routing Avancé

## 📋 Objectif
Implémenter un système de routing avancé avec routes imbriquées, guards de navigation et gestion d'erreurs sophistiquée.

## ✅ Implémentation

### 1. Fonctionnalités implémentées

**Routing sophistiqué :**
- 🏗️ Routes imbriquées avec layouts
- 🛡️ Navigation guards pour la sécurité
- 🔄 Navigation programmatique intelligente
- 📍 Breadcrumbs automatiques
- 🚫 Page 404 personnalisée
- ⚡ Lazy loading des composants

### 2. Code de la correction

#### A. Router avancé (`src/router/index.js`)

```javascript
import { createRouter, createWebHistory } from 'vue-router'
import { useMoviesStore } from '@/stores/movies'

// Lazy loading des composants
const Home = () => import('@/views/Home.vue')
const Movies = () => import('@/views/Movies.vue')
const MovieDetail = () => import('@/views/MovieDetail.vue')
const MovieEdit = () => import('@/views/MovieEdit.vue')
const Favorites = () => import('@/views/Favorites.vue')
const Statistics = () => import('@/views/Statistics.vue')
const NotFound = () => import('@/views/NotFound.vue')
const AdminPanel = () => import('@/views/AdminPanel.vue')

// Layout components
const MainLayout = () => import('@/layouts/MainLayout.vue')
const AdminLayout = () => import('@/layouts/AdminLayout.vue')

const routes = [
  {
    path: '/',
    component: MainLayout,
    children: [
      {
        path: '',
        name: 'Home',
        component: Home,
        meta: {
          title: 'Accueil - Cinéma App',
          description: 'Découvrez notre collection de films'
        }
      },
      {
        path: 'movies',
        name: 'Movies',
        component: Movies,
        meta: {
          title: 'Films - Cinéma App',
          requiresData: true
        },
        children: [
          {
            path: 'favorites',
            name: 'Favorites',
            component: Favorites,
            meta: {
              title: 'Mes Favoris - Cinéma App',
              requiresData: true
            }
          },
          {
            path: 'statistics',
            name: 'Statistics',
            component: Statistics,
            meta: {
              title: 'Statistiques - Cinéma App',
              requiresData: true
            }
          }
        ]
      },
      {
        path: 'movies/:id(\\d+)',
        name: 'MovieDetail',
        component: MovieDetail,
        props: route => ({
          id: parseInt(route.params.id)
        }),
        meta: {
          title: 'Détail du film - Cinéma App',
          requiresData: true
        },
        beforeEnter: (to, from, next) => {
          const store = useMoviesStore()
          const movieId = parseInt(to.params.id)
          const movie = store.getMovieById(movieId)
          
          if (!movie) {
            next({ name: 'NotFound', params: { resource: 'film' } })
          } else {
            // Mettre à jour le titre avec le nom du film
            to.meta.title = `${movie.title} - Cinéma App`
            next()
          }
        }
      },
      {
        path: 'movies/:id(\\d+)/edit',
        name: 'MovieEdit',
        component: MovieEdit,
        props: true,
        meta: {
          title: 'Éditer le film - Cinéma App',
          requiresData: true,
          requiresConfirmation: true
        }
      }
    ]
  },
  {
    path: '/admin',
    component: AdminLayout,
    meta: {
      requiresAuth: true,
      adminOnly: true
    },
    children: [
      {
        path: '',
        name: 'AdminPanel',
        component: AdminPanel,
        meta: {
          title: 'Administration - Cinéma App'
        }
      },
      {
        path: 'movies',
        name: 'AdminMovies',
        component: () => import('@/views/admin/AdminMovies.vue'),
        meta: {
          title: 'Gestion des Films - Admin'
        }
      },
      {
        path: 'categories',
        name: 'AdminCategories',
        component: () => import('@/views/admin/AdminCategories.vue'),
        meta: {
          title: 'Gestion des Catégories - Admin'
        }
      }
    ]
  },
  {
    path: '/404/:resource?',
    name: 'NotFound',
    component: NotFound,
    props: true,
    meta: {
      title: 'Page non trouvée - Cinéma App'
    }
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: to => {
      return { name: 'NotFound', params: { resource: 'page' } }
    }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else if (to.hash) {
      return { el: to.hash, behavior: 'smooth' }
    } else {
      return { top: 0, behavior: 'smooth' }
    }
  }
})

// Navigation Guards globaux
router.beforeEach(async (to, from, next) => {
  // Simuler une vérification d'authentification
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true'
  
  // Vérifier l'authentification pour les routes admin
  if (to.meta.requiresAuth && !isAuthenticated) {
    next({ 
      name: 'Home', 
      query: { 
        redirect: to.fullPath,
        message: 'Connexion requise'
      }
    })
    return
  }
  
  // Vérifier les données requises
  if (to.meta.requiresData) {
    const store = useMoviesStore()
    if (store.movies.length === 0) {
      // Charger les données si nécessaire
      try {
        await store.loadMoviesFromAPI()
      } catch (error) {
        console.error('Erreur de chargement des données:', error)
      }
    }
  }
  
  next()
})

router.afterEach((to, from) => {
  // Mettre à jour le titre de la page
  if (to.meta.title) {
    document.title = to.meta.title
  }
  
  // Analytics ou tracking
  if (typeof gtag !== 'undefined') {
    gtag('config', 'GA_MEASUREMENT_ID', {
      page_title: to.meta.title,
      page_location: window.location.href
    })
  }
})

export default router
```

#### B. Composable useNavigation.js

```javascript
import { computed, ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useMoviesStore } from '@/stores/movies'

export function useNavigation() {
  const router = useRouter()
  const route = useRoute()
  const store = useMoviesStore()
  
  const isNavigating = ref(false)
  const navigationHistory = ref([])
  
  // État de navigation
  const currentRoute = computed(() => route)
  const canGoBack = computed(() => navigationHistory.value.length > 1)
  const previousRoute = computed(() => 
    navigationHistory.value[navigationHistory.value.length - 2]
  )
  
  // Navigation avec confirmation
  const navigateWithConfirmation = async (to, message = 'Êtes-vous sûr de vouloir quitter cette page ?') => {
    if (route.meta.requiresConfirmation) {
      const confirmed = window.confirm(message)
      if (!confirmed) {
        return false
      }
    }
    
    return await navigateTo(to)
  }
  
  // Navigation principale
  const navigateTo = async (to, options = {}) => {
    isNavigating.value = true
    
    try {
      // Ajouter à l'historique
      navigationHistory.value.push({
        path: route.fullPath,
        name: route.name,
        timestamp: new Date()
      })
      
      // Limiter l'historique
      if (navigationHistory.value.length > 10) {
        navigationHistory.value = navigationHistory.value.slice(-10)
      }
      
      await router.push(to)
      return true
      
    } catch (error) {
      console.error('Erreur de navigation:', error)
      return false
    } finally {
      isNavigating.value = false
    }
  }
  
  // Navigation vers un film
  const goToMovie = async (movieId) => {
    const movie = store.getMovieById(movieId)
    if (!movie) {
      throw new Error(`Film avec l'ID ${movieId} non trouvé`)
    }
    
    return await navigateTo({
      name: 'MovieDetail',
      params: { id: movieId }
    })
  }
  
  // Navigation vers l'édition
  const editMovie = async (movieId) => {
    return await navigateWithConfirmation({
      name: 'MovieEdit',
      params: { id: movieId }
    }, 'Voulez-vous éditer ce film ?')
  }
  
  // Navigation avec recherche
  const searchMovies = async (query) => {
    return await navigateTo({
      name: 'Movies',
      query: { search: query }
    })
  }
  
  // Navigation par catégorie
  const browseCategory = async (category) => {
    return await navigateTo({
      name: 'Movies',
      query: { category }
    })
  }
  
  // Retour en arrière intelligent
  const goBack = async () => {
    if (canGoBack.value) {
      navigationHistory.value.pop() // Retirer la route actuelle
      const previous = navigationHistory.value.pop() // Récupérer la précédente
      
      if (previous) {
        return await navigateTo(previous.path)
      }
    }
    
    // Fallback vers la page d'accueil
    return await navigateTo({ name: 'Home' })
  }
  
  // Navigation vers les favoris
  const goToFavorites = async () => {
    return await navigateTo({ name: 'Favorites' })
  }
  
  // Navigation vers les statistiques
  const goToStatistics = async () => {
    return await navigateTo({ name: 'Statistics' })
  }
  
  // Gestion des erreurs de navigation
  const handleNavigationError = (error, fallbackRoute = { name: 'Home' }) => {
    console.error('Erreur de navigation:', error)
    
    if (error.name === 'NavigationDuplicated') {
      // Ignorer les navigations dupliquées
      return
    }
    
    // Rediriger vers une route de fallback
    router.push(fallbackRoute)
  }
  
  // Breadcrumbs
  const breadcrumbs = computed(() => {
    const crumbs = []
    
    // Toujours commencer par l'accueil
    crumbs.push({
      name: 'Accueil',
      route: { name: 'Home' },
      active: route.name === 'Home'
    })
    
    if (route.name === 'Movies') {
      crumbs.push({
        name: 'Films',
        route: { name: 'Movies' },
        active: true
      })
    } else if (route.name === 'MovieDetail') {
      const movie = store.getMovieById(parseInt(route.params.id))
      crumbs.push(
        {
          name: 'Films',
          route: { name: 'Movies' },
          active: false
        },
        {
          name: movie?.title || 'Film',
          route: route,
          active: true
        }
      )
    } else if (route.name === 'Favorites') {
      crumbs.push(
        {
          name: 'Films',
          route: { name: 'Movies' },
          active: false
        },
        {
          name: 'Favoris',
          route: { name: 'Favorites' },
          active: true
        }
      )
    }
    
    return crumbs
  })
  
  // Méta-informations de la route
  const routeMeta = computed(() => ({
    title: route.meta.title || 'Cinéma App',
    description: route.meta.description || '',
    requiresAuth: route.meta.requiresAuth || false,
    requiresData: route.meta.requiresData || false
  }))
  
  return {
    // État
    currentRoute,
    isNavigating,
    canGoBack,
    previousRoute,
    navigationHistory,
    breadcrumbs,
    routeMeta,
    
    // Actions
    navigateTo,
    navigateWithConfirmation,
    goToMovie,
    editMovie,
    searchMovies,
    browseCategory,
    goBack,
    goToFavorites,
    goToStatistics,
    handleNavigationError
  }
}
```

#### C. Layout MainLayout.vue

```vue
<template>
  <div class="main-layout">
    <header class="main-header">
      <nav class="main-nav">
        <router-link to="/" class="logo">
          🎬 Cinéma App
        </router-link>
        
        <div class="nav-links">
          <router-link to="/" exact-active-class="active">
            Accueil
          </router-link>
          <router-link to="/movies" active-class="active">
            Films
          </router-link>
          <router-link to="/movies/favorites" active-class="active">
            Favoris
          </router-link>
          <router-link to="/movies/statistics" active-class="active">
            Stats
          </router-link>
        </div>
        
        <div class="nav-actions">
          <button @click="goBack" :disabled="!canGoBack" class="back-btn">
            ← Retour
          </button>
        </div>
      </nav>
      
      <!-- Breadcrumbs -->
      <div v-if="breadcrumbs.length > 1" class="breadcrumbs">
        <span
          v-for="(crumb, index) in breadcrumbs"
          :key="index"
          class="breadcrumb"
        >
          <router-link
            v-if="!crumb.active"
            :to="crumb.route"
            class="breadcrumb-link"
          >
            {{ crumb.name }}
          </router-link>
          <span v-else class="breadcrumb-current">
            {{ crumb.name }}
          </span>
          <span v-if="index < breadcrumbs.length - 1" class="separator">
            /
          </span>
        </span>
      </div>
    </header>
    
    <main class="main-content">
      <div v-if="isNavigating" class="loading-overlay">
        <div class="loading-spinner">Chargement...</div>
      </div>
      
      <router-view v-slot="{ Component }">
        <transition name="page" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>
    
    <footer class="main-footer">
      <p>&copy; 2024 Cinéma App - Formation Vue.js 3</p>
    </footer>
  </div>
</template>

<script setup>
import { useNavigation } from '@/composables/useNavigation'

const {
  isNavigating,
  canGoBack,
  breadcrumbs,
  goBack
} = useNavigation()
</script>

<style scoped>
.main-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.main-header {
  background: #667eea;
  color: white;
  padding: 1rem 0;
}

.main-nav {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo {
  font-size: 1.5rem;
  font-weight: bold;
  text-decoration: none;
  color: white;
}

.nav-links {
  display: flex;
  gap: 2rem;
}

.nav-links a {
  color: white;
  text-decoration: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  transition: background-color 0.2s;
}

.nav-links a:hover,
.nav-links a.active {
  background: rgba(255, 255, 255, 0.2);
}

.breadcrumbs {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
  opacity: 0.9;
}

.breadcrumb-link {
  color: white;
  text-decoration: none;
}

.breadcrumb-link:hover {
  text-decoration: underline;
}

.separator {
  margin: 0 0.5rem;
}

.main-content {
  flex: 1;
  position: relative;
}

.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.page-enter-active,
.page-leave-active {
  transition: opacity 0.3s ease;
}

.page-enter-from,
.page-leave-to {
  opacity: 0;
}

.main-footer {
  background: #f8f9fa;
  padding: 1rem;
  text-align: center;
  color: #666;
}

.back-btn {
  background: rgba(255, 255, 255, 0.2);
  border: none;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
}

.back-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
```

#### D. Page 404 personnalisée (`src/views/NotFound.vue`)

```vue
<template>
  <div class="not-found">
    <div class="error-content">
      <h1>🎬 Oups !</h1>
      <h2>{{ errorMessage }}</h2>
      <p>{{ errorDescription }}</p>
      
      <div class="suggestions">
        <h3>Que souhaitez-vous faire ?</h3>
        <div class="suggestion-buttons">
          <router-link to="/" class="btn btn-primary">
            🏠 Retour à l'accueil
          </router-link>
          <router-link to="/movies" class="btn btn-secondary">
            🎬 Voir tous les films
          </router-link>
          <button @click="goBack" class="btn btn-outline">
            ← Page précédente
          </button>
        </div>
      </div>
      
      <div v-if="resource === 'film'" class="movie-suggestions">
        <h3>Films populaires</h3>
        <div class="movie-grid">
          <router-link
            v-for="movie in popularMovies"
            :key="movie.id"
            :to="`/movies/${movie.id}`"
            class="movie-card-mini"
          >
            <img :src="movie.poster" :alt="movie.title" />
            <span>{{ movie.title }}</span>
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useNavigation } from '@/composables/useNavigation'
import { useMoviesStore } from '@/stores/movies'

const props = defineProps({
  resource: {
    type: String,
    default: 'page'
  }
})

const { goBack } = useNavigation()
const store = useMoviesStore()

const errorMessage = computed(() => {
  switch (props.resource) {
    case 'film':
      return 'Film non trouvé'
    case 'page':
      return 'Page non trouvée'
    default:
      return 'Ressource non trouvée'
  }
})

const errorDescription = computed(() => {
  switch (props.resource) {
    case 'film':
      return 'Le film que vous recherchez n\'existe pas ou a été supprimé.'
    case 'page':
      return 'La page que vous recherchez n\'existe pas.'
    default:
      return 'La ressource demandée est introuvable.'
  }
})

const popularMovies = computed(() => 
  store.movies
    .filter(movie => movie.rating >= 4)
    .slice(0, 4)
)
</script>

<style scoped>
.not-found {
  min-height: 60vh;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2rem;
}

.error-content {
  text-align: center;
  max-width: 600px;
}

.error-content h1 {
  font-size: 4rem;
  margin-bottom: 1rem;
}

.error-content h2 {
  color: #e74c3c;
  margin-bottom: 1rem;
}

.suggestions {
  margin: 2rem 0;
}

.suggestion-buttons {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}

.movie-suggestions {
  margin-top: 2rem;
}

.movie-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
}

.movie-card-mini {
  text-decoration: none;
  color: inherit;
  text-align: center;
}

.movie-card-mini img {
  width: 100%;
  height: 150px;
  object-fit: cover;
  border-radius: 8px;
  margin-bottom: 0.5rem;
}

.movie-card-mini span {
  font-size: 0.875rem;
  display: block;
}
</style>
```

## 🎯 Points clés de la correction

### 1. Architecture avancée
- **Routes imbriquées** avec layouts personnalisés
- **Lazy loading** pour optimiser les performances
- **Navigation guards** pour la sécurité et validation

### 2. Expérience utilisateur
- **Breadcrumbs** automatiques selon la route
- **Transitions** fluides entre pages
- **Page 404** contextuelle et utile
- **Navigation programmatique** intelligente

### 3. Fonctionnalités avancées
- **Historique de navigation** avec retour intelligent
- **Confirmation** pour les actions sensibles
- **Gestion d'erreurs** robuste
- **Méta-données** dynamiques

## ✅ Validation

- [ ] Les routes imbriquées fonctionnent
- [ ] Les guards de navigation sont opérationnels
- [ ] La page 404 est personnalisée
- [ ] Les breadcrumbs s'affichent correctement
- [ ] La navigation programmatique fonctionne
- [ ] Les transitions entre pages sont fluides

## 🎓 Compétences acquises

- **Vue Router 4** avancé avec routes imbriquées
- **Navigation guards** et middleware
- **Layouts** et composants de structure
- **Navigation programmatique** sophistiquée
- **Gestion d'erreurs** de routing
- **UX** optimisée avec breadcrumbs et transitions

---

**🎯 Cette correction montre comment créer un système de routing professionnel pour vos applications Vue.js 3 !**
