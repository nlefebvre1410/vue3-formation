# 📋 Instructions de Démarrage - Phase 3

## 🚀 Installation et lancement

### 1. Installation des dépendances
```bash
pnpm install
```

### 2. Lancement en mode développement
```bash
pnpm dev
```

L'application sera accessible sur `http://localhost:3000` (ou un autre port si occupé).

## 🎯 Code de base fourni

### Store Pinia simplifié
Le fichier `src/stores/movies.js` contient :
- ✅ État de base avec les films
- ✅ Filtres basiques
- ✅ Actions CRUD essentielles
- ❌ Pas de statistiques avancées
- ❌ Pas d'actions asynchrones
- ❌ Pas de gestion d'erreurs sophistiquée

### Composable basique
Le fichier `src/composables/useMovies.js` contient :
- ✅ Interface simple vers le store
- ❌ Pas de logique métier complexe
- ❌ Pas de gestion des notifications
- ❌ Pas de fonctionnalités avancées

### Composants fonctionnels
- ✅ MovieCard, MovieFilters, MovieForm
- ✅ Vues Movies, MovieDetail, Home
- ✅ Routing de base
- ❌ Pas de composants avancés

## 📚 Exercices à réaliser

### 🏪 Exercice 1 : Store Pinia Avancé
**Objectif** : Étendre le store avec des fonctionnalités avancées
- Ajouter des statistiques détaillées
- Implémenter des actions asynchrones
- Créer un système de gestion d'erreurs
- Ajouter la gestion des catégories dynamiques

**Fichiers à modifier** :
- `src/stores/movies.js`
- Créer `src/components/MovieStats.vue`

### 🔄 Exercice 2 : Composables Personnalisés
**Objectif** : Créer des composables réutilisables
- Composable de gestion des favoris
- Composable de recherche avancée
- Composable de notifications
- Interface de recherche sophistiquée

**Fichiers à créer** :
- `src/composables/useFavorites.js`
- `src/composables/useSearch.js`
- `src/composables/useNotifications.js`
- `src/components/AdvancedSearch.vue`

### 🛣️ Exercice 3 : Routing Avancé
**Objectif** : Implémenter un routing sophistiqué
- Routes imbriquées
- Navigation guards
- Layouts personnalisés
- Page 404 avancée

**Fichiers à modifier/créer** :
- `src/router/index.js`
- `src/layouts/MainLayout.vue`
- `src/views/NotFound.vue`
- `src/composables/useNavigation.js`

### ⚡ Exercice 4 : Performance et Optimisation
**Objectif** : Optimiser l'application
- Lazy loading des composants
- Cache intelligent
- Virtualisation des listes
- Monitoring de performance

**Fichiers à créer** :
- `src/composables/useCache.js`
- `src/components/VirtualList.vue`
- `src/composables/useImageOptimization.js`
- `src/components/PerformanceMonitor.vue`

## 🔧 Structure actuelle

```
src/
├── assets/
│   ├── data/
│   │   └── movies.json          ✅ 10 films avec données réelles
│   ├── images/                  ✅ Images HD locales
│   └── style.css               ✅ Styles de base
├── components/
│   ├── MovieCard.vue           ✅ Carte de film basique
│   ├── MovieFilters.vue        ✅ Filtres simples
│   └── MovieForm.vue           ✅ Formulaire d'ajout
├── composables/
│   └── useMovies.js            ✅ Composable basique
├── stores/
│   └── movies.js               ✅ Store Pinia simplifié
├── views/
│   ├── Home.vue                ✅ Page d'accueil
│   ├── Movies.vue              ✅ Liste des films
│   └── MovieDetail.vue         ✅ Détail d'un film
├── router/
│   └── index.js                ✅ Routes de base
└── main.js                     ✅ Configuration Vue 3
```

## 💡 Conseils pour les exercices

### Progression recommandée
1. **Commencez par l'Exercice 1** - Le store est la base de tout
2. **Continuez avec l'Exercice 2** - Les composables utilisent le store
3. **Puis l'Exercice 3** - Le routing utilise les composables
4. **Finissez par l'Exercice 4** - Les optimisations viennent en dernier

### Bonnes pratiques
- **Testez régulièrement** votre code pendant le développement
- **Utilisez les outils de développement** Vue.js
- **Consultez la documentation** officielle en cas de doute
- **N'hésitez pas à expérimenter** avec les concepts

### Ressources utiles
- [Documentation Pinia](https://pinia.vuejs.org/)
- [Vue Router Guide](https://router.vuejs.org/)
- [Composition API](https://vuejs.org/guide/extras/composition-api-faq.html)
- [Vue.js DevTools](https://devtools.vuejs.org/)

## 🎓 Objectifs d'apprentissage

À la fin des exercices, vous maîtriserez :
- **Architecture avancée** avec Pinia et composables
- **Gestion d'état** sophistiquée et performante
- **Navigation** complexe avec Vue Router
- **Optimisations** pour la production
- **Bonnes pratiques** de développement Vue.js 3

---

**🚀 Bon apprentissage et n'hésitez pas à poser des questions !**
