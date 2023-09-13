<template>
    <v-layout text-center wrap>
        <v-container>
            <v-row>
                <v-col cols="12" sm="5" md="4">
                    <v-select v-model="sede" :items="sedes" label="Sede" item-text="nombre" item-value="id" :disabled="loading"
                    multiple chips>
                    </v-select>
                </v-col>
                
                <v-col cols="12" sm="5" md="6">
                    <v-container>
                        <v-menu ref="menu1" :close-on-content-click="false" transition="scale-transition" offset-y :value="shown" max-width="auto">
                            <template v-slot:activator="{ on, attrs }">
                                <v-text-field
                                    v-model="dateRangeText"
                                    label="Rango de fecha"
                                    prepend-icon="mdi-calendar"
                                    readonly
                                    v-bind="attrs"
                                    v-on="on">
                                </v-text-field>
                            </template>
                            <v-icon @click="closemenu">
                                close
                            </v-icon>
                            <v-date-picker v-model="dates" no-title range @input="menu1 = false">
                                
                            </v-date-picker>
                        </v-menu>
                    </v-container>
                </v-col>
                <v-col cols="12" sm="2" md="1">
                    <v-btn class="ma-2" color="primary darken-1" text @click="consultar"><v-icon left small>refresh</v-icon></v-btn>
                </v-col>
            </v-row>

            <v-row v-bind:style="{ 'border-left': showBorderLeft ? '2px solid #000' : 'none' }" style="border-left: 2px solid #000;">
                <v-col>
                    {{ tipo }}
                </v-col>
                <v-col cols="12" class="mt-4 mb-4">
                    
                    <!-- <v-row>
                        <EmbudoContactCenter ref="embudoContactCenter" :tipo="tipo" :loadingProp="loadingProp" @comenzar="comenzarLoading" @terminar="terminarLoading"></EmbudoContactCenter>
                    </v-row> -->
                    
                    <v-row class="mt-4">
                        <EmbudoIngresadosContactCenter ref="embudoIngresadosContactCenter" :tipo="tipo" :loadingProp="loadingProp" @comenzar="comenzarLoading" @terminar="terminarLoading"></EmbudoIngresadosContactCenter>
                    </v-row>

                </v-col>
                <v-col cols="12" class="mt-4 pb-4">
                    <v-row>
                        <v-col>
                            <IngresoPorDia ref="ingresoPorDia" :tipo="tipo" :loadingProp="loadingProp" @comenzar="comenzarLoading" @terminar="terminarLoading"></IngresoPorDia>
                        </v-col>
                    </v-row>
                </v-col>
                <v-col cols="12" class="mt-4 mb-4">
                    <v-row>
                        <ResumenSedeContactCenter ref="resumenSedeContactCenter" :tipo="tipo" :loadingProp="loadingProp" @comenzar="comenzarLoading" @terminar="terminarLoading"></ResumenSedeContactCenter>
                    </v-row>
                </v-col>
                
            </v-row>
        </v-container>
    </v-layout>
</template>
<script>
    import IngresoPorDia from '@/components/Dashboard/Graficas/IngresoPorDia';
    // import EmbudoContactCenter from '@/components/Dashboard/Graficas/EmbudoContactCenter';
    import EmbudoIngresadosContactCenter from '@/components/Dashboard/Graficas/EmbudoIngresadosContactCenter';
    import ResumenSedeContactCenter from '@/components/Dashboard/Graficas/ResumenSedeContactCenter';
    import { mapState, mapActions, mapMutations } from 'vuex';
    
    export default {
    name: 'General',
        components: { 
            IngresoPorDia,
            // EmbudoContactCenter,
            EmbudoIngresadosContactCenter,
            ResumenSedeContactCenter
        },
        data: () => ({
            opciones:[],
            opcion:null,
            dates: [],
            menu1: false,
            shown: false,
            sedes:[],
            sede:null,
            loading:false,
            payload:{}
        }),
        mounted() {
            this.setDates();
            this.traerSedes();
        },
        props: {
            tipo: String,
            showBorderLeftProp: Boolean
        },
        methods: {
            ...mapActions({
                listarSedes: 'sedes/fetchLista',
            }),
            ...mapMutations({
                setInfo: 'setInfo',
                setError: 'setError',
            }),
            actualizar() {
                this.consultarComponentes('ingresoPorDia', new Date());
                // this.consultarComponentes('embudoContactCenter', new Date());
                this.consultarComponentes('embudoIngresadosContactCenter', new Date());
                this.consultarComponentes('resumenSedeContactCenter', new Date());
            },
            consultar() {
                this.payload = {desde: this.dates[0], hasta: this.dates[1], sede:this.sede, tipo: this.tipo};
                this.actualizar();
            },
            setDates() {
                this.dates[0] = this.$moment().format('YYYY-MM-01');
                this.dates[1] = this.$moment().format('YYYY-MM-DD');
            },
            closemenu() {
                this.shown = false;
            },

            traerSedes() {
                this.listarSedes()
                .then(result => {
                    this.sedes = result;
                })
                .catch(error => {
                    console.error(error)
                }).finally(() => {
    
                });
            },
            terminar() {
                this.loading = false;
                this.loadingProp = false;
                this.$emit('terminar');
            },
            comenzar() {
                this.loading = true;
                this.loadingProp = true;
                this.$emit('comenzar');
            },
            consultarComponentes(componente, comienza) {
                if (this.$refs[componente] && typeof this.$refs[componente].consultar === "function") {
                    this.$refs[componente].consultar(this.payload);
                } else if(((new Date()).getTime() - comienza.getTime()) / 1000 / 60 > 1) {
                    // CLEAR
                } else {
                    console.log((new Date()).getTime() - comienza.getTime());
                    setTimeout(() => {
                        this.consultarComponentes(componente, comienza);
                    }, 200);
                }
            },
            comenzarLoading() {
                this.loading = true;
            },
            terminarLoading() {
                this.loading = false;  
            }
        },
        computed:{
            ...mapState({
                user: state => state.auth.user_info,
            }),
            dateRangeText () {
                return this.dates.map(x => this.$moment(x).format("DD/MM/YYYY")).join(' ~ ')
            },
            loadingProp() {
                return this.loading;
            },
            showBorderLeft(){
                return this.showBorderLeftProp;
            },
        },
        watch: {
          selected () {
            this.search = ''
          },
        }
    };
</script>
    