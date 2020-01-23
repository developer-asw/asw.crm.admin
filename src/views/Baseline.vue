<template>
  <v-app id="inspire">
    <v-navigation-drawer
      v-model="drawer"
      app
    >

    <v-list dense>

        <v-list-item>
          <v-list-item-content>
            <v-list-item-title>{{getNombres}}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-divider></v-divider>

        <v-list-item v-if="isLogged && permiso('AFD4E76')" link @click="dirigir('/')">
          <v-list-item-action>
            <v-icon>mdi-home</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Inicio</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-item v-if="isLogged && permiso('EF995E25')" link @click="dirigir('/leads')">
          <v-list-item-action>
            <v-icon>mdi-contact-mail</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Leads</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-item v-if="isLogged && permiso('E5B05447')" link @click="dirigir('/plantillas')">
          <v-list-item-action>
            <v-icon>mdi-contact-mail</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Plantillas</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-item v-if="isLogged && permiso('C3372A4B')" link @click="dirigir('/orientadores')">
          <v-list-item-action>
            <v-icon>mdi-contact-mail</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Orientadores</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-item v-if="isLogged && permiso('E677357D')" link @click="dirigir('/agenda')">
          <v-list-item-action>
            <v-icon>mdi-contact-mail</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Agenda</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-divider></v-divider>

        <v-list-item v-if="isLogged" link @click.prevent="processLogout()">
          <v-list-item-action>
            <v-icon>mdi-contact-mail</v-icon>
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

    <v-footer color="indigo" >
      <span class="white--text">American School Way &copy; 2020 - v.0.1.2</span>
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
  </v-app>
</template>

<script>

  import {mapState,mapGetters,mapActions,mapMutations} from 'vuex';

  export default {
    data: () => ({
      drawer: null
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
        warning: state => state.warning,
        reportedVersion: state => state.version,
        isErrorShowed: state => state.isErrorShowed,
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
    }
  }
</script>