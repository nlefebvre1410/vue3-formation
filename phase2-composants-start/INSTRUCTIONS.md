# 📚 INSTRUCTIONS - Phase 2 Start

## 🎯 Bienvenue dans la Phase 2 !

Cette version **START** contient la base de travail pour apprendre l'architecture en composants Vue.js 3.

## 🚀 Installation et lancement

```bash
# Se placer dans le dossier
cd phase2-composants-start

# Installation des dépendances
pnpm install

# Lancement du serveur de développement
pnpm dev

# L'application sera disponible sur http://localhost:3003
```

## 🏗️ Structure actuelle

### ✅ Composants déjà créés
- **AppHeader.vue** - En-tête réutilisable
- **MovieCard.vue** - Affichage d'un film
- **MovieForm.vue** - Formulaire d'ajout/édition
- **MovieFilters.vue** - Système de filtres

### 📝 À créer (Exercices)
- **StarRating.vue** - Composant de notation
- **SearchInput.vue** - Recherche avec debounce
- **ConfirmModal.vue** - Modal de confirmation
- **SortSelector.vue** - Tri des données

## 🎯 Exercices à réaliser

### 🌟 Exercice 1 : StarRating
**Fichier à créer :** `src/components/StarRating.vue`

**Objectif :** Remplacer le select de notation par des étoiles cliquables.

**Props attendues :**
```javascript
{
  modelValue: Number,     // Note actuelle (0-5)
  interactive: Boolean,   // Cliquable ou lecture seule
  showLabel: Boolean,     // Afficher "X/5"
  size: String           // 'small', 'medium', 'large'
}
```

**Intégration :**
- Dans `MovieCard.vue` : mode lecture seule
- Dans `MovieForm.vue` : mode interactif

### 🔍 Exercice 2 : SearchInput
**Fichier à créer :** `src/components/SearchInput.vue`

**Objectif :** Améliorer la recherche avec debounce et indicateurs.

**Props attendues :**
```javascript
{
  modelValue: String,        // Terme de recherche
  debounceDelay: Number,     // Délai en ms (défaut: 300)
  minLength: Number,         // Longueur minimum (défaut: 2)
  placeholder: String,       // Placeholder
  loading: Boolean          // État de chargement
}
```

**Intégration :**
- Dans `MovieFilters.vue` : remplacer l'input basique

### 🗂️ Exercice 3 : ConfirmModal
**Fichier à créer :** `src/components/ConfirmModal.vue`

**Objectif :** Sécuriser les suppressions avec une modal de confirmation.

**Props attendues :**
```javascript
{
  isVisible: Boolean,        // Visibilité
  type: String,             // 'info', 'warning', 'danger', 'success'
  title: String,            // Titre
  message: String,          // Message principal
  confirmText: String,      // Texte bouton confirmer
  cancelText: String        // Texte bouton annuler
}
```

**Intégration :**
- Dans `MovieCard.vue` : confirmer avant suppression

### 📊 Exercice 4 : SortSelector
**Fichier à créer :** `src/components/SortSelector.vue`

**Objectif :** Permettre le tri des films par différents critères.

**Props attendues :**
```javascript
{
  modelValue: Object,        // { sortBy: '', direction: 'asc' }
  options: Array,           // Options de tri disponibles
  label: String,            // Label du composant
  showIndicator: Boolean    // Afficher l'état actuel
}
```

**Intégration :**
- Dans `App.vue` : ajouter le tri aux films filtrés

## 💡 Conseils pour réussir

### 🎨 Design cohérent
- Utilisez les classes CSS existantes
- Respectez le thème vert Vue.js (#42b883)
- Ajoutez des transitions fluides

### 📱 Responsive
- Testez sur mobile
- Utilisez les media queries existantes
- Adaptez les tailles de boutons

### ♿ Accessibilité
- Ajoutez des labels appropriés
- Gérez le focus clavier
- Respectez les contrastes

### 🔄 Réactivité Vue.js
- Utilisez la Composition API
- Implémentez v-model correctement
- Validez les props

## 🧪 Test de vos composants

### Vérifications à faire
1. **Props** : Toutes les props sont-elles validées ?
2. **Events** : Les événements sont-ils émis correctement ?
3. **v-model** : Fonctionne-t-il dans les deux sens ?
4. **Styles** : Le composant s'intègre-t-il bien ?
5. **Responsive** : Fonctionne-t-il sur mobile ?

### Tests manuels
- Testez tous les cas d'usage
- Vérifiez les états d'erreur
- Testez les interactions clavier
- Validez sur différentes tailles d'écran

## 📖 Ressources utiles

- [Documentation Vue.js 3](https://vuejs.org/)
- [Guide des composants](https://vuejs.org/guide/essentials/component-basics.html)
- [Composition API](https://vuejs.org/guide/extras/composition-api-faq.html)
- [Props et événements](https://vuejs.org/guide/components/props.html)

## 🎉 Objectif final

À la fin des 4 exercices, vous aurez :
- ⭐ Un système de notation moderne
- 🔍 Une recherche performante avec debounce
- 🗂️ Des confirmations sécurisées
- 📊 Un tri flexible des données

**Bonne chance et amusez-vous bien ! 🚀**
