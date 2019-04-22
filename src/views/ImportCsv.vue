<template lang="pug">
  div( class="container")
    div( class="panel panel-sm")
      div( class="panel-heading")
        h4 CSV Import
      div( class="panel-body")
        div( class="form-group")
          div( class="col-sm-9")
            input( type="file" id="csv_file" name="csv_file" class="form-control" @change="loadCSV($event)")
        div( class="col-sm-offset-3 col-sm-9")
          div( class="checkbox-inline")
            label( for="header_rows") 
        div( class="row")
          div( class="col")
            div( class="card-body p-0 pb-3 text-center" style="overflow-x:auto;")
              table( class="table mb-0")
                thead( class="bg-light")
                  tr
                    th( v-for="key in parse_header" @click="sortBy(key)" :class="{ active: sortKey == key }") {{ key | capitalize }}
                      span( class="arrow" :class="sortOrders[key] > 0 ? 'asc' : 'dsc'")
                tbody
                  tr( v-for="csv in parse_csv")
                    td( v-for="key in parse_header") {{csv[key]}}
            br
            div( align='center' v-if="parse_csv[0]")
              d-button( theme="primary") Submit
</template>

<script>
import graphqlFunction from '../graphqlFunction';
import address from '../address';
import headers from '../headers';

export default {
  name: 'import-xls',
  data() {
    return {
      parse_header: [],
      parse_csv: [],
      sortOrders:{},
      sortKey: ''
    };
  },
  filters: {
    capitalize: function (str) {
      return str.charAt(0).toUpperCase() + str.slice(1)
    }
  },
  methods: {
    sortBy: function (key) {
      var vm = this
      vm.sortKey = key
      vm.sortOrders[key] = vm.sortOrders[key] * -1
    },
    csvJSON(csv){
      var vm = this
      var lines = csv.split("\n")
      var result = []
      var headers = lines[0].split(";")
      vm.parse_header = lines[0].split(";") 
      lines[0].split(",").forEach(function (key) {
        vm.sortOrders[key] = 1
      })
      
      lines.map(function(line, indexLine){
        if (indexLine < 1) return // Jump header line
        
        var obj = {}
        var currentline = line.split(";")
        
        headers.map(function(header, indexHeader){
          obj[header] = currentline[indexHeader]
        })
        
        result.push(obj)
      })
      
      result.pop() // remove the last item because undefined values
      console.log(result)
      return result // JavaScript object
    },
    loadCSV(e) {
      var vm = this
      if (window.FileReader) {
        var reader = new FileReader();
        reader.readAsText(e.target.files[0]);
        // Handle errors load
        reader.onload = function(event) {
          var csv = event.target.result;
          vm.parse_csv = vm.csvJSON(csv)
          
        };
        reader.onerror = function(evt) {
          if(evt.target.error.name == "NotReadableError") {
            alert("Canno't read file !");
          }
        };
      } else {
        alert('FileReader are not supported in this browser.');
      }
    }
  }
};
</script>