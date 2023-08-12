<template>
    <div style="width: 100%; height: 100%">
        <apexchart v-if="grafico && grafico.data" type="area" height="350" width="100%" :options="grafico.data.chartOptions" :series="grafico.data.series"></apexchart>
    </div>
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
        data: () => ({
            grafico: {},
            util:util,
            loading:false,
        }),
        props: {
            loadingProp: Boolean,
            tipo:String,
        },
        mounted() {
            // 
        },
        methods: {
            ...mapActions({
                consulta: 'dashboard/consultarDatosPorDia',
            }),
            ...mapMutations({
                setInfo: 'setInfo',
                setError: 'setError',
            }),
            consultar(payload) {
                this.loading = true;
                payload.tipo = this.tipo;
                this.consulta(payload)
                    .then(result => {
                        var _payload = payload;
                        if(result && result.datos) {
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
                                                $this.descargar(_payload, 'datos_por_dia');
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
            descargar(_payload, grafica){
                this.comenzar();
                let payload = {..._payload};
                payload.usuario_email = this.userEmail;
                payload.download_tipo = 'csv';
                payload.grafica = grafica;
                console.log(payload)
                console.log(this.util.getUrlString(payload))
                let ruta = config.ROOT_API + "leads/descargar_dashboard?" + this.util.getUrlString(payload);
                let newWindow = window.open(ruta, '_blank');
                newWindow.focus();
                newWindow.onblur = function() { newWindow.close(); };
                this.terminar();
            },
            terminar() {
                this.loading = false;
                // this.loadingProp = false;
                this.$emit('terminar');
            },
            comenzar() {
                this.loading = true;
                // this.loadingProp = true;
                this.$emit('comenzar');
            }
    
        },
        computed:{
            ...mapState({
                user: state => state.auth.user_info,
            }),
            userEmail() {
                return this.user && this.user ? this.user.email : null
            },
            loadingComp() {
                return this.loadingProp
            }
        }
    };
</script>
    