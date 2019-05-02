<template>
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
              <th class="text-center">Patient Name</th>
              <th class="text-center">Doctor Name</th>
              <th class="text-center">Check-in Date</th>
              <th class="text-center">Consult Date</th>
              <th class="text-center">Diagnosis</th>
              <th class="text-center">Medicine</th>
              <th class="text-center">Status</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="consult in consults">
              <td class="lo-stats__items text-center">
                <span>{{ consult.patient_name }}</span>
              </td>
              <td class="lo-stats__items text-center">
                <span>{{ consult.doctor_name }}</span>
              </td>
              <td class="lo-stats__items text-center">{{ consult.checkin_date }}</td>
              <td class="lo-stats__items text-center">{{ consult.consult_date }}</td>
              <td class="lo-stats__items text-center">{{ consult.diagnosis }}</td>
              <td class="lo-stats__items text-center">{{ consult.medicine }}</td>
              <td class="lo-stats__status">
                <div class="d-table mx-auto">
                  <d-badge pill :class="[getBadgeType(consult.status)]">{{ consult.status }}</d-badge>
                </div>
              </td>
            </tr>
          </tbody>
        </table>

      </d-container>
    </d-card-body>
  </d-card>
</template>

<script>
import graphqlFunction from '@/graphqlFunction';
import address from '@/address';
import headers from '@/headers';

export default {
  name: 'consult',
  data(){
      return{
          consults: []
      }
  },

  created: function()
  {
      this.fetchItems();
  },

  methods: {
    fetchItems() {
      this.axios.get(address + ":3000/get-consult", headers).then((response) => {
        let query = `query getAllConsult {
          consults {
            _id
          	doctor_name
            patient_name
            checkin_date
            consult_date
            diagnosis
            medicine
            status
          }
        }`;
        graphqlFunction.graphqlFetchAll(query, (result) => {
          this.consults = result.consults;
        });
      });
    },
    getBadgeType(status) {
      const statusMap = {
        pending: 'danger',
        ongoing: 'warning',
        finished: 'success'
      };

      return `badge-${statusMap[status]}`;
    },
  }
};
</script>