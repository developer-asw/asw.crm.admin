<template>
    <div>
        <v-card>
            <v-card-title>
                <span class="headline">{{getTitle}}</span>
            </v-card-title>
            <v-form ref="leadForm" @submit.prevent="submitHandler">
                <v-card-text>

                        <v-row>
                            <v-col cols="12">
                                <span>Ultima actualización: {{formatDate(lead.updated_at)}}</span>

                            </v-col>
                            <v-col cols="12" sm="6" md="4" lg="3">
                                <v-row>
                                    <v-col cols="11" sm="10">
                                        <v-select v-model="lead.sede_id" :items="sedes" label="Sede" item-text="nombre" item-value="id" :disabled="disabled || !userCanEdit">
                                            <template slot="item" slot-scope="data">
                                                {{ data.item.ciudad ? data.item.ciudad+':' : '' }} {{ data.item.nombre }}
                                            </template>
                                            <template slot="selection" slot-scope="data">
                                                {{ data.item.ciudad ? data.item.ciudad+':' : '' }} {{ data.item.nombre }}
                                            </template>
                                        </v-select>
                                    </v-col>
                                    <v-col cols="1" sm="2">
                                        <v-btn v-if="cambioSede" @click="actualizarSede" x-small dark outlined color="success"><v-icon small>save</v-icon></v-btn>
                                        <v-icon v-if="!cambioSede">checkbox</v-icon>
                                        <v-btn v-else @click="lead.sede_id = leadOriginal.sede_id" x-small dark outlined color="warning"><v-icon small>cancel</v-icon></v-btn>
                                    </v-col>
                                </v-row>

                            </v-col>
                            <v-col cols="12" sm="6" md="4" lg="3">
                                <v-row>
                                    <v-col cols="11" sm="10">
                                        <v-text-field v-model="lead.identificacion" label="Identificación" :disabled="disabled" @blur="limpiarCampo('identificacion')"></v-text-field>
                                    </v-col>
                                    <v-col cols="1" sm="2">
                                        <v-btn v-if="cambioId" @click="actualizarId" x-small dark outlined color="success"><v-icon small>save</v-icon></v-btn>
                                        <v-icon v-if="!cambioId">check</v-icon>
                                        <v-btn v-else @click="lead.identificacion = leadOriginal.identificacion" x-small dark outlined color="warning"><v-icon small>cancel</v-icon></v-btn>
                                    </v-col>
                                </v-row>
                            </v-col>
                            <v-col cols="12" sm="6" md="4" lg="3">
                                <v-row>
                                    <v-col cols="11" sm="10">
                                        <v-text-field v-model="lead.primer_nombre" label="Primer Nombre" :disabled="disabled" @blur="limpiarCampoNombre()"></v-text-field>
                                    </v-col>
                                    <v-col cols="1" sm="2">
                                        <v-btn v-if="cambioPrimerNombre" @click="actualizarPrimerNombre" x-small dark outlined color="success"><v-icon small>save</v-icon></v-btn>
                                        <v-icon v-if="!cambioPrimerNombre">check</v-icon>
                                        <v-btn v-else @click="lead.primer_nombre = leadOriginal.primer_nombre" x-small dark outlined color="warning"><v-icon small>cancel</v-icon></v-btn>
                                    </v-col>
                                </v-row>
                            </v-col>
                            <v-col cols="12" sm="6" md="4" lg="3">
                                <v-row>
                                    <v-col cols="11" sm="10">
                                        <v-text-field v-model="lead.segundo_nombre" label="Segundo Nombre" :disabled="disabled" @blur="limpiarCampo('segundo_nombre')"></v-text-field>
                                    </v-col>
                                    <v-col cols="1" sm="2">
                                        <v-btn v-if="cambioSegundoNombre" @click="actualizarSegundoNombre" x-small dark outlined color="success"><v-icon small>save</v-icon></v-btn>
                                        <v-icon v-if="!cambioSegundoNombre">check</v-icon>
                                        <v-btn v-else @click="lead.segundo_nombre = leadOriginal.segundo_nombre" x-small dark outlined color="warning"><v-icon small>cancel</v-icon></v-btn>
                                    </v-col>
                                </v-row>
                            </v-col>
                            <v-col cols="12" sm="6" md="4" lg="3">
                                <v-row>
                                    <v-col cols="11" sm="10">
                                        <v-text-field v-model="lead.primer_apellido" label="Primer Apellido" :disabled="disabled" @blur="limpiarCampo('primer_apellido')"></v-text-field>
                                    </v-col>
                                    <v-col cols="1" sm="2">
                                        <v-btn v-if="cambioPrimerApellido" @click="actualizarPrimerApellido" x-small dark outlined color="success"><v-icon small>save</v-icon></v-btn>
                                        <v-icon v-if="!cambioPrimerApellido">check</v-icon>
                                        <v-btn v-else @click="lead.primer_apellido = leadOriginal.primer_apellido" x-small dark outlined color="warning"><v-icon small>cancel</v-icon></v-btn>
                                    </v-col>
                                </v-row>
                            </v-col>
                            <v-col cols="12" sm="6" md="4" lg="3">
                                <v-row>
                                    <v-col cols="11" sm="10">
                                        <v-text-field v-model="lead.segundo_apellido" label="Segundo Apellido" :disabled="disabled" @blur="limpiarCampo('segundo_apellido')"></v-text-field>
                                    </v-col>
                                    <v-col cols="1" sm="2">
                                        <v-btn v-if="cambioSegundoApellido" @click="actualizarSegundoApellido" x-small dark outlined color="success"><v-icon small>save</v-icon></v-btn>
                                        <v-icon v-if="!cambioSegundoApellido">check</v-icon>
                                        <v-btn v-else @click="lead.segundo_apellido = leadOriginal.segundo_apellido" x-small dark outlined color="warning"><v-icon small>cancel</v-icon></v-btn>
                                    </v-col>
                                </v-row>
                            </v-col>
                            <v-col cols="12" sm="6" md="4" lg="3">
                                <v-row>
                                    <v-col cols="11" sm="10">
                                        <v-text-field v-model="lead.email" label="Email" :disabled="disabled || !userCanEdit" :rules="rules.email" @blur="buscarEmail()"></v-text-field>
                                    </v-col>
                                    <v-col cols="1" sm="2">
                                        <v-btn v-if="cambioEmail" @click="actualizarEmail" x-small dark outlined color="success"><v-icon small>save</v-icon></v-btn>
                                        <v-icon v-if="!cambioEmail">check</v-icon>
                                        <v-btn v-else @click="lead.email = leadOriginal.email" x-small dark outlined color="warning"><v-icon small>cancel</v-icon></v-btn>
                                    </v-col>
                                </v-row>
                            </v-col>
                            <v-col cols="12" sm="6" md="4" lg="3">
                                <v-row>
                                    <v-col cols="11" sm="10">
                                        <v-text-field v-model="lead.movil" label="Teléfono" :disabled="disabled || !userCanEdit" :rules="rules.telefono" @blur="buscarTelefono()"></v-text-field>
                                    </v-col>
                                    <v-col cols="1" sm="2">
                                        <v-btn v-if="cambioMovil" @click="actualizarMovil" x-small dark outlined color="success"><v-icon small>save</v-icon></v-btn>
                                        <v-icon v-if="!cambioMovil">check</v-icon>
                                        <v-btn v-else @click="lead.movil = leadOriginal.movil" x-small dark outlined color="warning"><v-icon small>cancel</v-icon></v-btn>
                                    </v-col>
                                </v-row>
                            </v-col>
                            <v-col cols="12" sm="6" md="4" lg="3">
                                <v-row>
                                    <v-col cols="11" sm="10">
                                        <v-select v-model="lead.renovacion" label="Renovación" :items="siNo" :disabled="disabled"></v-select>
                                    </v-col>
                                    <v-col cols="1" sm="2">
                                        <v-btn v-if="cambioRenovacion" @click="actualizarRenovacion" x-small dark outlined color="success"><v-icon small>save</v-icon></v-btn>
                                        <v-icon v-if="!cambioRenovacion">check</v-icon>
                                        <v-btn v-else @click="lead.renovacion = leadOriginal.renovacion" x-small dark outlined color="warning"><v-icon small>cancel</v-icon></v-btn>
                                    </v-col>
                                </v-row>
                            </v-col>
                            <v-col cols="12" sm="6" md="4" lg="3">
                                <v-row>
                                    <v-col cols="11" sm="10">
                                        <v-select v-model="lead.origen" label="Campaña" :items="listado.origenes" item-text="title" item-value="value" :disabled="disabled"></v-select>
                                    </v-col>
                                    <v-col cols="1" sm="2">
                                        <v-btn v-if="cambioOrigen" @click="actualizarOrigen" x-small dark outlined color="success"><v-icon small>save</v-icon></v-btn>
                                        <v-icon v-if="!cambioOrigen">check</v-icon>
                                        <v-btn v-else @click="lead.origen = leadOriginal.origen" x-small dark outlined color="warning"><v-icon small>cancel</v-icon></v-btn>
                                    </v-col>
                                </v-row>
                            </v-col>
                            
                            <v-col cols="12" sm="6" md="4" lg="3">
                                <v-row>
                                    <v-col cols="11" sm="10">
                                        <v-select v-model="lead.como_llego" label="¿Cómo llego?" :items="listado.comoLlego" item-text="title" item-value="value" :disabled="disabled"></v-select>
                                    </v-col>
                                    <v-col cols="1" sm="2">
                                        <v-btn v-if="cambioComoLlego" @click="actualizarComoLlego" x-small dark outlined color="success"><v-icon small>save</v-icon></v-btn>
                                        <v-icon v-if="!cambioComoLlego">check</v-icon>
                                        <v-btn v-else @click="lead.como_llego = leadOriginal.como_llego" x-small dark outlined color="warning"><v-icon small>cancel</v-icon></v-btn>
                                    </v-col>
                                </v-row>
                            </v-col>

                            <v-col cols="12" sm="6" md="4" lg="3">
                                <v-row>
                                    <v-col cols="11" sm="10">
                                        <v-select v-model="lead.como_se_entero" label="¿Cómo se entero?" :items="listado.comoSeEntero" item-text="title" item-value="value" :disabled="disabled"></v-select>
                                    </v-col>
                                    <v-col cols="1" sm="2">
                                        <v-btn v-if="cambioComoSeEntero" @click="actualizarComoSeEntero" x-small dark outlined color="success"><v-icon small>save</v-icon></v-btn>
                                        <v-icon v-if="!cambioComoSeEntero">check</v-icon>
                                        <v-btn v-else @click="lead.como_se_entero = leadOriginal.como_se_entero" x-small dark outlined color="warning"><v-icon small>cancel</v-icon></v-btn>
                                    </v-col>
                                </v-row>
                            </v-col>

                            <v-col cols="12" sm="6" md="4" lg="3">
                                <v-row>
                                    <v-col cols="11" sm="10">
                                        <v-select v-model="lead.programa_interes" label="Programa de interés" :items="listado.programaInteres" item-text="title" item-value="value" :disabled="disabled"></v-select>
                                    </v-col>
                                    <v-col cols="1" sm="2">
                                        <v-btn v-if="cambioProgramaInteres" @click="actualizarProgramaInteres" x-small dark outlined color="success"><v-icon small>save</v-icon></v-btn>
                                        <v-icon v-if="!cambioProgramaInteres">check</v-icon>
                                        <v-btn v-else @click="lead.programa_interes = leadOriginal.programa_interes" x-small dark outlined color="warning"><v-icon small>cancel</v-icon></v-btn>
                                    </v-col>
                                </v-row>
                            </v-col>

                            <v-col cols="12" sm="6" md="4" lg="3" v-if="false">
                                <v-row>
                                    <v-col cols="11" sm="10">
                                        <v-select v-model="lead.agente" label="Agente" :items="listado.agentes" item-text="value" item-value="email" :disabled="disabled || !userCanEdit">
                                            <template slot="item" slot-scope="data">
                                                    {{ data.item.primer_nombre }} {{ data.item.segundo_nombre }} {{ data.item.primer_apellido }} {{ data.item.segundo_apellido }}
                                                </template>
                                                <template slot="selection" slot-scope="data">
                                                    {{ data.item.primer_nombre }} {{ data.item.segundo_nombre }} {{ data.item.primer_apellido }} {{ data.item.segundo_apellido }}
                                                </template>
                                        </v-select>
                                    </v-col>
                                    <v-col cols="1" sm="2">
                                        <v-btn v-if="cambioAgente" @click="actualizarAgente" x-small dark outlined color="success"><v-icon small>save</v-icon></v-btn>
                                        <v-icon v-if="!cambioAgente">check</v-icon>
                                        <v-btn v-else @click="lead.agente = leadOriginal.agente" x-small dark outlined color="warning"><v-icon small>cancel</v-icon></v-btn>
                                    </v-col>
                                </v-row>
                            </v-col>

                            <v-col cols="12" sm="6" md="4" lg="3" v-if="lead.como_llego == 'Walk-In'">
                                <v-row>
                                    <v-col cols="11" sm="10">
                                        <v-select v-model="lead.agente" label="Coordinador de Admisiones" :items="listado.coordinadores" item-text="value" item-value="email" :disabled="disabled || !userCanEdit">
                                            <template slot="item" slot-scope="data">
                                                    {{ data.item.primer_nombre }} {{ data.item.segundo_nombre }} {{ data.item.primer_apellido }} {{ data.item.segundo_apellido }}
                                                </template>
                                                <template slot="selection" slot-scope="data">
                                                    {{ data.item.primer_nombre }} {{ data.item.segundo_nombre }} {{ data.item.primer_apellido }} {{ data.item.segundo_apellido }}
                                                </template>
                                        </v-select>
                                    </v-col>
                                    <v-col cols="1" sm="2">
                                        <v-btn v-if="cambioAgente" @click="actualizarAgente" x-small dark outlined color="success"><v-icon small>save</v-icon></v-btn>
                                        <v-icon v-if="!cambioAgente">check</v-icon>
                                        <v-btn v-else @click="lead.agente = leadOriginal.agente" x-small dark outlined color="warning"><v-icon small>cancel</v-icon></v-btn>
                                    </v-col>
                                </v-row>
                            </v-col>

                            <v-col cols="12" sm="6" md="4" lg="3">
                                <v-checkbox v-model="lead.contactar" label="Enviar al Callcenter" :disabled="disabled" @change="check()"></v-checkbox>
                            </v-col>
                            <v-col cols="12" sm="6" md="4" lg="3" v-if="lead.contactar">
                                <v-dialog ref="date" v-model="date.modal" :return-value.sync="lead.fecha_contacto" persistent width="290px">
                                    <template v-slot:activator="{ on, attrs }">
                                        <v-text-field v-model="lead.fecha_contacto" label="Fecha Contacto" readonly v-bind="attrs" v-on="on" :disabled="disabled">
                                        </v-text-field>
                                    </template>
                                    <v-date-picker v-model="lead.fecha_contacto" scrollable>
                                        <v-spacer></v-spacer>
                                        <v-btn text color="primary" @click="date.modal = false">Cancel</v-btn>
                                        <v-btn text color="primary" @click="$refs.date.save(lead.fecha_contacto)">OK</v-btn>
                                    </v-date-picker>
                                </v-dialog>
                            </v-col>

                            <v-col cols="12" sm="6" md="4" lg="3" v-if="lead.contactar">
                                <v-dialog ref="time" v-model="time.modal" :return-value.sync="lead.hora_contacto" persistent width="290px">
                                    <template v-slot:activator="{ on, attrs }">
                                        <v-text-field v-model="lead.hora_contacto" label="Hora contacto" readonly v-bind="attrs" v-on="on" :disabled="disabled">
                                        </v-text-field>
                                    </template>
                                    <v-time-picker v-model="lead.hora_contacto" scrollable full-width :disabled="disabled">
                                        <v-spacer></v-spacer>
                                        <v-btn text color="primary" @click="time.modal = false">Cancel</v-btn>
                                        <v-btn text color="primary" @click="$refs.time.save(lead.hora_contacto)">OK</v-btn>
                                    </v-time-picker>
                                </v-dialog>
                            </v-col>
                            <v-col cols="12" sm="6" md="4" lg="3">                                
                                <v-btn v-if="lead.contactar" @click="actualizarContactar" x-small dark outlined color="success"><v-icon small>save</v-icon></v-btn>
                                <v-icon v-if="!lead.contactar">check</v-icon>
                                <v-btn v-else @click="lead.contactar = false" x-small dark outlined color="warning"><v-icon small>cancel</v-icon></v-btn>
                            </v-col>
                        </v-row>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue darken-1" text @click="regresar">Regresar</v-btn>
                    <!-- <v-btn color="red darken-1" text type="submit">Guardar</v-btn> -->
                </v-card-actions>
            </v-form>
        </v-card>
        <v-dialog v-model="dialog.show" persistent max-width="360">
            <v-card>
                <v-card-title class="headline">¡Atención!</v-card-title>

                <v-card-text>
                    {{dialog.message}}
                    <br>
                    <div v-for="(item, index) in dialog.resultados" :key="index">
                        <p><b>Nombre:</b> {{item.full_name}}</p>
                        <p><b>Email:</b> {{item.email}}</p>
                        <p><b>Movíl:</b> {{item.movil}}</p>
                        <p><b>Registrado:</b> {{item.fecha_ingreso | moment("DD/MM/YYYY")}}</p>
                        <!-- <p><b>Registrado:</b> {{item.fecha_ingreso | moment("dddd, MMMM Do YYYY")}}</p> -->
                    </div>
                </v-card-text>

                <v-card-actions>
                <v-spacer></v-spacer>

                <v-btn color="green darken-1" text @click="cancelar()">
                    Cancelar
                </v-btn>
                <v-btn color="green darken-1" text @click="continuar()">
                    Continuar
                </v-btn>
                </v-card-actions>
            </v-card>
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
    export default {
        name: 'LeadsEditView',
        data: () => ({
            siNo: ['Si', 'No'],
            lead: {
                sede:null,
                identificacion:null,
                primer_nombre: null,
                segundo_nombre: null,
                primer_apellido: null,
                segundo_apellido: null,
                email: null,
                movil: null,
                renovacion:null,
                origen: null,
                como_llego:null,
                como_se_entero:null,
                programa_interes:null,
                agente:null
            },
            leadOriginal:{},
            leadBack: {},
            sedes: [],
            listado: {},
            dialog: {
                show: false,
                message: '',
                resultados: []
            },
            consultando: { buscando: false, objeto: ''},
            disabled: false,
            time: {
                date: new Date().toISOString().substr(0, 10),
                menu: false,
                modal: false
            },
            date: {
                date: new Date().toISOString().substr(0, 10),
                menu: false,
                modal: false
            },
            ver:{
                sede: true,
                programa_interes: true
            },
        }),
        mounted() {
            this.traerLead();
            this.traerSedes();
            this.traerOrigenes();
        },
        methods: {
            ...mapActions({
                listarSedes: 'sedes/fetchLista',
                actualizarLeads: 'leads/actualizarLeads',
                consultar: 'leads/fetchDetalle',
                listarOrigenes: 'listado/fetchListaLeads',
                buscarEmailLead: 'leads/buscarEmail',
                buscarTelefonoLead: 'leads/buscarTelefono',
                sedeUpdate: 'leads/actualizarSede',
                identificacionUpdate: 'leads/actualizarIdentificacion',
                programaInteresUpdate: 'leads/actualizarProgramaInteres',
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
                agenteUpdate: 'leads/actualizarAgente',
                contactarUpdate: 'leads/actualizarContactar',
            }),
            ...mapMutations({
                setInfo: 'setInfo',
                setError: 'setError',
            }),
            check() {
                if(this.lead.contactar) {
                    this.lead.fecha_contacto= new Date().toISOString().substr(0, 10);
                    let [shora, minuto] = new Date().toISOString().substr(11,5).split(':');
                    let hora = parseInt(shora);
                    hora = hora - 5;
                    this.lead.hora_contacto= `${(hora+'').padStart(2, '0')}:${minuto.padStart(2, '0')}`
                }
            },
            traerLead() {
                this.consultar({id:this.$route.params.id})
                    .then(result => {
                        this.lead = result.datos;
                        this.leadOriginal = JSON.parse(JSON.stringify(result.datos));
                        this.separarNombre();
                        this.limpiarEmail();
                        this.leadBack = {...result.datos };
                        if (this.listado && this.listado.origenes) {
                            this.setOrigenLead()
                        }
                    })
                    .catch(error => {
                        console.log(error)
                    }).finally(() => {

                    });
            },
            gurdarLeads() {
                this.procesando = true;
                this.actualizarLeads(this.lead)
                    .then(result => {
                        if (result.lead) {
                            this.setInfo("Actualizado correctamente")
                            this.regresar()
                        }
                    })
                    .catch(error => {
                        console.log(error)
                    }).finally(() => {
                        this.procesando = false;
                    });
            },
            regresar() {
                this.$router.back();
            },
            traerSedes() {
                this.listarSedes()
                    .then(result => {
                        this.sedes = result;
                    })
                    .catch(error => {
                        console.log(error)
                        ///this.setError(error)
                    }).finally(() => {

                    });
            },
            traerOrigenes() {
                this.listarOrigenes()
                    .then(result => {
                        this.listado = result;
                        if(this.lead) {
                            this.setOrigenLead();
                        }
                    })
                    .catch(error => {
                        console.log(error)
                    }).finally(() => {

                    });
            },
            setOrigenLead() {
                if (this.lead.origen && this.listado.origenes.indexOf(x => x.value == this.lead.origen) == -1){
                    this.listado.origenes.push({title:this.lead.origen,value:this.lead.origen})
                }
            },
            submitHandler(){
                if (this.$refs.leadForm.validate()){
                    this.gurdarLeads();
                }
            },
            limpiarEmail() {
                if (this.lead.email) {
                    this.lead.email = this.limpiarTexto(this.lead.email);
                    this.lead.email = this.quitarEspacios(this.lead.email)
                }
            },
            buscarEmail() {
                this.limpiarEmail();
                if(this.consultando.buscando) return;
                this.disabled = true;
                this.consultando.objeto = 'email';
                this.consultando.buscando = true;
                 this.buscarEmailLead(this.lead.email)
                .then(result => {
                    this.dialog.resultados = result;
                    this.existeRegistroMsg('Email');
                })
                .catch(error => {
                    console.log(error)
                }).finally(() => {
                    this.consultando.buscando = false;
                    this.disabled = false;
                });
            },
            limpiarTelefono() {
                if (this.lead.movil) {
                    this.lead.movil = this.limpiarTexto(this.lead.movil);
                    this.lead.movil = this.quitarEspacios(this.lead.movil)
                }
            },
            buscarTelefono() {
                this.limpiarTelefono();
                if(this.consultando.buscando) return;
                this.disabled = true;
                this.consultando.objeto = 'telefono';
                this.consultando.buscando = true;
                 this.buscarTelefonoLead(this.lead.movil)
                .then(result => {
                    this.dialog.resultados = result;
                    this.existeRegistroMsg('Teléfono');
                })
                .catch(error => {
                    console.log(error)
                }).finally(() => {
                    this.consultando.buscando = false;
                    this.disabled = false;
                });
            },
            existeRegistroMsg(elemento) {
                this.dialog.message = `Fue encontrado un registro con el mismo ${elemento}`;
                if (this.dialog.resultados.length > 0 && this.dialog.resultados[0]._id != this.lead._id) {
                    this.dialog.show = true;
                }else{
                    this.dialog.show = false;
                }
            },
            cancelar() {
                this.dialog.show = false;
                switch(this.consultando.objeto) {
                    case 'email':
                        this.lead.email = this.leadBack.email;
                        break;
                    case 'telefono':
                        this.lead.movil = this.leadBack.movil;
                        break;
                }
                
            },
            continuar(){
                this.dialog.show = false;
                let id = this.dialog.resultados.length > 0 ? this.dialog.resultados[0]._id: null;
                if(id) {
                    this.$router.push(`/seguimiento/${id}/detail`);
                }
            },
            separarNombre() {
                if(!this.lead.primer_nombre) {
                    this.lead.primer_nombre = this.lead.full_name;
                    this.limpiarCampoNombre();
                }else{
                    if((!!this.lead.primer_nombre) && !this.lead.segundo_nombre && !this.lead.primer_apellido && !this.lead.segundo_apellido) {
                        this.limpiarCampoNombre();
                    }
                }
            },
            separar(cadena){
                let result = [];
                let valores = cadena.split(' ');
                for (const key in valores) {
                    if(valores[key]) {
                        result.push(valores[key])
                    }
                }
                return result;
            },
            limpiarCampoNombre() {
                if(this.lead.primer_nombre) {
                    this.lead.primer_nombre = this.limpiarTexto(this.lead.primer_nombre);
                    if(this.lead.primer_nombre.includes(' ')) {
                        let nom_separado = this.separar(this.lead.primer_nombre);
                        switch(nom_separado.length) {
                            case 1:
                                this.lead.primer_nombre = nom_separado[0];
                                break;
                            case 2:
                                this.lead.primer_nombre = nom_separado[0];
                                this.lead.primer_apellido = nom_separado[1];
                                break;
                            case 3:
                                this.lead.primer_nombre = nom_separado[0];
                                this.lead.primer_apellido = nom_separado[1];
                                this.lead.segundo_apellido = nom_separado[2];
                                break;
                            case 4:
                                this.lead.primer_nombre = nom_separado[0];
                                this.lead.segundo_nombre = nom_separado[1];
                                this.lead.primer_apellido = nom_separado[2];
                                this.lead.segundo_apellido = nom_separado[3];
                                break;
                            default:
                                this.lead.primer_nombre = nom_separado[0];
                                nom_separado.splice(0, 1);
                                if (!this.lead.primer_apellido) {
                                    this.lead.primer_apellido = nom_separado.join(' ');
                                }else{
                                    this.lead.segundo_apellido = nom_separado.join(' ');
                                }
                        }
                    }
                }
            },
            limpiarCampo(key) {
                if (this.lead[key]) {
                    this.lead[key] = this.limpiarTexto(this.lead[key])
                }
            },
            limpiarTexto(cadena) {
                return cadena.replace(/['"]+/g, '');
            },
            quitarEspacios(cadena) {
                return cadena.replace(/ /g, '');
            },
            formatDate(value){
                if (value instanceof Date)
                    return this.$moment(value).format('DD/MM/YYYY h:mm a')
                else 
                    return value
            },
            actualizarSede() {
                this.procesando = true;
                const dato = { id: this.lead._id, sede:this.lead.sede_id };
                this.sedeUpdate(dato)
                    .then(result => {
                        console.log(result);
                        if (result && result.codigo == 1) {
                            this.setInfo(result.mensaje ? result.mensaje : "Actualizado correctamente");
                            this.lead.sede_full = result.dato.valor;
                            this.lead.updated_at = new Date(result.dato.updated_at);
                            this.leadOriginal.sede_id = this.lead.sede_id;
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
            actualizarId() {
                this.procesando = true;
                const dato = { id: this.lead._id, valor:this.lead.identificacion };
                this.identificacionUpdate(dato)
                    .then(result => {
                        console.log(result);
                        if (result && result.codigo == 1) {
                            this.setInfo(result.mensaje ? result.mensaje : "Actualizado correctamente");
                            this.lead.identificacion = result.dato.valor;
                            this.leadOriginal.identificacion = result.dato.valor;
                            this.lead.updated_at = new Date(result.dato.updated_at);
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
            actualizarPrimerNombre() {
                this.procesando = true;
                const dato = { id: this.lead._id, valor:this.lead.primer_nombre };
                this.primerNombreUpdate(dato)
                    .then(result => {
                        console.log(result);
                        if (result && result.codigo == 1) {
                            this.setInfo(result.mensaje ? result.mensaje : "Actualizado correctamente");
                            this.lead.primer_nombre = result.dato.valor;
                            this.leadOriginal.primer_nombre = result.dato.valor;
                            this.lead.updated_at = new Date(result.dato.updated_at);
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
            actualizarSegundoNombre() {
                this.procesando = true;
                const dato = { id: this.lead._id, valor:this.lead.segundo_nombre };
                this.segundoNombreUpdate(dato)
                    .then(result => {
                        console.log(result);
                        if (result && result.codigo == 1) {
                            this.setInfo(result.mensaje ? result.mensaje : "Actualizado correctamente");
                            this.lead.segundo_nombre = result.dato.valor;
                            this.leadOriginal.segundo_nombre = result.dato.valor;
                            this.lead.updated_at = new Date(result.dato.updated_at);
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
            actualizarPrimerApellido() {
                this.procesando = true;
                const dato = { id: this.lead._id, valor:this.lead.primer_apellido };
                this.primerApellidoUpdate(dato)
                    .then(result => {
                        console.log(result);
                        if (result && result.codigo == 1) {
                            this.setInfo(result.mensaje ? result.mensaje : "Actualizado correctamente");
                            this.lead.primer_apellido = result.dato.valor;
                            this.leadOriginal.primer_apellido = result.dato.valor;
                            this.lead.updated_at = new Date(result.dato.updated_at);
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
            actualizarSegundoApellido() {
                this.procesando = true;
                const dato = { id: this.lead._id, valor:this.lead.segundo_apellido };
                this.segundoApellidoUpdate(dato)
                    .then(result => {
                        console.log(result);
                        if (result && result.codigo == 1) {
                            this.setInfo(result.mensaje ? result.mensaje : "Actualizado correctamente");
                            this.lead.segundo_apellido = result.dato.valor;
                            this.leadOriginal.segundo_apellido = result.dato.valor;
                            this.lead.updated_at = new Date(result.dato.updated_at);
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
            actualizarEmail() {
                this.procesando = true;
                const dato = { id: this.lead._id, valor:this.lead.email };
                this.emailUpdate(dato)
                    .then(result => {
                        console.log(result);
                        if (result && result.codigo == 1) {
                            this.setInfo(result.mensaje ? result.mensaje : "Actualizado correctamente");
                            this.lead.email = result.dato.valor;
                            this.leadOriginal.email = result.dato.valor;
                            this.lead.updated_at = new Date(result.dato.updated_at);
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
            actualizarMovil() {
                this.procesando = true;
                const dato = { id: this.lead._id, valor:this.lead.movil };
                this.movilUpdate(dato)
                    .then(result => {
                        console.log(result);
                        if (result && result.codigo == 1) {
                            this.setInfo(result.mensaje ? result.mensaje : "Actualizado correctamente");
                            this.lead.movil = result.dato.valor;
                            this.leadOriginal.movil = result.dato.valor;
                            this.lead.updated_at = new Date(result.dato.updated_at);
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
            actualizarRenovacion() {
                this.procesando = true;
                const dato = { id: this.lead._id, valor:this.lead.renovacion };
                this.renovacionUpdate(dato)
                    .then(result => {
                        console.log(result);
                        if (result && result.codigo == 1) {
                            this.setInfo(result.mensaje ? result.mensaje : "Actualizado correctamente");
                            this.lead.renovacion = result.dato.valor;
                            this.leadOriginal.renovacion = result.dato.valor;
                            this.lead.updated_at = new Date(result.dato.updated_at);
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
            actualizarOrigen() {
                this.procesando = true;
                const dato = { id: this.lead._id, valor:this.lead.origen };
                this.origenUpdate(dato)
                    .then(result => {
                        console.log(result);
                        if (result && result.codigo == 1) {
                            this.setInfo(result.mensaje ? result.mensaje : "Actualizado correctamente");
                            this.lead.origen = result.dato.valor;
                            this.leadOriginal.origen = result.dato.valor;
                            this.lead.updated_at = new Date(result.dato.updated_at);
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
            actualizarComoLlego() {
                this.procesando = true;
                const dato = { id: this.lead._id, valor:this.lead.como_llego };
                this.comoLlegoUpdate(dato)
                    .then(result => {
                        console.log(result);
                        if (result && result.codigo == 1) {
                            this.setInfo(result.mensaje ? result.mensaje : "Actualizado correctamente");
                            this.lead.como_llego = result.dato.valor;
                            this.leadOriginal.como_llego = result.dato.valor;
                            this.lead.updated_at = new Date(result.dato.updated_at);
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
            actualizarComoSeEntero() {
                this.procesando = true;
                const dato = { id: this.lead._id, valor:this.lead.como_se_entero };
                this.comoSeEnteroUpdate(dato)
                    .then(result => {
                        console.log(result);
                        if (result && result.codigo == 1) {
                            this.setInfo(result.mensaje ? result.mensaje : "Actualizado correctamente");
                            this.lead.como_se_entero = result.dato.valor;
                            this.leadOriginal.como_se_entero = result.dato.valor;
                            this.lead.updated_at = new Date(result.dato.updated_at);
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
                            this.leadOriginal.programa_interes = result.dato.valor;
                            this.lead.updated_at = new Date(result.dato.updated_at);
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
            actualizarAgente() {
                this.procesando = true;
                const dato = { id: this.lead._id, valor:this.lead.agente };
                this.agenteUpdate(dato)
                    .then(result => {
                        console.log(result)
                        if (result && result.codigo == 1) {
                            this.setInfo(result.mensaje ? result.mensaje : "Actualizado correctamente");
                            this.lead.agente = result.dato.valor;
                            this.leadOriginal.agente = result.dato.valor;
                            this.lead.updated_at = new Date(result.dato.updated_at);
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
            actualizarContactar() {
                this.procesando = true;
                const dato = { id: this.lead._id, valor:{fecha_contacto:this.lead.fecha_contacto, hora_contacto:this.lead.hora_contacto} };
                this.contactarUpdate(dato)
                    .then(result => {
                        console.log(result)
                        if (result && result.codigo == 1) {
                            this.setInfo(result.mensaje ? result.mensaje : "Actualizado correctamente");
                            this.lead.fecha_contacto = result.dato.valor.fecha_contacto;
                            this.lead.hora_contacto = result.dato.valor.hora_contacto;
                            this.leadOriginal.fecha_contacto = result.dato.valor.fecha_contacto;
                            this.leadOriginal.hora_contacto = result.dato.valor.hora_contacto;
                            this.lead.updated_at = new Date(result.dato.updated_at);
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
            }
        },
        computed: {
            ...mapState({
                error: state => state.error,
                user: state => state.auth.user,   
            }),
            ...mapGetters({
                detalle: 'leads/getDetalle',
            }),
            getTitle() {
                return 'Editar Leads'
            },
            userCanEdit() {
                return this.user && this.user.data && (this.user.data.rol == 'coordinador' || this.user.data.rol == 'recepcion')
            },
            userAdmin() {
                return this.user && this.user.data && (this.user.data.rol == 'coordinador' || this.user.data.rol == 'superusuario')
            },
            cambioSede() {
                return this.lead.sede_id != this.leadOriginal.sede_id;
            },
            cambioId() {
                return this.lead.identificacion != this.leadOriginal.identificacion
            },
            cambioPrimerNombre() {
                return this.lead.primer_nombre != this.leadOriginal.primer_nombre
            },
            cambioSegundoNombre() {
                return this.lead.segundo_nombre != this.leadOriginal.segundo_nombre
            },
            cambioPrimerApellido() {
                return this.lead.primer_apellido != this.leadOriginal.primer_apellido
            },
            cambioSegundoApellido() {
                return this.lead.segundo_apellido != this.leadOriginal.segundo_apellido
            },
            cambioMovil() {
                return this.lead.movil != this.leadOriginal.movil
            },
            cambioEmail() {
                return this.lead.email != this.leadOriginal.email
            },
            cambioRenovacion() {
                return this.lead.renovacion != this.leadOriginal.renovacion
            },
            cambioOrigen() {
                return this.lead.origen != this.leadOriginal.origen
            },
            cambioComoLlego() {
                return this.lead.como_llego != this.leadOriginal.como_llego
            },
            cambioComoSeEntero() {
                return this.lead.como_se_entero != this.leadOriginal.como_se_entero
            },
            cambioProgramaInteres() {
                return this.lead.programa_interes != this.leadOriginal.programa_interes
            },
            cambioAgente() {
                return this.lead.agente != this.leadOriginal.agente
            },
            rules(){
                const _rules = {}
                _rules.telefono= [
                    v => !!v || 'El Teléfono es necesario'
                ];
                _rules.firstname= [
                    v => !!v || 'El Nombre es necesario',
                    v => (v && v.length > 2) || 'El nombre debe ser mayor de 2 caracteres',
                ];
                if(!this.userCanEdit) {
                    // _rules.email= [
                    //     v => !!v || 'El E-mail es necesario',
                    //     v => /.+@.+\..+/.test(v) || 'El E-mail debe ser válido',
                    // ];
                    _rules.field= [
                        v => !!v || 'Este campo es necesario'
                    ];
                    _rules.lastname= [
                        v => !!v || 'El Nombre es necesario',
                        v => (v && v.length > 2) || 'El nombre debe ser mayor de 2 caracteres',
                    ];
                    _rules.id= [
                        v => !!v || 'El campo Identificación es necesario'
                    ];
                }
                return _rules;
            }
        }
    };
</script>