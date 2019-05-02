<template>
  <d-card class="card-small lo-stats h-100">

    <!-- Card Header -->
    <d-card-header class="border-bottom">
      <h6 class="m-0">Commerce</h6>
      <div class="block-handle"></div>
    </d-card-header>

    <d-card-body class="p-0">
      <d-container fluid class="px-0">

        <!-- Latest Orders List -->
        <table class="table mb-0">
          <thead class="py-2 bg-light text-semibold border-bottom">
            <tr>
              <th>Details</th>
              <th></th>
              <th class="text-center">Status</th>
              <th class="text-center">Qty</th>
              <th class="text-center">Price</th>
              <th class="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="commerce in commerces">
              <td class="lo-stats__image">
                <img class="border rounded" :src="commerce.image" alt="Alternative title">
              </td>
              <td class="lo-stats__order-details">
                <span>{{ commerce.name }}</span>
              </td>
              <td class="lo-stats__status">
                <div class="d-table mx-auto">
                  <d-badge pill :class="[getBadgeType(status)]">{{ status }}</d-badge>
                </div>
              </td>
              <td class="lo-stats__items text-center">{{ commerce.qty }}</td>
              <td class="lo-stats__total text-center text-success">{{ commerce.price }}</td>
              <td class="lo-stats__actions">
                <d-button-group class="d-table ml-auto">
                  <d-link :to="'/update-commerce?id=' + commerce._id">
                    <d-button size="sm" type="button" class="btn-white">Update</d-button>
                  </d-link>
                  <d-link :to="'/delete-commerce?id=' + commerce._id">
                    <d-button size="sm" type="button" class="btn-white">Delete</d-button>
                  </d-link>
                </d-button-group>
              </td>
            </tr>
          </tbody>
        </table>

      </d-container>
    </d-card-body>

    <d-card-footer class="border-top">
      <d-row>

        <!-- Time Frame -->
        <d-col>
          <d-link to="/add-commerce">
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
  name: 'commerce',
  data(){
      return{
          commerces: [],
          status: 'Available'
      }
  },

  created: function()
  {
      this.fetchItems();
  },

  methods: {
    fetchItems() {
      this.axios.get(address + ":3000/get-commerce", headers).then((response) => {
        let query = `query getallCommerce {
          commerces {
            _id
            name
            price
            qty
            description
            user
            image
          }
        }`;
        graphqlFunction.graphqlFetchAll(query, (result) => {
          this.commerces = result.commerces;
        });
      });
    },
    getBadgeType(status) {
      const statusMap = {
        Available: 'success',
        Empty: 'danger',
      };

      return `badge-${statusMap[status]}`;
    },
  }
};
</script>

<style type="text/css">
  .commerce_image {
    width: 300px;
    height: 250px;
  }
</style>