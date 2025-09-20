<template>
  <div class="container">
    <div class="not-found">
      <h1>404</h1>
      <h2>Page non trouvée</h2>
      <p>Désolé, la page que vous recherchez n'existe pas.</p>
      <div class="not-found-actions">
        <router-link to="/" class="btn">
          🏠 Retour à l'accueil
        </router-link>
        <router-link to="/movies" class="btn btn-outline">
          🎬 Voir les films
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'NotFound'
}
</script>

<style scoped>
.not-found {
  text-align: center;
  padding: 4rem 0;
}

.not-found h1 {
  font-size: 6rem;
  color: #667eea;
  margin-bottom: 1rem;
  font-weight: 700;
}

.not-found h2 {
  font-size: 2rem;
  margin-bottom: 1rem;
  color: #333;
}

.not-found p {
  font-size: 1.2rem;
  color: #666;
  margin-bottom: 2rem;
  max-width: 500px;
  margin-left: auto;
  margin-right: auto;
}

.not-found-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}

@media (max-width: 768px) {
  .not-found h1 {
    font-size: 4rem;
  }
  
  .not-found h2 {
    font-size: 1.5rem;
  }
  
  .not-found-actions {
    flex-direction: column;
    align-items: center;
  }
}
</style>
