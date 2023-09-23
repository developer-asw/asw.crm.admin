<template>
    <!-- dark -->
    <v-col cols="12" md="12">
        <h2>Datos Matricula</h2>
        
        <div v-if="adicional.matricula && adicional.matricula.ultima">
            <h3>Programa adquirido</h3>
            <p>{{adicional.matricula ? adicional.matricula.ultima.modulo : '' }}</p>
            
            <h3>Forma de pago</h3>
            <p>{{adicional.matricula ? adicional.matricula.ultima.forma_pago : '' }}</p>
            
            <h3>Vigencia</h3>
            <p>{{adicional.matricula ? adicional.matricula.ultima.fecha_vigencia : '' }}</p>
            
            <h3>Orientador</h3>
            <p>{{adicional.matricula ? adicional.matricula.ultima.orientador : '' }}</p>
            
            <h3>Puntos</h3>
            <p>{{adicional.matricula ? adicional.matricula.ultima.puntos : '' }}</p>
            
        </div>
        
    </v-col>
    
    </template>
    
    <script>
    
    import { mapState, mapGetters, mapActions, mapMutations } from 'vuex';//,,
    
    export default {
        name: 'EditLead',
        components: {

        },
        data: () => ({
            adicional: {},
        }),
        props: {
            lead_id: String,
        },
        mounted() {
            this.verificar();
        },
        methods: {
            ...mapActions({
                fetchAdicional: 'leads/fetchAdicional'
            }),
            ...mapMutations({
                setInfo: 'setInfo',
                setError: 'setError',
            }),
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
            verificar() {
                this.viewItem()
            },
            viewItem() {
                if (this.lead_id)
                this.fetchAdicional({id:this.lead_id}).then((result) => {
                    if (result && result.datos) {
                        this.adicional = result.datos;
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
                permiso: 'auth/permiso', 
            }),
            getTitle() {
                return 'Registro de llamada'
            }
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