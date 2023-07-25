<template>
    <v-row>
        <v-col>            
            <v-row>
                <v-col >
                    Datos ingresados
                </v-col>
                <v-col>
                    <v-progress-linear
                        v-model="datos.ingresados.total"
                        color="amber"
                        height="25"
                        >
                        <template v-slot:default="{ value }">
                            <strong>{{ Math.ceil(value) }}</strong>
                        </template>
                    </v-progress-linear>
                </v-col>
                <v-col>
                    {{datos.ingresados.porcentaje}}%
                </v-col>
            </v-row>
            <v-row>
                <v-col>
                    Citas agendadas
                </v-col>
                <v-col>
                    <v-progress-linear
                        v-model="datos.citas_agendadas.porcentaje"
                        color="amber"
                        height="25"
                        >
                        <template v-slot:default="{ value }">
                            <strong>{{ Math.ceil(datos.citas_agendadas.total) }}</strong>
                        </template>
                    </v-progress-linear>
                </v-col>
                <v-col>
                    {{datos.citas_agendadas.porcentaje}}%
                </v-col>
            </v-row>
            <v-row>
                <v-col>
                    Citas asistidas
                </v-col>
                <v-col>
                    <v-progress-linear
                        v-model="datos.citas_asistidas.porcentaje"
                        color="amber"
                        height="25"
                        >
                        <template v-slot:default="{ value }">
                            <strong>{{ Math.ceil(datos.citas_asistidas.total) }}</strong>
                        </template>
                    </v-progress-linear>
                </v-col>
                <v-col>
                    {{datos.citas_asistidas.porcentaje}}%
                </v-col>
            </v-row>
            <v-row>
                <v-col>
                    Citas matriculadas
                </v-col>
                <v-col>
                    <v-progress-linear
                        v-model="datos.matriculas.porcentaje"
                        color="amber"
                        height="25"
                        >
                        <template v-slot:default="{ value }">
                            <strong>{{ Math.ceil(datos.matriculas.total) }}</strong>
                        </template>
                    </v-progress-linear>
                </v-col>
                <v-col>
                    {{datos.matriculas.porcentaje}}%
                </v-col>
            </v-row>

            <v-row>
                <v-col>
                    <v-simple-table dense>
                        <template v-slot:default>
                            <tbody>
                                <tr v-for="(item, index) in datos.llamadas" :key="index">
                                    <td class="text-left">{{ item.titulo }}</td>
                                    <td class="text-right">{{ item.total }}</td>
                                </tr>
                            </tbody>
                        </template>
                    </v-simple-table>
                </v-col>
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
            datos: {
                ingresados:{porcentaje:0,total:0},
                citas_agendadas:{porcentaje:0,total:0},
                citas_asistidas:{porcentaje:0,total:0},
                matriculas:{porcentaje:0,total:0},
                llamadas_dia:{porcentaje:0,total:0},
                llamadas_mes:{porcentaje:0,total:0},
                llamadas_promedio:{porcentaje:0,total:0}
            }
        }),
        mounted() {
            console.log("EMBUDO_CONTACTCENTER")
        },
        methods: {
            ...mapActions({
                consulta: 'dashboard/consultarDatosContactCenterPorFecha',
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
    