<template>
  <v-card>
    <v-card-title>
      <span class="headline">{{getTitle}}</span>
    </v-card-title>
    <v-card-text>

      <v-container v-if="lead">
        <v-row>
          <v-tabs v-model="tab" background-color="indigo accent-4" class="elevation-2" dark :centered="centered"
            :grow="grow" :vertical="vertical" :right="right"
            :prev-icon="prevIcon ? 'mdi-arrow-left-bold-box-outline' : undefined"
            :next-icon="nextIcon ? 'mdi-arrow-right-bold-box-outline' : undefined" :icons-and-text="icons">
            <v-tabs-slider></v-tabs-slider>

            <v-tab :href="'#tab-1'">
              Información general
              <v-icon v-if="icons">mdi-phone</v-icon>
            </v-tab>
            <v-tab :href="'#tab-2'">
              Citas
              <v-icon v-if="icons">mdi-phone</v-icon>
            </v-tab>
            <v-tab :href="'#tab-3'">
              Hits
              <v-icon v-if="icons">mdi-phone</v-icon>
            </v-tab>
            <v-tab :href="'#tab-4'">
              Eventos
              <v-icon v-if="icons">mdi-phone</v-icon>
            </v-tab>

            <v-tab-item :value="'tab-1'">
              <v-card flat tile>
                <v-card-text>
                  <v-form>
                    <v-row>
                      <v-col cols="6" md="6" sm="12">
                        <v-text-field v-model="lead.full_name" label="Nombre" value="lead.full_name" required>
                        </v-text-field>
                      </v-col>
                      <v-col cols="6" md="6" sm="12">
                        <v-text-field v-model="lead.movil" label="Telefono" required>
                        </v-text-field>
                      </v-col>
                      <v-col cols="6" md="6" sm="12">
                        <v-text-field v-model="lead.origen" label="Origen" required>
                        </v-text-field>
                      </v-col>
                      <v-col cols="6" md="6" sm="12">
                        <v-text-field v-model="lead.agente_callcenter" label="Agente" required>
                        </v-text-field>
                      </v-col>
                      <v-col cols="6" md="6" sm="12">
                        <v-text-field v-model="lead.estrategia" label="Estrategia" required>
                        </v-text-field>
                      </v-col>
                    </v-row>
                  </v-form>
                </v-card-text>
              </v-card>
            </v-tab-item>
            <v-tab-item :value="'tab-2'">
              <v-card flat tile>
                <v-card-text>
                  <v-data-table :headers="headers" :items="lead.citas" :loading="loading" @item-expanded="expand"
                    show-expand loading-text="Loading... Please wait" class="elevation-1">
                  </v-data-table>
                </v-card-text>
              </v-card>
            </v-tab-item>
            <v-tab-item :value="'tab-3'">
              <v-card flat tile>
                <v-card-text>
                  <v-data-table :headers="headers" :items="lead.citas" :loading="loading" @item-expanded="expand"
                    show-expand loading-text="Loading... Please wait" class="elevation-1">
                  </v-data-table>
                </v-card-text>
              </v-card>
            </v-tab-item>
            <v-tab-item :value="'tab-4'">
              <v-card flat tile>
                <v-card-text>
                  <v-data-table :headers="headersEventos" :items="lead.eventos" :loading="loading" @item-expanded="expand"
                    show-expand loading-text="Loading... Please wait" class="elevation-1">
                  </v-data-table>
                </v-card-text>
              </v-card>
            </v-tab-item>
          </v-tabs>


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
  //import Vue from 'vue';

  export default {
    name: 'LeadsView',
    components: {},
    data() {
      return {
        leads: {
          full_name: null,
          movil: null,
        },
        headers: [

          {
            text: 'Sede',
            value: 'sede.nombre'
          },
          {
            text: 'Fecha',
            value: 'fecha'
          },
          {
            text: 'Hora',
            value: 'hora'
          },
          {
            text: 'Estado',
            value: 'estado'
          },
          {
            text: 'Observaciones',
            value: 'observaciones'
          },

        ],
        headersEventos: [

          
          {
            text: 'Fecha',
            value: 'fecha'
          },
          {
            text: 'Codigo',
            value: 'codigo'
          },
          {
            text: 'Agente',
            value: 'user_agent'
          },
          {
            text: 'Observaciones',
            value: 'observaciones'
          },

        ],
        procesando: false,
        tab: null,
        text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
        icons: false,
        centered: false,
        grow: false,
        vertical: false,
        prevIcon: false,
        nextIcon: false,
        right: false,
        tabs: 3,
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