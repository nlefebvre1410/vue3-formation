<template>
          <!-- Recherche textuelle -->
      <div class="filter-section">
        <div class="filter-group search-group">
          <label for="search">Recherche</label>
          <div class="search-input-wrapper">
            <input
              id="search"
              v-model="filters.search"
              type="text"
              placeholder="Rechercher dans les titres et descriptions..."
              class="search-input"
            >
            <button 
              v-if="filters.search"
              @click="clearSearch"
              class="clear-search"
              type="button"
            >
              ✕
            </button>
          </div>
        </div>
      </div>

      <!-- Filtres principaux -->
      <div class="filter-section">
        <div class="filters-grid">
          <!-- Catégorie -->
          <div class="filter-group">
            <label for="category">Catégorie</label>
            <select id="category" v-model="filters.category">
              <option value="">Toutes les catégories</option>
              <option v-for="cat in categories" :key="cat" :value="cat">
                {{ cat }}
              </option>
            </select>
          </div>

          <!-- Année -->
          <div class="filter-group">
            <label>Année</label>
            <div class="year-range">
              <input
                v-model.number="filters.yearFrom"
                type="number"
                placeholder="De"
                min="1900"
                :max="currentYear"
              >
              <span>à</span>
              <input
                v-model.number="filters.yearTo"
                type="number"
                placeholder="À"
                min="1900"
                :max="currentYear"
              >
            </div>
          </div>

          <!-- Note minimale -->
          <div class="filter-group">
            <label for="minRating">Note minimale</label>
            <div class="rating-filter">
              <StarRating
                v-model="filters.minRating"
                :interactive="true"
                :show-label="true"
                :max-stars=5
              />
            </div>
          </div>

          <!-- Favoris -->
          <div class="filter-group">
            <label class="checkbox-label">
              <input
                v-model="filters.favoritesOnly"
                type="checkbox"
              >
              <span class="checkbox-text">Favoris uniquement</span>
            </label>
          </div>
        </div>
      </div>

      <!-- Tri -->
      <div class="filter-section">
        <div class="sort-controls">
          <div class="filter-group">
            <label for="sortBy">Trier par</label>
            <select id="sortBy" v-model="filters.sortBy">
              <option value="title">Titre</option>
              <option value="year">Année</option>
              <option value="rating">Note</option>
              <option value="category">Catégorie</option>
            </select>
          </div>

          <div class="filter-group">
            <label for="sortOrder">Ordre</label>
            <select id="sortOrder" v-model="filters.sortOrder">
              <option value="asc">Croissant</option>
              <option value="desc">Décroissant</option>
            </select>
          </div>
        </div>
      </div>
</template>

<script>
import { ref,reactive } from 'vue'
import StarRating from '../StarRating.vue'
export default{
name: 'FiltersSection',
  props: {
        categories: {
        type: Array,
        required: true
        },        
    initialFilters:{
      type:Object,
      required:false
    }

    },
    emits:['update:filters'],
    setup({emits}){

       const currentYear=ref(2025)
        const filters = reactive({
            search: '',
            category: '',
            yearFrom: null,
            yearTo: null,
            minRating: 0,
            favoritesOnly: false,
            sortBy: 'title', // 'title', 'year', 'rating', 'category'
            sortOrder: 'asc' // 'asc', 'desc'
        })


        return{
            filters,
            currentYear
        }
    },
    components:{
        StarRating
    }
    
}



</script>