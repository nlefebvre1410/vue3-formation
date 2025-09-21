# 🚀 Phase 3 : Vue.js 3 Avancé - Point de Départ

**Code de base pour les exercices de la Phase 3**

Ce dossier contient le code de démarrage simplifié pour réaliser les exercices de la Phase 3. Il s'agit d'une version allégée de l'application finale.

## 📋 Prérequis

- Maîtrise de la **Phase 1** (Fondamentaux)
- Maîtrise de la **Phase 2** (Composants)
- Connaissance de la Composition API
- Notions d'architecture frontend

## 🎯 Ce que vous allez apprendre

Cette version de démarrage contient :
- **Store Pinia basique** avec les fonctionnalités essentielles
- **Composants Vue** fonctionnels mais simples
- **Routing de base** avec Vue Router
- **Données réelles** avec images locales

### Exercices à réaliser
1. **Store avancé** - Statistiques et actions asynchrones
2. **Composables** - Logique réutilisable et abstraite
3. **Routing avancé** - Navigation sophistiquée
4. **Performance** - Optimisations et monitoring

## 🏗️ Architecture du projet

```
src/
├── assets/
│   ├── data/
│   │   └── movies.json          # Données des films
│   └── images/                  # Images locales
├── components/
│   ├── MovieCard.vue           # Carte de film
│   ├── MovieFilters.vue        # Filtres avancés
│   └── MovieForm.vue           # Formulaire d'ajout/édition
├── composables/
│   └── useMovies.js            # Logique métier réutilisable
├── stores/
│   └── movies.js               # Store Pinia
├── views/
│   ├── Home.vue                # Page d'accueil
│   ├── Movies.vue              # Liste des films
│   └── MovieDetail.vue         # Détail d'un film
├── router/
│   └── index.js                # Configuration des routes
└── main.js                     # Point d'entrée
```

## 🎬 Fonctionnalités

### Interface utilisateur
- **Liste des films** avec pagination et filtres
- **Détail complet** de chaque film
- **Formulaire d'ajout/édition** avec validation
- **Gestion des favoris** persistante
- **Navigation fluide** entre les vues

### Filtrage et recherche
- **Recherche textuelle** avec debounce
- **Filtres par catégorie** (Action, Comédie, etc.)
- **Filtres par année** et note
- **Filtre favoris** uniquement
- **Combinaison de filtres** multiple

### Gestion des données
- **10 films réels** avec données TMDB
- **Images haute qualité** stockées localement
- **Réalisateurs authentiques** et catégories
- **Fallback SVG** pour images manquantes

## 🔧 Technologies utilisées

### Vue.js 3 Ecosystem
- **Vue 3** avec Composition API
- **Pinia** pour la gestion d'état
- **Vue Router 4** pour la navigation
- **Vite** pour le build et développement

### Outils modernes
- **Import.meta.glob** pour les assets
- **Composables** pour la logique réutilisable
- **Debounce** pour l'optimisation
- **SVG inline** pour les placeholders

## 🚀 Installation et lancement

```bash
# Installation des dépendances
pnpm install

# Lancement en mode développement
pnpm dev

# Build de production
pnpm build
```

## 📚 Concepts clés abordés

### 1. Store Pinia
```javascript
// stores/movies.js
export const useMoviesStore = defineStore('movies', () => {
  const movies = ref([])
  const filters = ref({})
  
  const filteredMovies = computed(() => {
    // Logique de filtrage
  })
  
  const addMovie = (movieData) => {
    // Action d'ajout
  }
  
  return { movies, filters, filteredMovies, addMovie }
})
```

### 2. Composables
```javascript
// composables/useMovies.js
export function useMovies() {
  const store = useMoviesStore()
  
  const addMovie = (movieData) => {
    return store.addMovie(movieData)
  }
  
  return {
    movies: store.movies,
    addMovie,
    // ... autres fonctions
  }
}
```

### 3. Vue Router
```javascript
// router/index.js
const routes = [
  { path: '/', component: Home },
  { path: '/movies', component: Movies },
  { path: '/movies/:id', component: MovieDetail }
]
```

### 4. Gestion des assets
```javascript
// Chargement dynamique des images
const files = import.meta.glob('../assets/images/*.jpg', {
  eager: true, 
  import: 'default'
})
```

## 🎯 Exercices pratiques

**4 exercices progressifs** pour maîtriser l'architecture avancée :

### **🏪 Exercice 1 : Store avancé** (45-60 min)
Ajoutez la gestion des catégories dynamiques et des statistiques dans le store.
- **Fichier** : `EXERCICE-1-Store.md`
- **Concepts** : Pinia avancé, getters complexes, actions asynchrones

### **🔄 Exercice 2 : Composables personnalisés** (60-75 min)
Créez des composables pour la gestion des favoris et des statistiques.
- **Fichier** : `EXERCICE-2-Composables.md`
- **Concepts** : Composition functions, logique réutilisable, abstraction

### **🛣️ Exercice 3 : Routing avancé** (45-60 min)
Implémentez des routes imbriquées et des guards de navigation.
- **Fichier** : `EXERCICE-3-Routing.md`
- **Concepts** : Routes imbriquées, navigation guards, redirections

### **⚡ Exercice 4 : Performance et optimisation** (60-90 min)
Optimisez l'application avec lazy loading et mise en cache.
- **Fichier** : `EXERCICE-4-Performance.md`
- **Concepts** : Lazy loading, cache, optimisations, bundle analysis

## 🎓 Compétences acquises

À la fin de cette phase, vous maîtriserez :

### Architecture
- **Séparation des préoccupations** claire
- **Structure modulaire** et maintenable
- **Patterns avancés** de Vue.js 3
- **Bonnes pratiques** de développement

### Gestion d'état
- **Store centralisé** avec Pinia
- **État réactif** et performant
- **Actions et getters** complexes
- **Persistance des données**

### Composables
- **Logique réutilisable** entre composants
- **Abstraction** des fonctionnalités
- **Hooks personnalisés** efficaces
- **Séparation logique/présentation**

### Navigation
- **Routing dynamique** avec paramètres
- **Navigation programmatique**
- **Guards et middlewares**
- **Gestion des erreurs** de navigation

## 🔗 Liens utiles

- [Documentation Pinia](https://pinia.vuejs.org/)
- [Vue Router Guide](https://router.vuejs.org/)
- [Composition API](https://vuejs.org/guide/extras/composition-api-faq.html)
- [Vite Guide](https://vitejs.dev/guide/)

## 📈 Progression suggérée

1. **Étudier l'architecture** existante (30 min)
2. **Comprendre le store Pinia** (45 min)
3. **Analyser les composables** (30 min)
4. **Explorer le routing** (30 min)
5. **Faire les exercices** dans l'ordre (4-5h)
6. **Projet personnel** avec ces concepts (optionnel)

---

**🎯 Cette phase vous prépare à développer des applications Vue.js 3 professionnelles avec une architecture robuste et maintenable !**
