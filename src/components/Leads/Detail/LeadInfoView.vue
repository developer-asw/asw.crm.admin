<template>
<!-- dark -->
    <v-simple-table dense class="blue lighten-5">
        <template v-slot:default>
            <tbody>
                <!--tr>
                    <td><b>Tipo: </b></td>
                    <td>{{ lead.categoria_lead }}</td>
                    <td></td>
                </tr-->
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
                    <td>{{ lead.email }}</td>
                    <td></td>
                </tr>
                <tr>
                    <td><b>Teléfono: </b></td>
                    <td>{{ lead.movil }}</td>
                    <td></td>
                </tr>
                <tr>
                    <td><b>Sede: </b></td>
                    <td>
                        <span v-if="ver_sede">{{lead.sede_full  ? lead.sede_full.nombre:""}}</span>
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
                        <v-icon v-if="!lead.deleted_at && !ver_sede" @click="actualizarSede()" small right>save</v-icon>
                        <v-icon v-if="!lead.deleted_at && ver_sede" @click="editarSede()" small right>autorenew</v-icon>
                        <v-icon v-else-if="!lead.deleted_at" @click="editarSede()" small right>cancel</v-icon>
                    </td>
                </tr>
                <tr>
                    <td><b>Programa de interes: </b></td>
                    <td>
                        {{lead.programa_interes}}
                        <!-- <span v-if="ver_programa_interes">{{lead.programa_interes}}</span>
                        <v-select v-else v-model="lead.programa_interes" :items="listado.programaInteres" item-text="title" item-value="value">
                        </v-select> -->
                    </td>
                    <td class="text-right">
                        <!-- <v-icon v-if="!ver_programa_interes" @click="actualizarProgramaInteres()" small right>save</v-icon>
                        <v-icon v-if="ver_programa_interes" @click="editarProgramaInteres()" small right>autorenew</v-icon>
                        <v-icon v-else @click="editarProgramaInteres()" small right>cancel</v-icon> -->
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
                <tr v-if="lead.referido">
                    <td><b>Referido por: </b></td>
                    <td>{{ lead.referido.nombre }}</td>
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
                
                <!--tr v-if="lead.form_ciudad">
                    <td><b>Ciudad: </b></td>
                    <td>{{ lead.form_ciudad }}</td>
                    <td></td>
                </tr-->
                
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
                    <td><b>¿Quieres contarnos o preguntarnos algo más? </b></td>
                    <td><p>{{ lead.mesagge }}</p></td>
                    <td></td>
                </tr>

                <tr>
                    <td><b>Estado: </b></td>
                    <td>{{ lead.ultima_llamada_estado }}</td>
                    <td></td>
                </tr>
                <tr>
                    <td><b>Renovación: </b></td>
                    <td>{{ lead.cmp_renovacion ? "SI" : "NO" }}</td>
                    <td></td>
                </tr>
                <tr v-if="viewInfoMatricula">
                    <td>Matricula:</td>
                    <td v-if="lead.ultima_matricula && lead.ultima_matricula.sticker">{{lead.ultima_matricula.sticker}}</td>
                    <td v-else>{{lead.af_ultima_llamada && lead.af_ultima_llamada.solicitante ? lead.af_ultima_llamada.solicitante.nombre + ' ('+lead.af_ultima_llamada.solicitante.perfil+')' : '' }}</td>
                    <td></td>
                </tr>
                
                <!-- <td colspan="2">
                    <v-icon @click="actualizar" right>refresh</v-icon>
                </td> -->
            </tbody>
        </template>
    </v-simple-table>
</template>

<script>

import { mapState, mapGetters, mapActions, mapMutations } from 'vuex';//,,

export default {
    name: 'LeadInfoView',
    data: () => ({
        listado: [],
        ver_sede: true,
        ver_programa_interes: true,
        lead: {},
    }),
    props: {
        lead_id: String,
        setSedes: Array,
        viewInfoMatricula: Boolean
    },
    mounted() {
        this.verificar();
        this.traerOrigenes();
    },
    methods: {
        ...mapActions({
            fetchLead: 'leads/fetchLead',
            listarOrigenes: 'listado/fetchListaLeads',
            sedeUpdate: 'leads/actualizarSede',
            programaInteresUpdate: 'leads/actualizarProgramaInteres',
        }),
        ...mapMutations({
            setInfo: 'setInfo',
            setError: 'setError',
        }),
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
            this.ver_sede = !this.ver_sede;
        },
        editarProgramaInteres() {
            this.ver_programa_interes = !this.ver_programa_interes;
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
                        this.ver_sede = true;
                    }else{
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
        actualizarProgramaInteres() {
            this.procesando = true;
            const dato = { id: this.lead._id, programa_interes:this.lead.programa_interes };
            this.programaInteresUpdate(dato)
                .then(result => {
                    console.log(result)
                    if (result && result.codigo == 1) {
                        this.setInfo(result.mensaje ? result.mensaje : "Actualizado correctamente");
                        this.lead.programa_interes = result.dato.valor;
                        this.ver_programa_interes = true;
                    }else{
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
        verificar() {
            this.viewItem()
        },
        viewItem() {
            if (this.lead_id)
            this.fetchLead({id:this.lead_id}).then((result) => {
                if (result && result.datos) {
                    this.lead = result.datos;
                }
            })
            .finally(() => {
                this.loading = false;
            })  
        },
        actualizar(){
            this.viewItem();
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
        },
        // lead() {
        //     return this.detalle(this.lead_id)
        // }

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