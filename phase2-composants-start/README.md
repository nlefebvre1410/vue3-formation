# Phase 2 : Application faite de composants - VERSION START

Cette phase correspond au **Jour 2** de la formation Human Coders et se concentre sur l'architecture en composants de Vue.js 3.

> **📚 VERSION DÉMARRAGE** : Cette version contient la base de travail pour les apprenants, sans les exercices implémentés.

## 🎯 Objectifs de cette phase

- Comprendre le rôle des composants dans une SPA
- Maîtriser les props et événements
- Créer des Single File Components
- Faire communiquer les composants entre eux
- Structurer une application modulaire

## 📚 Concepts abordés

### 1. Composants
- ✅ Rôle du composant dans une SPA
- ✅ Props et validation
- ✅ Événements personnalisés (emits)
- ✅ Composants dynamiques
- ✅ v-model sur composants

### 2. Single File Components
- ✅ Structure .vue (template, script, style)
- ✅ Styles scopés
- ✅ Communication parent-enfant
- ✅ Communication enfant-parent

## 🏗️ Architecture de l'application

L'application a été refactorisée en composants réutilisables :

### Structure des composants (VERSION START)

```
src/
├── App.vue                 # Composant racine
├── components/
│   ├── AppHeader.vue       # En-tête de l'application ✅
│   ├── MovieForm.vue       # Formulaire d'ajout/édition ✅
│   ├── MovieFilters.vue    # Filtres et recherche ✅
│   └── MovieCard.vue       # Carte d'affichage d'un film ✅
└── assets/
    └── style.css           # Styles globaux ✅
```

> **📝 À CRÉER** : Les composants des exercices pratiques ne sont pas inclus dans cette version start.

### 1. AppHeader.vue
**Props :** `title`, `description`
- Composant d'en-tête réutilisable
- Accepte un titre et une description via props

### 2. MovieCard.vue
**Props :** `movie`
**Emits :** `edit`, `delete`, `toggle-favorite`
- Affichage d'un film avec toutes ses informations
- Gestion des actions (édition, suppression, favoris)
- Validation des props avec validator

### 3. MovieForm.vue
**Props :** `movie`, `categories`
**Emits :** `submit`, `cancel`
- Formulaire d'ajout/édition de film
- Mode d'édition automatique selon la prop movie
- Validation côté client

### 4. MovieFilters.vue
**Props :** `filters`, `categories`, `years`, `movies`
**Emits :** `update-filter`, `clear-filters`
- Système de filtres complet
- Affichage des filtres actifs
- Compteurs par catégorie

## 🎬 Fonctionnalités de base (VERSION START)

### Fonctionnalités implémentées
- ✅ **Listing d'éléments** : Affichage de la liste des films
- ✅ **Ajouter des films** : Formulaire d'ajout avec validation
- ✅ **Supprimer des films** : Suppression directe
- ✅ **Éditer des films** : Modification en place
- ✅ **Filtres par catégorie** : Filtrage dynamique
- ✅ **Recherche textuelle** : Recherche dans titre et description
- ✅ **Filtre par année** : Filtrage par année de sortie
- ✅ **Système de notes** : Notation 1-5 étoiles (select basique)
- ✅ **Favoris** : Marquer des films comme favoris
- ✅ **Messages de feedback** : Notifications d'actions
- ✅ **Filtres avancés** : Par note et favoris
- ✅ **Animations** : Transitions CSS pour les films
- ✅ **Responsive design** : Adaptation mobile

### Communication entre composants

```javascript
// Parent vers enfant (Props)
<MovieCard :movie="movie" />

// Enfant vers parent (Events)
<MovieCard @edit="editMovie" @delete="deleteMovie" />

// Validation des props
props: {
  movie: {
    type: Object,
    required: true,
    validator(movie) {
      return movie.id && movie.title && movie.category
    }
  }
}
```

## 🚀 Installation et lancement

```bash
# Installation des dépendances
pnpm install

# Lancement du serveur de développement
pnpm dev

# L'application sera disponible sur http://localhost:3002
```

## 🔍 Points d'apprentissage clés

### 1. Props et validation
```javascript
props: {
  title: {
    type: String,
    required: true
  },
  value: {
    type: [Number, String],
    default: 0
  }
}
```

### 2. Événements personnalisés
```javascript
// Définition
emits: ['edit', 'delete', 'toggle-favorite']

// Émission
this.$emit('edit', movie)

// Écoute
<MovieCard @edit="editMovie" />
```

### 3. Composition API dans les composants
```javascript
setup(props, { emit }) {
  const handleClick = () => {
    emit('custom-event', data)
  }
  
  return { handleClick }
}
```

### 4. Styles scopés
```vue
<style scoped>
.movie-card {
  /* Styles appliqués uniquement à ce composant */
}
</style>
```

## 🎯 Exercices pratiques À RÉALISER

### Exercice 1 : Composant de notation ⭐
**Objectif :** Créez un composant `StarRating` réutilisable pour afficher et modifier les notes.

**Fonctionnalités attendues :**
- Affichage de 1 à 5 étoiles
- Mode interactif (cliquable) et lecture seule
- Support v-model
- Props configurables (taille, label)
- Remplacer le select dans MovieForm et les étoiles dans MovieCard

### Exercice 2 : Composant de recherche 🔍
**Objectif :** Extrayez la recherche dans un composant `SearchInput` avec debounce.

**Fonctionnalités attendues :**
- Debounce configurable (300ms par défaut)
- Indicateur de chargement
- Bouton de suppression
- Support Escape
- Remplacer l'input basique dans MovieFilters

### Exercice 3 : Composant modal 🗂️
**Objectif :** Créez une modal pour confirmer les suppressions.

**Fonctionnalités attendues :**
- Modal avec overlay
- Types : info, warning, danger, success
- Teleport vers body
- Animations d'entrée/sortie
- Prévention des actions multiples
- Remplacer la suppression directe

### Exercice 4 : Composant de tri 📊
**Objectif :** Ajoutez un composant `SortSelector` pour trier les films.

**Fonctionnalités attendues :**
- Sélection du critère de tri
- Direction ascendante/descendante
- Bouton de réinitialisation
- Indicateur de tri actif
- Options configurables (titre, année, note, etc.)

## 🔧 Défis avancés

### Défi 1 : Provide/Inject
Utilisez provide/inject pour partager des données globales.

### Défi 2 : Slots
Ajoutez des slots au composant MovieCard pour personnaliser l'affichage.

### Défi 3 : Composants dynamiques
Implémentez un système d'onglets avec des composants dynamiques.

## 📖 Ressources

- [Guide des composants Vue.js](https://vuejs.org/guide/essentials/component-basics.html)
- [Props et événements](https://vuejs.org/guide/components/props.html)
- [Single File Components](https://vuejs.org/guide/scaling-up/sfc.html)

## ➡️ Prochaine étape

Une fois cette phase maîtrisée, passez à la **Phase 3 : Réutilisabilité et réactivité** pour explorer les composables, plugins et fonctionnalités avancées.
