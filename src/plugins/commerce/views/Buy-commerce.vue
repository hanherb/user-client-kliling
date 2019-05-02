<template>
  <div>
    <d-row>
      <div v-for="commerce in commerces" class="card-container">
        <d-col lg="12">
          <d-card style="max-width: 300px">
            <d-card-header></d-card-header>
            <d-card-img :src="commerce.image" class="item-img"/>
            <d-card-body :title="commerce.name">
                <p>{{commerce.description}}</p>
                <d-row>
                  <d-col lg="4" md="4" sm="4">
                    <d-input type="number" placeholder="Qty" value="1" :id="commerce.id"></d-input>
                  </d-col>
                </d-row>
                <br>
                <d-btn theme="primary" v-on:click="addToCart(commerce.id, commerce.name, commerce.price, commerce.qty)">Add to cart &rarr;</d-btn>
            </d-card-body>
            <d-card-footer>Rp. {{commerce.price}}</d-card-footer>
          </d-card>
        </d-col>
      </div>
    </d-row>
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
          commerces: [],
          carts: [],
          totalShoppingPrice: 0
      }
  },

  created: function()
  {
      this.fetchItems();
      this.fetchShoppingCart();
  },

  methods: {
      fetchItems() {
        this.axios.get(address + ":3000/get-commerce", headers).then((response) => {
          let query = `query getAllCommerce {
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
            for(var i = 0; i < result.commerces.length; i++) {
              this.commerces.push({
                id: result.commerces[i]._id,
                name: result.commerces[i].name,
                price: result.commerces[i].price,
                qty: result.commerces[i].qty,
                description: result.commerces[i].description.substr(0,30) + '...',
                user: result.commerces[i].user,
                image: result.commerces[i].image
              });
            }
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
                  this.fetchItems();
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