<template lang="pug">
  <div>
    <d-card class="card-small lo-stats h-100" v-if="ongoingConsult == 1">

      <!-- Card Header -->
      <d-card-header class="border-bottom">
        <h6 class="m-0">Current Consult</h6>
        <div class="block-handle"></div>
      </d-card-header>

      <d-card-body class="p-0">
        <d-container fluid class="px-0">

          <!-- Latest Orders List -->
          <table class="table mb-0">
            <thead class="py-2 bg-light text-semibold border-bottom">
              <tr>
                <th class="text-center">Doctor Name</th>
                <th class="text-center">Check-in Date</th>
                <th class="text-center">Status</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td class="lo-stats__items text-center">{{ consult.doctor_name }}</td>
                <td class="lo-stats__items text-center">{{ consult.checkin_date }}</td>
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
    <d-card class="card-small lo-stats h-100">

      <!-- Card Header -->
      <d-card-header class="border-bottom">
        <h6 class="m-0">Doctor List</h6>
        <div class="block-handle"></div>
      </d-card-header>

      <d-card-body class="p-0">
        <d-container fluid class="px-0">

          <!-- Latest Orders List -->
          <table class="table mb-0">
            <thead class="py-2 bg-light text-semibold border-bottom">
              <tr>
                <th class="text-center">Doctor Name</th>
                <th class="text-center">Role</th>
                <th class="text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="user in users">
                <td class="lo-stats__items text-center">{{ user.fullname }}</td>
                <td class="lo-stats__items text-center">{{ user.role }}</td>
                <td class="lo-stats__actions">
                  <div class="text-center">
                    <d-button size="sm" type="button" class="btn-white" v-on:click="consultWithDoctor(user.fullname)" :disabled="ongoingConsult == 1">Consult</d-button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>

        </d-container>
      </d-card-body>
    </d-card>
  </div>
</template>

<script>
import graphqlFunction from '@/graphqlFunction';
import basicFunction from '@/basicFunction';
import address from '@/address';
import headers from '@/headers';

export default {
  name: 'patient-consult',
  data(){
      return{
          users: [],
          consult: {},
          ongoingConsult: 0
      }
  },

  created: function()
  {
      this.fetchDoctor();
      this.checkOngoingConsult();
  },

  methods: {
    checkOngoingConsult() {
      this.axios.get(address + ":3000/get-consult", headers).then((response) => {
        let query = `query getAllConsult {
          consults {
            _id
            doctor_name
            patient_name
            checkin_date
            consult_date
            status
          }
        }`;
        graphqlFunction.graphqlFetchAll(query, (result) => {
          for(let i = 0; i < result.consults.length; i++) {
            if(result.consults[i].patient_name == this.$session.get('user').fullname) {
              if(result.consults[i].status == 'pending' || result.consults[i].status == 'ongoing') {
                this.consult = result.consults[i];
                this.ongoingConsult = 1;
                break;
              }
            }
          }
        });
      });
    },
    fetchDoctor() {
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
          for(let i = 0; i < result.users.length; i++) {
            if(result.users[i].role == "doctor") {
              this.users.push(result.users[i]);
            }
          }
        });
      })
    },
    consultWithDoctor(name) {
      let patient = this.$session.get('user').fullname;
      let dateObj = basicFunction.getDate();
      let checkin_date = dateObj.date + " " + dateObj.month + " " + dateObj.year + " @ " + dateObj.hour + ":" + dateObj.minute + ":" + dateObj.second;
      let postObj = {
        doctor_name: name,
        patient_name: patient,
        checkin_date: checkin_date,
        status: "pending"

      }
      this.axios.post(address + ':3000/add-consult', postObj, headers)
      .then((response) => {
        postObj._id = response.data.insertedIds[0];
        let query = `mutation createSingleConsult($input:ConsultInput) {
            createConsult(input: $input) {
                doctor_name
            }
        }`;
        let variables = {
          input: postObj
        }
        graphqlFunction.graphqlMutation(query, variables, (result) => {
          alert("Add Consult Success");
          this.$router.push('/patient-consult');
          location.reload();
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