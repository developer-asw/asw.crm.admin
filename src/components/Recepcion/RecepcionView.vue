<template>
    <div>
        <v-card>
            <!-- <v-card-title>
                <span class="headline">{{getTitle}}</span>
                
            </v-card-title> -->
            <v-card-text>
                <v-row>
                    <v-col cols="12" sm="3" md="2"></v-col>
                    <v-col cols="12" sm="6" md="8">
                        <LeadInfoView :key="lead_id" :lead_id="lead_id" :setSedes="sedes"></LeadInfoView>
                    </v-col>
                </v-row>

                <v-row>
                    <v-col cols="12" sm="3" md="2"></v-col>

                    <v-col cols="12" sm="6" md="8">
                        <v-select v-model="sede" :items="sedes" label="Sede" item-text="text" item-value="id"></v-select>
                        <v-spacer></v-spacer>
                        <div class="text-right">
                            <v-btn v-if="setAsisteCita == true" class="ma-2" color="red darken-1" text @click="iniciarSolicitar"><v-icon left small>event</v-icon>&nbsp;Asiste a Cita&nbsp;</v-btn>
                            <v-btn class="ma-2" color="orange darken-1" text :to="{ name: 'seguimiento_edit', params: { id: lead_id } }"><v-icon left small>edit</v-icon>&nbsp;Editar&nbsp;</v-btn>
                            <v-btn class="ma-2" color="blue darken-1" text @click="regresar"><v-icon>navigate_before</v-icon>&nbsp;Regresar&nbsp;</v-btn>
                        </div>
                    </v-col>
                     <!-- <v-card-actions>  -->

                     <!-- </v-card-actions>   -->
                </v-row>
                
                <v-row class="mt-10">
                    <v-col cols="12" sm="3" md="2"></v-col>
                    <v-col cols="12" sm="6" md="8">
                        <LeadHistoricView :key="lead_id" :lead_id="lead_id"  :ver_detalles="true"></LeadHistoricView>
                    </v-col>
                </v-row>
            </v-card-text>
        </v-card>
        <v-dialog v-model="dialog" persistent max-width="800px">
            <RecepcionRegistrarAsistencia :lead_id="lead_id" :sede_id="sede"  @cerrar="cerrarDialog" @actualizar="actualizar"></RecepcionRegistrarAsistencia>
        </v-dialog>
    </div>
</template>
<script>
    import {
        mapState,
        mapGetters,
        mapActions,
        mapMutations
    } from 'vuex';

import RecepcionRegistrarAsistencia from '@/components/Recepcion/RecepcionRegistrarAsistencia'
import LeadInfoView from '@/components/Leads/Detail/LeadInfoView'
import LeadHistoricView from '@/components/Leads/Detail/LeadHistoricView'


    export default {
        name: 'RecepcionView',
        components: {
            RecepcionRegistrarAsistencia,
            LeadInfoView,
            LeadHistoricView
        },
        data: () => ({
            loading: false,
            dialog: false,
            listado: {},
            headerSeguimientos: [
                { text: '', value: 'tipo' },
                { text: 'Fecha', value: 'fecha' },
                { text: 'Usuario', value: 'usuario.nombre' },
                { text: 'Acción', value: 'accion' },
                { text: 'Observación', value: 'observacion' },
            ],
            detalles:[],
            llamada: {
                show: false,
            },
            sedes: [],
            fechas: [],
            sede: null,
        }),
        mounted() {
            this.viewItem();
            this.traerSedesYFechas();
        },
        methods: {
            ...mapActions({
                usuarioLogueado: 'consultar/usuarioLogueado',
                fetchDetalle: 'leads/fetchDetalle',
                solicitar: 'recepcionista/solicitar',
                fetchDisponibilidad: 'agenda/fetchDisponibilidad',
                cambiarEstado: 'agenda/confirmarAsistencia',
            }),
            ...mapMutations({
				setInfo: 'setInfo',
                setLead: 'leads/setDetalle',
            }),
            traerSedesYFechas() {
                console.log(this.setAsisteCita());
                this.fetchDisponibilidad()
                    .then(result => {
                        this.fechas = result.resultSet.fechas
                        this.sedes = result.resultSet.sedes
                        this.sede = this.getSedeUsuario();
                    })
                    .catch(error => {
                        console.log(error)
                        this.setError(error)
                    }).finally(() => {

                    })
            },
            regresar() {
                console.log("Regresando....")
                this.$router.back();
            },
            copiarDato(value) {
                this.$copyText(value).then(() => {
                        this.setInfo('Copiado en list:' + value) 
                    }).catch(error => {
                        console.log(error);this.setInfo(error)
                    }
                );
            },
            viewItem() {
                this.loading = true;
                // this.fetchDetalle({id:this.lead_id}).then((result) => {
                //     if(result.datos){
                //         console.log(result.datos)
                //         this.setLead(result.datos);
                //     }
                // })
                // .finally(() => {
                //     this.loading = false;
                // }) 
                this.fetchDetalle({id:this.lead_id})
                .finally(() => {
                    this.loading = false;
                })  
            },
            viewDialog() {
                this.dialog = !this.dialog;
            },
            iniciarSolicitar(){
                this.dialog = true;
                // this.loading = true;
                // this.solicitar({id_lead:this.lead_id, sede: this.sede})
                // .then((result) => {
                //     if(result.result == 'ok') {
                //         this.dialog = true;
                //     }else{
                //         this.setInfo(result.mensaje)
                //     }           
                // })
                // .finally(()=>{
                //     this.loading = false;
                // })
            },
            cerrarDialog(){
                this.dialog = false;
            },
            actualizar(){
                this.viewItem();
            },
            getSedeUsuario(){
                if(this.user && this.user.data) {
                    return this.user.data.sede_id;
                }else{
                    return null;
                }
            },
            setAsisteCita(){
                if(this.user && this.user.data) {
                    // 'callcenter', 'coordinador',
                    return ['superusuario', 'recepcion'].indexOf(this.user.data.rol) >= 0
                    // return this.user.data.rol;
                }else{
                    return false;
                }
            }
        },
        computed: {
            ...mapState({
                user: state => state.consultar.user,  
                error: state => state.error,
            }),
            ...mapGetters({
                
            }),
            getTitle() {
                return 'Recepcion'
            },
            lead_id(){
                return this.$route.params.id
            },
            lead() {
                return this.detalle(this.lead_id)
            },
            ...mapGetters({
                detalle: 'leads/getDetalle',
            })
        }
    };
</script>