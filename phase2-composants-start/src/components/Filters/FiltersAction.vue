<template>
    <div class="filter-actions">
        <button @click="resetFilters" class="btn btn-secondary">
          🔄 Réinitialiser
        </button>
        <button @click="toggleAdvanced" class="btn btn-outline">
          {{ showAdvanced ? 'Masquer' : 'Afficher' }} les options avancées
        </button>
      </div>
</template>

<script>

import { ref } from 'vue';
export default{

    name:"filterAction",
    
    emits:['reset'],

    setup({emits}){
        
         const resetFilters = ()=>{
            emits('reset')
        }
        const showAdvanced=ref(false);
        const toggleAdvanced=()=>{
            this.showAdvanced=!this.showAdvanced
        }

        return{
            resetFilters,
            toggleAdvanced,
            showAdvanced
        }
    }

}
</script>