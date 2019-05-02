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
                <d-button v-on:click="addCommerce">Submit</d-button>
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
  name: 'add-commerce',
  data(){
      return{
        input:{
          name: "",
          price: "",
          qty: "",
          description: "",
          image: ""
        }
      }
  },

  methods: {
      addCommerce() {
        let user = this.$session.get('user').fullname;
        let postObj = {
          name: this.input.name,
          price: parseInt(this.input.price),
          qty: parseInt(this.input.qty),
          description: this.input.description,
          image: this.input.image,
          user: user
        };
        this.axios.post(address + ':3000/add-item', postObj, headers)
        .then((response) => {
          postObj._id = response.data.insertedIds[0];
          let query = `mutation createSingleCommerce($input:CommerceInput) {
              createCommerce(input: $input) {
                  name
              }
          }`;
          let variables = {
            input: postObj
          }
          graphqlFunction.graphqlMutation(query, variables, (result) => {
            alert("Add Item Success");
            this.$router.push('/commerce');
          });
        });
      }
  }
};
</script>