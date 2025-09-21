# 🎯 EXERCICES PRATIQUES - Phase 1 : Fondamentaux Vue.js 3

## 📚 Introduction

Ces **4 exercices pratiques** vous permettront d'approfondir les concepts fondamentaux de Vue.js 3 en enrichissant progressivement l'application d'annuaire de films.

Chaque exercice se base sur le précédent et introduit de nouveaux concepts tout en renforçant les acquis.

## 🚀 Prérequis

- Application de base fonctionnelle (`pnpm dev` sur port 3001)
- Compréhension des concepts de base Vue.js 3
- Connaissance de JavaScript ES6+

## 📋 Liste des exercices

### **⭐ Exercice 1 : Système de notes** (30-45 min)
**Fichier** : `EXERCICE-1-Notes.md`

**Objectif** : Ajouter un système de notation 1-5 étoiles aux films

**Concepts travaillés** :
- Modification de structure de données
- Propriétés calculées (`computed`)
- Rendu conditionnel (`v-if`)
- Boucles avec conditions (`v-for`)
- Styles dynamiques

**Résultat attendu** :
- Champ de sélection de note dans le formulaire
- Affichage d'étoiles dans les cartes de films
- Calcul et affichage de la note moyenne

---

### **📊 Exercice 2 : Système de tri** (45-60 min)
**Fichier** : `EXERCICE-2-Tri.md`

**Objectif** : Implémenter un tri des films par titre, année ou note

**Concepts travaillés** :
- Computed properties avancées
- Manipulation d'arrays (sort, clonage)
- Gestion d'état d'interface
- Interface utilisateur dynamique

**Résultat attendu** :
- Interface de sélection de tri
- Tri fonctionnel par différents critères
- Indicateurs visuels du tri actif
- Gestion des directions (croissant/décroissant)

---

### **❤️ Exercice 3 : Système de favoris** (30-45 min)
**Fichier** : `EXERCICE-3-Favoris.md`

**Objectif** : Ajouter un système de films favoris avec bouton cœur

**Concepts travaillés** :
- Gestion d'événements (`@click`)
- Modification d'état réactif
- Filtrage de données
- Feedback utilisateur
- Styles conditionnels

**Résultat attendu** :
- Bouton cœur sur chaque film
- Filtre pour afficher favoris/non-favoris
- Statistique du nombre de favoris
- Indicateurs visuels des favoris

---

### **✅ Exercice 4 : Validation avancée** (60-90 min)
**Fichier** : `EXERCICE-4-Validation.md`

**Objectif** : Améliorer la validation du formulaire avec des règles métier

**Concepts travaillés** :
- Watchers (`watch`)
- Validation en temps réel
- Gestion d'erreurs complexe
- UX de formulaire avancée
- État de formulaire réactif

**Résultat attendu** :
- Validation en temps réel pendant la saisie
- Messages d'erreur contextuels
- Vérification de règles métier (unicité, limites)
- Bouton désactivé si formulaire invalide

## 🎯 Progression recommandée

### **Étape 1 : Lecture et compréhension**
1. Lire entièrement le fichier de l'exercice
2. Comprendre l'objectif et le résultat attendu
3. Identifier les concepts Vue.js impliqués

### **Étape 2 : Planification**
1. Décomposer l'exercice en petites étapes
2. Identifier les modifications nécessaires
3. Préparer les données de test

### **Étape 3 : Implémentation**
1. Suivre les étapes détaillées du guide
2. Tester chaque modification avant de continuer
3. Vérifier le bon fonctionnement

### **Étape 4 : Validation**
1. Vérifier tous les critères de réussite
2. Tester les cas limites
3. S'assurer de la cohérence avec l'existant

### **Étape 5 : Amélioration (optionnel)**
1. Implémenter les bonus suggérés
2. Améliorer l'interface utilisateur
3. Optimiser le code

## 💡 Conseils généraux

### **🔧 Développement**
- **Sauvegardez régulièrement** votre travail
- **Testez fréquemment** dans le navigateur
- **Utilisez les DevTools** Vue.js pour debugger
- **Consultez la console** pour les erreurs

### **🎨 Interface utilisateur**
- Gardez une **cohérence visuelle** avec l'existant
- Pensez à l'**expérience utilisateur**
- Ajoutez des **transitions** pour fluidifier
- Testez sur **différentes tailles d'écran**

### **📝 Code**
- Écrivez du code **lisible et commenté**
- Respectez les **conventions Vue.js**
- Utilisez les **bonnes pratiques** de la Composition API
- **Factorisez** le code répétitif

### **🐛 Debugging**
- Utilisez `console.log()` pour tracer l'exécution
- Vérifiez la **réactivité** des données
- Contrôlez les **types de données**
- Testez les **cas d'erreur**

## 🆘 Aide et ressources

### **En cas de blocage**
1. **Relire** les consignes attentivement
2. **Vérifier** la console pour les erreurs
3. **Tester** avec des données simples
4. **Demander de l'aide** au formateur
5. **Consulter** la documentation Vue.js

### **Ressources utiles**
- [Documentation Vue.js 3](https://vuejs.org/)
- [Guide Composition API](https://vuejs.org/guide/extras/composition-api-faq.html)
- [DevTools Vue.js](https://devtools.vuejs.org/)
- [MDN JavaScript](https://developer.mozilla.org/fr/docs/Web/JavaScript)

## ✅ Auto-évaluation

Après chaque exercice, posez-vous ces questions :

### **Fonctionnel**
- [ ] L'exercice fonctionne-t-il comme attendu ?
- [ ] Tous les critères de réussite sont-ils remplis ?
- [ ] L'interface est-elle intuitive ?

### **Technique**
- [ ] Le code est-il propre et lisible ?
- [ ] Les concepts Vue.js sont-ils bien utilisés ?
- [ ] Y a-t-il des erreurs dans la console ?

### **Compréhension**
- [ ] Ai-je compris les concepts travaillés ?
- [ ] Puis-je expliquer mon code à quelqu'un ?
- [ ] Suis-je capable de faire des variantes ?

## 🎉 Félicitations !

Une fois les 4 exercices terminés, vous maîtriserez :

- ✅ **Réactivité avancée** avec ref, reactive, computed
- ✅ **Gestion d'événements** et interactions utilisateur
- ✅ **Manipulation de données** et calculs automatiques
- ✅ **Interface utilisateur** dynamique et responsive
- ✅ **Validation** et gestion d'erreurs
- ✅ **Bonnes pratiques** Vue.js 3

Vous serez alors prêt(e) pour la **Phase 2 : Composants** ! 🚀

## 📞 Support

N'hésitez pas à :
- Poser des questions pendant la formation
- Expérimenter au-delà des exercices
- Partager vos découvertes avec le groupe
- Demander des clarifications sur les concepts

**Bon apprentissage ! 🎓**
