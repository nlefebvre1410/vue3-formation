<template>
  <div class="container">
    <div class="about-hero">
      <h1>📚 À propos de cette application</h1>
      <p>Découvrez les technologies et concepts utilisés dans ce projet de formation Vue.js 3</p>
    </div>

    <div class="about-content">
      <!-- Technologies utilisées -->
      <div class="card">
        <h2>🛠️ Technologies utilisées</h2>
        <div class="tech-grid">
          <div class="tech-item">
            <div class="tech-icon">⚡</div>
            <h3>Vue.js 3</h3>
            <p>Framework JavaScript progressif avec Composition API</p>
          </div>
          <div class="tech-item">
            <div class="tech-icon">🏪</div>
            <h3>Pinia</h3>
            <p>Store officiel pour la gestion d'état dans Vue.js</p>
          </div>
          <div class="tech-item">
            <div class="tech-icon">🛣️</div>
            <h3>Vue Router</h3>
            <p>Routeur officiel pour les applications Vue.js</p>
          </div>
          <div class="tech-item">
            <div class="tech-icon">⚡</div>
            <h3>Vite</h3>
            <p>Build tool moderne et rapide pour le développement</p>
          </div>
        </div>
      </div>

      <!-- Concepts Vue.js abordés -->
      <div class="card">
        <h2>🎓 Concepts Vue.js 3 abordés</h2>
        <div class="concepts-grid">
          <div class="concept-section">
            <h3>🏗️ Fondamentaux</h3>
            <ul>
              <li>Composition API</li>
              <li>Réactivité avec ref() et reactive()</li>
              <li>Propriétés calculées (computed)</li>
              <li>Watchers et lifecycle hooks</li>
              <li>Directives (v-model, v-for, v-if)</li>
            </ul>
          </div>
          
          <div class="concept-section">
            <h3>🧩 Composants</h3>
            <ul>
              <li>Single File Components (.vue)</li>
              <li>Props et validation</li>
              <li>Événements personnalisés (emits)</li>
              <li>Slots et provide/inject</li>
              <li>Styles scopés</li>
            </ul>
          </div>
          
          <div class="concept-section">
            <h3>🔄 Réutilisabilité</h3>
            <ul>
              <li>Composables personnalisés</li>
              <li>Store Pinia</li>
              <li>Navigation avec Vue Router</li>
              <li>Gestion d'état globale</li>
              <li>Persistence avec localStorage</li>
            </ul>
          </div>
          
          <div class="concept-section">
            <h3>🎨 UX/UI</h3>
            <ul>
              <li>Transitions et animations CSS</li>
              <li>Design responsive</li>
              <li>Messages de feedback</li>
              <li>Loading states</li>
              <li>Navigation intuitive</li>
            </ul>
          </div>
        </div>
      </div>

      <!-- Fonctionnalités de l'application -->
      <div class="card">
        <h2>✨ Fonctionnalités de l'application</h2>
        <div class="features-grid">
          <div class="feature-item">
            <div class="feature-icon">🎬</div>
            <h3>Gestion de films</h3>
            <p>Ajout, modification et suppression de films avec validation</p>
          </div>
          <div class="feature-item">
            <div class="feature-icon">🔍</div>
            <h3>Recherche avancée</h3>
            <p>Filtrage par titre, catégorie, année et note avec debounce</p>
          </div>
          <div class="feature-item">
            <div class="feature-icon">❤️</div>
            <h3>Système de favoris</h3>
            <p>Marquer des films comme favoris avec page dédiée</p>
          </div>
          <div class="feature-item">
            <div class="feature-icon">⭐</div>
            <h3>Notation</h3>
            <p>Système de notation 1-5 étoiles avec moyenne</p>
          </div>
          <div class="feature-item">
            <div class="feature-icon">📊</div>
            <h3>Statistiques</h3>
            <p>Tableaux de bord avec métriques en temps réel</p>
          </div>
          <div class="feature-item">
            <div class="feature-icon">🎨</div>
            <h3>Interface moderne</h3>
            <p>Design responsive avec animations fluides</p>
          </div>
        </div>
      </div>

      <!-- Architecture du projet -->
      <div class="card">
        <h2>🏛️ Architecture du projet</h2>
        <div class="architecture">
          <div class="arch-section">
            <h3>📁 Structure des dossiers</h3>
            <pre class="code-block"><code>src/
