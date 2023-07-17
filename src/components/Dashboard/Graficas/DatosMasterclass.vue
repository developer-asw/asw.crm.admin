<template>
    <div style="width: 100%; height: 100%">
        <apexchart v-if="grafico && grafico.data" type="bar" height="350" :options="grafico.data.barOptions" :series="grafico.data.series"></apexchart>
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
            loading:false,
            util:util
        }),
        mounted() {
            console.log("MASTERCLASS_MATRICULADOS_VS_CITA")
        },
        methods: {
            ...mapActions({
                consulta: 'dashboard/consultarOrigenesMasterclass',
            }),
            ...mapMutations({
                setInfo: 'setInfo',
                setError: 'setError',
            }),
            consultar(payload) {
                this.loading = true;
                this.consulta(payload)
                .then(result => {
                    if(result && result.datos) {
                        this.grafico = result.datos;
                        if (this.grafico.data && this.grafico.data.barOptions) {
                            var $this = this;
                            var _payload = payload;
                            if (!this.grafico.data.barOptions.chart) {
                                this.grafico.data.barOptions.chart = {selection: { enabled: true }};
                            }
                            this.grafico.data.barOptions.chart.toolbar= {
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
                                            $this.descargar(_payload, 'masterclass_vs_citas');
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
                this.loading = true
                let payload = {..._payload};
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
