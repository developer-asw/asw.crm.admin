<template>
  <v-container>
    <v-layout
      text-center
      wrap
    >
      

      <v-row>
        <v-flex mb-4>
          <h1 class="display-2 font-weight-bold mb-3">
            Dashboard
          </h1>          
        </v-flex>
      </v-row>

      <v-row>
      <v-col cols="8" class="text-center" style="text-aling: center;">
        <v-img src="https://www.americanschoolway.edu.co/wp-content/uploads/2019/10/acerca_asw_4.jpg">
          <div class="fill-height bottom-gradient"></div>
        </v-img>
      </v-col>
      </v-row>

      <!-- <v-row>
      <v-col offset-sm="2" offset="3" cols="6" sm="4">
        <v-img aspect-ratio="1/2" src="https://www.americanschoolway.edu.co/wp-content/uploads/2019/10/acerca_asw_4.jpg">
          <div class="fill-height bottom-gradient"></div>
        </v-img>
      </v-col>
      </v-row> -->

      
    </v-layout>
  </v-container>
</template>

<script>
export default {
  name: 'Dashboard',

  data: () => ({
    
  }),
};
</script>
