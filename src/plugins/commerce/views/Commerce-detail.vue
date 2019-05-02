<template>
  <div>
    <d-container fluid class="main-content-container px-4">
      <d-row class="mt-4">
        <d-col lg="4" sm="12">
          <d-card class="card-small user-details mb-4">
            <img :src="commerce.image">
          </d-card>
        </d-col>
        <d-col lg="3" sm="12">
          <d-card class="card-small user-details mb-4">

            <h4 class="text-center m-0 mt-2 p-3">{{ commerce.name }}</h4>

            <div class="user-details__user-data border-top border-bottom p-4">
              <div class="row mb-3">
                <div class="col w-100">
                  <span>Description</span>
                  <span>{{ commerce.description }}</span>
                </div>
              </div>
              <div class="row mb-3">
                <div class="col w-100">
                  <span>Price</span>
                  <span>Rp. {{ commerce.price }}</span>
                </div>
              </div>
              <div class="row mb-3">
                <div class="col w-100">
                  <span>Qty</span>
                  <d-row>
                    <d-col lg="3" md="3" sm="3">
                      <d-input type="number" placeholder="Qty" value="1" :id="commerce._id"></d-input>
                    </d-col>
                  </d-row>
                </div>
              </div>
            </div>
            <div class="p-4">
              <div class="row mb-3">
                <div class="col w-100">
                  <d-btn theme="primary" v-on:click="addToCart(commerce._id, commerce.name, commerce.price, commerce.qty)">Add to cart &rarr;</d-btn>
                </div>
              </div>
            </div>
          </d-card>
        </d-col>
        <div class="row cart col-lg-5" v-if="carts">
          <div class="col">
            <div class="card card-small mb-4">
              <div class="card-header border-bottom">
                <h6 class="m-0">Shopping Cart</h6>
              </div>
              <div class="card-body p-0 pb-3">
                <table class="table mb-0">
                  <thead class="bg-light">
                    <tr>
                      <th scope="col" class="border-0">Item Name</th>
                      <th scope="col" class="border-0">Qty</th>
                      <th scope="col" class="border-0">Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="cart in carts">
                      <td>{{cart.itemName}}</td>
                      <td>{{cart.itemQty}}</td>
                      <td>{{cart.totalPrice}}</td>
                    </tr>
                    <tr>
                      <td>Total:</td>
                      <td></td>
                      <td>{{totalShoppingPrice}}</td>
                    </tr>
                  </tbody>
                </table>
                <div class="text-center">
                  <d-button v-if="carts" v-on:click="buyItem()">Checkout &rarr;</d-button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </d-row>
    </d-container>
  </div>
</template>

<script>
import graphqlFunction from '@/graphqlFunction';
import basicFunction from '@/basicFunction';
import address from '@/address';
import headers from '@/headers';

export default {
  name: 'commerce',
  data(){
      return{
          input: {
            qty: ""
          },
          commerce: {},
          carts: [],
          totalShoppingPrice: 0
      }
  },

  created: function()
  {
      this.fetchCommerce();
      this.fetchShoppingCart();
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
            this.commerce = result.commerce
          });
        });
      },
      addToCart(id, name, price, prevQty) {
        let qty = document.getElementById(id).value;
        let tempCart = {
          itemId: id,
          itemName: name,
          itemQty: qty,
          prevQty: prevQty,
          totalPrice: price * qty
        };
        if(this.$session.get('session_cart')) {
          let sessionCart = this.$session.get('session_cart');
          sessionCart.push(tempCart);
          this.$session.set('session_cart', sessionCart);
          this.fetchShoppingCart();
        }
        else {
          let sessionCart = [];
          sessionCart.push(tempCart);
          this.$session.set('session_cart', sessionCart);
          this.fetchShoppingCart();
        }
      },
      fetchShoppingCart() {
        this.carts = this.$session.get('session_cart');
        if(this.carts) {
          for(let i = 0; i < this.carts.length; i++) {
            this.totalShoppingPrice += this.carts[i].totalPrice;
          }
        }
      },
      buyItem() {
        let postObj = this.carts;
        let dateObj = basicFunction.getDate();
        let transaction_date = dateObj.date + " " + dateObj.month + " " + dateObj.year + " @ " + dateObj.hour + ":" + dateObj.minute + ":" + dateObj.second;
        for(let i = 0; i < postObj.length; i++) {
          postObj[i].buyer_name = this.$session.get('user').fullname;
          postObj[i].transaction_date = transaction_date;
        }

        this.axios.post(address + ':3000/add-transaction', postObj, headers)
        .then((response) => {
          let query = `mutation createTransaction($input:TransactionInput) {
              createTransaction(input: $input) {
                  _id
              }
          }`;
          for(let i = 0; i < postObj.length; i++) {
            postObj[i]._id = response.data.insertedIds[i];
            postObj[i].itemQty = parseInt(postObj[i].itemQty);
            let variables = {
              input: {
                _id: postObj[i]._id,
                itemId: postObj[i].itemId,
                itemName: postObj[i].itemName,
                itemQty: postObj[i].itemQty,
                totalPrice: postObj[i].totalPrice,
                buyer_name: postObj[i].buyer_name,
                transaction_date: postObj[i].transaction_date
              }
            }
            graphqlFunction.graphqlMutation(query, variables, (result) => {
              this.substractQty(postObj[i].itemId, (postObj[i].prevQty-postObj[i].itemQty), () => {
                if(i == (postObj.length-1)) {
                  this.$session.remove('session_cart');
                  alert("Add Transaction Success");
                  this.$router.push('/buy-commerce');
                  this.fetchShoppingCart();
                  this.fetchCommerce();
                  location.reload();
                }
              });
            });
          }
        });
      },
      substractQty(id, qty, callback) {
        let postObj = {
          _id: id,
          qty: qty
        };
        this.axios.post(address + ':3000/substract-qty', postObj, headers)
        .then((response) => {
          let query = `mutation updateSingleItem($itemId:String!, $input:CommerceInput) {
              updateCommerce(_id: $itemId, input: $input) {
                  name
              }
          }`;
          let variables = {
            itemId: id,
            input: postObj
          }
          graphqlFunction.graphqlMutation(query, variables, (result) => {
            console.log(result);
            if(callback)
                return callback();
          });
        });
      }
  }
};
</script>

<style type="text/css">
  .item-img {
    width: 300px;
    height: 200px;
  }
  .card-container {
    padding-top: 5px;
    padding-bottom: 5px;
    margin-left: 6%;
  }
  .cart {
    padding-top: 20px;
  }
</style>