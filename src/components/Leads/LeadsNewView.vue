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
                                <v-select v-model="lead.sede" :items="sedes" label="Sede" item-text="nombre" item-value="id" :disabled="disabled" :rules="rules.id">
                                    <template slot="item" slot-scope="data">
                                        {{ data.item.ciudad ? data.item.ciudad+':' : '' }} {{ data.item.nombre }}
                                    </template>
                                    <template slot="selection" slot-scope="data">
                                        {{ data.item.ciudad ? data.item.ciudad+':' : '' }} {{ data.item.nombre }}
                                    </template>
                                </v-select>
                            </v-col>
                            <v-col cols="12" sm="6" md="4" lg="3">
                                <v-text-field v-model="lead.identificacion" label="Identificación" :disabled="disabled" @blur="limpiarCampo('identificacion')"></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="6" md="4" lg="3">
                                <v-text-field v-model="lead.primer_nombre" label="Primer Nombre" :disabled="disabled" :rules="rules.firstname" @blur="limpiarCampoNombre()"></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="6" md="4" lg="3">
                                <v-text-field v-model="lead.segundo_nombre" label="Segundo Nombre" :disabled="disabled" @blur="limpiarCampo('segundo_nombre')"></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="6" md="4" lg="3">
                                <v-text-field v-model="lead.primer_apellido" label="Primer Apellido" :disabled="disabled" @blur="limpiarCampo('primer_apellido')" :rules="rules.lastname"></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="6" md="4" lg="3">
                                <v-text-field v-model="lead.segundo_apellido" label="Segundo Apellido" :disabled="disabled" @blur="limpiarCampo('segundo_apellido')"></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="6" md="4" lg="3">
                                <v-text-field v-model="lead.email" label="Email" @blur="buscarEmail()" :disabled="disabled" :rules="rules.email">
                                </v-text-field>
                            </v-col>
                            <v-col cols="12" sm="6" md="4" lg="3">
                                <v-text-field v-model="lead.movil" label="Teléfono" @blur="buscarTelefono()" :disabled="disabled" :rules="rules.telefono"></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="6" md="4" lg="3">
                                <v-select v-model="lead.renovacion" label="Renovación" :items="siNo" :disabled="disabled"></v-select>
                            </v-col>
                            <v-col cols="12" sm="6" md="4" lg="3">
                                <v-select v-model="lead.origen" label="Campaña" :items="listado.origenes" item-text="title" item-value="value" :disabled="disabled" :rules="rules.field"></v-select>
                            </v-col>
                            
                            <v-col cols="12" sm="6" md="4" lg="3">
                                <v-select v-model="lead.como_llego" label="¿Cómo llego?" :items="listado.comoLlego" item-text="title" item-value="value" :disabled="disabled" :rules="rules.field"></v-select>
                            </v-col>

                            <v-col cols="12" sm="6" md="4" lg="3">
                                <v-select v-model="lead.como_se_entero" label="¿Cómo se entero?" :items="listado.comoSeEntero" item-text="title" item-value="value" :disabled="disabled" :rules="rules.field"></v-select>
                            </v-col>

                            <v-col cols="12" sm="6" md="4" lg="3">
                                <v-select v-model="lead.programa_interes" label="Programa de interés" :items="listado.programaInteres" item-text="title" item-value="value" :disabled="disabled" :rules="rules.field"></v-select>
                            </v-col>

                            <v-col cols="12" sm="6" md="4" lg="3" v-if="false">
                                <v-select v-model="lead.agente" label="Agente" :items="listado.agentes" item-text="primer_nombre" item-value="email" :disabled="disabled" :rules="rules.agente">
                                    <template slot="item" slot-scope="data">
                                        {{ data.item.primer_nombre }} {{ data.item.segundo_nombre }} {{ data.item.primer_apellido }} {{ data.item.segundo_apellido }}
                                    </template>
                                    <template slot="selection" slot-scope="data">
                                        <!-- // HTML that describe how select should render selected items -->
                                        <!-- {{ data.item.name }} - {{ data.item.description }} -->
                                        {{ data.item.primer_nombre }} {{ data.item.segundo_nombre }} {{ data.item.primer_apellido }} {{ data.item.segundo_apellido }}
                                    </template>
                                </v-select>
                            </v-col>

                            <v-col cols="12" sm="6" md="4" lg="3" v-if="['Walk-In','Referido','Renovación'].includes(lead.como_llego)">
                                <v-select v-model="lead.agente" label="Coordinador de admisiones" :items="listado.coordinadores" item-text="primer_nombre" item-value="email" 
                                :disabled="disabled" :rules="rules.coordinador_admision">
                                    <template slot="item" slot-scope="data">
                                        {{ data.item.primer_nombre }} {{ data.item.segundo_nombre }} {{ data.item.primer_apellido }} {{ data.item.segundo_apellido }}
                                    </template>
                                    <template slot="selection" slot-scope="data">
                                        {{ data.item.primer_nombre }} {{ data.item.segundo_nombre }} {{ data.item.primer_apellido }} {{ data.item.segundo_apellido }}
                                    </template>
                                </v-select>
                            </v-col>

                            <v-col cols="12" sm="6" md="4" lg="3" v-if="false">
                                <v-checkbox v-model="lead.contactar" label="Contactar" title="Especificar una fecha de contacto" :disabled="disabled" @change="check()"></v-checkbox>
                            </v-col>

                            <v-col cols="12" sm="6" md="4" lg="3" v-if="lead.contactar">
                                <v-dialog ref="date" v-model="date.modal" :return-value.sync="lead.fecha_contacto" persistent width="290px">
                                    <template v-slot:activator="{ on, attrs }">
                                        <v-text-field v-model="lead.fecha_contacto" label="Fecha Contacto" readonly v-bind="attrs" v-on="on" :disabled="disabled">
                                        </v-text-field>
                                    </template>
                                    <v-date-picker v-model="lead.fecha_contacto" scrollable>
                                        <v-spacer></v-spacer>
                                        <v-btn text color="primary" @click="date.modal = false">Cancelar</v-btn>
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
                                        <v-btn text color="primary" @click="time.modal = false">Cancelar</v-btn>
                                        <v-btn text color="primary" @click="$refs.time.save(lead.hora_contacto)">OK</v-btn>
                                    </v-time-picker>
                                </v-dialog>
                            </v-col>

                        </v-row>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue darken-1" text @click="regresar">Regresar</v-btn>
                    <!-- <v-btn color="blue darken-1" text @click="consola">Consola</v-btn> -->
                    <v-btn color="red darken-1" text type="submit">Guardar</v-btn>
                </v-card-actions>
            </v-form>
        </v-card>

        <v-dialog v-model="dialog.show" persistent max-width="360">
            <v-card>
                <v-card-title class="headline">¡Atención!</v-card-title>

                <v-card-text>
                    {{dialog.message}}

                        <v-item v-slot="{ isSelected, toggle }" v-for="(item, index) in dialog.resultados" :key="index">
                            <v-card
                            :color="isSelected || index == dialog.index ? 'primary' : ''"
                            class="d-flex align-center"
                            height="200"
                            light
                            @click="toggle,selectedItem(index)"
                            >
                            <v-scroll-y-transition>
                                <div class="flex-grow-1 text-center">
                                    <p><b>Registrado:</b> {{item.fecha_ingreso | moment("DD/MM/YYYY")}}</p>
                                    <p><b>Nombre:</b> {{item.full_name}}</p>
                                    <p v-if="!item.deleted_at"><b>Email:</b> {{item.email}}</p>
                                    <p v-if="!item.deleted_at"><b>Movíl:</b> {{item.movil}}</p>
                                </div>
                                
                                

                            </v-scroll-y-transition>
                            </v-card>
                        </v-item>
                    <hr>
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
        name: 'LeadsNewView',
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
                agente:null,
                contactar: false,
                fecha_contacto: new Date().toISOString().substring(0, 10),
                hora_contacto: new Date().toISOString().substring(11,5)
            },
            sedes: [],
            listado: {},
            dialog: {
                show: false,
                message: '',
                resultados: [],
                index: 0
            },
            consultando: { buscando: false, objeto: ''},
            disabled: false,
            time: {
                date: new Date().toISOString().substring(0, 10),
                menu: false,
                modal: false
            },
            date: {
                date: new Date().toISOString().substring(0, 10),
                menu: false,
                modal: false
            },
        }),
        mounted() {
            this.traerSedes()
            this.traerOrigenes();
        },
        methods: {
            ...mapActions({
                listarSedes: 'sedes/fetch',
                generarLeads: 'leads/crearLeads',
                listarOrigenes: 'listado/fetchListaLeads',
                buscarEmailLead: 'leads/buscarEmail',
                buscarTelefonoLead: 'leads/buscarTelefono',
            }),
            ...mapMutations({
                setInfo: 'setInfo',
            }),
            check() {
                if(this.lead.contactar) {
                    this.lead.fecha_contacto= new Date().toISOString().substring(0, 10);
                    let [shora, minuto] = new Date().toISOString().substring(11,5).split(':');
                    let hora = parseInt(shora);
                    hora = hora - 5;
                    this.lead.hora_contacto= `${(hora+'').padStart(2, '0')}:${minuto.padStart(2, '0')}`
                }
            },
            reiniciar() {
                this.lead = {
                    primer_nombre: null,
                    primer_apellido: null,
                    movil: null,
                    sede: null,
                    email: null,
                    id: null
                };
                this.$refs.leadForm.resetValidation()
            },
            gurdarLeads() {
                this.procesando = true;
                this.generarLeads(this.lead)
                    .then(result => {
                        if (result.lead) {
                            this.reiniciar();
                            this.setInfo("Registro guardado exitosamente")
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
            consola() {
                console.log(new Date().toISOString())
                console.log(new Date().toUTCString())
                console.log(this.lead);
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
                    this.dialog.resultados = result.datos;
                    if (this.dialog.resultados && this.dialog.resultados.length) {
                        this.dialog.index = 0;
                    } else {
                        this.dialog.index = null;
                    }
                    this.dialog.sedes = result.sedes;
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
                    this.dialog.resultados = result.datos;
                    if (this.dialog.resultados && this.dialog.resultados.length) {
                        this.dialog.index = 0;
                    } else {
                        this.dialog.index = null;
                    }
                    this.dialog.sedes = result.sedes;
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
                if (this.dialog.resultados.length > 0) {
                    this.dialog.show = true;
                }else{
                    this.dialog.show = false;
                }
            },
            cancelar() {
                this.dialog.show = false;
                switch(this.consultando.objeto) {
                    case 'email':
                        this.lead.email = '';
                        break;
                    case 'telefono':
                        this.lead.movil = '';
                        break;
                }
                
            },
            continuar(){
                this.dialog.show = false;
                if (this.dialog.index >= 0 && this.dialog.resultados && this.dialog.resultados[this.dialog.index]) {
                    if (this.dialog.resultados[this.dialog.index]._allow_data_to_user) {
                        let id = this.dialog.resultados[this.dialog.index]._id;
                        if(id) {
                            this.$router.push(`/recepcion/${id}/view`);
                        } else {
                            this.setInfo("Selección no válida");
                        }
                    } else {
                        this.setInfo("No pertence a su sede");
                    }
                } else {
                    this.setInfo("Seleccione un dato");
                }
            },
            submitHandler(){
                if (this.$refs.leadForm.validate()){
                    this.gurdarLeads();
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
            selectedItem(index) {
                this.dialog.index = index;
            }
        },
        computed: {
            ...mapState({
                error: state => state.error,
                user: state => state.auth.user_info, 
            }),
            ...mapGetters({
                detalle: 'leads/getDetalle',
            }),
            getTitle() {
                return 'Nuevo Leads'
            },
            userCanEdit() {
                return this.user ? this.user.disponibilidad : false
            },
            rules(){
                const _rules = {}
                _rules.telefono= [
                    v => !!v || 'El Teléfono es necesario'
                ];
                _rules.firstname = [
                    v => !!v || 'El Nombre es necesario',
                    v => (v && v.length > 2) || 'El nombre debe ser mayor de 2 caracteres',
                ];
                if (['Walk-In','Referido','Renovación'].includes(this.lead.como_llego)) {
                    _rules.coordinador_admision = [
                        v => !!v || 'El coordinador de admisión es necesario'
                    ];
                }
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