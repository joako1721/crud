<template>
    <div class="nav">

        <h2 class="nav__top">
            CRUD
        </h2>

        <h2 class="nav__mid"></h2>

        <button class="nav__bot" @click="logout">Logout</button>

    </div>
</template>

<script lang="ts">

export default {
    name: 'TheNavbar',
    methods: {
        logout(){
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            this.$router.push('/login');
        },
    }
}
</script>

<style scoped>
.nav {
    display: flex;
    justify-content: space-between;
    padding: 0.5em 2em;
    align-items: center; 
    background-color: #243540;
    margin-bottom: 2em;
}
.nav__mid {
    justify-self: middle;
}
.nav__top {
    color: #fafafa !important;
}

</style>