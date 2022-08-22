<template>

      <v-container fluid fill-height>
        <v-layout align-center justify-center>
          <v-flex xs12 sm8 md4>
            <v-card class="elevation-12">
              <v-toolbar dark color="primary">
                <v-toolbar-title>Leads App</v-toolbar-title>
                <v-spacer></v-spacer>
                
              </v-toolbar>
              <v-card-text>
                <v-form>
                  <v-text-field v-model="user.username" prepend-icon="person" name="login" label="Login" type="text"></v-text-field>
                  <v-text-field v-model="user.password" id="password" prepend-icon="lock" name="password" label="Password" type="password"></v-text-field>
                </v-form>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="primary" @click="processLogin">Login</v-btn>
              </v-card-actions>
            </v-card>
          </v-flex>
        </v-layout>
         <div class="text-center">
          <!-- <v-btn :disabled="dialog" :loading="dialog" class="white--text" color="purple darken-2" @click="dialog = true">
            Start loading
          </v-btn> -->
          <v-dialog v-model="dialog.show" persistent width="300">
            <v-card color="primary" dark>
              <v-card-text class="text-center">
                {{dialog.message}}
                <v-progress-linear indeterminate color="white" class="mb-0" ></v-progress-linear>
              </v-card-text>
            </v-card>
          </v-dialog>
        </div>
      </v-container>
    
</template>

<script>
  import {mapActions,mapMutations} from 'vuex';
  
  export default {
    
    name: 'login',
    data () {
      return {
        user: {
          username: '',
          password: '',
        },
        dialog: {
          show: false,
          message: 'Iniciando sesión',
        }
      }
    },
    methods: {
      ...mapActions({
        login: 'auth/login',
        
      }),
      ...mapMutations({
				setInfo: 'setInfo',
      }),
      processLogin () {
        this.dialog.show = true;
        this.dialog.message = "Verificando datos, por favor espere un momento";
        setTimeout(() => {
          this.process();
        }, 750);
      },
      process() {
        this.login(this.user).then(
          user => {
            console.log('logged:'+user)
            console.log(user)
            setTimeout(() => {
              this.dialog.message = "Logueado, por favor espere un momento"
              this.dialog.show = false;
              this.$router.push('/');
            }, 1000);
          },
          error => {
            console.log(error)
            if(error.data) {
              if(error.data.error) {
                this.dialog.message = error.data.error;
                this.setInfo(error.data.error);
              }else{
                this.dialog.message = error.data;
                this.setInfo(error.data);
              }
            } else if(error.body) {
              if(error.body.error) {
                this.dialog.message = error.body.error;
                this.setInfo(error.body.error);
              }else{
                this.dialog.message = error.body;
                this.setInfo(error.body);
              }
            }
            setTimeout(() => {
              this.dialog.show = false;
            }, 1000);
          })
      }
    }
  }
</script>