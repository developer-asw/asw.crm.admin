<template>
  <div>
    <v-card>
      <v-card-title>
        <span class="headline">{{ getTitle }}</span>
      </v-card-title>
      <v-card-text>
        <v-row>
          
          <v-col cols="12">
              <span>Ultima actualización: {{formatDate(lead.updated_at)}}</span> <br>
              <span v-if="lead.deleted_at">Eliminado en: {{formatDate(lead.deleted_at)}}</span>
          </v-col>

          <v-col cols="12" sm="6" md="4" lg="3">
            <b>ID: </b> <br/> {{ lead.numero }}
          </v-col>
          <v-col cols="12" sm="6" md="4" lg="3">
            FECHA INGRESO: <br />
            {{ lead.fecha_ingreso | moment("DD/MM/YYYY") }}
          </v-col>
          <v-col cols="12" sm="6" md="4" lg="3">
            SEDE: <br />
            {{ lead.sede_full ? lead.sede_full.nombre : "Sin sede" }}
          </v-col>
          <v-col cols="12" sm="6" md="4" lg="3">
            IDENTIFICACIÓN: <br />{{ lead.identificacion }}
          </v-col>
          <v-col cols="12" sm="6" md="4" lg="3">
            NOMBRE COMPLETO: <br />{{ lead.full_name }}
          </v-col>
          <v-col cols="12" sm="6" md="4" lg="3">
            E-MAIL: <br />{{ lead.email }}
          </v-col>
          <v-col cols="12" sm="6" md="4" lg="3">
            TELÉFONO: <br />{{ lead.movil }}
          </v-col>
          <v-col cols="12" sm="6" md="4" lg="3">
            RENOVACIÓN: <br />{{ lead.renovacion }}
          </v-col>
          <v-col cols="12" sm="6" md="4" lg="3">
            CAMPAÑA: <br />{{ getOrigen }}
          </v-col>

          <v-col cols="12" sm="6" md="4" lg="3">
            ¿CÓMO LLEGO?: <br />{{ getComoLlego }}
          </v-col>

          <v-col cols="12" sm="6" md="4" lg="3">
            ¿CÓMO SE ENTERO?: <br />{{ getComoSeEntero }}
          </v-col>

          <v-col cols="12" sm="6" md="4" lg="3">
            PROGRAMA DE INTERÉS: <br />{{ getProgramaInteres }}
          </v-col>

          <v-col cols="12" sm="6" md="4" lg="3">
            AGENTE: <br />{{ getAgente }}
          </v-col>
          
          <v-col cols="12" sm="6" md="4" lg="3">
            ESTADO: <br />{{ lead.ultima_llamada_estado ? lead.ultima_llamada_estado : getEstado(lead.estado) }}
          </v-col>
          
          <v-col cols="12" sm="6" md="4" lg="3">
            NIVEL DE INGLÉS: <br />{{ lead.inputNivel }}
          </v-col>
          <v-col cols="12" sm="6" md="4" lg="3">
            OCUPACIÓN: <br />{{ lead.inputOcupacion }}
          </v-col>
          <v-col cols="12" sm="6" md="4" lg="3">
            EDAD: <br />{{ lead.inputAge }}
          </v-col>
          <v-col cols="12" sm="6" md="4" lg="3">
            OBSERVACIONES CLIENTE: <br />{{ lead.mesagge ? lead.mesagge : lead.comentarios }}
          </v-col>

          
          <v-col cols="12" sm="6" md="4" lg="3">
            OBSERVACIONES: <br />{{ getObservacion }}
          </v-col>
        </v-row>

        <v-row>
          <!-- <v-card-actions> -->
          <v-spacer></v-spacer>
          <v-btn class="ma-2" v-if="!lead.deleted_at" color="red darken-1" text :to="{ name: 'lead_edit', params: { id: leadId } }"><v-icon left small>edit</v-icon>&nbsp;Editar&nbsp;</v-btn>
          <v-btn class="ma-2" v-if="!lead.deleted_at && puedeSolicitar() && (permiso('OP_REGISTRAR_LLAMADA') || permiso('OP_AGENTE'))" color="green darken-1" text @click="iniciarSolicitar()" :loading="loading" title="Callcenter">
            <v-icon left small>phone</v-icon>&nbsp;Llamar &nbsp;
          </v-btn>
          <v-btn class="ma-2" v-else-if="!lead.deleted_at && estaAsignado() && (permiso('OP_REGISTRAR_LLAMADA') || permiso('OP_AGENTE'))" color="green darken-1" text @click="iniciarCerrar()" :loading="loading" title="Callcenter">
            <v-icon left small>warning</v-icon>&nbsp;Llamar &nbsp;
          </v-btn>
          <v-btn class="ma-2" v-else-if="!lead.deleted_at && (permiso('OP_REGISTRAR_LLAMADA') || permiso('OP_AGENTE'))" color="green darken-1" text @click="historyOnly()" :loading="loading" title="Callcenter">
            <v-icon left small>phone_locked</v-icon>&nbsp;Llamar &nbsp;
          </v-btn>

          <v-btn class="ma-2" v-if="!lead.deleted_at && puedeSolicitarApoyoFinanciero() && permiso('OP_AF_REGISTRAR_LLAMADA')" color="green darken-1" text @click="iniciarSolicitarApoyoFinanciero()" :loading="loading" title="Apoyo Finaciero">
            <v-icon left small>phone</v-icon>&nbsp;Apoyo Financiero &nbsp;
          </v-btn>
          <v-btn class="ma-2" v-else-if="!lead.deleted_at && estaAsignadoApoyoFinanciero() && permiso('OP_AF_REGISTRAR_LLAMADA')" color="green darken-1" text @click="iniciarCerrarApofoFinanciero()" :loading="loading" title="Apoyo Finaciero">
            <v-icon left small>warning</v-icon>&nbsp;Apoyo Financiero &nbsp;
          </v-btn>
          <v-btn class="ma-2" v-else-if="!lead.deleted_at && permiso('OP_AF_REGISTRAR_LLAMADA')" color="green darken-1" text @click="historyOnlyApoyoFinanciero() && permiso('OP_AF_REGISTRAR_LLAMADA')" :loading="loading" title="Apoyo Finaciero">
            <v-icon left small>phone_locked</v-icon>&nbsp;Apoyo Financiero &nbsp;
          </v-btn>

          <v-btn class="ma-2" color="blue darken-1" text @click="regresar"
            ><v-icon>navigate_before</v-icon>&nbsp;Regresar&nbsp;</v-btn
          >
          <!-- </v-card-actions>  -->
        </v-row>
        <v-row class="mt-10">
          <v-col cols="12" md="1"  sm="2"></v-col>
          <v-col cols="12" md="10" sm="8">
            <LeadHistoricView :key="leadId" :lead_id="leadId" :ver_detalles="true"></LeadHistoricView>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
    <v-dialog v-model="llamada.show" max-width="800px">
      <CallcenterRegistrarLlamada
        :key="leadId"
        :lead_id="leadId"
        :ocultar="false"
        @cerrar="cerrarDialog"
        @actualizar="actualizar"
        @copiarDatoParent="copiarDato"
      ></CallcenterRegistrarLlamada>
    </v-dialog>
    <v-dialog v-model="llamadaApoyoFinanciero.show" max-width="800px">
      <RegistrarLlamadaApoyoFinanciero
        :key="leadId"
        :lead_id="leadId"
        :ocultar="false"
        @cerrar="cerrarDialogApoyoFinanciero"
        @actualizar="actualizar"
        @copiarDatoParent="copiarDato"
      ></RegistrarLlamadaApoyoFinanciero>
    </v-dialog>
  </div>
