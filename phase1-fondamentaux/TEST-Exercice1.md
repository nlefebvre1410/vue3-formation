# 🧪 TEST - Exercice 1 : Système de notes

## ✅ Fonctionnalités à tester

### 1. **Affichage des données initiales**
- [ ] Les films existants affichent leurs étoiles automatiquement
- [ ] La note moyenne est calculée et affichée dans les statistiques
- [ ] Les films sans note (rating: 0) n'affichent pas d'étoiles

### 2. **Formulaire d'ajout**
- [ ] Le champ "Note du film" est présent avec les options 0-5 étoiles
- [ ] La sélection "Pas de note" correspond à 0
- [ ] Les options avec étoiles (⭐⭐⭐) sont visuellement claires
- [ ] L'ajout d'un film avec note fonctionne correctement

### 3. **Affichage des étoiles**
- [ ] Les étoiles pleines (★) sont dorées (#ffc107)
- [ ] Les étoiles vides (★) sont grises (#ddd)
- [ ] Le texte "X/5" s'affiche à côté des étoiles
- [ ] L'affichage est conditionnel (v-if="movie.rating > 0")

### 4. **Modification de films**
- [ ] Le formulaire de modification charge la note existante
- [ ] La modification de la note met à jour l'affichage
- [ ] La note moyenne se recalcule automatiquement

### 5. **Calcul de la note moyenne**
- [ ] Seuls les films avec rating > 0 sont inclus dans le calcul
- [ ] La moyenne est affichée avec 1 décimale (ex: 4.2)
- [ ] La moyenne se met à jour en temps réel

## 🎯 Scénarios de test

### **Scénario 1 : Ajout d'un nouveau film avec note**
1. Ouvrir l'application
2. Remplir le formulaire avec :
   - Titre : "Film Test"
   - Catégorie : "Excellent"
   - Année : 2024
   - **Note : ⭐⭐⭐⭐ 4 étoiles**
3. Cliquer sur "Ajouter le film"
4. **Vérifier** :
   - Le film apparaît avec 4 étoiles dorées et 1 étoile grise
   - Le texte "4/5" est affiché
   - La note moyenne est mise à jour

### **Scénario 2 : Modification d'une note existante**
1. Cliquer sur "Modifier" sur un film existant
2. Changer la note dans le formulaire
3. Cliquer sur "Mettre à jour"
4. **Vérifier** :
   - L'affichage des étoiles est mis à jour
   - La note moyenne est recalculée

### **Scénario 3 : Film sans note**
1. Ajouter un film avec "Pas de note" (0)
2. **Vérifier** :
   - Aucune étoile n'est affichée pour ce film
   - Le film n'affecte pas la note moyenne

### **Scénario 4 : Responsive et animations**
1. Tester sur mobile (< 768px)
2. Survoler une carte de film
3. **Vérifier** :
   - Les étoiles sont centrées sur mobile
   - L'animation de scale(1.1) fonctionne au survol

## 📊 Données de test

### Films avec notes pour tester :
```javascript
// Ces données sont automatiquement générées depuis vote_average
{
  id: 1311031,
  title: "Demon Slayer",
  vote_average: 8.4,
  rating: 4 // Math.round(8.4 / 2) = 4 étoiles
}

{
  id: 755898,
  title: "La Guerre des mondes",
  vote_average: 6.8,
  rating: 3 // Math.round(6.8 / 2) = 3 étoiles
}
```

### Note moyenne attendue :
- Si 10 films avec ratings [5,4,4,3,3,3,2,2,1,0]
- Films notés : 9 films (excluant le 0)
- Somme : 5+4+4+3+3+3+2+2+1 = 27
- Moyenne : 27/9 = 3.0

## 🐛 Points d'attention

### **Erreurs communes à vérifier :**
1. **Conversion vote_average** : S'assurer que `Math.round(vote_average / 2)` donne des valeurs 1-5
2. **Affichage conditionnel** : Vérifier `v-if="movie.rating > 0"`
3. **Réactivité** : La note moyenne doit se mettre à jour automatiquement
4. **Formulaire** : Le champ rating doit être inclus dans toutes les opérations CRUD

### **CSS à vérifier :**
1. **Couleurs des étoiles** : `.star-filled { color: #ffc107; }`
2. **Responsive** : `@media (max-width: 768px)`
3. **Animations** : `.movie-card:hover .star-filled { transform: scale(1.1); }`

## ✅ Critères de validation finale

- [ ] **Fonctionnel** : Toutes les opérations CRUD incluent le rating
- [ ] **Visuel** : Étoiles dorées/grises avec bon contraste
- [ ] **UX** : Interface intuitive et responsive
- [ ] **Performance** : Calculs réactifs sans lag
- [ ] **Code** : Propre, commenté et maintenable

## 🚀 Test de performance

### **Avec 100+ films :**
1. Ajouter plusieurs films avec notes différentes
2. Modifier plusieurs notes rapidement
3. **Vérifier** :
   - Pas de lag dans l'interface
   - Calcul de moyenne instantané
   - Rendu fluide des étoiles

---

**🎯 Si tous ces tests passent, l'Exercice 1 est parfaitement implémenté !**
