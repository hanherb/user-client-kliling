<template>
  <div>
    <d-button size="sm" type="button" class="btn-white" name="button-commerce" v-on:click="toggleDisplay">Commerce</d-button>
    <div class="row table-report" name="table-commerce">
      <div class="col">
        <div class="card card-small mb-4">
          <div class="card-header border-bottom">
            <h6 class="m-0">Commerce</h6>
          </div>
          <div class="card-body p-0 pb-3 text-center">
            <table class="table mb-0">
              <thead class="bg-light">
                <tr>
                  <th scope="col" class="border-0">Name</th>
                  <th scope="col" class="border-0">Description</th>
                  <th scope="col" class="border-0">Price</th>
                  <th scope="col" class="border-0">Qty</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="commerce in commerces">
                  <td>{{ commerce.name }}</td>
                  <td>{{ commerce.description }}</td>
                  <td>{{ commerce.price }}</td>
                  <td>{{ commerce.qty }}</td>
                </tr>
              </tbody>
            </table>
            <d-button size="sm" class="btn-accent ml-auto" name="print-consult" v-on:click="startPrint">Print</d-button>
          </div>
        </div>
      </div>
    </div>
    <d-button size="sm" type="button" class="btn-white" name="button-consult" v-on:click="toggleDisplay">Consult</d-button>
    <div class="row table-report" name="table-consult">
      <div class="col">
        <div class="card card-small mb-4">
          <div class="card-header border-bottom">
            <h6 class="m-0">Consult</h6>
          </div>
          <div class="card-body p-0 pb-3 text-center">
            <table class="table mb-0">
              <thead class="bg-light">
                <tr>
                  <th scope="col" class="border-0">Patient Name</th>
                  <th scope="col" class="border-0">Doctor Name</th>
                  <th scope="col" class="border-0">Check-in Date</th>
                  <th scope="col" class="border-0">Consult Date</th>
                  <th scope="col" class="border-0">Diagnosis</th>
                  <th scope="col" class="border-0">Medicine</th>
                  <th scope="col" class="border-0">Status</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="consult in consults">
                  <td>{{ consult.patient_name }}</td>
                  <td>{{ consult.doctor_name }}</td>
                  <td>{{ consult.checkin_date }}</td>
                  <td>{{ consult.consult_date }}</td>
                  <td>{{ consult.diagnosis }}</td>
                  <td>{{ consult.medicine }}</td>
                  <td>{{ consult.status }}</td>
                </tr>
              </tbody>
            </table>
            <d-button size="sm" class="btn-accent ml-auto" name="print-consult" v-on:click="startPrint">Print</d-button>
          </div>
        </div>
      </div>
    </div>
    <d-button size="sm" type="button" class="btn-white" name="button-transaction" v-on:click="toggleDisplay">Transaction</d-button>
    <div class="row table-report" name="table-transaction">
      <div class="col">
        <div class="card card-small mb-4">
          <div class="card-header border-bottom">
            <h6 class="m-0">Transaction</h6>
          </div>
          <div class="card-body p-0 pb-3 text-center">
            <table class="table mb-0">
              <thead class="bg-light">
                <tr>
                  <th scope="col" class="border-0">Item Name</th>
                  <th scope="col" class="border-0">Item Qty</th>
                  <th scope="col" class="border-0">Total Price</th>
                  <th scope="col" class="border-0">Buyer Name</th>
                  <th scope="col" class="border-0">Transaction Date</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="transaction in transactions">
                  <td>{{ transaction.itemName }}</td>
                  <td>{{ transaction.itemQty }}</td>
                  <td>{{ transaction.totalPrice }}</td>
                  <td>{{ transaction.buyer_name }}</td>
                  <td>{{ transaction.transaction_date }}</td>
                </tr>
              </tbody>
            </table>
            <d-button size="sm" class="btn-accent ml-auto" name="print-transaction" v-on:click="startPrint">Print</d-button>
          </div>
        </div>
      </div>
    </div>
    <d-button size="sm" type="button" class="btn-white" name="button-supply" v-on:click="toggleDisplay">Supply</d-button>
    <div class="row table-report" name="table-supply">
      <div class="col">
        <div class="card card-small mb-4">
          <div class="card-header border-bottom">
            <h6 class="m-0">Supply</h6>
          </div>
          <div class="card-body p-0 pb-3 text-center">
            <table class="table mb-0">
              <thead class="bg-light">
                <tr>
                  <th scope="col" class="border-0">Supplier Name</th>
                  <th scope="col" class="border-0">Medicine</th>
                  <th scope="col" class="border-0">Qty</th>
                  <th scope="col" class="border-0">Supply Date</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="supply in supplies">
                  <td>{{ supply.supplier_name }}</td>
                  <td>{{ supply.medicine }}</td>
                  <td>{{ supply.qty }}</td>
                  <td>{{ supply.supply_date }}</td>
                </tr>
              </tbody>
            </table>
            <d-button size="sm" class="btn-accent ml-auto" name="print-supply" v-on:click="startPrint">Print</d-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import graphqlFunction from '@/graphqlFunction';
