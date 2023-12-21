import { createApp } from 'vue'
import './style.css'
import App from './App.vue'

import { library } from '@fortawesome/fontawesome-svg-core';
import { faEye, faEyeSlash, fas, faPenToSquare, faTrash, faXmark, faFloppyDisk} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

library.add(faEye, faEyeSlash, fas, faPenToSquare, faTrash, faXmark, faFloppyDisk);

import { createRouter, createWebHashHistory } from 'vue-router';
import LoginView from './views/LoginForm.vue'
import UserForm from './views/UserForm.vue'
import UserList from './views/UserList.vue'

import VueSweetalert2 from 'vue-sweetalert2'
import 'sweetalert2/dist/sweetalert2.min.css'

import Vue3EasyDataTable from 'vue3-easy-data-table';
import 'vue3-easy-data-table/dist/style.css';

const routes = [
    { path: '/', redirect: '/login'},
    { path: '/login', component: LoginView, meta: { hideNavbar: true}},
    { path: '/users/form/:id?', component: UserForm, porps: true, meta: { requiresAuth: true }},
    { path: '/users', component: UserList, meta: { requiresAuth: true }},
];

export const router = createRouter({
    history: createWebHashHistory(),
    routes,
})

router.beforeEach((to, _from, next) => {
    if (to.meta.requiresAuth && !localStorage.getItem('token')) next('/login');
    next();
});

const app = createApp(App);

app.component('font-awesome-icon', FontAwesomeIcon);
app.component('EasyDataTable', Vue3EasyDataTable);

app.use(VueSweetalert2)
app.use(router);

app.mount('#app');
