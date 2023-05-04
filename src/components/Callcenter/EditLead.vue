<template>
<!-- dark -->
    <v-row>
        <v-col cols="12" md="8">

            <v-simple-table dense class="blue lighten-5">
                <template v-slot:default>
                    <tbody>
                        <tr>
                            <td><b>Tipo: </b></td>
                            <td>{{ lead.categoria_lead }}</td>
                            <td></td>
                        </tr>
                        <tr>
                            <td><b>ID: </b></td>
                            <td>{{ lead.numero }}</td>
                            <td></td>
                        </tr>
                        <tr v-if="lead.empresa">
                            <td><b>Empresa: </b></td>
                            <td>{{ lead.empresa }}</td>
                            <td></td>
                        </tr>
                        <tr>
                            <td><b>Nombre: </b></td>
                            <td>{{ lead.full_name }}</td>
                            <td></td>
                        </tr>
                        <tr>
                            <td><b>E-Mail: </b></td>
                            <td>
                                <span v-if="ver.email">{{lead.email}}</span>
                                <input type="email" v-else v-model="lead.email" />
                            </td>
                            <td class="text-right">
                                <v-icon v-if="!ver.email" @click="actualizarEmail()" small right>save</v-icon>
                                <v-icon v-if="ver.email" @click="editarEmail()" small right>autorenew</v-icon>
                                <v-icon v-else @click="editarEmail()" small right>cancel</v-icon>
                            </td>
                        </tr>
                        <tr>
                            <td><b>Teléfono: </b></td>
                            <td>{{ lead.movil }}</td>
                            <td class="text-right">
                                <v-icon v-if="!ver.movil" @click="actualizarMovil()" small right>save</v-icon>
                                <v-icon v-if="ver.movil" @click="editarMovil()" small right>autorenew</v-icon>
                                <v-icon v-else @click="editarMovil()" small right>cancel</v-icon>
                            </td>
                        </tr>
                        <tr>
                            <td><b>Sede: </b></td>
                            <td>
                                <span v-if="ver.sede">{{lead.sede_full  ? lead.sede_full.nombre:""}}</span>
                                <v-select v-else v-model="lead.sede_id" :items="sedes" item-text="nombre" item-value="id">
                                    <template slot="item" slot-scope="data">
                                        {{ data.item.ciudad ? data.item.ciudad+':' : '' }} {{ data.item.sede }}
                                    </template>
                                    <template slot="selection" slot-scope="data">
                                        {{ data.item.ciudad ? data.item.ciudad+':' : '' }} {{ data.item.sede }}
                                    </template>
                                </v-select>
                            </td>
                            <td class="text-right">
                                <v-icon v-if="!ver.sede" @click="actualizarSede()" small right>save</v-icon>
                                <v-icon v-if="ver.sede" @click="editarSede()" small right>autorenew</v-icon>
                                <v-icon v-else @click="editarSede()" small right>cancel</v-icon>
                            </td>
                        </tr>
                        <tr>
                            <td><b>Programa de interes: </b></td>
                            <td>
                                <span v-if="ver.programa_interes">{{lead.programa_interes}}</span>
                                <v-select v-else v-model="lead.programa_interes" :items="listado.programaInteres" item-text="title" item-value="value">
                                </v-select>
                            </td>
                            <td class="text-right">
                                <v-icon v-if="!ver.programa_interes" @click="actualizarProgramaInteres()" small right>save</v-icon>
                                <v-icon v-if="ver.programa_interes" @click="editarProgramaInteres()" small right>autorenew</v-icon>
                                <v-icon v-else @click="editarProgramaInteres()" small right>cancel</v-icon>
                            </td>
                        </tr>
                        <tr>
                            <td><b>Ciudad: </b></td>
                            <td>{{ lead.ciudad }}</td>
                            <td></td>
                        </tr>
                        <tr>
                            <td><b>Cómo llego: </b></td>
                            <td>{{ lead.como_llego }}</td>
                            <td></td>
                        </tr>
                        <tr>
                            <td><b>Cómo se entero: </b></td>
                            <td>{{ lead.como_se_entero }}</td>
                            <td></td>
                        </tr>
                        <tr v-if="lead.comentarios">
                            <td><b>Comentarios Pagina Web: </b></td>
                            <td>{{ lead.comentarios }}</td>
                            <td></td>
                        </tr>
                        
                        <tr v-if="lead.form_plan">
                            <td><b>Plan: </b></td>
                            <td>{{ lead.form_plan }}</td>
                            <td></td>
                        </tr>
                        
                        <tr v-if="lead.sede_full">
                            <td><b>Ciudad: </b></td>
                            <td>{{ lead.sede_full.ciudad }}</td>
                            <td></td>
                        </tr>
                        
                        <tr v-if="lead.form_adicional">
                            <td><b>Adicional: </b></td>
                            <td>{{ lead.form_adicional }}</td>
                            <td></td>
                        </tr>
                        
                        <tr v-if="lead.inputNivel">
                            <td><b>Nivel de inglés: </b></td>
                            <td>{{ lead.inputNivel }}</td>
                            <td></td>
                        </tr>
                        
                        <tr v-if="lead.inputOcupacion">
                            <td><b>Ocupación: </b></td>
                            <td>{{ lead.inputOcupacion }}</td>
                            <td></td>
                        </tr>
                        
                        <tr v-if="lead.inputAge">
                            <td><b>Edad: </b></td>
                            <td>{{ lead.inputAge }}</td>
                            <td></td>
                        </tr>

                        <tr v-if="lead.mesagge">
                            <td><b>Observaciones Cliente </b></td>
                            <td><p>{{ lead.mesagge ? lead.mesagge : lead.comentarios }}</p></td>
                            <td></td>
                        </tr>

                        <tr>
                            <td><b>Estado: </b></td>
                            <td>
                                {{lead.ultima_llamada_estado}}
                            </td>
                            <td>
                                <v-icon v-if="!ver.estado" @click="actualizarEstado()" small right>save</v-icon>
                                <v-icon v-if="ver.estado" @click="editarEstado()" small right>autorenew</v-icon>
                                <v-icon v-else @click="editarEstado()" small right>cancel</v-icon>
                            </td>
                        </tr>
                        <tr>
                            <td><b>Renovación: </b></td>
                            <td>{{ lead.cmp_renovacion ? "SI" : "NO" }}</td>
                            <td></td>
                        </tr>
                        <tr v-if="!ver.estado">
                            <td colspan="3" bgColor="white">
                                <CallcenterRegistrarLlamada :key="lead_id" :lead_id="lead_id" :ocultar="true" @actualizar="actualizarEstado" @copiarDatoParent="copiarDato"></CallcenterRegistrarLlamada>
                            </td>
                        </tr>
                        <!-- <td colspan="2">
                            <v-icon @click="actualizar" right>refresh</v-icon>
                        </td> -->
                    </tbody>
                </template>
            </v-simple-table>
        </v-col>
        <v-col cols="12" md="4">
            <div>
                <h2>Referidos</h2>
                <v-simple-table dense class="lighten-5">
                    <template v-slot:default>
                        <thead>
                            <tr>
                                <th>
                                    Nombre
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(r, i) in referidos.referidos" :key="i">
                                <td>{{ r.full_name }}</td>
                            </tr>
                        </tbody>
                    </template>
                </v-simple-table>
            </div>  
            <div class="mt-5" >
                <h2>Referidos Efectivo</h2>
                <v-simple-table dense class="lighten-5">
                    <template v-slot:default>
                        <thead>
                            <tr>
                                <th>
                                    Nombre
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(re, i) in referidos.referidos_efectivos" :key="i">
                                <td>{{ re.full_name }}</td>
                            </tr>
                        </tbody>
                    </template>
                </v-simple-table>
            </div> 
        </v-col>
    </v-row>

