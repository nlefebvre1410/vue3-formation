<template>
  <div class="star-rating">
    <span 
      v-for="star in maxStars" 
      :key="star"
      class="star"
      :class="{ 
        'star-filled': star <= currentRating,
        'star-hover': star <= hoverRating && interactive
      }"
      @click="interactive && setRating(star)"
      @mouseenter="interactive && (hoverRating = star)"
      @mouseleave="interactive && (hoverRating = 0)"
    >
      ★
    </span>
    <span v-if="showLabel" class="rating-label">
      {{ currentRating }}/{{ maxStars }}
    </span>
  </div>
</template>

<script>
import { ref, computed } from 'vue'

export default {
  name: 'StarRating',
  props: {
    // Note actuelle (peut être décimale)
    modelValue: {
      type: Number,
      default: 0,
      validator(value) {
        return value >= 0 && value <= 5
      }
    },
    // Nombre maximum d'étoiles
    maxStars: {
      type: Number,
      default: 5,
      validator(value) {
        return value > 0 && value <= 10
      }
    },
    // Si le composant est interactif (cliquable)
    interactive: {
      type: Boolean,
      default: true
    },
    // Afficher le label numérique
    showLabel: {
      type: Boolean,
      default: false
    },
    // Taille des étoiles
    size: {
      type: String,
      default: 'medium',
      validator(value) {
        return ['small', 'medium', 'large'].includes(value)
      }
    }
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    const hoverRating = ref(0)

    // Note arrondie pour l'affichage des étoiles
    const currentRating = computed(() => {
      return Math.round(props.modelValue)
    })

    const setRating = (rating) => {
      emit('update:modelValue', rating)
    }

    return {
      hoverRating,
      currentRating,
      setRating
    }
  }
}
</script>

<style scoped>
.star-rating {
  display: inline-flex;
  align-items: center;
  gap: 2px;
}

.star {
  color: #ddd;
  font-size: 1.2rem;
  transition: color 0.2s ease, transform 0.1s ease;
  cursor: default;
}

/* Tailles des étoiles */
.star-rating[data-size="small"] .star {
  font-size: 1rem;
}

.star-rating[data-size="large"] .star {
  font-size: 1.5rem;
}

/* États des étoiles */
.star-filled {
  color: #ffc107;
}

.star-hover {
  color: #ffb300;
  transform: scale(1.1);
}

/* Étoiles interactives */
.star-rating .star:hover {
  cursor: pointer;
}

.star-rating:not([data-interactive="false"]) .star {
  cursor: pointer;
}

.star-rating[data-interactive="false"] .star {
  cursor: default;
}

.rating-label {
  margin-left: 0.5rem;
  font-size: 0.9rem;
  color: #666;
  font-weight: 500;
}

/* Animation au survol pour les composants interactifs */
.star-rating:not([data-interactive="false"]) .star:hover {
  transform: scale(1.1);
}

/* Accessibilité */
.star-rating:focus-within {
  outline: 2px solid #42b883;
  outline-offset: 2px;
  border-radius: 4px;
}
</style>
