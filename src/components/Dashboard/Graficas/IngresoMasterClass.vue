<template>
    <v-card
        class="mx-auto text-center"
        color="cyan"
        dark
        max-width="600">
        <v-card-text>
            <v-sheet color="rgba(0, 0, 0, .12)">
                <v-sparkline
                    :value="grafico.data.values"
                    :labels="grafico.data.labels"
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
                <small>{{grafico.title}}</small>
                <br>
                {{grafico.total}}
                <v-btn small colot="info" text @click="descargar('datos_masterclass')">
                    <v-icon>cloud_download</v-icon>
                </v-btn>
            </div>
        </v-card-text>
    </v-card>
</template>
<script>
    import { mapState, mapActions, mapMutations } from 'vuex';
    import config from '@/modules/config';
    import util from "@/utility/util";
    
    export default {
    name: 'Dashboard',
        components: { 
        },
        data: () => ({
            grafico: {data:{}},
            loading:false,
            util:util
        }),
        mounted() {
            console.log("INGRESO_MASTERCLASS")
        },
        methods: {
            ...mapActions({
                consulta: 'dashboard/consultarDatosMasterclass',
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
