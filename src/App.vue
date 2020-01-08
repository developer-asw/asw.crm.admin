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
