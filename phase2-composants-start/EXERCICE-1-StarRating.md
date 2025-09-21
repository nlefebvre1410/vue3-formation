# 🌟 EXERCICE 1 : Composant StarRating

## 📋 Objectif
Créer un composant `StarRating` réutilisable pour afficher et modifier les notes avec des étoiles.

**Durée estimée** : 45-60 minutes

## 🎯 Fonctionnalités à implémenter

### 1. Composant StarRating.vue
Créez un composant dans `src/components/StarRating.vue` avec :

**Props :**
- `modelValue` (Number) : Note actuelle (0-5)
- `maxStars` (Number, défaut: 5) : Nombre maximum d'étoiles
- `interactive` (Boolean, défaut: true) : Mode cliquable ou lecture seule
- `showLabel` (Boolean, défaut: false) : Afficher "X/5"
- `size` (String, défaut: 'medium') : Taille ('small', 'medium', 'large')

**Événements :**
- `update:modelValue` : Émis quand l'utilisateur clique sur une étoile

**Fonctionnalités :**
- ⭐ Affichage d'étoiles pleines/vides selon la note
- 🎯 Mode interactif avec clic pour noter
- 🎨 Effet de survol (preview de la note)
- 📏 Trois tailles différentes
- 🏷️ Label numérique optionnel
- ✅ Support de v-model

### 2. Template de base
```vue
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
      {{ modelValue }}/{{ maxStars }}
    </span>
  </div>
</template>
```

### 3. Script de base
```vue
<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  modelValue: {
    type: Number,
    default: 0,
    validator: (value) => value >= 0 && value <= 5
  },
  maxStars: {
    type: Number,
    default: 5,
    validator: (value) => value > 0 && value <= 10
  },
  interactive: {
    type: Boolean,
    default: true
  },
  showLabel: {
    type: Boolean,
    default: false
  },
  size: {
    type: String,
    default: 'medium',
    validator: (value) => ['small', 'medium', 'large'].includes(value)
  }
})

const emit = defineEmits(['update:modelValue'])

// À COMPLÉTER : Logique du composant
</script>
```

## 🔧 Étapes de développement

### Étape 1 : Structure de base (15 min)
1. Créez le fichier `src/components/StarRating.vue`
2. Implémentez le template avec les étoiles
3. Ajoutez les props de base
4. Testez l'affichage statique

### Étape 2 : Interactivité (20 min)
1. Ajoutez la logique de clic pour noter
2. Implémentez l'effet de survol
3. Gérez l'émission de l'événement `update:modelValue`
4. Testez le mode interactif

### Étape 3 : Styles et variantes (15 min)
1. Créez les styles CSS pour les différentes tailles
2. Ajoutez les animations de survol
3. Stylisez les étoiles pleines/vides
4. Testez les différentes variantes

### Étape 4 : Intégration (10 min)
1. Intégrez le composant dans `MovieCard.vue`
2. Ajoutez un champ `rating` aux films
3. Testez l'intégration complète

## 💡 Conseils de développement

### CSS de base
```css
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
```

### Logique JavaScript
```javascript
const hoveredRating = ref(0)

const currentRating = computed(() => {
  return hoveredRating.value || props.modelValue
})

const setRating = (rating) => {
  emit('update:modelValue', rating)
}
```

## 🧪 Tests à effectuer

### Tests fonctionnels
- [ ] Affichage correct du nombre d'étoiles selon `maxStars`
- [ ] Étoiles remplies selon la valeur `modelValue`
- [ ] Clic sur une étoile met à jour la note
- [ ] Effet de survol fonctionne en mode interactif
- [ ] Mode lecture seule désactive les interactions
- [ ] Label s'affiche quand `showLabel` est true
- [ ] Validation des props fonctionne

### Tests d'intégration
- [ ] v-model fonctionne avec le composant parent
- [ ] Intégration dans MovieCard affiche les notes
- [ ] Modification de note met à jour les données
- [ ] Styles responsive sur mobile

## 🎨 Améliorations optionnelles

### Fonctionnalités avancées
- **Demi-étoiles** : Support des notes décimales (4.5/5)
- **Couleurs personnalisées** : Props pour changer les couleurs
- **Icônes personnalisées** : Utiliser d'autres symboles que ⭐
- **Animation** : Effet d'apparition des étoiles
- **Accessibilité** : Support clavier et screen readers

### Variantes de design
```css
/* Étoiles colorées */
.star.filled {
  color: #ffd700;
  text-shadow: 0 0 3px rgba(255, 215, 0, 0.5);
}

/* Animation de remplissage */
.star {
  transition: all 0.3s ease;
}

.star.filled {
  animation: fillStar 0.3s ease-in-out;
}

@keyframes fillStar {
  0% { transform: scale(1); }
  50% { transform: scale(1.2); }
  100% { transform: scale(1); }
}
```

## 📚 Utilisation dans l'application

### Dans MovieCard.vue
```vue
<template>
  <div class="movie-card">
    <!-- Contenu existant -->
    <div class="movie-rating">
      <StarRating 
        v-model="movie.rating" 
        :interactive="false"
        show-label
        size="small"
      />
    </div>
  </div>
</template>

<script setup>
import StarRating from './StarRating.vue'
</script>
```

### Dans MovieForm.vue
```vue
<template>
  <form>
    <!-- Champs existants -->
    <div class="form-group">
      <label>Note du film :</label>
      <StarRating 
        v-model="formData.rating"
        show-label
      />
    </div>
  </form>
</template>
```

## ✅ Critères de validation

### Fonctionnalités minimales
- ✅ Composant StarRating créé et fonctionnel
- ✅ Props et événements implémentés
- ✅ Mode interactif et lecture seule
- ✅ Styles pour les différentes tailles
- ✅ Intégration dans l'application

### Qualité du code
- ✅ Code propre et commenté
- ✅ Validation des props
- ✅ Gestion d'erreurs
- ✅ Styles CSS organisés
- ✅ Responsive design

## 🎓 Compétences acquises

À la fin de cet exercice, vous maîtriserez :
- **Création de composants** réutilisables
- **Props et événements** avancés
- **v-model** personnalisé
- **Validation de props** robuste
- **Interactivité** et gestion d'état local
- **CSS** et animations
- **Intégration** de composants

---

**🎯 Cet exercice vous apprend à créer des composants Vue.js professionnels et réutilisables !**
