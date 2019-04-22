<template lang="pug">
  div( class="main-content-container container-fluid px-4")
    <!-- Page Header -->
    div( class="page-header row no-gutters py-4")
      div( class="col-12 col-sm-4 text-center text-sm-left mb-0")
        span( class="text-uppercase page-subtitle") Overview
        h3( class="page-title") Data Tables
    <!-- Default Light Table -->
    div( class="row")
      div( class="col")
        div( class="card card-small mb-4")
          div( class="card-header border-bottom")
            h6( class="m-0") Active Users
          div( class="card-body p-0 pb-3 text-center")
            table( class="table mb-0")
              thead( class="bg-light")
                tr
                  th( scope="col" class="border-0") Fullname
                  th( scope="col" class="border-0") Email
                  th( scope="col" class="border-0") Role
                  th( scope="col" class="border-0") Action
              tbody
                tr( v-for="user in users")
                  td {{user.fullname}}
                  td {{user.email}}
                  td {{user.role}}
                  td
                    d-link( :to="'/update-user?id=' + user._id") 
                      d-button( theme="success") Update
                    d-link( :to="'/delete-user?id=' + user._id") 
                      d-button( theme="danger") Delete
            d-link( to="/add-user") 
              d-button( theme="primary") Add
</template>
<script>
import graphqlFunction from '@/graphqlFunction';
import basicFunction from '@/basicFunction';
import address from '@/address';
import headers from '@/headers';

export default {
  name: 'data-table',
  data(){
    return{
      users: [],
    }
  },

  created: function()
  {
    this.fetchUsers();
  },

  methods: {
    fetchUsers() {
      this.axios.get(address + ":3000/get-user", headers).then((response) => {
        let query = `query getAllUser {
          users {
            _id
            fullname
            email
            role
            authority
          }
        }`;
        graphqlFunction.graphqlFetchAll(query, (result) => {
          this.users = result.users;
        });
      })
    }
  }
}
</script>
