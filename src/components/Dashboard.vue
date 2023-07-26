<template>
<div>
    <v-toolbar flat light dense color="blue lighten-5">
        <!-- <v-toolbar-title>{{getTitle}}</v-toolbar-title> -->
        <v-spacer></v-spacer>
        <v-toolbar-items>
            <!--<v-btn small color="info" dark @click="consultar">
                <v-icon>autorenew</v-icon>
            </v-btn>-->
        </v-toolbar-items>
    </v-toolbar>

    <v-row justify="center">
        <v-col cols="12" sm="4" md="3">
            <v-select v-model="opcionComputed" :items="opciones" label="Opción" :disabled="loading" @change="inicializar()">
            </v-select>
        </v-col>
    </v-row>

    <v-container v-if="opcionComputed == OPCIONES_DASHBOARD.general">
        <General ref="general" :loadingProp="loadingProp" @comenzar="comenzarLoading" @terminar="terminarLoading"></General>
    </v-container>
    <v-container v-else-if="opcionComputed == OPCIONES_DASHBOARD.contactcenter_elite">
        <v-row justify="center">
            <v-col cols="6">
                <ContactCenter :key="OPCIONES_DASHBOARD.contactcenter_elite" ref="contactCenterELITE" :tipo="OPCIONES_DASHBOARD.contactcenter_elite" :loadingProp="loadingProp" @comenzar="comenzarLoading" @terminar="terminarLoading"></ContactCenter>
            </v-col>
        </v-row>
    </v-container>
    <v-container v-else-if="opcionComputed == OPCIONES_DASHBOARD.contactcenter_fenix">
        <v-row justify="center">
            <v-col cols="6">
                <ContactCenter :key="OPCIONES_DASHBOARD.contactcenter_fenix" ref="contactCenterFENIX" :tipo="OPCIONES_DASHBOARD.contactcenter_fenix" :loadingProp="loadingProp" @comenzar="comenzarLoading" @terminar="terminarLoading"></ContactCenter>
            </v-col>
        </v-row>
    </v-container>
    <v-container v-else-if="opcionComputed == OPCIONES_DASHBOARD.contactcenter">
        <v-row justify="center">
            <v-col cols="6">
                <ContactCenter :key="OPCIONES_DASHBOARD.contactcenter_elite" ref="contactCenterELITE" :tipo="OPCIONES_DASHBOARD.contactcenter_elite" :loadingProp="loadingProp" @comenzar="comenzarLoading" @terminar="terminarLoading"></ContactCenter>
            </v-col>
            <v-col cols="6">
                <ContactCenter :key="OPCIONES_DASHBOARD.contactcenter_fenix" ref="contactCenterFENIX" :tipo="OPCIONES_DASHBOARD.contactcenter_fenix" :loadingProp="loadingProp" @comenzar="comenzarLoading" @terminar="terminarLoading"></ContactCenter>
            </v-col>
        </v-row>
    </v-container>
    <v-container v-else>
        <v-row justify="center">
            <h1>Bienvenido a CRM</h1>
        </v-row>
    </v-container>
</div>

</template>

<script>

import General from '@/components/Dashboard/General';
import ContactCenter from '@/components/Dashboard/ContactCenter';

import { mapState, mapActions, mapMutations } from 'vuex';
const OPCIONES_DASHBOARD = {
    general:"MERCADEO",
    contactcenter_elite:"ELITE",
    contactcenter_fenix:"FENIX",
    contactcenter:"CONTACT CENTER",
    consulta:"CONSULTA",
}

