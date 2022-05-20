<template>
<div>
    <v-toolbar flat light dense color="blue lighten-5">
        <!-- <v-toolbar-title>{{getTitle}}</v-toolbar-title> -->
        <v-spacer></v-spacer>
        <v-toolbar-items>
            <!-- <v-btn small color="info" dark @click="consultar">
                <v-icon>autorenew</v-icon>
            </v-btn> -->
        </v-toolbar-items>
    </v-toolbar>
    <v-container v-if="esUsuario()">

        <v-card>
            <v-card-title>
                <!-- List -->
                <v-row>
                    <v-spacer></v-spacer>
                    <v-col>
                        <v-radio-group class="small-radio" v-model="payload.tipo" row >
                            <v-radio label="Teléfono" value="telefono"></v-radio>
                            <v-radio label="ID" value="numero"></v-radio>
                            <v-radio label="E-mail" value="email"></v-radio>
                            <v-radio label="Nombre" value="nombre"></v-radio>
                        </v-radio-group>
                        <v-text-field
                            v-model="payload.search"
                            clearable
                            :append-outer-icon="payload.search ? 'search' : ''"
                            @click:append-outer="preFiltro"
                            :loading="loading"
                            label="Search"
                            single-line
                            hide-details>
                        </v-text-field>
                        <!--  -->
                    </v-col>
                    <v-spacer></v-spacer>
                </v-row>
            </v-card-title>
            <v-data-table
                v-if="lista && lista.length"
                :headers="headers"
                :items="lista"
                :loading="loading"
                :search="payload.search"
                loading-text="Loading... Please wait"
                class="elevation-1">
                <template v-slot:[`item.ultima_llamada.fecha_solicitado`]="{ item }">
                    <span v-if="item.ultima_llamada && item.ultima_llamada.fecha_solicitado">{{presentDate(item.ultima_llamada.fecha_solicitado)}}</span>
                </template>
                <template v-slot:[`item.full_name`]="{ item }">
                    <span @click="$copyText(item.full_name);setInfo(item.full_name)">{{item.full_name}}</span>
                </template>
                <template v-slot:[`item.movil`]="{ item }">
                    <span @click="$copyText(item.movil);setInfo(item.movil)">{{item.movil}}</span>
                </template>
                <template v-slot:[`item.email`]="{ item }">
                    <span @click="$copyText(item.email);setInfo(item.email)">{{item.email}}</span>
                </template>
                <template v-slot:[`item.action`]="{ item }">
                    <v-icon smallclass="mr-2" @click="dirigir(item)">
                        search
                    </v-icon>
                </template>
                <template v-slot:[`item.sede`]="{ item }">
                    <span v-if="item.sede_full">{{item.sede_full.nombre}}</span>
                    <span v-else>{{item.sede}}</span>
                </template>
            </v-data-table>
        </v-card>

    </v-container>
    <v-container v-else>
        <h1>Bienvenido a leads</h1>
    </v-container>
</div>

</template>

<script>

import { mapState, mapActions, mapMutations } from 'vuex';

export default {
name: 'Consultar',
    components: { 
        
    },
    data: () => ({
        loading: false,
        payload: {
            tipo: 'telefono',
            search: '',
        },
        headers: [
          { text: 'Próximo contacto', value: 'ultima_llamada.fecha_solicitado' },
          //{ text: 'Primer contacto', value: 'inicia_callcenter' },
          { text: 'Nombre', value: 'full_name' },
          { text: 'Móvil', value: 'movil' },
          { text: 'Email', value: 'email' },
          { text: 'Sede', value: 'sede' },
          { text: 'Agente', value: 'ultima_llamada.agente.nombre' },
          { text: 'Actions', value: 'action', sortable: false }
        ]

    }),
    mounted() {
        this.usuarioLogueado();
    },
    methods: {
        ...mapActions({
            usuarioLogueado: 'consultar/usuarioLogueado',
            filtro: 'consultar/filtro',
            fetchDetalle: 'leads/fetchDetalle',
        }),
        ...mapMutations({
            setInfo: 'setInfo',
            setError: 'setError',
        }),
        esUsuario(){
            if(this.user && this.user.data) {
                // 'callcenter'
                return ['recepcion', 'coordinador', 'superusuario'].indexOf(this.user.data.rol) >= 0
            }else{
                return false;
            }
        },
        getSedeUsuario(){
            if(this.user && this.user.data) {
                return this.user.data.sede_id;
            }else{
                return null;
            }
        },
        dirigir(value) {
            this.loading = true;
            this.fetchDetalle({id: value._id}).then((result) => {
                if(result && result.datos) {
                    this.$router.push(`/recepcion/${value._id}/view`)
                }else {
                    this.setInfo("No se pudo realizar la consulta, intente más tarde");
                }
            })
            .finally(() => {
                this.loading = false;
            })  
        },
        filtrar(filtro){
            this.loading = true;
            this.filtro(filtro)
            .finally(()=>{
                this.loading = false;
            })
        },
        preFiltro(){
            if(this.payload.search) {
                let filtro = this.payload;
                filtro.CheckTelefono = false;
                filtro.CheckEmail = false;
                filtro.CheckNombre = false;
                filtro.CheckNumero = false;
                switch(filtro.tipo) {
                    case 'telefono':
                    filtro.CheckTelefono = true;
                    break;
                    case 'email':
                    filtro.CheckEmail = true;
                    break;
                    case 'nombre':
                    filtro.CheckNombre = true;
                    break;
                    case 'numero':
                    filtro.CheckNumero = true;
                    break;
                }
                this.filtrar(filtro);
            } else{
                this.setInfo("Por favor, ingrese mas de 4 caracteres para realizar la busqueda")
            }
        },
        presentDate(value){
            return this.$moment(value).format('DD-MM-YYYY h:mm a')
        }
    },
    computed:{
        ...mapState({
            user: state => state.consultar.user,  
            lista: state => state.consultar.lista,
            pagination: state => state.consultar.pagination,
        }) 
    }
};
</script>
<style scoped>
    .small-radio i {
        font-size: 19px;
    }
    .small-radio label, .small-radio .v-input--selection-controls__input {
        font-size: 10px;
        padding-left: 0px;
        margin-left: -4px;
    }
    .small-radio .v-radio {
        padding: 0px;
    }
    .small-radio [class*="__ripple"] {
        left: 0;
    }
</style>