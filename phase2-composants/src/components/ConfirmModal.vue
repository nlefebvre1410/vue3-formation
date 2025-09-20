<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="isVisible" class="modal-overlay" @click="handleOverlayClick">
        <div class="modal-container" @click.stop>
          <div class="modal-header">
            <h3 class="modal-title">
              <span class="modal-icon">{{ icon }}</span>
              {{ title }}
            </h3>
            <button 
              class="modal-close"
              @click="handleCancel"
              :aria-label="'Fermer ' + title"
            >
              ✕
            </button>
          </div>
          
          <div class="modal-body">
            <p class="modal-message">{{ message }}</p>
            
            <!-- Slot pour contenu personnalisé -->
            <slot name="content"></slot>
            
            <!-- Détails supplémentaires -->
            <div v-if="details" class="modal-details">
              <p><strong>{{ details }}</strong></p>
            </div>
            
            <!-- Warning si action destructive -->
            <div v-if="type === 'danger'" class="modal-warning">
              ⚠️ Cette action est irréversible
            </div>
          </div>
          
          <div class="modal-footer">
            <button 
              class="btn btn-secondary"
              @click="handleCancel"
              :disabled="loading"
            >
              {{ cancelText }}
            </button>
            <button 
              :class="['btn', confirmButtonClass]"
              @click="handleConfirm"
              :disabled="loading"
            >
              <span v-if="loading" class="loading-spinner"></span>
              {{ loading ? loadingText : confirmText }}
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script>
import { computed, onMounted, onUnmounted } from 'vue'

export default {
  name: 'ConfirmModal',
  props: {
    // Visibilité de la modal
    isVisible: {
      type: Boolean,
      default: false
    },
    // Type de modal (détermine l'apparence)
    type: {
      type: String,
      default: 'info',
      validator(value) {
        return ['info', 'warning', 'danger', 'success'].includes(value)
      }
    },
    // Titre de la modal
    title: {
      type: String,
      default: 'Confirmation'
    },
    // Message principal
    message: {
      type: String,
      required: true
    },
    // Détails supplémentaires
    details: {
      type: String,
      default: ''
    },
    // Texte du bouton de confirmation
    confirmText: {
      type: String,
      default: 'Confirmer'
    },
    // Texte du bouton d'annulation
    cancelText: {
      type: String,
      default: 'Annuler'
    },
    // Texte pendant le chargement
    loadingText: {
      type: String,
      default: 'En cours...'
    },
    // État de chargement
    loading: {
      type: Boolean,
      default: false
    },
    // Fermer en cliquant sur l'overlay
    closeOnOverlay: {
      type: Boolean,
      default: true
    },
    // Fermer avec la touche Escape
    closeOnEscape: {
      type: Boolean,
      default: true
    }
  },
  emits: ['confirm', 'cancel', 'close'],
  setup(props, { emit }) {
    // Icône selon le type
    const icon = computed(() => {
      const icons = {
        info: 'ℹ️',
        warning: '⚠️',
        danger: '🗑️',
        success: '✅'
      }
      return icons[props.type] || icons.info
    })

    // Classe CSS du bouton de confirmation
    const confirmButtonClass = computed(() => {
      const classes = {
        info: 'btn-primary',
        warning: 'btn-warning',
        danger: 'btn-danger',
        success: 'btn-success'
      }
      return classes[props.type] || classes.info
    })

    // Gestion des événements
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
      if (props.closeOnOverlay && !props.loading) {
        handleCancel()
      }
    }

    // Gestion de la touche Escape
    const handleEscape = (event) => {
      if (event.key === 'Escape' && props.closeOnEscape && props.isVisible && !props.loading) {
        handleCancel()
      }
    }

    // Lifecycle hooks
    onMounted(() => {
      document.addEventListener('keydown', handleEscape)
      // Empêcher le scroll du body quand la modal est ouverte
      if (props.isVisible) {
        document.body.style.overflow = 'hidden'
      }
    })

    onUnmounted(() => {
      document.removeEventListener('keydown', handleEscape)
      // Restaurer le scroll du body
      document.body.style.overflow = ''
    })

    return {
      icon,
      confirmButtonClass,
      handleConfirm,
      handleCancel,
      handleOverlayClick
    }
  }
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  padding: 1rem;
}

.modal-container {
  background: white;
  border-radius: 12px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
  max-width: 500px;
  width: 100%;
  max-height: 90vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.5rem;
  border-bottom: 1px solid #e9ecef;
  background: #f8f9fa;
}

.modal-title {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
  color: #212529;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.modal-icon {
  font-size: 1.5rem;
}

.modal-close {
  background: none;
  border: none;
  font-size: 1.5rem;
  color: #6c757d;
  cursor: pointer;
  padding: 0;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  transition: all 0.2s ease;
}

.modal-close:hover {
  background: #e9ecef;
  color: #495057;
}

.modal-body {
  padding: 1.5rem;
  flex: 1;
  overflow-y: auto;
}

.modal-message {
  margin: 0 0 1rem 0;
  font-size: 1rem;
  line-height: 1.5;
  color: #495057;
}

.modal-details {
  margin: 1rem 0;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 8px;
  border-left: 4px solid #42b883;
}

.modal-details p {
  margin: 0;
  color: #495057;
}

.modal-warning {
  margin: 1rem 0 0 0;
  padding: 0.75rem 1rem;
  background: #fff3cd;
  border: 1px solid #ffeaa7;
  border-radius: 8px;
  color: #856404;
  font-size: 0.9rem;
  font-weight: 500;
}

.modal-footer {
  display: flex;
  gap: 0.75rem;
  padding: 1.5rem;
  border-top: 1px solid #e9ecef;
  background: #f8f9fa;
  justify-content: flex-end;
}

.modal-footer .btn {
  min-width: 100px;
}

/* Boutons spécialisés */
.btn-warning {
  background: #ffc107;
  color: #212529;
  border: 1px solid #ffc107;
}

.btn-warning:hover {
  background: #ffb300;
  border-color: #ffb300;
}

.btn-danger {
  background: #dc3545;
  color: white;
  border: 1px solid #dc3545;
}

.btn-danger:hover {
  background: #c82333;
  border-color: #c82333;
}

.btn-success {
  background: #28a745;
  color: white;
  border: 1px solid #28a745;
}

.btn-success:hover {
  background: #218838;
  border-color: #218838;
}

/* Spinner de chargement */
.loading-spinner {
  display: inline-block;
  width: 16px;
  height: 16px;
  border: 2px solid transparent;
  border-top: 2px solid currentColor;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-right: 0.5rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Transitions */
.modal-enter-active, .modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from, .modal-leave-to {
  opacity: 0;
}

.modal-enter-active .modal-container,
.modal-leave-active .modal-container {
  transition: transform 0.3s ease;
}

.modal-enter-from .modal-container,
.modal-leave-to .modal-container {
  transform: scale(0.9) translateY(-50px);
}

/* Responsive */
@media (max-width: 768px) {
  .modal-overlay {
    padding: 0.5rem;
  }
  
  .modal-container {
    max-height: 95vh;
  }
  
  .modal-header,
  .modal-body,
  .modal-footer {
    padding: 1rem;
  }
  
  .modal-footer {
    flex-direction: column-reverse;
  }
  
  .modal-footer .btn {
    width: 100%;
  }
}
</style>
