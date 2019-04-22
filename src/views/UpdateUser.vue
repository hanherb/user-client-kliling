<template lang="pug">
  d-row.h-100(align-v='center', align-h='center')
    d-form
      .form-group
        label Email
        d-input( type="text" v-model="input.email" placeholder="Email")
      .form-group
        label Full Name
        d-input( type="text" v-model="input.fullname" placeholder="Full Name")
      .form-group
        label Role
        d-form-select( :options="roles" v-model="input.role" placeholder="Role")
      .form-group
        label User Management Authority
        div
          d-checkbox( label="create" v-model="input.authority" value="create") Create
        div
          d-checkbox( label="update" v-model="input.authority" value="update") Update
        div
          d-checkbox( label="delete" v-model="input.authority" value="delete") Delete
        <!-- label API Authority
        div( v-for="plugin in plugins")
          d-checkbox( :label="plugin.name" v-model="input.authority" :value="plugin.name") {{plugin.name}} -->
      d-button( type="button" v-on:click="updateUser()") Submit
</template>

<script>
import graphqlFunction from '../graphqlFunction';
import address from '../address';
import headers from '../headers';

export default {
  name: 'update-user',
  data(){
      return{
        input:{
          email: "",
          fullname: "",
          role: "",
          authority: []
        },
        roles: [],
        plugins: []
      }
  },

  created: function()
  {
      this.fetchUser();
      this.fetchRole();
      this.fetchPlugin();
  },

  methods: {
      fetchUser() {
        let id = window.location.href.split("?id=")[1];
        this.axios.get(address + ":3000/get-user", headers).then((response) => {
          let query = `query getSingleUser($userId: String!) {
            user(_id: $userId) {
              _id
              fullname
              email
              role
              authority
            }
          }`;
          let variable = {
            userId: id
          };
          graphqlFunction.graphqlFetchOne(query, variable, (result) => {
            this.input.email = result.user.email;
            this.input.fullname = result.user.fullname;
            this.input.role = result.user.role;
            this.input.authority = result.user.authority;
          });
        })
      },
      fetchRole() {
        this.axios.get(address + ":3000/get-role", headers).then((response) => {
          let query = `query getAllRole {
            roles {
                role_name
            }
          }`;
          graphqlFunction.graphqlFetchAll(query, (result) => {
            for(let i = 0; i < result.roles.length; i++) {
              let temp = {
                'text': result.roles[i].role_name,
                'value': result.roles[i].role_name
              }
              this.roles.push(temp);
            }
          });
        });
      },

      fetchPlugin() {
        this.axios.get(address + ":3000/get-plugin", headers).then((response) => {
          let query = `query getAllPlugin {
            plugins {
              name
              status
            }
          }`;
          graphqlFunction.graphqlFetchAll(query, (result) => {
            this.plugins = result.plugins;
          });
        });
      },

      updateUser() {
        let postObj = {
          email: this.input.email, 
          fullname: this.input.fullname,
          role: this.input.role,
          authority: this.input.authority
        };
        this.axios.post(address + ':3000/update-user', postObj, headers)
        .then((response) => {
          let query = `mutation updateSingleUser($userEmail:String!, $input:PersonInput) {
              updateUser(email: $userEmail, input: $input) {
                  fullname
              }
          }`;
          let variables = {
            userEmail: this.input.email,
            input: postObj
          }
          graphqlFunction.graphqlMutation(query, variables, (result) => {
            alert("Update User Success");
            this.$router.push('/users');
          });

        });
      }
  }
};
</script>