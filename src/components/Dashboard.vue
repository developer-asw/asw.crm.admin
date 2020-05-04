<template>
<div>
    <v-toolbar flat light dense color="blue lighten-5">
        <!-- <v-toolbar-title>{{getTitle}}</v-toolbar-title> -->
        <v-spacer></v-spacer>
        <v-toolbar-items>
            <v-btn small color="info" dark @click="consultar">
                <v-icon>autorenew</v-icon>
            </v-btn>
        </v-toolbar-items>
    </v-toolbar>

    <v-container>
        <v-layout text-center wrap>

            <!-- multiple -->
            <v-expansion-panels  v-model="panels">
                <v-expansion-panel v-for="(data, key, index) in estadisticas" :key="index">
                    <v-expansion-panel-header dark color="indigo darken-5" flat :style="{'color':'white','font-weight':'900'}">
                        {{data.titulo}}

                    </v-expansion-panel-header>
                    <v-expansion-panel-content>
            <v-row>
                <template>
                    <v-container fluid>
                        <v-data-iterator
                        :items="data.datos"
                        :items-per-page.sync="itemsPerPage"
                        hide-default-footer>
                        

                        <template v-slot:default="props">
                            <v-row>
                            <v-col
                                v-for="item in props.items"
                                :key="item.value"
                                cols="12"
                                sm="6"
                                md="4"
                                lg="4">
                                <v-card v-if="item.tipo === 0">
                                    <v-card-title class="subheading font-weight-bold">{{ item.title }}</v-card-title>

                                    <v-divider></v-divider>


                                    <v-list dense>
                                        <v-list-item v-for="(v, k, i) in item.data" :key="i">
                                            <v-list-item-content>{{k}}:</v-list-item-content>
                                            <v-list-item-content :style="{'text-align':'right'}" class="align-end">{{ v }}</v-list-item-content>
                                        </v-list-item>
                                    </v-list>
                                </v-card>


                                <v-card
                                    class="mx-auto text-center"
                                    color="green"
                                    dark
                                    max-width="600" v-if="item.tipo === 1">
                                    <v-card-text>
                                        <v-sheet color="rgba(0, 0, 0, .12)">
                                            <v-sparkline
                                                :value="item.data.values"
                                                :labels="item.data.labels"
                                                color="white"
                                                line-width="2"
                                                padding="16">
                                            <template v-slot:label="item">
                                                {{ item.value }}
                                            </template>
                                            </v-sparkline>
                                        </v-sheet>
                                    </v-card-text>

                                    <v-card-text>
                                        <div class="display-1 font-weight-thin">
                                            {{item.title}}
                                        </div>
                                    </v-card-text>

                                    <!-- <v-divider></v-divider> -->

                                    <!-- <v-card-actions class="justify-center">
                                        <v-btn block text>Go to Report</v-btn>
                                    </v-card-actions> -->
                                </v-card>
                                
                                <v-card
                                    class="mx-auto text-center"
                                    max-width="600" v-if="item.tipo === 2">
                                    <v-card-text>
                                        <apexchart type="area" height="350" :options="item.data.chartOptions" :series="item.data.series"></apexchart>
                                    </v-card-text>

                                    <!-- <v-card-text>
                                        <div class="display-1 font-weight-thin">
                                            {{item.title}}
                                        </div>
                                    </v-card-text> -->
                                    

                                    <!-- <v-card-actions class="justify-center">
                                        <v-btn block text>Go to Report</v-btn>
                                    </v-card-actions> -->
                                </v-card>
                            </v-col>
                            </v-row>
                        </template>

                        <!-- <template v-slot:footer>
                            <v-toolbar
                            class="mt-2"
                            color="indigo"
                            dark
                            flat>
                            <v-toolbar-title class="subheading">This is a footer</v-toolbar-title>
                            </v-toolbar>
                        </template> -->
                        </v-data-iterator>
                    </v-container>
                </template>
            </v-row>

                        </v-expansion-panel-content>
                </v-expansion-panel>
            </v-expansion-panels>


            <!-- <v-row>
              <v-col offset-sm="2" offset="3" cols="6" sm="4">
                  <v-img aspect-ratio="1/2" src="https://www.americanschoolway.edu.co/wp-content/uploads/2019/10/acerca_asw_4.jpg">
                      <div class="fill-height bottom-gradient"></div>
                  </v-img>
              </v-col>
            </v-row> -->
        </v-layout>
    </v-container>
</div>

</template>

<script>

import { mapActions, mapMutations } from 'vuex';
import VueApexCharts from 'vue-apexcharts'

export default {
name: 'Dashboard',
    components: { 
        apexchart: VueApexCharts, 
    },
    data: () => ({
        estadisticas: [],
        panels: 0,
        // panels: [0],
        itemsPerPage:6,
    }),
    mounted() {
        this.consultar();
    },
    methods: {
        ...mapActions({
            consultarDashboard: 'leads/consultarDashboard',
        }),
        ...mapMutations({
            setInfo: 'setInfo',
            setError: 'setError',
        }),
        consultar() {
            this.loading = true;
            this.consultarDashboard({})
                .then(result => {
                    this.estadisticas = result.datos;
                    console.log(this.estadisticas)
                })
                .catch(error => {
                    console.log(error)
                    this.setError(error)
                }).finally(() => {
                    this.loading = false;
                })
        },
    }
};
</script>
