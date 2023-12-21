<template>
    <div class="user-list__header">
        <h3>User List</h3>
        <span class="user-list__header__btn" @click="createUser" v-show="showCreateButton">+</span>
    </div>
    <EasyDataTable
    :headers="headers"
    :items="items"
    header-text-direction="center"
    body-text-direction="center"
    alternating>

    <template #item-options="item">
        <span v-if="item.viewButton" @click="formUser(item.id)" style="padding-right: 10px;">
            <font-awesome-icon :icon="['fas', 'eye']" /> 
        </span>
        <span v-if="item.editButton" @click="formUser(item.id)" style="padding-right: 10px;">
            <font-awesome-icon :icon="['fas', 'pen-to-square']" />
        </span>

        <span v-if="item.deleteButton" @click="deleteUser(item.id)">
            <font-awesome-icon :icon="['fas', 'trash']" /> 
        </span>
    </template>
    
    </EasyDataTable>
</template>

<script lang="ts">
import {defineComponent} from 'vue';
import { Permissions, User } from '../entities/User';
import { UserService } from '../services/UserService';
import type { Header, Item } from "vue3-easy-data-table";
import { getCurrentUser } from '../helpers/Helper';

const userService = new UserService();

export default defineComponent({
    name: 'UserList',
    setup(){
        const headers: Header[] = [
        { text: "Id", value: "id", sortable: true },
        { text: "Username", value: "username" },
        { text: "Email", value: "email" },
        { text: "Options", value: "options"}
        ];
    return {
      headers,
    };

    },
    data(){
        return {
            users: [] as User[],
            verifyPassword: '',
            items: [] as Item[],
            showCreateButton: false,
        };

    },
    created(){
        var currentUser = getCurrentUser();
        this.showCreateButton = currentUser ? !!(currentUser.permissions & Permissions.create) : false;
        this.listUsers();
    },
    methods: {
        async listUsers(){
            userService.listUsers().then((res) => {
                if(res.data.data){
                    this.users = res.data.data;
                    this.items = this.users;
                    const currentUser = getCurrentUser();
                    if(!currentUser) return;
                    var viewButton = !!((currentUser.permissions & Permissions.view) && !(currentUser.permissions & Permissions.modify));
                    var editButton = !!(currentUser.permissions & Permissions.modify)
                    var deleteButton = !!(currentUser.permissions & Permissions.delete)
                    this.items.forEach(x=>{
                        x.viewButton = viewButton
                        x.editButton = editButton
                        x.deleteButton = deleteButton
                    })
                } 
            }).catch((e) => {
                console.log(e);
            })
        },
        async deleteUser(id: string){
            userService.deleteUser(id).then((res) => {
                if(res.data.data){this.listUsers();} 
            }).catch((e) => {
                console.log(e);
            })
        },

        formUser(id: number){
            this.$router.push(`/users/form/${id.toString()}`);
        },

        createUser(){
            this.$router.push('/users/form/');
        }

    }
});
</script>

<style scoped>
.user-list__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 1em;

}
.user-list__header__btn{
  height: 1em;
  width: 1em;
  border-radius: 50%;
  background-color: #fafafa;
  color: #243540;
  font-weight: bold;
  font-size: 2em;
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
  user-select: none;
}
.user-list__header__btn:hover{
  cursor: pointer;
  background-color: #243540;
  color: #fafafa;
}

</style>