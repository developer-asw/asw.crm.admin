<template>
    <v-row>
        <v-col cols="12" sm="1">

        </v-col>
        <v-col cols="12" sm="10" class="px-10 py-8">
            <div>
                <v-sheet tile height="54" class="d-flex">
                      <v-btn icon class="ma-2" @click="$refs.calendar.prev()">
                          <v-icon>mdi-chevron-left</v-icon>
                      </v-btn>
                      <v-select
                          v-model="type" :items="types" dense outlined hide-details class="ma-2" label="type">
                      </v-select>
                      <v-select
                          v-model="mode" :items="modes" dense outlined hide-details label="event-overlap-mode" class="ma-2">
                      </v-select>
                      <v-select
                          v-model="weekday" :items="weekdays" dense outlined hide-details label="weekdays" class="ma-2">
                      </v-select>
                      <v-spacer></v-spacer>
                      <v-btn icon class="ma-2" @click="$refs.calendar.next()">
                          <v-icon>mdi-chevron-right</v-icon>
                      </v-btn>
                  </v-sheet>
                  <v-sheet height="600">
                      <v-calendar
                      ref="calendar"
                      v-model="value"
                      :weekdays="weekday"
                      :type="type"
                      :events="events"
                      :event-overlap-mode="mode"
                      :event-overlap-threshold="30"
                      :event-color="getEventColor"
                      @change="getEvents"
                      ></v-calendar>
                  </v-sheet>
              </div>
        </v-col>
    </v-row>
</template>

<script>
import {mapState, mapActions, mapMutations, mapGetters} from 'vuex';
import Vue from 'vue'
import VueClipboard from 'vue-clipboard2'

Vue.use(VueClipboard)

export default {
    name: 'Calendario',
    components: {
      
    },
    data () {
        return {
            headers: [
                { text: 'ID', value: 'id' },
                { text: 'Nombre', value: 'clave' },
                { text: 'Descripción', value: 'descripcion' },
                { text: 'Valor', value: 'valor' },
                { text: 'Actions', value: 'actions', sortable: false }
            ],
            loading: false,
            rowsPerPage : [100],
            search: '',
            payload: {
                prioridad: 1,
            },
            //// Edits elementes
            editedIndex: -1,
            dialog: false,
            dialogDelete: false,
            registro: {},
            ///////////
            type: 'month',
            types: ['month', 'week', 'day', '4day'],
            mode: 'stack',
            modes: ['stack', 'column'],
            weekday: [0, 1, 2, 3, 4, 5, 6],
            weekdays: [
                { text: 'Sun - Sat', value: [0, 1, 2, 3, 4, 5, 6] },
                { text: 'Mon - Sun', value: [1, 2, 3, 4, 5, 6, 0] },
                { text: 'Mon - Fri', value: [1, 2, 3, 4, 5] },
                { text: 'Mon, Wed, Fri', value: [1, 3, 5] },
            ],
            value: '',
            events: [],
            colors: ['blue', 'indigo', 'deep-purple', 'cyan', 'green', 'orange', 'grey darken-1'],
            names: ['Meeting', 'Holiday', 'PTO', 'Travel', 'Event', 'Birthday', 'Conference', 'Party'],
        }
    },
    props : {
        query: Object,
    },
    mounted() {
        if (!this.permiso('OP_CONF_PARAMETROS')) {
            this.$router.push(this.url_no_permitida)
        } else {
            this.actualizar();
        }
    },
    methods:{
      ...mapActions({
            fetchLista: 'management/fetchParameters',
            saveRecordParameter: 'management/saveRecordParameter'
      }),
      ...mapMutations({
          setInfo: 'setInfo',
      }),
      actualizar(){
          this.loading = true;
          this.fetchLista(this.payload)
          .finally(() => {
              this.loading = false;
          })
      },
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
        presentDate(value){
            return this.$moment(value).format('DD-MM-YYYY h:mm a')
        },
        saveParametro(record) {
            this.loading = true;
            this.saveRecordParameter(record)
            .then((result) => {
                    if (result && result.mensaje) this.setInfo(result.mensaje)
                    else this.setInfo('Vuelva a actualizar la pagina para verificar que los cambios fueron realizados')
            })
            .finally(() => {
                this.loading = false;
            })
        },
        ////////////////
        editItem (item) {
            this.editedIndex = this.lista.indexOf(item)
            this.registro = Object.assign({}, item)
            this.dialog = true
        },

        deleteItem (item) {
            this.editedIndex = this.lista.indexOf(item)
            this.registro = Object.assign({}, item)
            this.dialogDelete = true
        },

        deleteItemConfirm () {
            this.lista.splice(this.editedIndex, 1)
            this.closeDelete()
        },

        close () {
            this.dialog = false
            this.$nextTick(() => {
            this.registro = Object.assign({}, this.defaultItem)
            this.editedIndex = -1
            })
        },

        closeDelete () {
            this.dialogDelete = false
            this.$nextTick(() => {
            this.registro = Object.assign({}, this.defaultItem)
            this.editedIndex = -1
            })
        },

        save () {
            if (this.editedIndex > -1) {
                Object.assign(this.lista[this.editedIndex], this.registro)
            } else {
                this.lista.push(this.registro)
            }
            this.saveParametro(this.registro);
            this.close()
        },

        /////////////////
        getEvents ({ start, end }) {
            const events = []

            const min = new Date(`${start.date}T00:00:00`)
            const max = new Date(`${end.date}T23:59:59`)
            const days = (max.getTime() - min.getTime()) / 86400000
            const eventCount = this.rnd(days, days + 20)

            for (let i = 0; i < eventCount; i++) {
            const allDay = this.rnd(0, 3) === 0
            const firstTimestamp = this.rnd(min.getTime(), max.getTime())
            const first = new Date(firstTimestamp - (firstTimestamp % 900000))
            const secondTimestamp = this.rnd(2, allDay ? 288 : 8) * 900000
            const second = new Date(first.getTime() + secondTimestamp)

            events.push({
                name: this.names[this.rnd(0, this.names.length - 1)],
                start: first,
                end: second,
                color: this.colors[this.rnd(0, this.colors.length - 1)],
                timed: !allDay,
            })
            }

            this.events = events
        },
        getEventColor (event) {
            return event.color
        },
        rnd (a, b) {
            return Math.floor((b - a + 1) * Math.random()) + a
        },
    },
    computed: {
        ...mapState({
            lista: state => state.management.parameters,
            pagination: state => state.callcenter.pagination,
            url_no_permitida: state => state.auth.url_no_permitida,
            user: state => state.auth.user_info,   
        }),
        ...mapGetters({
            permiso: 'auth/permiso',
        }),
        getValoresValidos() {
            let result = [];
            if(this.registro.valores_validos) {
                result = this.registro.valores_validos.split(",");
                return result;
            }
            return result;
        },
        formTitle () {
            return this.editedIndex === -1 ? 'Nuevo' : 'Editar'
        },
        getTitle(){
            return 'Parámetros'
        }
    },
    watch: {
        dialog (val) {
            val || this.close()
        },
        dialogDelete (val) {
            val || this.closeDelete()
        }
    }
}
</script>