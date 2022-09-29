<template>
  <div>
    

    <v-toolbar flat light dense color="blue lighten-5">
    
      <v-toolbar-title>
        {{getTitle}}
      </v-toolbar-title>
      <v-spacer></v-spacer>

      <v-toolbar-items>
        <v-subheader>{{pagination.total}} registros</v-subheader>
        <!--
      <v-btn v-if="lista.length>0" flat small color="info" dark @click="descargarReporte">
        <v-icon>cloud_download</v-icon>
      </v-btn>
    -->
    <v-btn  small color="info" dark @click="transferir">
        <v-icon>sync_alt</v-icon>
    </v-btn>
    
    <v-btn small color="info" dark>
        <download-excel
            :data   = "lista"
            :fields = "json_fields">
            <v-icon smallclass="mr-2">
                file_download
            </v-icon>
        </download-excel>
    </v-btn>
    <v-btn  small color="info" dark @click="actualizar">
        <v-icon>autorenew</v-icon>
    </v-btn>
    
    
    </v-toolbar-items>
    
  </v-toolbar>

  <v-data-table
      :headers="headers"
      :items="lista"
      :loading="loading"
      loading-text="Loading... Please wait"
      class="elevation-1"
  >

    <template v-slot:[`item.action`]="{ item }">
      <v-icon
        small
        class="mr-2"
        @click="editItem(item)"
      >
        edit
      </v-icon>
      
    </template>
    <template v-slot:[`item.checkbox`]="{ item }">
      <v-checkbox
      v-model="item.check"
      ></v-checkbox>
      
    </template>
    <template v-slot:[`item.ultima_llamada.fecha_solicitado`]="{ item }">
        <span>{{presentDate(item.ultima_llamada.fecha_solicitado)}}</span>
    </template>

    </v-data-table>
    <v-dialog v-model="newDialog" persistent max-width="560px">
            <Transferir :orientador_id="orientadorId" :datos_seleccionado="seleccionados" @cerrar="cerrarDialog"></Transferir>
        </v-dialog>
  </div>
</template>

<script>
    import {mapState, mapGetters, mapActions, mapMutations} from 'vuex';

    //import Vue from 'vue';
    import Transferir from '@/components/Coordinador/Transferir'
    export default {
        name: 'OrientadorDatosList',
        components: {
            Transferir
        },
        data () {
        return {
            headers: [
                { text: 'ID', value: 'numero' },
                { text: 'Nombre', value: 'full_name' },
                { text: 'Email', value: 'email' },
                { text: 'Móvil', value: 'movil' },
                { text: 'Sede', value: 'sede_full.nombre' },
                { text: 'Fecha Llamar', value: 'ultima_llamada.fecha_solicitado' },
                { text: 'Estado Llamada', value: 'ultima_llamada.estado' },
                { text: '', value: 'checkbox' },
            ],
            json_fields:{
                "ID": "numero",
                "Nombre": "full_name",
                "Email": "email",
                "Móvil": "movil",
                "Sede": "sede_full.nombre",
                "Fecha Llamar": "ultima_llamada.fecha_solicitado",
                "Estado Llamada": "ultima_llamada.estado",
                "Ultimo Estado": "ultima_llamada_estado",
                "Perfil": "ultima_llamada.agente.perfil",
            },
            orientadorId:null,
            seleccionados:[],
            newDialog : false,
            loading: false,
            rowsPerPage : [100],
            search: '',
            payload: {},
            detallesOpened:[]
        }
        },
        props : {
        
        },
        
        mounted () {
            this.actualizar()
        },
        methods:{
            ...mapActions({
                fetchLista: 'orientadores/getDatosOrientadores',
                fetchFranjas: 'agenda/fetchFranjas',
            }),
            ...mapMutations({
                setInfo: 'setInfo',
            }),
            actualizar(){
                this.loading = true;
                this.orientadorId=this.$route.params.id;
                this.fetchLista({id:this.$route.params.id})
                .finally(()=>{
                this.loading = false;
                })
            },
            dirigir(value){
                this.$router.push(value)
            },
            iniciarNuevo(){
                
            },
            cerrarDialog(){
                this.newDialog = false;
                this.actualizar();
            },
            editItem(item){
                console.log(item)
            },
            presentDate(value){
                if (value) {
                    return this.$moment(value).format('DD-MM-YYYY h:mm a');
                }
                return '';
            },
            transferir(){
                let result =this.lista.filter(x => x.check);
                if (result && result.length > 0) {
                    this.seleccionados = result.map(x => x.numero);
                    this.newDialog = true
                } else {
                    this.setInfo("No ha seleccionado algún elemento de la lista")
                }
            }
        
        },
        computed: {
        ...mapState({
            lista: state => state.orientadores.datos,
            pagination: state => state.orientadores.pagination,
        }),
        ...mapGetters({
            detalle: 'plantillas/getDetalle', 
        }),
        getTitle(){
            return 'Datos - Orientadores'
        },
        
        orientadorIdDialog(){
            if(this.orientadorSeleccionado){
            return this.orientadorSeleccionado._id
            }else{
            return null
            }
            
        }   

        }
    }
</script>
