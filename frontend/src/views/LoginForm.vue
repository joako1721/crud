<template>
  <div class="login-form" @keydown.enter="login">
    <h1>CRUD</h1>
    <input class="input" :class="{ 'shake': loginFailed }" type="text" v-model="username" placeholder="Username...">
    <input class="input" :class="{ 'shake': loginFailed }" type="password" v-model="password" placeholder="Password...">
    <button class="input" @click="login">Login</button>
  </div >
</template>

<script lang="ts">
import { AuthService } from '../services/AuthService'
import { defineComponent } from 'vue';
import Swal from 'sweetalert2';

const authService = new AuthService();
export default defineComponent({
  name: 'LoginForm',
  data() {
    return {
      username: "",
      password: "",
      loginFailed: false,
    };
  },
  methods: {
    async login(){
      await authService.login(this.username, this.password).then((res) => {
        const token = res.data.data;
        if(token){
          localStorage.setItem('token', token);
          const user = atob(token.split('.')[1]);
          localStorage.setItem('user', user)

          Swal.fire({
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 1500,
          icon: 'success',
          title: 'Login Success!',})

          this.$router.push('/users');

        } else { this.failedLogin(); }
      }).catch((e)=>{
        console.log(e);
        this.failedLogin(); 
      })
    },

    failedLogin() {
      this.loginFailed = true;
      this.username = '';
      this.password = '';

      setTimeout(()=>{
        this.loginFailed = false;
      }, 300)
    }

  }
})
</script>

<style scoped>
.login-form{
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
}


</style>