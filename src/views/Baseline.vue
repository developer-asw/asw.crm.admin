<template>
    <v-app id="inspire">
        

        <v-navigation-drawer
        v-model="drawer"
        app dark
        class="blue-grey overflow-y-auto theme--light light"
        >
            <v-overlay :value="overlay" class="align-center justify-center">
                <v-progress-circular color="primary" indeterminate size="64"></v-progress-circular>
            </v-overlay>
            <v-list dense>

                <!-- <img src="https://www.americanschoolway.edu.co/wp-content/uploads/2020/02/logo_header_Asw_18a.jpg"/> -->
                <v-img :aspect-ratio="36/9" src="https://www.americanschoolway.edu.co/wp-content/uploads/2019/12/logo_Asw.png">
                    <v-row align="end" class="lightbox white--text pa-2 fill-height">
                        <!-- <v-col>
                          <div class="subheading">{{getNombres}}</div>
                          <div class="body-1">heyfromjonathan@gmail.com</div>
                        </v-col> -->
                    </v-row>
                </v-img>

                <v-list-item>
                    <v-list-item-content>
                        <v-list-item-title class="text-right">{{getNombres}}</v-list-item-title>
                    </v-list-item-content>
                </v-list-item>

                <v-divider></v-divider>

                <v-list-item-group v-model="model">

                    <v-list-item v-if="isLogged && user" link @click="dirigir('/')">
                        <v-list-item-action>
                            <v-icon>home</v-icon>
                        </v-list-item-action>
                        <v-list-item-content>
                            <v-list-item-title>Inicio</v-list-item-title>
                        </v-list-item-content>
                    </v-list-item>
                    <v-list-item v-if="isLogged && permiso('OP_PANEL')" link @click="dirigir('/dashboard')">
                        <v-list-item-action>
                            <v-icon>dashboard</v-icon>
                        </v-list-item-action>
                        <v-list-item-content>
                            <v-list-item-title>Dashboard</v-list-item-title>
                        </v-list-item-content>
                    </v-list-item>
                    <!-- <v-list-item v-if="isLogged && user && (user.rol == 'coordinador' || user.rol == 'superusuario') && permiso('EF995E25')" link @click="dirigir('/leads')">
                        <v-list-item-action>
                            <v-icon>contact_mail</v-icon>
                        </v-list-item-action>
                        <v-list-item-content>
                            <v-list-item-title>Leads</v-list-item-title>
                        </v-list-item-content>
                    </v-list-item> -->

                    <v-list-group v-if="isLogged && permiso('OP_LEAD')" no-action sub-group>
                        <template v-slot:activator>
                            <v-list-item-content>
                                <v-list-item-title>Leads</v-list-item-title>
                            </v-list-item-content>
                        </template>

                        <v-list-item v-if="isLogged && permiso('OP_LEAD_NUEVO')" link @click="dirigir('/lead/new')">
                            <v-list-item-action>
                                <v-icon>add</v-icon>
                            </v-list-item-action>
                            <v-list-item-content>
                                <v-list-item-title>Nuevo</v-list-item-title>
                            </v-list-item-content>
                        </v-list-item>
                    </v-list-group>

                    <v-list-group v-if="isLogged && permiso('OP_CALLCENTER')"
                    no-action
                    sub-group
                    value="true"
                    >
                        <template v-slot:activator>
                            <v-list-item-content>
                                <v-list-item-title v-if="user && [8,10,11].includes(user.perfil_id)">Callcenter</v-list-item-title>
                                <v-list-item-title v-else>Coordinador</v-list-item-title>
                                <!--<v-list-item-title>Gestión</v-list-item-title>-->
                            </v-list-item-content>
                        </template>
                        <!-- && permiso('A8229B00') -->
                        <v-list-item v-if="isLogged && permiso('OP_AGENTE')" link @click="dirigir('/callcenter')">
                            <v-list-item-action>
                                <v-icon>call</v-icon>
                            </v-list-item-action>
                            <v-list-item-content>
                                <v-list-item-title>Agente</v-list-item-title>
                            </v-list-item-content>
                        </v-list-item>
                        <v-list-item v-if="isLogged && permiso('OP_CONSULTA_SEGUIMIENTO')" link @click="dirigir('/consultas/seguimientos')">
                            <v-list-item-action>
                                <v-icon>calendar_today</v-icon>
                            </v-list-item-action>
                            <v-list-item-content>
                                <v-list-item-title>Mis seguimientos</v-list-item-title>
                            </v-list-item-content>
                        </v-list-item>
                        <v-list-item v-if="isLogged && permiso('OP_APOYO_FINANCIERO')" link @click="dirigir('/apoyofinanciero/matriculados')">
                            <v-list-item-action>
                                <v-icon>credit_card</v-icon>
                            </v-list-item-action>
                            <v-list-item-content>
                                <v-list-item-title>Apoyo Financiero</v-list-item-title>
                            </v-list-item-content>
                        </v-list-item>
                        <v-list-item v-if="isLogged && permiso('OP_AF_SEGUIMIENTO')" link @click="dirigir('/apoyofinanciero/seguimientos')">
                            <v-list-item-action>
                                <v-icon>calendar_today</v-icon>
                            </v-list-item-action>
                            <v-list-item-content>
                                <v-list-item-title>Mis seguimientos</v-list-item-title>
                            </v-list-item-content>
                        </v-list-item>
                        <!--<v-list-item v-if="isLogged && user && user.rol == 'coordinador'" link @click="dirigir('/venta_telefonica')">
                            <v-list-item-action>
                                <v-icon>call</v-icon>
                            </v-list-item-action>
                            <v-list-item-content>
                                <v-list-item-title>Venta Teléfonica</v-list-item-title>
                            </v-list-item-content>
                        </v-list-item>-->
                        <v-list-item v-if="isLogged && permiso('OP_CONVENIO')" link @click="dirigir('/callcenter/convenio')">
                            <v-list-item-action>
                                <v-icon>thumb_up</v-icon>
                            </v-list-item-action>
                            <v-list-item-content>
                                <v-list-item-title>Convenio</v-list-item-title>
                            </v-list-item-content>
                        </v-list-item>
                        
                        <!-- && permiso('2BF48DCE') -->
                        <v-list-item v-if="isLogged && permiso('OP_COORDINADOR')" link @click="dirigir('/callcenter_coordinator')">
                            <v-list-item-action>
                                <v-icon>archive</v-icon>
                            </v-list-item-action>
                            <v-list-item-content>
                                <v-list-item-title>Coordinator</v-list-item-title>
                            </v-list-item-content>
                        </v-list-item>
                        <v-list-item v-if="isLogged && permiso('OP_ORIENTADORES')" link @click="dirigir('/coordinador/orientadores')">
                            <v-list-item-action>
                                <v-icon>account_circle</v-icon>
                            </v-list-item-action>
                            <v-list-item-content>
                                <v-list-item-title>Orientadores</v-list-item-title>
                            </v-list-item-content>
                        </v-list-item>
                    </v-list-group>
                    
                    <!--<v-list-group 
                    v-if="isLogged  && (user.rol == 'superusuario')" 
                    no-action 
                    sub-group
                    >
                        <template v-slot:activator>
                            <v-list-item-content>
                                <v-list-item-title>CRM</v-list-item-title>
                            </v-list-item-content>
                        </template>

                        <v-list-item 
                        v-if="isLogged && user && (user.rol == 'coordinador' || user.rol == 'superusuario')" 
                        link 
                        @click="dirigir('/CRM/Importar')">
                            <v-list-item-action>
                                <v-icon>import_export</v-icon>
                            </v-list-item-action>
                            <v-list-item-content>
                                <v-list-item-title>Importar</v-list-item-title>
                            </v-list-item-content>
                        </v-list-item>
                         <v-list-item v-if="isLogged" link @click="dirigir('/CRM/Consultar')">
                            <v-list-item-action>
                                <v-icon>filter_list</v-icon>
                            </v-list-item-action>
                            <v-list-item-content>
                                <v-list-item-title>Consultar</v-list-item-title>
                            </v-list-item-content>
                        </v-list-item> 

                    </v-list-group>-->

                    <v-list-group v-if="isLogged && permiso('OP_REPORTE')" no-action sub-group>
                        <template v-slot:activator>
                          <v-list-item-content>
                            <v-list-item-title>Reportes</v-list-item-title>
                          </v-list-item-content>
                        </template>
                        <v-list-item v-if="isLogged && permiso('OP_REPORTE_HITS')" link @click="dirigir('/Reportes/Hits')">
                            <v-list-item-action>
                                <v-icon>filter_list</v-icon>
                            </v-list-item-action>
                            <v-list-item-content>
                                <v-list-item-title>Hits</v-list-item-title>
                            </v-list-item-content>
                        </v-list-item>
                        <v-list-item v-if="isLogged && permiso('OP_REPORTE_CITAS')" link @click="dirigir('/Reportes/Citas')">
                            <v-list-item-action>
                                <v-icon>filter_list</v-icon>
                            </v-list-item-action>
                            <v-list-item-content>
                                <v-list-item-title>Citas</v-list-item-title>
                            </v-list-item-content>
                        </v-list-item>
                        <!--<v-list-item v-if="isLogged && user" link @click="dirigir('/Reportes/Leads')">
                            <v-list-item-action>
                                <v-icon>filter_list</v-icon>
                            </v-list-item-action>
                            <v-list-item-content>
                                <v-list-item-title>Leads</v-list-item-title>
                            </v-list-item-content>
                        </v-list-item>-->
                        <v-list-item v-if="isLogged && permiso('OP_REPORTE_LLAMADAS')" link @click="dirigir('/Reportes/Llamadas')">
                            <v-list-item-action>
                                <v-icon>filter_list</v-icon>
                            </v-list-item-action>
                            <v-list-item-content>
                                <v-list-item-title>Llamadas</v-list-item-title>
                            </v-list-item-content>
                        </v-list-item>
                        <v-list-item v-if="isLogged && permiso('OP_REPORTE_TAREAS')" link @click="dirigir('/Reportes/Agentes')">
                            <v-list-item-action>
                                <v-icon>filter_list</v-icon>
                            </v-list-item-action>
                            <v-list-item-content>
                                <v-list-item-title>Tareas</v-list-item-title>
                            </v-list-item-content>
                        </v-list-item>
                    </v-list-group>
                    
                                        
                    <v-list-group v-if="isLogged && permiso('OP_ADM')" no-action sub-group>
                        <template v-slot:activator>
                            <v-list-item-content>
                                <v-list-item-title>Administración</v-list-item-title>
                            </v-list-item-content>
                        </template>
                        
                        <v-list-item v-if="isLogged && permiso('OP_ADM_USUARIOS')" link @click="dirigir('/administracion/usuarios')">
                            <v-list-item-action>
                                <v-icon>group</v-icon>
                            </v-list-item-action>
                            <v-list-item-content>
                                <v-list-item-title>Usuarios</v-list-item-title>
                            </v-list-item-content>
                        </v-list-item>

                        <v-list-item v-if="isLogged && permiso('OP_ADM_PERFILES')" link @click="dirigir('/administracion/perfiles')">
                            <v-list-item-action>
                                <v-icon>group</v-icon>
                            </v-list-item-action>
                            <v-list-item-content>
                                <v-list-item-title>Perfiles</v-list-item-title>
                            </v-list-item-content>
                        </v-list-item>
                        <v-list-item v-if="isLogged && permiso('OP_ADM_PERMISOS')" link @click="dirigir('/administracion/permisos')">
                            <v-list-item-action>
                                <v-icon>group</v-icon>
                            </v-list-item-action>
                            <v-list-item-content>
                                <v-list-item-title>Permisos</v-list-item-title>
                            </v-list-item-content>
                        </v-list-item>
                    </v-list-group>

                    <v-list-group v-if="isLogged && permiso('OP_CONF')" no-action sub-group>
                        <template v-slot:activator>
                            <v-list-item-content>
                                <v-list-item-title>Configuración</v-list-item-title>
                            </v-list-item-content>
                        </template>
                        
                        <v-list-item v-if="isLogged && permiso('OP_PLANTILLAS')" link @click="dirigir('/plantillas')">
                            <v-list-item-action>
                                <v-icon>perm_media</v-icon>
                            </v-list-item-action>
                            <v-list-item-content>
                                <v-list-item-title>Plantillas</v-list-item-title>
                            </v-list-item-content>
                        </v-list-item>
                        
                        <v-list-item v-if="isLogged && permiso('OP_CONF_PARAMETROS')" link @click="dirigir('/setting/parameters')">
                            <v-list-item-action>
                                <v-icon>settings</v-icon>
                            </v-list-item-action>
                            <v-list-item-content>
                                <v-list-item-title>Parámetros</v-list-item-title>
                            </v-list-item-content>
                        </v-list-item>
                        <v-list-item v-if="isLogged && permiso('OP_CONF_DATOS')" link @click="dirigir('/setting/incoming_data')">
                            <v-list-item-action>
                                <v-icon>update</v-icon>
                            </v-list-item-action>
                            <v-list-item-content>
                                <v-list-item-title>Datos Entrantes</v-list-item-title>
                            </v-list-item-content>
                        </v-list-item>
                        <v-list-item v-if="isLogged && permiso('OP_CONF_CITAS')" link @click="dirigir('/setting/missed_appointments')">
                            <v-list-item-action>
                                <v-icon>pending_actions</v-icon>
                            </v-list-item-action>
                            <v-list-item-content>
                                <v-list-item-title>Citas Ausentes</v-list-item-title>
                            </v-list-item-content>
                        </v-list-item>
                        <v-list-item v-if="isLogged && permiso('OP_CONF_WOLKVOX')" link @click="dirigir('/setting/wolkvox')">
                            <v-list-item-action>
                                <v-icon>headphones</v-icon>
                            </v-list-item-action>
                            <v-list-item-content>
                                <v-list-item-title>Wolkvox</v-list-item-title>
                            </v-list-item-content>
                        </v-list-item>
                    </v-list-group>

                    
                    <v-list-item v-if="isLogged" link @click="dirigir('/profile/user')">
                        <v-list-item-action>
                            <v-icon>person</v-icon>
                        </v-list-item-action>
                        <v-list-item-content>
                            <v-list-item-title>Mi perfil</v-list-item-title>
                        </v-list-item-content>
                    </v-list-item>

                </v-list-item-group>

                <v-divider></v-divider>

                <v-list-item v-if="isLogged" link @click.prevent="processLogout()">
                    <v-list-item-action>
                        <v-icon>exit_to_app</v-icon>
                    </v-list-item-action>
                    <v-list-item-content>
                        <v-list-item-title>Cerrar</v-list-item-title>
                    </v-list-item-content>
                </v-list-item>

            </v-list>
            
            <v-divider></v-divider>

        </v-navigation-drawer>

        <v-app-bar
        app
        color="blue-grey"
        dark
        >
            <v-app-bar-nav-icon @click.stop="drawer = !drawer" />

            <v-toolbar-title>{{titulo}}</v-toolbar-title>
        </v-app-bar>


        <v-content>  
            <router-view></router-view>
        </v-content>

        

        <v-footer color="blue-grey" class="white--text text-center">
            <v-card-text>
                American School Way &copy; 2023 - v.1.4.0
            </v-card-text>
        </v-footer>
        
        <v-snackbar v-model="isErrorDialogShowed">
            {{ error }}
            <v-btn color="pink" text @click="hideError">
                Close
            </v-btn>
        </v-snackbar>
        
        <v-snackbar v-model="isInfoDialogShowed">
            {{ info }}
            <v-btn color="pink" text @click="hideInfo">
                Close
            </v-btn>
        </v-snackbar>
    </v-app>
