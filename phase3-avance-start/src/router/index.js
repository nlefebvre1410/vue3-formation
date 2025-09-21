import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/views/Home.vue'
import Movies from '@/views/Movies.vue'
import MovieDetail from '@/views/MovieDetail.vue'
import Favorites from '@/views/Favorites.vue'
import About from '@/views/About.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: {
      title: 'Accueil'
    }
  },
  {
    path: '/movies',
    name: 'Movies',
    component: Movies,
    meta: {
      title: 'Films'
    }
  },
  {
    path: '/movies/:id',
    name: 'MovieDetail',
    component: MovieDetail,
    meta: {
      title: 'Détail du film'
    },
    props: true
  },
  {
    path: '/favorites',
    name: 'Favorites',
    component: Favorites,
    meta: {
      title: 'Favoris'
    }
  },
  {
    path: '/about',
    name: 'About',
    component: About,
    meta: {
      title: 'À propos'
    }
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/views/NotFound.vue'),
    meta: {
      title: 'Page non trouvée'
    }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  }
})

// Navigation guard pour les titres
router.beforeEach((to, from, next) => {
  document.title = `${to.meta.title} - Annuaire de Films`
  next()
})

export default router
