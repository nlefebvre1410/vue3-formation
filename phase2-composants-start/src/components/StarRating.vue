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

<script>
import { computed,ref } from 'vue';

export default{
    
    name:'StartRating',
    props:{
        modelValue:{
            type:Number,
            default:0,
            validator:(value)=>value >=0 && value <=8
        },
        maxStars:{
            type:Number,
            default:8,
            validator:(value)=>value >0 && value <=10
        },
        interactive :{
            type:Boolean,
            default:true
        },
        showLabel: {
            type:Boolean,
            default:false
        },
        size:{
            type:String,
            default:'medium',
            validator:(value)=>['small', 'medium', 'large'].includes(value)
        }
    },
    emits:['update:modelValue'],
    setup(props,{emits}) {
        const currentRating =  computed(() => Math.round(!!props.modelValue/props.maxStars)/10)
        const hoveredRating= ref(0)
        const setRating= (rating)=>{
            
            Math.round(rating/props.maxStars )/10
            emits('update:modelValue',rating)
        }

        
        return{
            currentRating,
            setRating,
            hoveredRating
            
        }

    }


    }



</script>