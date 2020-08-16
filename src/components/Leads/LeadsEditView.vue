<template>
    <div>
        <v-card>
            <v-card-title>
                <span class="headline">{{getTitle}}</span>
            </v-card-title>
            <v-form ref="leadForm" @submit.prevent="submitHandler">
                <v-card-text>
                        <v-row>
                            <v-col cols="12" sm="6" md="4" lg="3">
                                <v-select v-model="lead.sede" :items="sedes" label="Sede" item-text="nombre" item-value="id" :disabled="disabled || !userCanEdit" @change="consola()">
                                    <template slot="item" slot-scope="data">
                                        {{ data.item.ciudad ? data.item.ciudad+':' : '' }} {{ data.item.nombre }}
                                    </template>
                                    <template slot="selection" slot-scope="data">
                                        {{ data.item.ciudad ? data.item.ciudad+':' : '' }} {{ data.item.nombre }}
                                    </template>
                                </v-select>
                            </v-col>
                            <v-col cols="12" sm="6" md="4" lg="3">
                                <v-text-field v-model="lead.identificacion" label="Identificación" :disabled="disabled"></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="6" md="4" lg="3">
                                <v-text-field v-model="lead.primer_nombre" label="Primer Nombre" :disabled="disabled"></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="6" md="4" lg="3">
                                <v-text-field v-model="lead.segundo_nombre" label="Segundo Nombre" :disabled="disabled"></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="6" md="4" lg="3">
                                <v-text-field v-model="lead.primer_apellido" label="Primer Apellido" :disabled="disabled"></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="6" md="4" lg="3">
                                <v-text-field v-model="lead.segundo_apellido" label="Segundo Apellido" :disabled="disabled"></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="6" md="4" lg="3">
                                <v-text-field v-model="lead.email" label="Email" :disabled="disabled || !userCanEdit" :rules="rules.email" @blur="buscarEmail()"></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="6" md="4" lg="3">
                                <v-text-field v-model="lead.movil" label="Teléfono" :disabled="disabled || !userCanEdit" :rules="rules.telefono" @blur="buscarTelefono()"></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="6" md="4" lg="3">
                                <v-select v-model="lead.renovacion" label="Renovación" :items="siNo" :disabled="disabled"></v-select>
                            </v-col>
                            <v-col cols="12" sm="6" md="4" lg="3">
                                <v-select v-model="lead.origen" label="Campaña" :items="listado.origenes" item-text="title" item-value="value" :disabled="disabled"></v-select>
                            </v-col>
                            
                            <v-col cols="12" sm="6" md="4" lg="3">
                                <v-select v-model="lead.como_llego" label="¿Cómo llego?" :items="listado.comoLlego" item-text="title" item-value="value" :disabled="disabled"></v-select>
                            </v-col>

                            <v-col cols="12" sm="6" md="4" lg="3">
                                <v-select v-model="lead.como_se_entero" label="¿Cómo se entero?" :items="listado.comoSeEntero" item-text="title" item-value="value" :disabled="disabled"></v-select>
                            </v-col>

                            <v-col cols="12" sm="6" md="4" lg="3">
                                <v-select v-model="lead.programa_interes" label="Programa de interés" :items="listado.programaInteres" item-text="title" item-value="value" :disabled="disabled"></v-select>
                            </v-col>

                            <v-col cols="12" sm="6" md="4" lg="3">
                                <v-select v-model="lead.agente" label="Agente" :items="listado.agentes" item-text="value" item-value="email" :disabled="disabled || !userCanEdit">
                                    <template slot="item" slot-scope="data">
                                            {{ data.item.primer_nombre }} {{ data.item.segundo_nombre }} {{ data.item.primer_apellido }} {{ data.item.segundo_apellido }}
                                        </template>
                                        <template slot="selection" slot-scope="data">
                                            {{ data.item.primer_nombre }} {{ data.item.segundo_nombre }} {{ data.item.primer_apellido }} {{ data.item.segundo_apellido }}
                                        </template>
                                </v-select>
                            </v-col>
                            <v-col cols="12" sm="6" md="4" lg="3">
                                <v-checkbox v-model="lead.contactar" label="Contactar" :disabled="disabled" @change="check()"></v-checkbox>
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
                        </v-row>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue darken-1" text @click="regresar">Regresar</v-btn>
                    <v-btn color="red darken-1" text type="submit">Guardar</v-btn>
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
            }),
            ...mapMutations({
                setInfo: 'setInfo',
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
                        this.separarNombre();
                        this.leadBack = {...result.datos }
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
                    })
                    .catch(error => {
                        console.log(error)
                    }).finally(() => {

                    });
            },
            submitHandler(){
                if (this.$refs.leadForm.validate()){
                    this.gurdarLeads();
                }
            },
            buscarEmail() {
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
            buscarTelefono() {
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
                }
            },
            consola() {
                console.log(this.lead)
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
                return this.user && this.user.data && this.user.data.rol == 'coordinador'
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
                    _rules.email= [
                        v => !!v || 'El E-mail es necesario',
                        v => /.+@.+\..+/.test(v) || 'El E-mail debe ser válido',
                    ];
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