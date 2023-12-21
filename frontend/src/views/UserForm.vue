<template>

    <div class="user-form__header">
        <h3>{{ user.id ? (showModify ?'Edit' : 'View') : 'New' }} User</h3> 
        <div class="user-form__header__btn-container">
            <span class="user-form__header__btn user-form__header__btn--red" @click="goToUserList">
                <font-awesome-icon :icon="['fas', 'xmark']" />
            </span>
        </div>
    </div>
    <div class="user-form">
        <div class="user-form__div">
            <label for="username" class="user-form__label">Username</label>
            <input class="input input-w" type="text" name="username" v-model="user.username" placeholder="Enter Username" :disabled="showView">
            <label for="password" class="user-form__label">Password</label>
            <input class="input input-w" type="password" name="password" v-model="user.password" placeholder="Enter Password" :disabled="showView">
            <label for="verifyPassword" class="user-form__label">Verify Password</label>
            <input class="input input-w" type="password" name="verifyPassword" v-model="verifyPassword" placeholder="Enter Verify Password" :disabled="showView">
            <label for="email" class="user-form__label">Email</label>
            <input class="input input-w" type="text" name="email" v-model="user.email" placeholder="Enter Email" :disabled="showView">
            <label class="user-form__label">Permission</label>
            <div class="user-form__permission-div"> 
                <div class="user-form__permission-div__container">
                    <label for="viewPermission" class="user-form__label">View</label>
                    <label class="switch">
                        <input name="viewPermission" type="checkbox" v-model="permissions.view" :disabled="showView">
                        <span class="slider round"></span>
                    </label>
                </div>

                <div class="user-form__permission-div__container">
                    <label for="editPermission" class="user-form__label">Edit</label>
                    <label class="switch">
                        <input name="editPermission" type="checkbox" v-model="permissions.edit" :disabled="showView">
                        <span class="slider round"></span>
                    </label>
                </div>

                <div class="user-form__permission-div__container">
                    <label for="deletePermission" class="user-form__label">Delete</label>
                    <label class="switch">
                        <input name="deletePermission" type="checkbox" v-model="permissions.delete" :disabled="showView">
                        <span class="slider round"></span>
                    </label>
                </div>

                <div class="user-form__permission-div__container">
                    <label for="createPermission" class="user-form__label">Create</label>
                    <label class="switch">
                        <input name="createPermission" type="checkbox" v-model="permissions.create" :disabled="showView">
                        <span class="slider round"></span>
                    </label>
                </div>
            </div>
        </div>
        <div class="user-form__save-div" v-show="showModify || showCreate" @click="saveUser">
            <font-awesome-icon class="user-form__save-div__icon" :icon="['fas', 'floppy-disk']" />
            <span class="user-form__save-div__label">Save</span>
        </div>
    </div> 
</template>

<script lang="ts">
import {defineComponent} from 'vue';
import { User, Permissions } from '../entities/User';
import { UserService } from '../services/UserService';
import { getCurrentUser } from '../helpers/Helper';
import Swal from 'sweetalert2';

const userService = new UserService();

export default defineComponent({
    name: 'UserForm',
    props: ['id'],
    data(){
        return {
            user: {
                id: 0,
                username: '',
                email: '',
                permissions: 0,
                password: '',
            } as User,
            verifyPassword: '',
            showModify: false,
            showCreate: false,
            showView: false,
            permissions: {
                view: false,
                edit: false,
                delete: false,
                create: false,
            }
        };

    },
    created(){
        const currentUser = getCurrentUser();
        this.showModify = currentUser ? !!(currentUser.permissions & Permissions.modify) && !!(this.$route.params.id) : false;
        this.showCreate = currentUser ? !!(currentUser.permissions & Permissions.create) && !(this.$route.params.id) : false;
        this.showView = currentUser ? !!(currentUser.permissions & Permissions.view) : false;
        if(!this.showCreate && !this.showView && !this.showModify) this.$router.push('/users')
        if(this.$route.params?.id){
            this.getUser();
        } 
    },
    methods: {
        async getUser(){
            const id: string = this.$route.params.id as string;
            await userService.getUser(id).then((res) => {
                if(res.data.data){
                    this.user = res.data.data as User;
                    this.permissions.view = !!(this.user.permissions & Permissions.view);
                    this.permissions.edit = !!(this.user.permissions & Permissions.modify);
                    this.permissions.delete = !!(this.user.permissions & Permissions.delete);
                    this.permissions.create = !!(this.user.permissions & Permissions.create);
                } 
                else this.$router.push('/users');
            }).catch((e) => {
                console.log(e);
            }) 
        },
        goToUserList(){
            this.$router.push('/users');
        },
        async saveUser(){
            if((this.user.password || this.verifyPassword) && (this.user.password !== this.verifyPassword)){
                Swal.fire({
                showConfirmButton: true,
                icon: 'error',
                title: 'Passwords dont match',})
                return;
            }

            if(this.permissions.edit && !this.permissions.view) this.permissions.view = true;

            this.user.permissions |= (Number(this.permissions.view) << 0)
            this.user.permissions |= (Number(this.permissions.create) << 1)
            this.user.permissions |= (Number(this.permissions.edit) << 2)
            this.user.permissions |= (Number(this.permissions.delete) << 3)

            if(this.user.id){
                await userService.modifyUser(this.user).then((res) => {
                    if(res.data.data){
                        Swal.fire({
                        toast: true,
                        position: 'top-end',
                        showConfirmButton: false,
                        timer: 1500,
                        icon: 'success',
                        title: 'User Saved',})
                        this.goToUserList();
                    } 
                }).catch((e) => {
                    console.log(e);
                })
            } else {
                await userService.createUser(this.user).then((res)=>{
                    if(!res.data.error){
                        Swal.fire({
                        toast: true,
                        position: 'top-end',
                        showConfirmButton: false,
                        timer: 1500,
                        icon: 'success',
                        title: 'User Created',})
                        this.goToUserList();
                    }
                })
            }
        }
    }
});
</script>

<style scoped>

.user-form{
  display: flex;
  flex-direction: column;
  align-items:center ;
  height: 100%;
}

.user-form__div {
    align-items: left;
}

.user-form__label {
    display: flex;
    align-self: left;
    margin-left: 10px;
    font-weight: light;
    font-size: 0.75em;
}

.user-form__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 1em;

}
.user-form__header__btn{
  height: 1em;
  width: 1em;
  border-radius: 25%;
  background-color: #fafafa;
  color: #243540;
  font-weight: bold;
  font-size: 2em;
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
  user-select: none;
  margin-left: 10px;
}
.user-form__header__btn:hover{
  cursor: pointer;
  transform: scale(1.2);
}

.user-form__header__btn--red {
    color: #cd143c;
}

.user-form__header__btn-container {
    display: flex;
}

.user-form__permission-div{
    margin-top: 1em;
    display: flex;
    justify-content: space-between;
}
.user-form__permission-div__container{
    display:flex;
    flex-direction:column;
    align-items:left;
    margin-left: 5px;
}
.input-w {
  width: 100%;
}


.user-form__save-btn{
  margin-top: 2em;
}
.user-form__save-div {
    border-radius: 5px;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px solid #243540;
    border-radius: 5px;
    padding: 0.5em 2em;
    margin-top: 2em;
    user-select: none;
}

.user-form__save-div:hover {
    cursor: pointer;
    transform: scale(1.2);
    transition: transform 0.2s ease-in-out;
}
.user-form__save-div__icon {
    margin-right: 0.5em;
}



</style>