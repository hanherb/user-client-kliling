<template lang="pug">
  <d-card class="card-small lo-stats h-100">

    <!-- Card Header -->
    <d-card-header class="border-bottom">
      <h6 class="m-0">Consult List</h6>
      <div class="block-handle"></div>
    </d-card-header>

    <d-card-body class="p-0">
      <d-container fluid class="px-0">

        <!-- Latest Orders List -->
        <table class="table mb-0">
          <thead class="py-2 bg-light text-semibold border-bottom">
            <tr>
              <th class="text-center">Supplier Name</th>
              <th class="text-center">Medicine</th>
              <th class="text-center">Qty</th>
              <th class="text-center">Supply Date</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="supply in supplies">
              <td class="lo-stats__items text-center">{{ supply.supplier_name }}</td>
              <td class="lo-stats__items text-center">{{ supply.medicine }}</td>
              <td class="lo-stats__items text-center">{{ supply.qty }}</td>
              <td class="lo-stats__items text-center">{{ supply.supply_date }}</td>
            </tr>
          </tbody>
        </table>
      </d-container>
    </d-card-body>
    <d-card-footer class="border-top">
      <d-row>

        <!-- Time Frame -->
        <d-col>
          <d-link to="/add-supply">
            <d-button size="sm" type="button" class="btn-white">Add</d-button>
          </d-link>
        </d-col>

      </d-row>
    </d-card-footer>
  </d-card>
</template>

<script>
import graphqlFunction from '@/graphqlFunction';
import address from '@/address';
import headers from '@/headers';

export default {
  name: 'supply',
  data(){
      return{
          supplies: []
      }
  },

  created: function()
  {
      this.fetchItems();
  },

  methods: {
      fetchItems() {
        this.axios.get(address + ":3000/get-supply", headers).then((response) => {
          let query = `query getAllSupply {
            supplies {
            	supplier_name
              medicine
              qty
              supply_date
            }
          }`;
          graphqlFunction.graphqlFetchAll(query, (result) => {
            this.supplies = result.supplies;
          });
        });
      }
  }
};
</script>