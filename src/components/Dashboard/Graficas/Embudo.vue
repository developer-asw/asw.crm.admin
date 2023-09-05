<template>
    <v-card>
        <v-card-title class="subheading font-weight-bold">{{datos.title}}</v-card-title>
        <v-divider></v-divider>

        <v-data-table
            :headers="[ { text: 'Titulo', align: 'start', value: 'title', }, { text: 'Total', align: 'start', value: 'value', }, { text: 'Porcentaje', align: 'start', value: 'percent', } ]"
            :items="datos.data"
            hide-default-header
            hide-default-footer
            class="elevation-1"
            dense>
            <template v-slot:[`item.percent`]="{ item }">
                {{ item.percent ? item.percent+'%':'' }}
            </template>
        </v-data-table>
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
            datos: [],
            loading:false,
            util:util
        }),
        mounted() {
            console.log("EMBUDO")
        },
        methods: {
            ...mapActions({
                consulta: 'dashboard/consultarDatosGeneral',
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
                        this.datos = result.datos;
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
    