export default {
name: 'Dashboard',
    components: {
        General,
        ContactCenter
    },
    data: () => ({
        opciones:[],
        opcion:null,
        dates: [],
        menu1: false,
        shown: false,
        tags: ["Digital", "Convenio", "Referido", "Renovación", "Walk-In", "Otros"],
        tagSelected: [],
        sedes:[],
        sede:null,
        loading:false,
        OPCIONES_DASHBOARD:OPCIONES_DASHBOARD
    }),
    mounted() {
        this.setDates();
        this.traerSedes();
        this.traerOpciones();
    },
    methods: {
        ...mapActions({
            listarSedes: 'sedes/fetchLista',
            listarOpciones: 'auth/getPermisos'
        }),
        ...mapMutations({
            setInfo: 'setInfo',
            setError: 'setError',
        }),
        consultar() {
            if (this.opcion == this.OPCIONES_DASHBOARD.general) {
                this.consultarComponentes('general', new Date());
            } else if (this.opcion == this.OPCIONES_DASHBOARD.contactcenter) {
                this.consultarComponentes('contactCenterFENIX', new Date());
                this.consultarComponentes('contactCenterELITE', new Date());
            } if (this.opcion == this.OPCIONES_DASHBOARD.contactcenter_elite) {
                this.consultarComponentes('contactCenterELITE', new Date());
            } if (this.opcion == this.OPCIONES_DASHBOARD.contactcenter_fenix) {
                this.consultarComponentes('contactCenterFENIX', new Date());
            }
        },
        inicializar() {
            this.payload = {desde: this.dates[0], hasta: this.dates[1], sede:this.sede, tipo: this.tagSelected};
            this.consultar();
        },
        setDates() {
            this.dates[0] = this.$moment().format('YYYY-MM-01');
            this.dates[1] = this.$moment().format('YYYY-MM-DD');
        },
        
        closemenu() {
            this.shown = false;
        },
        verSeleccionados() {
            console.log(this.tagSelected)
        },
        seleccionarTag(tag) {
            let index = this.tagSelected.indexOf(tag);
            if (this.tagSelected.indexOf(tag) === -1) {
                this.tagSelected.push(tag)
            }else {
                this.tagSelected.splice(index, 1)
            }
        },
        traerSedes() {
            this.loading = true;
            this.listarSedes()
            .then(result => {
                this.sedes = result;
            })
            .catch(error => {
                console.error(error)
            }).finally(() => {
                this.loading = false;
            });
        },
        traerOpciones() {
            this.loading = true;
            this.listarOpciones({modulo:'OP_DASHBOARD'})
            .then(result => {
                this.opciones = result.map(x => x.valor);
                if (this.opciones.length > 0) {
                    this.opcion = this.opciones[0];
                }
                this.inicializar();
            })
            .catch(error => {
                console.error(error)
            }).finally(() => {
                this.loading = false;
            });
        },
        consultarComponentes(componente, comienza) {
            if (this.$refs[componente] && typeof this.$refs[componente].consultar === "function") {
                this.$refs[componente].consultar();
            } else if(((new Date()).getTime() - comienza.getTime()) / 1000 / 60 > 1) {
                // console.log(`Terminar funcion : ${componente}`);
                // terminar ejecucion
            } else {
                // console.log(`Posponer la ejecucion de la función : ${componente}, tiempo: ${(((new Date()).getTime() - comienza.getTime()) / 1000 / 60)}`);
                setTimeout(() => {
                    this.consultarComponentes(componente, comienza);
                }, 200);
            }
        },
        comenzarLoading() {
            this.loading = true;
        },
        terminarLoading() {
            this.loading = false;  
        }
    },
    computed:{
        ...mapState({
            user: state => state.auth.user_info,
        }),
        dateRangeText () {
            return this.dates.map(x => this.$moment(x).format("DD/MM/YYYY")).join(' ~ ')
        },
        allSelected () {
            return this.selected.length === this.items.length
        },
        selections () {
            const selections = []
            for (const selection of this.selected) {
                selections.push(selection)
            }
            return selections
        },
        esUsuario(){
            if(this.user && this.user.activo) {
                return true;
            }else{
                return false;
            }
        },
        userEmail() {
            return this.user && this.user ? this.user.email : null
        },
        fechaInicio() {
            if (this.dates.length) {
                return this.dates[0];
            }
            return "";
        },
        fechaFin() {
            if (this.dates.length) {
                return this.dates[this.dates.length - 1];
            }
            return "";
        },
        loadingProp() {
            return this.loading;
        },
        opcionComputed:{
            get() {
                return this.opcion;
            },
            set(val) {
                this.opcion = val;
            }
        },
    },
    watch: {
      selected () {
        this.search = ''
      },
    }
};
</script>
