# 🔔 EXERCICE 4 : Composant ConfirmModal

## 📋 Objectif
Créer un composant modal de confirmation réutilisable pour les actions sensibles avec une interface moderne et accessible.

**Durée estimée** : 45-60 minutes

## 🎯 Fonctionnalités à implémenter

### 1. Composant ConfirmModal.vue
Créez un composant dans `src/components/ConfirmModal.vue` avec :

**Props :**
- `show` (Boolean) : Contrôle l'affichage du modal
- `title` (String, défaut: 'Confirmation') : Titre du modal
- `message` (String) : Message de confirmation
- `confirmText` (String, défaut: 'Confirmer') : Texte du bouton de confirmation
- `cancelText` (String, défaut: 'Annuler') : Texte du bouton d'annulation
- `type` (String, défaut: 'warning') : Type d'alerte ('warning', 'danger', 'info')
- `loading` (Boolean, défaut: false) : État de chargement

**Événements :**
- `confirm` : Émis quand l'utilisateur confirme
- `cancel` : Émis quand l'utilisateur annule
- `close` : Émis à la fermeture du modal

**Fonctionnalités :**
- 🎭 Modal overlay avec animation
- 🎨 Différents types visuels (warning, danger, info)
- ⌨️ Support clavier (Escape pour fermer)
- 🔒 Gestion du focus et accessibilité
- 📱 Design responsive
- ⏳ État de chargement
- 🖱️ Fermeture par clic sur l'overlay

### 2. Template de base
```vue
<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="show"
        class="modal-overlay"
        @click="handleOverlayClick"
        @keydown.esc="handleCancel"
      >
        <div
          class="modal-container"
          :class="[`modal-${type}`, { loading }]"
          @click.stop
          role="dialog"
          aria-modal="true"
          :aria-labelledby="titleId"
          :aria-describedby="messageId"
        >
          <!-- Header -->
          <div class="modal-header">
            <div class="modal-icon">
              <component :is="iconComponent" />
            </div>
            <h3 :id="titleId" class="modal-title">{{ title }}</h3>
            <button
              class="modal-close"
              @click="handleCancel"
              :disabled="loading"
              aria-label="Fermer"
            >
              ✕
            </button>
          </div>

          <!-- Body -->
          <div class="modal-body">
            <p :id="messageId" class="modal-message">{{ message }}</p>
            <slot name="content"></slot>
          </div>

          <!-- Footer -->
          <div class="modal-footer">
            <button
              class="btn btn-secondary"
              @click="handleCancel"
              :disabled="loading"
            >
              {{ cancelText }}
            </button>
            <button
              class="btn"
              :class="confirmButtonClass"
              @click="handleConfirm"
              :disabled="loading"
            >
              <span v-if="loading" class="loading-spinner"></span>
              {{ loading ? 'Traitement...' : confirmText }}
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
```

### 3. Script de base
```vue
<script setup>
import { computed, nextTick, watch, ref } from 'vue'

const props = defineProps({
  show: {
    type: Boolean,
    default: false
  },
  title: {
    type: String,
    default: 'Confirmation'
  },
  message: {
    type: String,
    required: true
  },
  confirmText: {
    type: String,
    default: 'Confirmer'
  },
  cancelText: {
    type: String,
    default: 'Annuler'
  },
  type: {
    type: String,
    default: 'warning',
    validator: (value) => ['warning', 'danger', 'info', 'success'].includes(value)
  },
  loading: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['confirm', 'cancel', 'close'])

// À COMPLÉTER : Logique du composant
</script>
```

## 🔧 Étapes de développement

### Étape 1 : Structure de base (15 min)
1. Créez le fichier `src/components/ConfirmModal.vue`
2. Implémentez la structure HTML du modal
3. Ajoutez les props et événements de base
4. Testez l'affichage du modal

### Étape 2 : Logique et interactions (20 min)
1. Implémentez la gestion des événements
2. Ajoutez le support clavier (Escape)
3. Gérez la fermeture par overlay
4. Testez les interactions

### Étape 3 : Styles et animations (15 min)
1. Créez les styles CSS pour le modal
2. Ajoutez les animations d'entrée/sortie
3. Implémentez les différents types visuels
4. Testez les animations

### Étape 4 : Accessibilité et intégration (10 min)
1. Ajoutez les attributs d'accessibilité
2. Gérez le focus management
3. Intégrez dans l'application
4. Testez l'accessibilité

## 💡 Logique du composant

