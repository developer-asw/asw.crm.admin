<template>
    <div>
        <v-toolbar flat light dense color="blue lighten-5">
            <v-toolbar-title>{{getTitle}}</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-toolbar-items>
                <!--<v-subheader>{{pagination.total}} registros</v-subheader>-->
                <v-subheader>{{lista.length}} registros</v-subheader>
                <v-btn small color="info" dark @click="actualizar" :disabled="loading">
                    <v-icon>autorenew</v-icon>
                </v-btn>
            </v-toolbar-items>
        </v-toolbar>
        <v-card>
            <v-card-title>
                <!--<v-select v-model="payload.prioridad" :items="prioridad" label="Prioridad" item-text="text" item-value="value" :disabled="loading" @change="actualizar"></v-select>-->

                <v-spacer></v-spacer>
                <v-text-field
                    v-model="payload.search"
                    append-icon="search"
                    clearable
                    label="Search"
                    single-line
                    hide-details
                    class="pa-0 ma-0">
                </v-text-field> 

            </v-card-title>
            <v-data-table
                dense
                :headers="headers"
                :items="lista"
                :search="payload.search"
                :loading="loading"
                loading-text="Loading... Please wait"
                class="elevation-2"
                :disabled="loading">
                <!--<template v-slot:[`item.full_name`]="{ item }">
                    <span @click="$copyText(item.full_name);setInfo(item.full_name)">{{item.full_name}}</span>
                </template>-->
                <template v-slot:top>
                    <v-toolbar flat>
                        <v-toolbar-title>My CRUD</v-toolbar-title>
                        <v-divider class="mx-4" inset vertical></v-divider>
                        <v-spacer></v-spacer>
                        <v-dialog v-model="dialog" max-width="500px">
                            <template v-slot:activator="{ on, attrs }">
                                <v-btn color="primary" dark class="mb-2" v-bind="attrs" v-on="on">New Item</v-btn>
                            </template>
                            <v-card>
                                <v-card-title>
                                    <span class="text-h5">{{ formTitle }}</span>
                                </v-card-title>
                                <v-card-text>
                                    <v-container>
                                        <v-row>
                                            <v-col cols="12">
                                                <v-text-field v-model="editedItem.clave" label="Nombre" :disabled="true"></v-text-field>
                                            </v-col>
                                            <v-col cols="12">
                                                <v-text-field v-model="editedItem.descripcion" label="Descripción"></v-text-field>
                                            </v-col>
                                            <v-col cols="12">
                                                <v-select v-if="editedItem.valores_validos && getValoresValidos.length > 0" v-model="editedItem.valor" label="valor" :items="getValoresValidos"></v-select>
                                                <v-text-field v-else v-model="editedItem.valor" label="valor"></v-text-field>
                                            </v-col>
                                        </v-row>
                                    </v-container>
                                </v-card-text>
                                <v-card-actions>
                                    <v-spacer></v-spacer>
                                    <v-btn color="blue darken-1" text @click="close">
                                        Cancel
                                    </v-btn>
                                    <v-btn color="blue darken-1" text @click="save">
                                        Save
                                    </v-btn>
                                </v-card-actions>
                            </v-card>
                        </v-dialog>
                        <v-dialog v-model="dialogDelete" max-width="500px">
                            <v-card>
                                <v-card-title class="text-h5">Are you sure you want to delete this item?</v-card-title>
                                    <v-card-actions>
                                        <v-spacer></v-spacer>
                                        <v-btn color="blue darken-1" text @click="closeDelete">Cancel</v-btn>
                                        <v-btn color="blue darken-1" text @click="deleteItemConfirm">OK</v-btn>
                                        <v-spacer></v-spacer>
                                    </v-card-actions>
                            </v-card>
                        </v-dialog>
                    </v-toolbar>
                </template>
                <template v-slot:[`item.actions`]="{ item }">
                    <v-icon small class="mr-2" @click="editItem(item)">
                        edit
                    </v-icon>
                    <!--<v-icon small @click="deleteItem(item)">
                        delete
                    </v-icon>-->
                </template>
            </v-data-table>
        </v-card>
    </div>
</template>

<script>
import {mapState, mapActions, mapMutations} from 'vuex';
import Vue from 'vue'
import VueClipboard from 'vue-clipboard2'

Vue.use(VueClipboard)

export default {
    name: 'Parameters',
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
            editedItem: {},
        }
    },
    props : {
        query: Object,
    },
    mounted() {
        this.actualizar();
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
        esUsuario(){
            if(this.user) {
                return ['callcenter', 'coordinador', 'superusuario', 'recepcion'].indexOf(this.user.rol) >= 0
            }else{
                return false;
            }
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
            this.editedItem = Object.assign({}, item)
            this.dialog = true
        },

        deleteItem (item) {
            this.editedIndex = this.lista.indexOf(item)
            this.editedItem = Object.assign({}, item)
            this.dialogDelete = true
        },

        deleteItemConfirm () {
            this.lista.splice(this.editedIndex, 1)
            this.closeDelete()
        },

        close () {
            this.dialog = false
            this.$nextTick(() => {
            this.editedItem = Object.assign({}, this.defaultItem)
            this.editedIndex = -1
            })
        },

        closeDelete () {
            this.dialogDelete = false
            this.$nextTick(() => {
            this.editedItem = Object.assign({}, this.defaultItem)
            this.editedIndex = -1
            })
        },

        save () {
            if (this.editedIndex > -1) {
                Object.assign(this.lista[this.editedIndex], this.editedItem)
            } else {
                this.lista.push(this.editedItem)
            }
            this.saveParametro(this.editedItem);
            this.close()
        }
    },
    computed: {
        ...mapState({
            lista: state => state.management.parameters,
            pagination: state => state.callcenter.pagination,
            user: state => state.auth.user,   
        }),
        getValoresValidos() {
            let result = [];
            if(this.editedItem.valores_validos) {
                result = this.editedItem.valores_validos.split(",");
                return result;
            }
            return result;
        },
        formTitle () {
            return this.editedIndex === -1 ? 'New Item' : 'Edit Item'
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