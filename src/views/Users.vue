<template lang="pug">
  <d-container fluid class="main-content-container px-4 pb-4">
    <v-client-table class="dataTables_wrapper" :data="tableData" :columns="columns" :options="clientTableOptions">
      <!-- Actions Column Slot -->
      <d-button-group slot="actions" slot-scope="props" size="small" class="d-flex justify-content-center">
        <d-link :to="'/update-user?id=' + props.row._id">
          <d-button class="btn-white" v-d-tooltip.hover="'Edit'">
            <i class="material-icons">&#xE254;</i>
          </d-button>
        </d-link>
        <d-link :to="'/delete-user?id=' + props.row._id">
          <d-button class="btn-white" v-d-tooltip.hover="'Delete'">
            <i class="material-icons">&#xE872;</i>
          </d-button>
        </d-link>
      </d-button-group>

      <!-- Status Column Slot -->
      <span slot="status" slot-scope="props" :class="[getStatusClass(props.row.status)]">
        <!-- {{ props.row.status }} -->
      </span>

      <!-- Total Column Slot -->
      <span slot="total" slot-scope="props" class="text-success">
        <!-- {{ props.row.total }} -->
      </span>
    </v-client-table>
    <d-link to="/add-user">
      <d-button class="btn-white" v-d-tooltip.hover="'Add'">
        <i class="material-icons">&#xe145;</i>
      </d-button>
    </d-link>
  </d-container>
</template>
<script>
import graphqlFunction from '@/graphqlFunction';
import basicFunction from '@/basicFunction';
import address from '@/address';
import headers from '@/headers';
import Vue from 'vue';
import { ClientTable } from 'vue-tables-2';
import '@/assets/scss/vue-tables.scss';

Vue.use(ClientTable);

export default {
  name: 'user-table',
  components: {
    ClientTable,
  },
  data(){
    return{
      columns: ['fullname', 'email', 'role', 'actions'],
      tableData: [],
      clientTableOptions: {
        perPage: 10,
        recordsPerPage: [10, 25, 50, 100],
        skin: 'transaction-history table dataTable',
        sortIcon: {
          base: 'fas float-right mt-1 text-muted',
          up: 'fa-caret-up',
          down: 'fa-caret-down',
        },
        texts: {
          filterPlaceholder: '',
          limit: 'Show',
        },
        pagination: {
          edge: true,
          nav: 'scroll',
        },
      },
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
          this.tableData = result.users;
        });
      })
    },
    handleActionClick(type, id) {
      alert(`You have ${type} item ${id}`); // eslint-disable-line no-alert
    },
    getStatusClass(status) {
      const map = {
        Pending: 'warning',
        Complete: 'success',
        Cancelled: 'danger',
      };

      return `text-${map[status]}`;
    },
  }
}
</script>
