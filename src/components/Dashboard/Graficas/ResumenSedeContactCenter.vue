<template>
    <v-row>
        <v-col>
            <v-row>
                <v-col>
                    
                </v-col>
                <v-col>
                    <h6>Citas asistidas por sede</h6>
                </v-col>
                <v-col>
                    <h6>Citas matriculadas por sede</h6>
                </v-col>
            </v-row>
            <v-row v-for="(item, index) in datos" :key="index">
                <v-col><small>{{item._id}}</small></v-col>
                <v-col><small>{{item.citas}}</small></v-col>
                <v-col><small>{{item.matriculas}}</small></v-col>
            </v-row>
        </v-col>
    </v-row>
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
            loading:false,
            util:util,
            datos: []
        }),
        mounted() {
            console.log("EMBUDO_RESUMEN_SEDES")
        },
        methods: {
            ...mapActions({
                consulta: 'dashboard/consultarResumenSedesContactCenterPorFecha',
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
    