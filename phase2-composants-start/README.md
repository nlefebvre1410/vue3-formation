# Phase 2 : Composants Vue.js 3 - VERSION START

Cette phase correspond au **Jour 2** de la formation Human Coders et couvre l'architecture en composants avec Vue.js 3.

> **📚 VERSION DÉMARRAGE** : Cette version contient la base de travail pour les apprenants, sans les exercices implémentés.

## 🎯 Objectifs de cette phase

- Comprendre l'architecture en composants
- Maîtriser la communication entre composants (props/events)
- Créer des composants réutilisables
- Organiser une application en modules
- Utiliser les slots et la composition de composants

## 📚 Concepts abordés

### 1. Architecture en composants
- ✅ Décomposition d'une application en composants
- ✅ Single File Components (.vue)
- ✅ Organisation des fichiers et dossiers
- ✅ Bonnes pratiques de structuration

### 2. Communication entre composants
- ✅ Props pour passer des données aux enfants
- ✅ Events pour communiquer vers les parents
- ✅ v-model personnalisé
- ✅ Validation des props

### 3. Composants avancés
- ✅ Slots pour la composition flexible
- ✅ Composants dynamiques
- ✅ Teleport pour le rendu conditionnel
- ✅ Provide/inject pour l'injection de dépendances

## 🎬 Projet fil rouge : Application de films modulaire

L'application développée dans cette phase transforme le monolithe de la Phase 1 en architecture modulaire :

### Composants créés
- ✅ **MovieCard** : Affichage d'un film individuel
- ✅ **MovieForm** : Formulaire d'ajout/modification
- ✅ **MovieFilters** : Système de filtrage avancé
- ✅ **StarRating** : Composant de notation
- ✅ **ConfirmModal** : Modal de confirmation
- ✅ **AppHeader** : En-tête de l'application

### Architecture finale
```
src/
├── components/
│   ├── MovieCard.vue
│   ├── MovieForm.vue
│   ├── MovieFilters.vue
│   ├── StarRating.vue
│   ├── ConfirmModal.vue
│   └── AppHeader.vue
├── App.vue
└── main.js
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

### 1. Props et Events
```vue
<!-- Parent -->
<MovieCard 
  :movie="movie" 
  @edit="handleEdit"
  @delete="handleDelete"
/>

<!-- Enfant -->
<script setup>
const props = defineProps({
  movie: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['edit', 'delete'])
</script>
```

### 2. v-model personnalisé
```vue
<!-- Composant StarRating -->
<script setup>
const props = defineProps(['modelValue'])
const emit = defineEmits(['update:modelValue'])

const updateRating = (value) => {
  emit('update:modelValue', value)
}
</script>

<!-- Utilisation -->
<StarRating v-model="movie.rating" />
```

### 3. Slots pour la flexibilité
```vue
<!-- Composant avec slot -->
<template>
  <div class="card">
    <header class="card-header">
      <slot name="header"></slot>
    </header>
    <main class="card-content">
      <slot></slot>
    </main>
  </div>
</template>

<!-- Utilisation -->
<Card>
  <template #header>
    <h2>Titre personnalisé</h2>
  </template>
  <p>Contenu du composant</p>
</Card>
```

## 🎯 Exercices à réaliser

**4 exercices progressifs** pour maîtriser l'architecture en composants :

### **⭐ [Exercice 1 : Composant StarRating](./EXERCICE-1-StarRating.md)** (45-60 min)
**À IMPLÉMENTER** : Créez un composant de notation avec étoiles cliquables et support v-model.
- **Concepts** : Props, events, v-model personnalisé, validation
- **Objectif** : Maîtriser la communication parent-enfant

### **📝 [Exercice 2 : Composant MovieForm](./EXERCICE-2-MovieForm.md)** (60-75 min)
**À IMPLÉMENTER** : Extrayez le formulaire dans un composant réutilisable avec validation avancée.
- **Concepts** : Formulaires complexes, validation, états de chargement
- **Objectif** : Créer des composants métier robustes

### **🔍 [Exercice 3 : Composant MovieFilters](./EXERCICE-3-MovieFilters.md)** (60-75 min)
**À IMPLÉMENTER** : Créez un système de filtrage avancé avec recherche et tri.
- **Concepts** : Computed complexes, watchers, interface utilisateur
- **Objectif** : Gérer la logique de filtrage et tri

### **🔔 [Exercice 4 : Composant ConfirmModal](./EXERCICE-4-ConfirmModal.md)** (45-60 min)
**À IMPLÉMENTER** : Créez un modal de confirmation réutilisable avec Teleport.
- **Concepts** : Teleport, accessibilité, animations, gestion du focus
- **Objectif** : Maîtriser les modals et l'accessibilité

## 📝 Instructions détaillées

Consultez le fichier **[INSTRUCTIONS.md](./INSTRUCTIONS.md)** pour :
- 🚀 Guide d'installation et de lancement
- 📋 Prérequis et structure du projet
- 💡 Conseils de développement
- 🧪 Méthodes de test et validation
- 📚 Ressources complémentaires

## 📖 Ressources

- [Guide des composants Vue.js 3](https://vuejs.org/guide/essentials/component-basics.html)
- [Props et Events](https://vuejs.org/guide/components/props.html)
- [Slots](https://vuejs.org/guide/components/slots.html)
- [Teleport](https://vuejs.org/guide/built-ins/teleport.html)

## ➡️ Prochaine étape

Une fois cette phase maîtrisée, passez à la **Phase 3 : Concepts avancés** pour apprendre Pinia, Vue Router et les techniques d'optimisation.
