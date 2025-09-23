import { reactive,watch } from "vue";

export function useValidateForm(newMovie,movies){


const validationErrors = reactive({
      title: [],
      category: [],
      year: [],
      description: []
    })


  const validateTitle = () => {
  const errors = []
  
  if (!newMovie.title) {
    errors.push('Le titre est obligatoire')
  } else if (newMovie.title.length < 2) {
    errors.push('Le titre doit contenir au moins 2 caractères')
  } else if (newMovie.title.length > 100) {
    errors.push('Le titre ne peut pas dépasser 100 caractères')
  }

  // Vérifier l'unicité (sauf en mode édition)
  const existingMovie = movies.value.find(movie => 
    movie.title.toLowerCase() === newMovie.title.toLowerCase()&&    
    (!isEditing.value || movie.id !==  editingMovie.value.id)
    
  )
  
  if (existingMovie) {
    errors.push('Un film avec ce titre existe déjà')
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

  const validateForm = () => {
  validateTitle()
  validateYear()
  validateCategory()
  validateDescription()
}
  //watcher
  watch(() => newMovie.title, validateTitle)
  watch(() => newMovie.year, validateYear)
  watch(() => newMovie.category, validateCategory)
  watch(() => newMovie.description, validateDescription)    
return{
            validateTitle,
            validateCategory,
            validateDescription,
            validateYear,
            validateForm,

            validationErrors

        }
}
