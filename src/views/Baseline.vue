<template>
  <v-app id="inspire">
    <v-navigation-drawer
      v-model="drawer"
      app
    >

    <v-list dense>

      <!-- <img src="https://www.americanschoolway.edu.co/wp-content/uploads/2020/02/logo_header_Asw_18a.jpg"/> -->
      <v-img :aspect-ratio="36/9" src="https://www.americanschoolway.edu.co/wp-content/uploads/2020/02/logo_header_Asw_18a.jpg">
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

          <v-list-item v-if="isLogged && permiso('AFD4E76')" link @click="dirigir('/')" active-class="border">
            <v-list-item-action>
              <v-icon>home</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title>Inicio</v-list-item-title>
            </v-list-item-content>
          </v-list-item>

          <v-list-item v-if="isLogged && permiso('EF995E25')" link @click="dirigir('/leads')" active-class="border">
            <v-list-item-action>
              <v-icon>contact_mail</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title>Leads</v-list-item-title>
            </v-list-item-content>
          </v-list-item>

          <v-list-item v-if="isLogged && permiso('E5B05447')" link @click="dirigir('/plantillas')" active-class="border">
            <v-list-item-action>
              <v-icon>perm_media</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title>Plantillas</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
  <!--
          <v-list-item v-if="isLogged && permiso('C3372A4B')" link @click="dirigir('/orientadores')">
            <v-list-item-action>
              <v-icon>mdi-contact-mail</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title>Orientadores</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
  -->
  <!--
          <v-list-item v-if="isLogged && permiso('E677357D')" link @click="dirigir('/agenda')">
            <v-list-item-action>
              <v-icon>mdi-contact-mail</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title>Agenda</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
  -->
          <v-list-item v-if="isLogged && permiso('2BF48DCE')" link @click="dirigir('/callcenter_admisiones')" active-class="border">
            <v-list-item-action>
              <v-icon>pan_tool</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title>Admisiones</v-list-item-title>
            </v-list-item-content>
          </v-list-item>

          <v-list-group
            no-action
            sub-group
            value="true"
          >
            <template v-slot:activator>
              <v-list-item-content>
                <v-list-item-title>Callcenter</v-list-item-title>
              </v-list-item-content>
            </template>

            <v-list-item v-if="isLogged && permiso('A8229B00')" link @click="dirigir('/callcenter')" active-class="border">
            
              <v-list-item-action>
                <v-icon>call</v-icon>
              </v-list-item-action>
              <v-list-item-content>
                <v-list-item-title>Agente</v-list-item-title>
              </v-list-item-content>
            </v-list-item>

          <v-list-item v-if="isLogged && permiso('2BF48DCE')" link @click="dirigir('/callcenter_coordinator')" active-class="border">

            <v-list-item-action>
              <v-icon>supervisor_account</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title>Coordinator</v-list-item-title>
            </v-list-item-content>
          </v-list-item>

          </v-list-group>
          
          <v-list-group no-action sub-group
          >
            <template v-slot:activator>
              <v-list-item-content>
                <v-list-item-title>CRM</v-list-item-title>
              </v-list-item-content>
            </template>

            <v-list-item v-if="isLogged" link @click="dirigir('/CRM/Importar')" active-class="border">
            
              <v-list-item-action>
                <v-icon>import_export</v-icon>
              </v-list-item-action>
              <v-list-item-content>
                <v-list-item-title>Importar</v-list-item-title>
              </v-list-item-content>
            </v-list-item>

          <!-- <v-list-item v-if="isLogged" link @click="dirigir('/CRM/Consultar')" active-class="border">

            <v-list-item-action>
              <v-icon>filter_list</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title>Consultar</v-list-item-title>
            </v-list-item-content>
          </v-list-item> -->

          </v-list-group>

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
      color="indigo"
      dark
    >
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
      <v-toolbar-title>Automatic Lead Attention</v-toolbar-title>
    </v-app-bar>

    <v-content>  
      <router-view></router-view>
    </v-content>


    <v-footer color="indigo" class="white--text text-center">
       <v-card-text>
         American School Way &copy; 2020 - v.1.0.8
       </v-card-text>
    </v-footer>
    
    <v-snackbar
      v-model="isErrorDialogShowed"
    >
      {{ error }}
      <v-btn
        color="pink"
        text
        @click="hideError"
      >
        Close
      </v-btn>
    </v-snackbar>
     <v-snackbar
      v-model="isInfoDialogShowed"
    >
      {{ info }}
      <v-btn
        color="pink"
        text
        @click="hideInfo"
      >
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
      model: 1
    }),
    props: {
      //source: String
    },
    methods:{
      ...mapActions({
        logout: 'auth/logout',
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
      }
    },
    computed: {
      ...mapState({
        isLogged: state => state.auth.logged,
        user: state => state.auth.user,   
        processing: state => state.processing,
        error: state => state.error,
        isErrorShowed: state => state.isErrorShowed,
        warning: state => state.warning,
        info: state => state.info,
        isInfoShowed: state => state.isInfoShowed,
        reportedVersion: state => state.version,
        
      }),
      ...mapGetters({
        permiso: 'auth/permiso', 
      }),
      getNombres(){
        if(this.user){
          return this.user.data.primer_nombre+' '+this.user.data.primer_apellido
        }
        return ''
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