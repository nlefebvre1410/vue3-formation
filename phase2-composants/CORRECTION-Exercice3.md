# 🗂️ CORRECTION - Exercice 3 : Composant ConfirmModal

## 📋 Objectif
Créer une modal réutilisable pour confirmer les suppressions et autres actions importantes.

## ✅ Implémentation

### 1. Composant ConfirmModal.vue

**Fonctionnalités implémentées :**
- 🎭 Modal avec overlay et Teleport
- 🎨 4 types : info, warning, danger, success
- 🔒 Prévention des actions pendant le chargement
- ⌨️ Support des raccourcis clavier (Escape)
- 📱 Design responsive et accessible
- 🎬 Animations d'entrée/sortie fluides

**Props :**
```javascript
{
  isVisible: Boolean,        // Visibilité de la modal
  type: String,             // 'info', 'warning', 'danger', 'success'
  title: String,            // Titre (défaut: "Confirmation")
  message: String,          // Message principal (requis)
  details: String,          // Détails supplémentaires
  confirmText: String,      // Texte bouton confirmer
  cancelText: String,       // Texte bouton annuler
  loadingText: String,      // Texte pendant chargement
  loading: Boolean,         // État de chargement
  closeOnOverlay: Boolean,  // Fermer en cliquant dehors
  closeOnEscape: Boolean    // Fermer avec Escape
}
```

**Events :**
```javascript
emits: ['confirm', 'cancel', 'close']
```

### 2. Types de modals

#### **Type "danger" (suppression)**
```vue
<ConfirmModal
  :is-visible="showDeleteModal"
  type="danger"
  title="Supprimer le film"
  :message="`Êtes-vous sûr de vouloir supprimer "${movieToDelete?.title}" ?`"
  details="Cette action est irréversible"
  confirm-text="Supprimer"
  cancel-text="Annuler"
  :loading="isDeleting"
  loading-text="Suppression..."
  @confirm="confirmDelete"
  @cancel="cancelDelete"
/>
```

#### **Type "warning" (action importante)**
```vue
<ConfirmModal
  :is-visible="showResetModal"
  type="warning"
  title="Réinitialiser les filtres"
  message="Voulez-vous effacer tous les filtres actifs ?"
  confirm-text="Réinitialiser"
  @confirm="resetAllFilters"
  @cancel="showResetModal = false"
/>
```

#### **Type "info" (confirmation simple)**
```vue
<ConfirmModal
  :is-visible="showSaveModal"
  type="info"
  title="Sauvegarder les modifications"
  message="Voulez-vous enregistrer les changements ?"
  confirm-text="Sauvegarder"
  @confirm="saveChanges"
  @cancel="showSaveModal = false"
/>
```

### 3. Intégration dans MovieCard

**Avant (suppression directe) :**
```vue
<button @click="$emit('delete', movie.id)">
  Supprimer
</button>
```

**Après (avec confirmation) :**
```vue
<template>
  <button @click="showDeleteConfirm = true">
    Supprimer
  </button>
  
  <ConfirmModal
    :is-visible="showDeleteConfirm"
    type="danger"
    title="Supprimer le film"
    :message="`Supprimer "${movie.title}" de votre collection ?`"
    :details="`Film de ${movie.year} • ${movie.category}`"
    confirm-text="Supprimer définitivement"
    cancel-text="Annuler"
    @confirm="handleDelete"
    @cancel="showDeleteConfirm = false"
  />
</template>

<script>
export default {
  data() {
    return {
      showDeleteConfirm: false
    }
  },
  methods: {
    handleDelete() {
      this.$emit('delete', this.movie.id)
      this.showDeleteConfirm = false
    }
  }
}
</script>
```

## 🎨 Fonctionnalités avancées

### **Teleport vers body**
```vue
<Teleport to="body">
  <div class="modal-overlay">
    <!-- Contenu modal -->
  </div>
</Teleport>
```
- Évite les problèmes de z-index
- Modal toujours au-dessus du contenu

### **Gestion du scroll**
```javascript
onMounted(() => {
  if (props.isVisible) {
    document.body.style.overflow = 'hidden'
  }
})

onUnmounted(() => {
  document.body.style.overflow = ''
})
```

### **Prévention des actions multiples**
```javascript
const handleConfirm = () => {
  if (!props.loading) {
    emit('confirm')
  }
}
```

### **Accessibilité**
- Focus trap dans la modal
- Support des lecteurs d'écran
- Contraste des couleurs
- Tailles de boutons tactiles

## 🎬 Animations

### **Transition CSS**
```css
.modal-enter-active, .modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from, .modal-leave-to {
  opacity: 0;
}

.modal-container {
  transition: transform 0.3s ease;
}

.modal-enter-from .modal-container {
  transform: scale(0.9) translateY(-50px);
}
```

## 🚀 Avantages

### ✅ Sécurité
- **Confirmation obligatoire** : Évite les suppressions accidentelles
- **États de chargement** : Prévient les double-clics
- **Messages clairs** : L'utilisateur sait ce qu'il fait

### ✅ UX professionnelle
- **Animations fluides** : Entrée/sortie naturelles
- **Design cohérent** : Couleurs selon le type d'action
- **Responsive** : Adaptation mobile parfaite

### ✅ Réutilisabilité
- **Configurable** : Textes, types, comportements
- **Générique** : Utilisable pour toute confirmation
- **Slots** : Contenu personnalisable

## 📚 Concepts Vue.js utilisés

- **Teleport** : Rendu hors de l'arbre des composants
- **Transitions** : Animations d'entrée/sortie
- **Composition API** : `setup()`, `computed()`, `onMounted()`
- **Props validation** : Types et validators
- **Événements personnalisés** : Communication parent-enfant
- **Lifecycle hooks** : Gestion du DOM
- **Styles scopés** : Isolation CSS

## 🎯 Résultat

La ConfirmModal offre une expérience utilisateur professionnelle avec :
- Confirmations sécurisées pour les actions destructives
- Interface moderne et accessible
- Animations fluides et naturelles
- Réutilisabilité maximale dans toute l'application

Fini les suppressions accidentelles ! 🛡️
