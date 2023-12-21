
<template>
  
  <TheNavbar v-if="!$route.meta.hideNavbar"/>
  <div class="router-content">
    <router-view>
    </router-view>
  </div>
</template>

<script setup lang="ts">
import TheNavbar from './components/TheNavbar.vue';
</script>

<style scoped>
.router-content{
  padding: 0 2em;
}
</style>
