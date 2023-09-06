<template>
  <div>  
      <div v-if="$route.meta.view == 'baseline'"> 
        <Baseline/>
      </div>
      <div v-else-if="$route.meta.view == 'clear'"> 
        <Clear/>
      </div>
      <div v-else> 
        <Baseline/>
      </div>
  </div>
</template>

<script>

import Baseline from './views/Baseline'
import Clear from './views/Clear'

export default {
  name: 'App',
  components: {
    Baseline,
    Clear

  },
  data () {
    return {
      //
    }
  }
  ,
}
</script>

<style>
::-webkit-scrollbar {
  width: 8px;
}

/* Track */
::-webkit-scrollbar-track {
  background: #f1f1f1; 
}
 
/* Handle */
::-webkit-scrollbar-thumb {
  background: #888; 
}

/* Handle on hover */
::-webkit-scrollbar-thumb:hover {
  background: #555; 
}
</style>
