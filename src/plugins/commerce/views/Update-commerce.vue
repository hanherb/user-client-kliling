<template>
  <d-row>
    <d-col lg="5" class="mb-4 mx-auto my-auto">
      <d-card class="card-small">
        <d-card-header class="border-bottom">
          <h6 class="m-0">Add Item</h6>
        </d-card-header>

        <d-list-group flush>
          <d-list-group-item class="p-3">
            <d-row>
              <d-col>
                <d-form-row>
                  <d-col md="12" class="form-group">
                    <label>Item Name</label>
                    <d-input v-model="input.name" type="text" placeholder="Item Name" />
                  </d-col>
                </d-form-row>

                <d-form-row>
                  <d-col md="12" class="form-group">
                    <label>Price</label>
                    <d-input v-model="input.price" type="number" placeholder="Price" />
                  </d-col>
                </d-form-row>

                <d-form-row>
                  <d-col md="12" class="form-group">
                    <label>Qty</label>
                    <d-input v-model="input.qty" type="number" placeholder="Qty" />
                  </d-col>
                </d-form-row>

                <d-form-row>
                  <d-col md="12" class="form-group">
                    <label>Description</label>
                    <textarea v-model="input.description" placeholder="Description" rows="10" wrap="soft" class="form-control form-control-lg" />
                  </d-col>
                </d-form-row>

                <d-form-row>
                  <d-col md="12" class="form-group">
                    <label>Image URL</label>
                    <d-input v-model="input.image" type="text" placeholder="Image URL" />
                  </d-col>
                </d-form-row>
                <d-button v-on:click="updateCommerce">Submit</d-button>
              </d-col>
            </d-row>
          </d-list-group-item>
        </d-list-group>
      </d-card>
    </d-col>
  </d-row> 
</template>

<script>
import graphqlFunction from '@/graphqlFunction';
import basicFunction from '@/basicFunction';
import address from '@/address';
import headers from '@/headers';

export default {
  name: 'update-commerce',
  data(){
      return{
        input:{
          name: "",
          price: "",
          qty: "",
          description: "",
          image: ""
        },
        commerce: []
      }
  },

  created: function()
  {
      this.fetchCommerce();
  },

  methods: {
      fetchCommerce() {
        let id = window.location.href.split("?id=")[1];
        this.axios.get(address + ":3000/get-commerce", headers).then((response) => {
          let query = `query getSingleItem($itemId: String!) {
            commerce(_id: $itemId) {
              _id
              name
              price
              qty
              description
              user
              image
            }
          }`;
          let variable = {
            itemId: id
          };
          graphqlFunction.graphqlFetchOne(query, variable, (result) => {
            this.input.name = result.commerce.name;
            this.input.price = result.commerce.price;
            this.input.qty = result.commerce.qty;
            this.input.description = result.commerce.description;
            this.input.image = result.commerce.image;
            this.commerce = result.commerce;
          });
        });
      },
      updateCommerce() {
        let user = this.$session.get('user').fullname;
        let postObj = {
          _id: this.commerce._id,
          name: this.input.name,
          price: parseInt(this.input.price),
          qty: parseInt(this.input.qty),
          description: this.input.description,
          image: this.input.image,
          user: user
        };
        this.axios.post(address + ':3000/update-item', postObj, headers)
        .then((response) => {
          let query = `mutation updateSingleCommerce($itemId: String!, $input:CommerceInput) {
              updateCommerce(_id: $itemId, input: $input) {
                  name
              }
          }`;
          let variables = {
            itemId: this.commerce._id,
            input: postObj
          }
          graphqlFunction.graphqlMutation(query, variables, (result) => {
            console.log(result);
            alert("Update Commerce Success");
            this.$router.push('/commerce');
          });
        });
      }
  }
};
</script>