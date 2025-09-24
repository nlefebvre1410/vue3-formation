<template>
    <div class="star-rating" :class="[`size-${size}`, { interactive }]">
      <span
        v-for="star in maxStars"
        :key="star"
        class="star"
        :class="{ 
          filled: star <= currentRating,
          hovered: interactive && star <= hoveredRating 
        }"
        @click="interactive && setRating(star)"
        @mouseenter="interactive && (hoveredRating = star)"
        @mouseleave="interactive && (hoveredRating = 0)"
      >
        ⭐
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
        modelValue: {
            type: Number,
            default: 0,
            validator: (value) => value >= 0 && value <= 10
        },
        maxStars: {
            type: Number,
            default: 10,
            validator: value => value > 0 && value <= 10
        },
        interactive: {
            type: Boolean,
            default: false
        },
        showLabel: {
            type: Boolean,
            default: false
        },
        size: {
            type: String,
            default: 'medium',
            validator: value => ['small', 'medium', 'large'].includes(value)
        }
    },
    emits: ['update:modelValue'],
    setup(props, {emit}) {
        const hoveredRating = ref(0)

        const currentRating = computed(() => {
            return hoveredRating.value || Math.round(props.modelValue/(10/props.maxStars))
        })
        // on peut faire get/set sur un computed
        // v-model est bidirectionnel
        const setRating = (rating) => {
            emit('update:modelValue', rating*(10/props.maxStars))
        }

        return {
            hoveredRating,
            currentRating,
            setRating
        }
    }
}

</script>
<style>
.star-rating {
  display: inline-flex;
  align-items: center;
  gap: 2px;
}

.star {
  cursor: pointer;
  transition: transform 0.2s ease;
  filter: grayscale(100%);
}

.star.filled {
  filter: grayscale(0%);
}

.star:hover {
  transform: scale(1.1);
}

.size-small .star { font-size: 0.8rem; }
.size-medium .star { font-size: 1rem; }
.size-large .star { font-size: 1.2rem; }
</style>