</template>
<script>
import { mapState, mapGetters, mapActions, mapMutations } from "vuex";

import CallcenterRegistrarLlamada from "@/components/Callcenter/CallcenterRegistrarLlamada";
import RegistrarLlamadaApoyoFinanciero from "@/components/ApoyoFinanciero/RegistrarLlamada";
import LeadHistoricView from "@/components/Leads/Detail/LeadHistoricView";

export default {
  name: "LeadsDetailView",
  components: {
    RegistrarLlamadaApoyoFinanciero,
    CallcenterRegistrarLlamada,
    LeadHistoricView,
  },
  data: () => ({
    loading: false,
    dialog: false,
    lead: {
      primer_nombre: null,
      segundo_nombre: null,
      primer_apellido: null,
      segundo_apellido: null,
      telefono: null,
      sede: null,
      email: null,
      origen: null,
      llamadas: [],
    },
    listado: {},
    headerSeguimientos: [
      { text: "", value: "tipo" },
      { text: "Fecha", value: "fecha" },
      { text: "Usuario", value: "usuario.nombre" },
      { text: "Llamar", value: "accion" },
      { text: "Observación", value: "observacion" },
    ],
    detalles: [],
    llamada: {
      show: false,
    },
    llamadaApoyoFinanciero: {
      show: false,
    },
    estados: {},
  }),
  mounted() {
    this.traerLead();
    this.traerOrigenes();
    this.traerEstados();
  },
  methods: {
    ...mapActions({
      listarOrigenes: "listado/fetchListaLeads",
      solicitarApoyoFinanciero:'callcenter/solicitarAF',
      solicitarCallcenter: "callcenter/solicitar",
      fetchDetalle: "leads/fetchDetalle",
      listarEstados: 'listado/fetchListaLlamadas',
    }),
    ...mapMutations({
      setInfo: "setInfo",
    }),
    traerOrigenes() {
      this.listarOrigenes()
        .then((result) => {
          this.listado = result;
        })
        .catch((error) => {
          console.log(error);
        })
        .finally(() => {});
    },
    regresar() {
      this.$router.back();
    },
    cerrarDialog() {
      this.llamada.show = false;
    },
    cerrarDialogApoyoFinanciero() {
      this.llamadaApoyoFinanciero.show = false;
    },
    actualizar() {
      this.traerLead();
    },
    copiarDato(value) {
      this.$copyText(value)
        .then(() => {
          this.setInfo("Copiado en list:" + value);
        })
        .catch((error) => {
          console.log(error);
          this.setInfo(error);
        });
    },
    ////////////////////
    traerLead() {
      this.viewItemConsulta();
    },
    puedeSolicitar() {
      if (
        !this.lead.deleted_at &&
        this.lead.ultima_llamada &&
        this.lead.ultima_llamada.estado == "pendiente"
      ) {
        return true;
      }
      return false;
    },
    puedeSolicitarApoyoFinanciero(){
        if((!this.lead.deleted_at && this.lead.af_ultima_llamada && ['pendiente','terminado'].includes(this.lead.af_ultima_llamada.estado)) || (!this.lead.af_ultima_llamada)){
            return true
        }
        return false
    },
    iniciarSolicitar() {
      this.loading = true;
      this.solicitarCallcenter({ id_lead: this.leadId })
        .then((result) => {
          if (result.result == "ok") {
            this.viewItem();
          }
          if (result.result == "llamando") {
            this.setInfo("Ya fue asignado");
          }
        })
        .finally(() => {
          this.loading = false;
        });
    },
    iniciarSolicitarApoyoFinanciero() {
      this.loading = true;
      this.solicitarApoyoFinanciero({ id_lead: this.leadId })
        .then((result) => {
          if (result.result == "ok") {
            this.viewItemApoyoFinanciero();
          }
          if (result.result == "llamando") {
            this.setInfo("Ya fue asignado");
          }
        })
        .finally(() => {
          this.loading = false;
        });
    },
    estaAsignado() {
        if ( this.lead.ultima_llamada && this.lead.ultima_llamada.estado == "llamando" && this.lead.ultima_llamada.agente ) {
            return true;
        }
        return false;
    },
    estaAsignadoApoyoFinanciero() {
        if(this.lead.af_ultima_llamada && this.lead.af_ultima_llamada.estado == 'llamando' && this.lead.af_ultima_llamada.agente && this.lead.af_ultima_llamada.agente.email == this.user.email){
            return true
        }
        return false
    },
    iniciarCerrar() {
      this.viewItem();
    },
    iniciarCerrarApofoFinanciero(){
        this.viewItemApoyoFinanciero()
    },
    historyOnly() {
      this.setInfo("Ya lo llamaron");
      this.llamada.show = true;
      this.llamada.llamada = false;
    },
    historyOnlyApoyoFinanciero() {
      this.setInfo("Ya lo llamaron");
      this.llamadaApoyoFinanciero.show = true;
      this.llamadaApoyoFinanciero.llamada = false;
    },
    viewItem() {
      this.loading = true;
      this.fetchDetalle({ id: this.leadId })
        .then((result) => {
          if (result.datos && result.datos.uid) {
            let phoneCopy = result.datos.uid;
            if (phoneCopy) {
              if (phoneCopy.startsWith("57")) {
                phoneCopy = phoneCopy.substring(2);
              }
              if (phoneCopy.length == 10) {
                phoneCopy = "9" + phoneCopy;
              }
              this.$copyText(phoneCopy)
                .then(() => {
                  this.setInfo("Autorizado y Copiado");
                })
                .catch((error) => {
                  console.log(error);
                });
            }
          }
          this.llamada.show = true;
          this.llamada.llamada = true;
        })
        .finally(() => {
          this.loading = false;
        });
    },
    viewItemApoyoFinanciero() {
      this.loading = true;
      this.fetchDetalle({ id: this.leadId })
        .then((result) => {
          if (result.datos && result.datos.uid) {
            let phoneCopy = result.datos.uid;
            if (phoneCopy) {
              if (phoneCopy.startsWith("57")) {
                phoneCopy = phoneCopy.substring(2);
              }
              if (phoneCopy.length == 10) {
                phoneCopy = "9" + phoneCopy;
              }
              this.$copyText(phoneCopy)
                .then(() => {
                  this.setInfo("Autorizado y Copiado");
                })
                .catch((error) => {
                  console.log(error);
                });
            }
          }
          this.llamadaApoyoFinanciero.show = true;
          this.llamadaApoyoFinanciero.llamada = true;
        })
        .finally(() => {
          this.loading = false;
        });
    },
    viewItemConsulta() {
      this.loading = true;
      this.fetchDetalle({ id: this.leadId })
        .then((result) => {
          if (result.datos) {
            this.lead = result.datos;
          }
        })
        .finally(() => {
          this.loading = false;
        });
    },
    getEstado(value) {
        if (this.estados && this.estados.llamadas) {
            let result = this.estados.llamadas.find(x => x.value == value);
            if (result) return result.text;
        }
        return value;
    },
    traerEstados() {
        this.listarEstados()
            .then(result => {
                this.estados = result;
            })
            .catch(error => {
                console.log(error)
            }).finally(() => {

            });
    },
    formatDate(value){
        if (value instanceof Date)
            return this.$moment(value).format('DD/MM/YYYY h:mm a')
        else {
          let result = this.$moment(value).format('DD/MM/YYYY h:mm a')
          if (result === 'Invalid date') {
            return value;
          } else {
            return result;
          }
        }
    }
    ////////////LLAMADAS
  },
  computed: {
    ...mapState({
      error: (state) => state.error,
    }),
    ...mapGetters({
      permiso: 'auth/permiso', 
    }),
    getTitle() {
      return "Leads";
    },
    getOrigen() {
      return this.lead.nombre_origen;
    },
    getComoLlego() {
      return this.lead.como_llego;
    },
    getComoSeEntero() {
      return this.lead.como_se_entero;
    },
    getProgramaInteres() {
      return this.lead.programa_interes;
    },
    getAgente() {
      if (this.listado && this.listado.agentes) {
        let agente = this.listado.agentes.find(
          (x) => x.email == this.lead.agente
        );
        if (agente) {
          return `${agente.primer_nombre} ${agente.primer_apellido}`;
        }
      }
      return this.lead.agente;
    },
    getObservacion() {
      if (this.lead.observacion) {
        return this.lead.observacion;
      }
      if (this.lead.descartado_motivo) {
        return this.lead.descartado_motivo;
      }
      if (this.lead.errado_motivo) {
        return this.lead.errado_motivo;
      }
      return "Sin observaciones";
    },
    leadId() {
      return this.$route.params.id;
    },
  },
};
</script>