├── components/     # Composants réutilisables
├── views/         # Pages de l'application
├── stores/        # Stores Pinia
├── composables/   # Logique réutilisable
├── router/        # Configuration du routeur
└── assets/        # Styles et ressources</code></pre>
          </div>
          
          <div class="arch-section">
            <h3>🔄 Flux de données</h3>
            <div class="data-flow">
              <div class="flow-item">
                <strong>Store Pinia</strong>
                <p>État global centralisé</p>
              </div>
              <div class="flow-arrow">→</div>
              <div class="flow-item">
                <strong>Composables</strong>
                <p>Logique métier réutilisable</p>
              </div>
              <div class="flow-arrow">→</div>
              <div class="flow-item">
                <strong>Composants</strong>
                <p>Interface utilisateur</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Progression pédagogique -->
      <div class="card">
        <h2>📈 Progression pédagogique</h2>
        <div class="progression">
          <div class="phase">
            <div class="phase-number">1</div>
            <div class="phase-content">
              <h3>Phase 1 : Fondamentaux</h3>
              <p>Application simple avec Vue.js 3, réactivité de base et directives essentielles</p>
            </div>
          </div>
          
          <div class="phase">
            <div class="phase-number">2</div>
            <div class="phase-content">
              <h3>Phase 2 : Composants</h3>
              <p>Architecture modulaire avec composants réutilisables et communication parent-enfant</p>
            </div>
          </div>
          
          <div class="phase">
            <div class="phase-number">3</div>
            <div class="phase-content">
              <h3>Phase 3 : Avancé</h3>
              <p>Composables, Pinia, Vue Router et fonctionnalités complètes d'une SPA moderne</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Liens utiles -->
      <div class="card">
        <h2>🔗 Ressources et liens utiles</h2>
        <div class="links-grid">
          <a href="https://vuejs.org/" target="_blank" class="link-item">
            <h3>📖 Documentation Vue.js</h3>
            <p>Guide officiel et API reference</p>
          </a>
          <a href="https://pinia.vuejs.org/" target="_blank" class="link-item">
            <h3>🏪 Documentation Pinia</h3>
            <p>Store officiel pour Vue.js</p>
          </a>
          <a href="https://router.vuejs.org/" target="_blank" class="link-item">
            <h3>🛣️ Vue Router</h3>
            <p>Routeur officiel pour Vue.js</p>
          </a>
          <a href="https://vitejs.dev/" target="_blank" class="link-item">
            <h3>⚡ Vite</h3>
            <p>Build tool moderne</p>
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// Pas de logique nécessaire pour cette page statique
</script>

<style scoped>
.about-hero {
  text-align: center;
  margin-bottom: 3rem;
}

.about-hero h1 {
  font-size: 2.5rem;
  color: #333;
  margin-bottom: 1rem;
}

.about-hero p {
  font-size: 1.2rem;
  color: #666;
  max-width: 600px;
  margin: 0 auto;
}

.about-content {
  max-width: 1000px;
  margin: 0 auto;
}

.tech-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-top: 1rem;
}

.tech-item {
  text-align: center;
  padding: 1.5rem;
  background: #f8f9fa;
  border-radius: 8px;
  transition: transform 0.2s ease;
}

.tech-item:hover {
  transform: translateY(-2px);
}

.tech-icon {
  font-size: 2.5rem;
  margin-bottom: 1rem;
}

.tech-item h3 {
  color: #333;
  margin-bottom: 0.5rem;
}

.tech-item p {
  color: #666;
  font-size: 0.95rem;
}

.concepts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-top: 1rem;
}

.concept-section {
  background: #f8f9fa;
  padding: 1.5rem;
  border-radius: 8px;
}

.concept-section h3 {
  color: #667eea;
  margin-bottom: 1rem;
  font-size: 1.2rem;
}

.concept-section ul {
  list-style: none;
  padding: 0;
}

.concept-section li {
  padding: 0.5rem 0;
  color: #555;
  position: relative;
  padding-left: 1.5rem;
}

.concept-section li::before {
  content: '✓';
  position: absolute;
  left: 0;
  color: #28a745;
  font-weight: bold;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-top: 1rem;
}

.feature-item {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  padding: 1.5rem;
  background: #f8f9fa;
  border-radius: 8px;
}

.feature-icon {
  font-size: 2rem;
  flex-shrink: 0;
}

.feature-item h3 {
  color: #333;
  margin-bottom: 0.5rem;
}

.feature-item p {
  color: #666;
  font-size: 0.95rem;
}

.architecture {
  display: grid;
  gap: 2rem;
  margin-top: 1rem;
}

.arch-section h3 {
  color: #667eea;
  margin-bottom: 1rem;
}

.code-block {
  background: #2d3748;
  color: #e2e8f0;
  padding: 1.5rem;
  border-radius: 8px;
  overflow-x: auto;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 0.9rem;
  line-height: 1.5;
}

.data-flow {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
  justify-content: center;
}

.flow-item {
  background: #667eea;
  color: white;
  padding: 1rem 1.5rem;
  border-radius: 8px;
  text-align: center;
  min-width: 150px;
}

.flow-item strong {
  display: block;
  margin-bottom: 0.5rem;
}

.flow-item p {
  font-size: 0.9rem;
  opacity: 0.9;
}

.flow-arrow {
  font-size: 1.5rem;
  color: #667eea;
  font-weight: bold;
}

.progression {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  margin-top: 1rem;
}

.phase {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  padding: 1.5rem;
  background: #f8f9fa;
  border-radius: 8px;
}

.phase-number {
  background: #667eea;
  color: white;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  font-weight: bold;
  flex-shrink: 0;
}

.phase-content h3 {
  color: #333;
  margin-bottom: 0.5rem;
}

.phase-content p {
  color: #666;
}

.links-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
}

.link-item {
  display: block;
  padding: 1.5rem;
  background: #f8f9fa;
  border-radius: 8px;
  text-decoration: none;
  color: inherit;
  transition: all 0.2s ease;
  border: 2px solid transparent;
}

.link-item:hover {
  background: #667eea;
  color: white;
  transform: translateY(-2px);
  border-color: #667eea;
}

.link-item h3 {
  margin-bottom: 0.5rem;
  color: inherit;
}

.link-item p {
  font-size: 0.95rem;
  opacity: 0.8;
}

@media (max-width: 768px) {
  .about-hero h1 {
    font-size: 2rem;
  }
  
  .tech-grid,
  .concepts-grid,
  .features-grid,
  .links-grid {
    grid-template-columns: 1fr;
  }
  
  .data-flow {
    flex-direction: column;
  }
  
  .flow-arrow {
    transform: rotate(90deg);
  }
  
  .phase {
    flex-direction: column;
    text-align: center;
  }
  
  .feature-item {
    flex-direction: column;
    text-align: center;
  }
}
</style>