### Gestion des événements
```javascript
const titleId = `modal-title-${Math.random().toString(36).substr(2, 9)}`
const messageId = `modal-message-${Math.random().toString(36).substr(2, 9)}`

const handleConfirm = () => {
  if (!props.loading) {
    emit('confirm')
  }
}

const handleCancel = () => {
  if (!props.loading) {
    emit('cancel')
    emit('close')
  }
}

const handleOverlayClick = () => {
  if (!props.loading) {
    handleCancel()
  }
}

// Gestion du focus
const previousActiveElement = ref(null)

watch(() => props.show, async (newValue) => {
  if (newValue) {
    // Sauvegarder l'élément actif
    previousActiveElement.value = document.activeElement
    
    // Attendre le rendu et focuser le modal
    await nextTick()
    const modalContainer = document.querySelector('.modal-container')
    if (modalContainer) {
      modalContainer.focus()
    }
  } else {
    // Restaurer le focus
    if (previousActiveElement.value) {
      previousActiveElement.value.focus()
    }
  }
})
```

### Composants d'icônes
```javascript
// Icônes pour les différents types
const iconComponents = {
  warning: {
    template: '<span style="color: #f39c12; font-size: 2rem;">⚠️</span>'
  },
  danger: {
    template: '<span style="color: #e74c3c; font-size: 2rem;">🚨</span>'
  },
  info: {
    template: '<span style="color: #3498db; font-size: 2rem;">ℹ️</span>'
  },
  success: {
    template: '<span style="color: #27ae60; font-size: 2rem;">✅</span>'
  }
}

const iconComponent = computed(() => iconComponents[props.type])

const confirmButtonClass = computed(() => {
  const classes = ['btn']
  switch (props.type) {
    case 'danger':
      classes.push('btn-danger')
      break
    case 'warning':
      classes.push('btn-warning')
      break
    case 'info':
      classes.push('btn-info')
      break
    case 'success':
      classes.push('btn-success')
      break
    default:
      classes.push('btn-primary')
  }
  return classes
})
```

## 🎨 Styles CSS

### Styles principaux
```css
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  backdrop-filter: blur(2px);
}

.modal-container {
  background: white;
  border-radius: 12px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
  max-width: 500px;
  width: 90%;
  max-height: 90vh;
  overflow: hidden;
  outline: none;
  transform: scale(1);
  transition: transform 0.3s ease;
}

.modal-container.loading {
  pointer-events: none;
  opacity: 0.8;
}

.modal-header {
  display: flex;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid #eee;
  gap: 1rem;
}

.modal-icon {
  flex-shrink: 0;
}

.modal-title {
  flex: 1;
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
  color: #333;
}

.modal-close {
  background: none;
  border: none;
  font-size: 1.5rem;
  color: #999;
  cursor: pointer;
  padding: 0.25rem;
  border-radius: 50%;
  transition: all 0.2s ease;
  flex-shrink: 0;
}

.modal-close:hover {
  background: #f5f5f5;
  color: #666;
}

.modal-close:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.modal-body {
  padding: 1.5rem;
}

.modal-message {
  margin: 0;
  line-height: 1.5;
  color: #555;
  font-size: 1rem;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  padding: 1.5rem;
  border-top: 1px solid #eee;
  background: #f8f9fa;
}

/* Types de modals */
.modal-warning .modal-header {
  border-bottom-color: #f39c12;
}

.modal-danger .modal-header {
  border-bottom-color: #e74c3c;
}

.modal-info .modal-header {
  border-bottom-color: #3498db;
}

.modal-success .modal-header {
  border-bottom-color: #27ae60;
}

/* Boutons */
.btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  min-width: 100px;
  justify-content: center;
}

.btn-primary {
  background: #42b883;
  color: white;
}

.btn-primary:hover {
  background: #369870;
}

.btn-danger {
  background: #e74c3c;
  color: white;
}

.btn-danger:hover {
  background: #c0392b;
}

.btn-warning {
  background: #f39c12;
  color: white;
}

.btn-warning:hover {
  background: #d68910;
}

.btn-info {
  background: #3498db;
  color: white;
}

.btn-info:hover {
  background: #2980b9;
}

.btn-secondary {
  background: #6c757d;
  color: white;
}

.btn-secondary:hover {
  background: #5a6268;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.loading-spinner {
  width: 1rem;
  height: 1rem;
  border: 2px solid transparent;
  border-top: 2px solid currentColor;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* Animations */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-active .modal-container,
.modal-leave-active .modal-container {
  transition: transform 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .modal-container,
.modal-leave-to .modal-container {
  transform: scale(0.9) translateY(-20px);
}

/* Responsive */
@media (max-width: 768px) {
  .modal-container {
    width: 95%;
    margin: 1rem;
  }
  
  .modal-header,
  .modal-body,
  .modal-footer {
    padding: 1rem;
  }
  
  .modal-footer {
    flex-direction: column;
  }
  
  .btn {
    width: 100%;
  }
}
```

## 🧪 Tests à effectuer