</template>

<script>

import {mapState,mapGetters,mapActions,mapMutations} from 'vuex';

export default {
    data: () => ({
        drawer: null,
        model: 0,
        user:null,
        overlay:false,
    }),
    props: {
        //source: String
    },
    beforeMount() {
        this.consultarUsuario();
    },
    mounted() {
        if (this.user_logged.data && this.user_logged.data.nombre_perfil) {
            // console.log("Ok")
        } else {
            this.processLogout();
        }
    },
    methods:{
        ...mapActions({
            logout: 'auth/logout',
            getUsuario: 'auth/getUsuario',
        }),
        ...mapMutations({
            hideError: 'hideError',
            showError: 'showError',
            hideInfo: 'hideInfo',
            showInfo: 'showInfo',
            setInfo: 'setInfo',
        }),
        dirigir(value){
            this.$router.push(value)
        },
        processLogout () {
            this.logout().then(
                this.$router.push('/login')
            )
        },
        consultarUsuario(){
            this.overlay = true;
            this.getUsuario().then((result) => {
                this.user = result;
                this.overlay = false;
            }).finally(() =>  {
                this.overlay = false;
            })
        }
    },
    computed: {
        ...mapState({
            isLogged: state => state.auth.logged,
            user_logged: state => state.auth.user,
            processing: state => state.processing,
            error: state => state.error,
            isErrorShowed: state => state.isErrorShowed,
            warning: state => state.warning,
            info: state => state.info,
            isInfoShowed: state => state.isInfoShowed,
            reportedVersion: state => state.version,
            titulo: state => state.titulo ? state.titulo : "Automatic Lead Attention",
        }),
        ...mapGetters({
            permiso: 'auth/permiso', 
        }),
        getNombres(){
            if(this.user){
                return this.user.primer_nombre+' '+this.user.primer_apellido
            }
            return ''
        },
        esUsuario(){
            if(this.user && this.user.activo == 1) {
                return true;
            }else{
                return false;
            }
        },
        isErrorDialogShowed:{
            get(){
                return this.isErrorShowed
            },
            set(value){
                if(value){
                    this.showError()
                }else{
                    this.hideError()
                }
            }
        },
        isInfoDialogShowed:{
            get(){
                return this.isInfoShowed
            },
            set(value){
                if(value){
                    this.showInfo()
                }else{
                    this.hideInfo()
                }
            }
        },
    }
}
</script>

<style>
.v-list-item--link:before{
    background-color: #869ca7;
    color: white !important;
}
.v-list-item .v-application .primary--text {
    color: white !important;
    caret-color: #fff !important;
}
.light::-webkit-scrollbar {
  width: 15px;
}

.light::-webkit-scrollbar-track {
  background: #e6e6e6;
  border-left: 1px solid #dadada;
}

.light::-webkit-scrollbar-thumb {
  background: #b0b0b0;
  border: solid 3px #e6e6e6;
  border-radius: 7px;
}

.light::-webkit-scrollbar-thumb:hover {
  background: black;
}

.dark::-webkit-scrollbar {
  width: 15px;
}

.dark::-webkit-scrollbar-track {
  background: #202020;
  border-left: 1px solid #2c2c2c;
}

.dark::-webkit-scrollbar-thumb {
  background: #3e3e3e;
  border: solid 3px #202020;
  border-radius: 7px;
}

.dark::-webkit-scrollbar-thumb:hover {
  background: white;
}
</style>