<template>
    <v-container>
        <v-layout text-center wrap>

            <!-- <v-row>
                <v-flex mb-4>
                    <h1 class="display-2 font-weight-bold mb-3">
                        Dashboard
                    </h1>
                </v-flex>
            </v-row> -->
            <!-- <v-row>
                <v-col cols="8" class="text-center" style="text-aling: center;">
                    <ul id="example-1">
                        <li v-for="item in lista" :key="item.value">
                            {{ item.title }} - {{ item.data }}
                        </li>
                    </ul>
                    <v-img src="https://www.americanschoolway.edu.co/wp-content/uploads/2019/10/acerca_asw_4.jpg">
                        <div class="fill-height bottom-gradient"></div>
                    </v-img>
                </v-col>
            </v-row> -->

            <v-row>
                <template>
                    <v-container fluid>
                        <v-data-iterator
                        :items="lista"
                        :items-per-page.sync="itemsPerPage"
                        hide-default-footer>
                        <template v-slot:header>
                            <v-toolbar
                            class="mb-2"
                            color="indigo darken-5"
                            dark
                            flat>
                            <v-toolbar-title>{{titulo}}</v-toolbar-title>
                            </v-toolbar>
                        </template>

                        <template v-slot:default="props">
                            <v-row>
                            <v-col
                                v-for="item in props.items"
                                :key="item.value"
                                cols="12"
                                sm="6"
                                md="4"
                                lg="4">
                                <v-card>
                                    <v-card-title class="subheading font-weight-bold">{{ item.title }}</v-card-title>

                                    <v-divider></v-divider>


                                    <v-list dense>
                                        <v-list-item v-for="(v, k, i) in item.data" :key="i">
                                            <v-list-item-content>{{k}}:</v-list-item-content>
                                            <v-list-item-content :style="{'text-align':'right'}" class="align-end">{{ v }}</v-list-item-content>
                                        </v-list-item>
                                    </v-list>
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

import { mapActions, mapMutations } from 'vuex';

export default {
name: 'Dashboard',

    data: () => ({
        lista: [],
        titulo: '',
        itemsPerPage:4
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
                    this.lista = result.datos;
                    this.titulo = result.titulo;
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
