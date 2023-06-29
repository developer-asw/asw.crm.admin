<template>
    <v-card class="mx-auto text-center">
        <v-card-text>
            <apexchart type="area" height="350" :options="grafico.data.chartOptions" :series="grafico.data.series"></apexchart>
        </v-card-text>
    </v-card>
</template>
<script>
    import { mapState, mapActions, mapMutations } from 'vuex';
    import VueApexCharts from 'vue-apexcharts';
    import config from '@/modules/config';
    import util from "@/utility/util";
    
    export default {
    name: 'Dashboard',
        components: { 
            apexchart: VueApexCharts, 
        },
        props: {
            // estudiante: Object,
            fecha_inicio: String,
            fecha_final: String,
            sede: Array,
            tipo: Array
        },
        data: () => ({
            dates: [],
            grafico: null,
            loading:false,
            util:util
        }),
        mounted() {
            // this.consultar();
        },
        methods: {
            ...mapActions({
                consulta: 'dashboard/consultarDatosPorDia',
            }),
            ...mapMutations({
                setInfo: 'setInfo',
                setError: 'setError',
            }),
            consultar() {
                this.loading = true;
                this.payload = {desde: this.fecha_inicio, hasta: this.fecha_final, sede:this.sede, tipo: this.tipo};
                this.consulta(this.payload)
                    .then(result => {
                        if(result && result.datos) {
                            this.grafico = result.datos;
                            this.grafico = result.datos;
                            if (this.grafico.data && this.grafico.data.chartOptions && this.grafico.data.chartOptions.chart) {
                                this.grafico.data.chartOptions.chart = {selection: { enabled: true }};
                                var $this = this;
                                this.grafico.data.chartOptions.chart.toolbar= {
                                    tools: {
                                        download: false, // descargar csv datos dibujados
                                        selection: false,
                                        zoom: false,
                                        zoomin: false,
                                        zoomout: false,
                                        pan: false,
                                        reset: false | '<img src="/img/download-icon.png" width="20">',
                                        customIcons: [{
                                            icon: '<img src="/img/download-icon.png" width="20">',
                                            title: 'Descargar datos.',
                                            click: function () {
                                                $this.descargar('datos_por_dia');
                                            },
                                            appendTo: 'top' // left / top means the button will be appended to the left most or right most position
                                        }]
                                    }
                                };
                            }
                        }
                    })
                    .catch(error => { this.setError(error) }).finally(() => { this.loading = false; })    
            },
            
            descargar(grafica){
                this.loading = true
                let payload = {...this.payload};
                payload.usuario_email = this.userEmail;
                payload.download_tipo = 'csv';
                payload.grafica = grafica;
                
                let ruta = config.ROOT_API + "leads/descargar_dashboard?" + this.util.getUrlString(payload);
                let newWindow = window.open(ruta, '_blank');
                newWindow.focus();
                newWindow.onblur = function() { newWindow.close(); };
                this.loading = false
            }
    
        },
        computed:{
            ...mapState({
                user: state => state.auth.user_info,
            }),
            userEmail() {
                return this.user && this.user ? this.user.email : null
            }
        }
    };
</script>
    