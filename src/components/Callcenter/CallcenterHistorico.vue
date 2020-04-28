<template>
    <v-card>
        <v-card-title>
            <span class="headline">{{getTitle}} </span>
        </v-card-title>
        <v-card-text>
			<v-row v-if="lead">
				<v-col cols="12" md="12">
                    <span>{{lead.full_name}}</span><br>
                    <span>{{lead.uid}}</span><br>
                    <span>{{lead.email}}</span><br>
                    <span v-if="lead.sede_full">{{lead.sede_full.nombre}}</span>
				</v-col>
			</v-row>
            <v-row>
                <v-col cols="12">
                    <template>
                        <div>
                            <v-tabs
                                v-model="tab"
                                background-color="deep-purple accent-4"
                                class="elevation-2"
                                dark
                                :centered="centered"
                                :grow="grow"
                                :vertical="vertical"
                                :right="right"
                                :prev-icon="prevIcon ? 'mdi-arrow-left-bold-box-outline' : undefined"
                                :next-icon="nextIcon ? 'mdi-arrow-right-bold-box-outline' : undefined"
                                :icons-and-text="icons">
                                <v-tabs-slider></v-tabs-slider>

                                <v-tab v-for="tab in historicos"
                                    :key="tab.id"
                                    :href="`#tab-${tab.id}`">
                                    {{ tab.title }}
                                    <!-- <v-icon v-if="icons">mdi-phone</v-icon> -->
                                </v-tab>

                                <v-tab-item v-for="tab in historicos" :key="tab.id" :value="'tab-' + tab.id">
                                    <v-data-table 
                                        v-if="tab.data.length > 0"
                                        :headers="tab.header" 
                                        :items="tab.data" 
                                        :loading="loading" 
                                        loading-text="Loading... Please wait"
                                        class="elevation-1">
                                    </v-data-table>
                                    <p class="pt-3 pb-3 pl-3" v-else>No hay datos registrados</p>
                                </v-tab-item>


                                <!-- <v-tab :href="'#tab-llamadas'">
                                        Llamadas
                                    <v-icon v-if="icons">mdi-phone</v-icon>
                                </v-tab>

                                <v-tab :href="'#tab-hits'">
                                        Hits
                                    <v-icon v-if="icons">mdi-phone</v-icon>
                                </v-tab>

                                <v-tab-item :value="'tab-llamadas'">
                                    <v-card flat tile>
                                    <v-card-text>{{ text }}</v-card-text>
                                    </v-card>
                                </v-tab-item>
                                
                                <v-tab-item :value="'tab-hits'">
                                    <v-card flat tile>
                                    <v-card-text>{{ text }}</v-card-text>
                                    </v-card>
                                </v-tab-item> -->
                            </v-tabs>
                        </div>
                        </template>
                </v-col>
            </v-row>
        </v-card-text>
        <v-card-actions>
            <v-btn v-if="btnCerrar" color="red darken-1" text @click="cerrar">Cerrar</v-btn>            
        </v-card-actions>
    </v-card>
</template>
<script>
    import {mapState,mapGetters,mapActions,mapMutations} from 'vuex';

    export default {
        name: 'CallcenterHistorico',
        data: () => ({
            historicos: [],
            loading: false,
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

            menu: false,
            menu2: false,
            date: new Date().toISOString().substr(0, 10),
            time: null,
        }),

        props: {
            lead_id: String,
            btnCerrar: Boolean,
        },
        mounted() {
            // this.traerHistoricos();
        },
        methods: {
            ...mapActions({
                consultarHistoricos: 'leads/consultarHistoricos',
            }),
            ...mapMutations({
				setInfo: 'setInfo',
				setError: 'setError',
            }),
            cerrar() {
                this.$emit('cerrar');
            },
            traerHistoricos() {
                this.loading = true;
                this.consultarHistoricos({lead_id:this.lead_id})
                    .then(result => {
                        this.historicos = result.datos;
                        console.log(this.historicos);
                    })
                    .catch(error => {
                        console.log(error)
                        this.setError(error)
                    }).finally(() => {
                        this.loading = false;
                    })
            },
            formatDate(date) {
                if (!date) return null

                const [year, month, day] = date.split('-')
                return `${day}/${month}/${year}`
            },
            parseDate(date) {
                if (!date) return null

                const [month, day, year] = date.split('/')
                return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
            }

        },
        computed: {
            ...mapState({
                error: state => state.error,
            }),
            ...mapGetters({
                detalle: 'leads/getDetalle',
            }),
            getTitle() {
                return 'Historial de leads'
            },
            horas() {
                if (this.resolucion.fecha_cita) {
                    let fechaObj = this.fechas.find(element => {
                        if (element.id == this.resolucion.fecha_cita) {
                            return element
                        }
                    })
                    return fechaObj.franjas
                }
                return []
            },
            lead() {
                if(this.lead_id) {
                    this.traerHistoricos()
                }
                return this.detalle(this.lead_id);
            }
        }
    };
</script>