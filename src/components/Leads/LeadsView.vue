<template>
  <v-card>
    <v-card-title>
      <span class="headline">{{getTitle}}</span>
    </v-card-title>
    <v-card-text>
      
      <v-container v-if="lead">
        <v-row>
          <v-col cols="12">
            <vue-json-pretty :path="'res'" :data="lead">
            </vue-json-pretty>
          </v-col>
        </v-row>
      </v-container>

    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn color="blue darken-1" text @click="cerrar">Cerrar</v-btn>

    </v-card-actions>

    <v-overlay :value="procesando">
      <v-progress-circular indeterminate size="64"></v-progress-circular>
    </v-overlay>
  </v-card>

</template>

<script>
  import {
    mapState,
    mapGetters,
    mapActions,
    mapMutations
  } from 'vuex';
  import VueJsonPretty from 'vue-json-pretty'
  //import Vue from 'vue';

  export default {
    name: 'LeadsView',
    components: {
      VueJsonPretty
    },
    data() {
      return {
        procesando: false,
      }
    },
    props: {
      lead_id: String,
    },

    mounted() {

    },
    methods: {
      ...mapActions({

      }),
      ...mapMutations({}),

      cerrar() {
        this.$emit('cerrar');
      },
      dirigir(value) {
        this.$router.push(value)
      },

    },
    computed: {
      ...mapState({

      }),
      ...mapGetters({
        detalle: 'leads/getDetalle',
      }),
      getTitle() {
        return 'Lead'
      },
      lead() {
        return this.detalle(this.lead_id)
      }

    }
  }
</script>