### Tests fonctionnels
- [ ] Modal s'affiche quand `show` est true
- [ ] Bouton confirmer émet l'événement `confirm`
- [ ] Bouton annuler émet l'événement `cancel`
- [ ] Clic sur overlay ferme le modal
- [ ] Touche Escape ferme le modal
- [ ] État loading désactive les interactions

### Tests d'accessibilité
- [ ] Focus est géré correctement
- [ ] Attributs ARIA sont présents
- [ ] Navigation clavier fonctionne
- [ ] Screen readers peuvent lire le contenu

### Tests visuels
- [ ] Différents types s'affichent correctement
- [ ] Animations sont fluides
- [ ] Design responsive sur mobile
- [ ] États loading visibles

## 🔄 Intégration dans l'application

### Utilisation basique
```vue
<template>
  <div>
    <!-- Bouton de suppression -->
    <button @click="showDeleteConfirm = true" class="btn btn-danger">
      Supprimer le film
    </button>

    <!-- Modal de confirmation -->
    <ConfirmModal
      :show="showDeleteConfirm"
      title="Supprimer le film"
      :message="`Êtes-vous sûr de vouloir supprimer "${movieToDelete?.title}" ? Cette action est irréversible.`"
      confirm-text="Supprimer"
      cancel-text="Annuler"
      type="danger"
      :loading="isDeleting"
      @confirm="handleDeleteConfirm"
      @cancel="showDeleteConfirm = false"
    />
  </div>
</template>

<script setup>
import ConfirmModal from './components/ConfirmModal.vue'

const showDeleteConfirm = ref(false)
const isDeleting = ref(false)
const movieToDelete = ref(null)

const handleDeleteConfirm = async () => {
  isDeleting.value = true
  
  try {
    await deleteMovie(movieToDelete.value.id)
    showDeleteConfirm.value = false
    // Afficher un message de succès
  } catch (error) {
    // Gérer l'erreur
  } finally {
    isDeleting.value = false
  }
}
</script>
```

### Utilisation avancée avec slot
```vue
<ConfirmModal
  :show="showAdvancedConfirm"
  title="Confirmation avancée"
  message="Cette action aura les conséquences suivantes :"
  type="warning"
  @confirm="handleAdvancedConfirm"
  @cancel="showAdvancedConfirm = false"
>
  <template #content>
    <ul class="consequences-list">
      <li>✓ Le film sera supprimé définitivement</li>
      <li>✓ Toutes les notes seront perdues</li>
      <li>✓ Les favoris seront mis à jour</li>
    </ul>
  </template>
</ConfirmModal>
```

## 🚀 Améliorations optionnelles

### Fonctionnalités avancées
- **Composable useConfirm** : Hook pour simplifier l'utilisation
- **Queue de modals** : Gestion de plusieurs modals
- **Personnalisation** : Thèmes et couleurs personnalisées
- **Animations avancées** : Effets d'entrée/sortie sophistiqués
- **Auto-fermeture** : Fermeture automatique après délai

### Composable useConfirm
```javascript
// composables/useConfirm.js
import { ref } from 'vue'

export function useConfirm() {
  const isVisible = ref(false)
  const config = ref({})
  
  const confirm = (options) => {
    return new Promise((resolve) => {
      config.value = {
        ...options,
        onConfirm: () => {
          isVisible.value = false
          resolve(true)
        },
        onCancel: () => {
          isVisible.value = false
          resolve(false)
        }
      }
      isVisible.value = true
    })
  }
  
  return {
    isVisible,
    config,
    confirm
  }
}
```

### Utilisation du composable
```vue
<script setup>
import { useConfirm } from '@/composables/useConfirm'

const { confirm } = useConfirm()

const handleDelete = async () => {
  const confirmed = await confirm({
    title: 'Supprimer le film',
    message: 'Êtes-vous sûr ?',
    type: 'danger'
  })
  
  if (confirmed) {
    // Procéder à la suppression
  }
}
</script>
```

## ✅ Critères de validation

### Fonctionnalités minimales
- ✅ Composant ConfirmModal créé et fonctionnel
- ✅ Tous les props et événements implémentés
- ✅ Support clavier et accessibilité
- ✅ Animations fluides
- ✅ Intégration dans l'application

### Qualité du code
- ✅ Code propre et accessible
- ✅ Gestion d'erreurs robuste
- ✅ Styles responsive
- ✅ Performance optimisée
- ✅ Documentation claire

## 🎓 Compétences acquises

À la fin de cet exercice, vous maîtriserez :
- **Modals et overlays** avec Vue.js
- **Teleport** pour le rendu hors DOM
- **Accessibilité** et gestion du focus
- **Animations** et transitions
- **Composants réutilisables** avancés
- **Patterns d'interaction** utilisateur

---

**🎯 Cet exercice vous apprend à créer des modals professionnels et accessibles avec Vue.js !**