import address from '@/address';
import headers from '@/headers';

export default {
  name: 'report',
  data(){
    return{
        commerces: [],
        consults: [],
        transactions: [],
        supplies: []
    }
  },

  created: function()
  {
      this.fetchCommerces();
      this.fetchConsults();
      this.fetchTransactions();
      this.fetchSupplies();
  },

  methods: {
    fetchCommerces() {
      this.axios.get(address + ":3000/get-commerce", headers).then((response) => {
        let query = `query getAllCommerce {
          commerces {
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

    fetchConsults() {
      this.axios.get(address + ":3000/get-consult", headers).then((response) => {
        let query = `query getAllConsult {
          consults {
            doctor_name
            patient_name
            checkin_date
            consult_date
            status
          }
        }`;
        graphqlFunction.graphqlFetchAll(query, (result) => {
          this.consults = result.consults;
        });
      });
    },

    fetchTransactions() {
      this.axios.get(address + ":3000/get-transaction", headers).then((response) => {
        let query = `query getAllTransaction {
          transactions {
            itemName
            itemQty
            totalPrice
            buyer_name
            transaction_date
          }
        }`;
        graphqlFunction.graphqlFetchAll(query, (result) => {
          this.transactions = result.transactions;
        });
      });
    },

    fetchSupplies() {
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
    },

    toggleDisplay(event) {
      let button = event.target.name.split('-')[1];
      let table = "table-" + button;
      let el = document.getElementsByName(table);
      for(let i = 0; i < el.length; i++) {
        if (el[i].style.display === "block") {
          el[i].style.display = "none";
        } else {
          el[i].style.display = "block";
        }
      }
    },

    startPrint(event) {
      if(event.target.name.split('-')[1] == 'commerce') {
        setTimeout(() => {
          this.downloadCSV({filename: "commerce.csv", data: this.commerces});
        },2000);
      }
      else if(event.target.name.split('-')[1] == 'consult') {
        setTimeout(() => {
          this.downloadCSV({filename: "consult.csv", data: this.consults});
        },2000);
      }
      else if(event.target.name.split('-')[1] == 'transaction') {
        setTimeout(() => {
          this.downloadCSV({filename: "transaction.csv", data: this.transactions});
        },2000);
      }
      else if(event.target.name.split('-')[1] == 'supply') {
        setTimeout(() => {
          this.downloadCSV({filename: "supply.csv", data: this.supplies});
        },2000);
      }
    },

    convertArrayOfObjectsToCsv(args) {  
      var result, ctr, keys, columnDelimiter, lineDelimiter, data;

      data = args.data || null;
      if (data == null || !data.length) {
          return null;
      }

      columnDelimiter = args.columnDelimiter || ',';
      lineDelimiter = args.lineDelimiter || '\n';

      keys = Object.keys(data[0]);

      result = '';
      result += keys.join(columnDelimiter);
      result += lineDelimiter;

      data.forEach(function(item) {
          ctr = 0;
          keys.forEach(function(key) {
              if (ctr > 0) result += columnDelimiter;

              result += item[key];
              ctr++;
          });
          result += lineDelimiter;
      });

      return 'sep=,\r\n' + result;
    },

    downloadCSV(args) {
      var data, filename, link;
      var csv = this.convertArrayOfObjectsToCsv({
          data: args.data
      });
      if (csv == null) return;

      filename = args.filename || 'export.csv';

      if (!csv.match(/^data:text\/csv/i)) {
          csv = 'data:text/csv;charset=utf-8,' + csv;
      }
      data = encodeURI(csv);

      link = document.createElement('a');
      link.setAttribute('href', data);
      link.setAttribute('download', filename);
      link.click();
    }
  }
};
</script>

<style type="text/css">
  .table-report {
    display: none;
  }
</style>