</template>

<script>

import { mapState, mapGetters, mapActions, mapMutations } from 'vuex';//,,

import CallcenterRegistrarLlamada from '@/components/Callcenter/CallcenterRegistrarLlamada'

export default {
    name: 'EditLead',
    components: {
      CallcenterRegistrarLlamada
    },
    data: () => ({
        listado: [],
        ver:{
            sede: true,
            programa_interes: true,
            email: true,
            movil: true,
            estado: true,
        },
        lead: {},
        leadOriginal: {},
        referidos:{referidos:[], referidos_efectivos:[]}
    }),
    props: {
        lead_id: String,
        setSedes: Array,
    },
    mounted() {
        this.verificar();
        this.traerOrigenes();
        this.getreferidos();
    },
    methods: {
        ...mapActions({
            consultarreferidos: "leads/fetchLeadreferidos",
            fetchLead: 'leads/fetchLead',
            listarOrigenes: 'listado/fetchListaLeads',
            sedeUpdate: 'leads/actualizarSede',
            programaInteresUpdate: 'leads/actualizarProgramaInteres',
            identificacionUpdate: 'leads/actualizarIdentificacion',
            primerNombreUpdate: 'leads/actualizarPrimerNombre',
            segundoNombreUpdate: 'leads/actualizarSegundoNombre',
            primerApellidoUpdate: 'leads/actualizarPrimerApellido',
            segundoApellidoUpdate: 'leads/actualizarSegundoApellido',
            emailUpdate: 'leads/actualizarEmail',
            movilUpdate: 'leads/actualizarMovil',
            renovacionUpdate: 'leads/actualizarRenovacion',
            origenUpdate: 'leads/actualizarOrigen',
            comoLlegoUpdate: 'leads/actualizarComoLlego',
            comoSeEnteroUpdate: 'leads/actualizarComoSeEntero',
        }),
        ...mapMutations({
            setInfo: 'setInfo',
            setError: 'setError',
        }),
        copiarDato(value) {
          this.$copyText(value).then(
              () => {
                  this.setInfo('Copiado en list:' + value)
              })
              .catch(error => {
                  console.log(error)
                  this.setInfo(error)
              })
        },
        traerOrigenes() {
            this.listarOrigenes()
                .then(result => {
                    this.listado = result;
                })
                .catch(error => {
                    console.log(error)
                }).finally(() => {

                });
        },
        editarSede() {
            this.ver.sede = !this.ver.sede;
        },
        actualizarSede() {
            this.procesando = true;
            const dato = { id: this.lead._id, sede:this.lead.sede_id };
            this.sedeUpdate(dato)
                .then(result => {
                    if (result && result.codigo == 1) {
                        this.setInfo(result.mensaje ? result.mensaje : "Actualizado correctamente");
                        this.lead.sede_full = result.dato.valor;
                        this.lead.sede_id = this.lead.sede_id;
                        this.ver.sede = true;
                    }else{
                        this.lead.sede_id = this.leadOriginal.sede_id;
                        this.setError(result)
                    }
                })
                .catch(error => {
                    this.setError(error)
                    console.log(error)
                }).finally(() => {
                    this.procesando = false;
                });
        },
        editarProgramaInteres() {
            this.ver.programa_interes = !this.ver.programa_interes;
        },
        actualizarProgramaInteres() {
            this.procesando = true;
            const dato = { id: this.lead._id, programa_interes:this.lead.programa_interes };
            this.programaInteresUpdate(dato)
                .then(result => {
                    console.log(result)
                    if (result && result.codigo == 1) {
                        this.setInfo(result.mensaje ? result.mensaje : "Actualizado correctamente");
                        this.lead.programa_interes = result.dato.valor;
                        this.ver.programa_interes = true;
                    }else{
                        this.lead.programa_interes = this.leadOriginal.programa_interes;
                        this.setError(result)
                    }
                })
                .catch(error => {
                    this.setError(error)
                    console.log(error)
                }).finally(() => {
                    this.procesando = false;
                });
        },
        editarEmail() {
            this.ver.email = !this.ver.email;
            if (!this.ver.email) {
                this.lead.email = this.leadOriginal.email;
            }
        },
        actualizarEmail() {
            this.procesando = true;
            const dato = { id: this.lead._id, valor:this.lead.email };
            this.emailUpdate(dato)
                .then(result => {
                    console.log(result);
                    if (result && result.codigo == 1) {
                        this.setInfo(result.mensaje ? result.mensaje : "Actualizado correctamente");
                        this.lead.email = result.dato.valor;
                        this.ver.email = true;
                    }else{
                        this.lead.email = this.leadOriginal.email;
                        this.setError(result)
                    }
                })
                .catch(error => {
                    this.setError(error)
                    console.log(error)
                }).finally(() => {
                    this.procesando = false;
                });
        },
        editarMovil() {
            this.ver.movil = !this.ver.movil;
        },
        actualizarMovil() {
            this.procesando = true;
            const dato = { id: this.lead._id, valor:this.lead.movil };
            this.emailUpdate(dato)
                .then(result => {
                    console.log(result);
                    if (result && result.codigo == 1) {
                        this.setInfo(result.mensaje ? result.mensaje : "Actualizado correctamente");
                        this.lead.movil = result.dato.valor;
                        this.ver.movil = true;
                    }else{
                        this.lead.movil = this.leadOriginal.movil;
                        this.setError(result)
                    }
                })
                .catch(error => {
                    this.setError(error)
                    console.log(error)
                }).finally(() => {
                    this.procesando = false;
                });
        },
        editarEstado() {
            this.ver.estado = !this.ver.estado;
        },
        actualizarEstado() {
            this.ver.estado = true;
        },
        verificar() {
            this.viewItem()
        },
        viewItem() {
            if (this.lead_id)
            this.fetchLead({id:this.lead_id}).then((result) => {
                if (result && result.datos) {
                    this.lead = result.datos;
                    this.leadOriginal = JSON.parse(JSON.stringify(result.datos));
                }
            })
            .finally(() => {
                this.loading = false;
            })  
        },
        actualizar(){
            this.viewItem();
        },
        getreferidos() {
            console.log("getreferidos");
            this.consultarreferidos({ id: this.lead_id }).then((result) => {
                console.log(result)
                this.referidos = result.datos;
            })
            .finally(() => {
                this.loading = false;
            });
        }
    },
    computed: {
        ...mapState({
            error: state => state.error,
        }),
        ...mapGetters({
            detalle: 'leads/getDetalle',
        }),
        getTitle() {
            return 'Registro de llamada'
        },
        sedes() {
            return this.setSedes
        }
    }
}
</script>

<style lang="scss">
    tbody {
        tr:hover {
            background-color: transparent !important;
        }
    }
</style>