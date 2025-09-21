# Phase 1 : Fondamentaux Vue.js 3 - VERSION START

Cette phase correspond au **Jour 1** de la formation Human Coders et couvre les fondamentaux de Vue.js 3.

> **📚 VERSION DÉMARRAGE** : Cette version contient la base de travail pour les apprenants, sans les exercices implémentés.

## 🎯 Objectifs de cette phase

- Comprendre les concepts SPA et Vue.js
- Maîtriser la réactivité basique avec l'interpolation et v-bind
- Utiliser les directives essentielles (v-model, v-for, v-if)
- Manipuler les propriétés calculées et les événements
- Créer une application simple avec Vue.js 3

## 📚 Concepts abordés

### 1. Introduction
- ✅ SPA et les frameworks JavaScript
- ✅ Vue.js, un framework progressif
- ✅ Data Driven Interfaces
- ✅ Comparatif entre Vue.js et jQuery

### 2. Bases Vue.js
- ✅ Instance Vue avec la Composition API
- ✅ Templating (Interpolation / Attributs / Directives)
- ✅ v-model pour inputs natives
- ✅ Boucler sur de la donnée avec v-for
- ✅ Rendering conditionnel avec v-if
- ✅ Manipuler des classes dynamiquement
- ✅ Propriétés calculées (computed)
- ✅ Écoute d'événements natifs

## 🎬 Projet fil rouge : Annuaire de films

L'application développée dans cette phase permet de :

### Fonctionnalités implémentées
- ✅ **Listing d'éléments** : Affichage de la liste des films
- ✅ **Ajouter des films** : Formulaire d'ajout avec validation
- ✅ **Supprimer des films** : Suppression avec confirmation
- ✅ **Éditer des films** : Modification en place
- ✅ **Filtres par catégorie** : Filtrage dynamique
- ✅ **Recherche textuelle** : Recherche dans titre et description
- ✅ **Filtre par année** : Filtrage par année de sortie
- ✅ **Statistiques** : Compteurs dynamiques

### Structure des données
```javascript
{
  id: Number,
  title: String,
  category: String,
  year: Number,
  description: String
}
```

## 🚀 Installation et lancement

```bash
# Installation des dépendances
pnpm install

# Lancement du serveur de développement
pnpm dev

# L'application sera disponible sur http://localhost:3000
```

## 🔍 Points d'apprentissage clés

### 1. Composition API
```javascript
import { ref, computed, reactive } from 'vue'

export default {
  setup() {
    const movies = ref([])
    const newMovie = reactive({})
    const filteredMovies = computed(() => {
      // logique de filtrage
    })
    
    return { movies, newMovie, filteredMovies }
  }
}
```

### 2. Réactivité
- `ref()` pour les valeurs primitives
- `reactive()` pour les objets
- `computed()` pour les propriétés calculées

### 3. Directives essentielles
- `v-model` : Liaison bidirectionnelle
- `v-for` : Boucles et listes
- `v-if` / `v-else` : Rendu conditionnel
- `v-bind` ou `:` : Liaison d'attributs
- `@click` : Gestion d'événements

### 4. Templating
- `{{ }}` : Interpolation de texte
- `:class` : Classes dynamiques
- `:style` : Styles dynamiques

## 🎯 Exercices à réaliser

**4 exercices progressifs** pour approfondir les fondamentaux Vue.js 3 :

### **⭐ Exercice 1 : Système de notes** (30-45 min)
**À IMPLÉMENTER** : Ajoutez un champ "note" (1-5 étoiles) aux films et affichez-la avec des étoiles visuelles.
- **Concepts** : computed, v-for conditionnel, styles dynamiques
- **Objectif** : Ajouter des données réactives et des calculs automatiques

### **📊 Exercice 2 : Système de tri** (45-60 min)
**À IMPLÉMENTER** : Implémentez un système de tri par titre, année ou note avec interface utilisateur.
- **Concepts** : computed avancées, manipulation d'arrays, gestion d'état
- **Objectif** : Maîtriser les propriétés calculées complexes

### **❤️ Exercice 3 : Système de favoris** (30-45 min)
**À IMPLÉMENTER** : Ajoutez un système de films favoris avec un bouton cœur et filtrage.
- **Concepts** : événements, modifications d'état, filtrage, feedback
- **Objectif** : Gérer les interactions utilisateur et l'état

### **✅ Exercice 4 : Validation avancée** (60-90 min)
**À IMPLÉMENTER** : Améliorez la validation du formulaire avec règles métier et validation temps réel.
- **Concepts** : watchers, validation temps réel, gestion d'erreurs, UX
- **Objectif** : Créer une expérience utilisateur professionnelle

> **📝 Note** : Les fichiers d'exercices détaillés sont disponibles dans la version complète `phase1-fondamentaux`

## 📖 Ressources

- [Documentation officielle Vue.js 3](https://vuejs.org/)
- [Guide de la Composition API](https://vuejs.org/guide/extras/composition-api-faq.html)
- [Réactivité en profondeur](https://vuejs.org/guide/extras/reactivity-in-depth.html)

## ➡️ Prochaine étape

Une fois cette phase maîtrisée, passez à la **Phase 2 : Composants** pour apprendre à structurer votre application avec des composants réutilisables.
