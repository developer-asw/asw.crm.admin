<template>
    <v-col>
        <v-row>
            <v-col>                
                <v-simple-table dense>
                    <template v-slot:default>
                        <thead>
                            <tr>
                                <th class="text-left">
                                    Sede
                                </th>
                                <th class="text-left">
                                    Citas asistidas
                                </th>
                                <th class="text-left">
                                    Citas matriculadas
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(item, index) in datos" :key="index">
                                <td class="text-left">{{ item.sede }}</td>
                                <td class="text-right">{{ item.citas }}</td>
                                <td class="text-right">{{ item.matriculas }}</td>
                            </tr>
                        </tbody>
                    </template>
                </v-simple-table>
            </v-col>
        </v-row>
    </v-col>
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
    