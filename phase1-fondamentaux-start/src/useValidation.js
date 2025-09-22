import { ref, reactive, computed, watch } from 'vue'

export function useValidation(newMovie, availableCategories) {
    const validateTitle = () => {
        const errors = []
        
        if (!newMovie.title) {
          errors.push('Le titre est obligatoire')
        } else if (newMovie.title.length < 2) {
          errors.push('Le titre doit contenir au moins 2 caractères')
        } else if (newMovie.title.length > 100) {
          errors.push('Le titre ne peut pas dépasser 100 caractères')
        }
        
        validationErrors.title = errors
      }
    
    const validateYear = () => {
        const errors = []
        const currentYear = new Date().getFullYear()
        
        if (!newMovie.year) {
          errors.push('L\'année est obligatoire')
        } else if (newMovie.year < 1888) {
          errors.push('L\'année ne peut pas être antérieure à 1888 (premier film)')
        } else if (newMovie.year > currentYear + 5) {
          errors.push(`L'année ne peut pas dépasser ${currentYear + 5}`)
        }
        
        validationErrors.year = errors
      }
      
    const validateCategory = () => {
        const errors = []
        
        if (!newMovie.category) {
          errors.push('La catégorie est obligatoire')
        } else if (!availableCategories.includes(newMovie.category)) {
          errors.push('Catégorie non valide')
        }
        
        validationErrors.category = errors
      }
      
    const validateDescription = () => {
        const errors = []
        
        if (newMovie.description && newMovie.description.length > 500) {
          errors.push('La description ne peut pas dépasser 500 caractères')
        }
        
        validationErrors.description = errors
      }

      watch(() => newMovie.title, validateTitle)
      watch(() => newMovie.year, validateYear)
      watch(() => newMovie.category, validateCategory)
      watch(() => newMovie.description, validateDescription)
  
      const validateForm = () => {
        validateTitle()
        validateYear()
        validateCategory()
        validateDescription()
      }

    const validationErrors = reactive({
        title: [],
        category: [],
        year: [],
        description: []
      })

    const isFormValid = computed(() => {
        return Object.values(validationErrors).every(errors => errors.length === 0) &&
              newMovie.title && 
              newMovie.category && 
              newMovie.year
      })

    return { validationErrors, validateTitle, validateYear, validateCategory, validateDescription, validateForm, isFormValid  }
}
// il peut être possible d'unifier les validate??? en une seule fonction prenant en paramètre le champ à valider et les règles de validation