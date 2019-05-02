<template>
  <div>
    <!-- h3( v-if="ongoingConsult == 1") Current Consult:
    sui-table( celled v-if="ongoingConsult == 1")
      sui-table-header
        sui-table-row
          sui-table-header-cell Patient Name
          sui-table-header-cell Check-in Date
          sui-table-header-cell Status
      sui-table-body
        sui-table-row
          sui-table-cell {{ongoingConsultDetail.patient_name}}
          sui-table-cell {{ongoingConsultDetail.checkin_date}}
          sui-table-cell {{ongoingConsultDetail.status}}
    sui-form( v-if="ongoingConsult == 1" v-on:submit.prevent)
      sui-form-field
        label Diagnosis
        textarea( type="text" v-model="input.diagnosis" placeholder="Diagnosis")
      sui-form-field
        label Medicine
        textarea( type="text" v-model="input.medicine" placeholder="Medicine")
      sui-button( basic color="red" v-on:click="finishConsultPatient(ongoingConsultDetail._id, ongoingConsultDetail.patient_name)") Finish -->
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
                  <th class="text-center">Patient Name</th>
                  <th class="text-center">Check-in Date</th>
                  <th class="text-center">Status</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td class="lo-stats__items text-center">{{ ongoingConsultDetail.doctor_name }}</td>
                  <td class="lo-stats__items text-center">{{ ongoingConsultDetail.checkin_date }}</td>
                  <td class="lo-stats__status">
                    <div class="d-table mx-auto">
                      <d-badge pill :class="[getBadgeType(ongoingConsultDetail.status)]">{{ ongoingConsultDetail.status }}</d-badge>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
            <d-row>
              <d-col lg="3" md="3" sm="3" class="mb-4 mx-auto my-auto">
                <d-form-row>
                  <d-col md="12" class="form-group">
                    <label>Diagnosis</label>
                    <textarea v-model="input.diagnosis" placeholder="Diagnosis" rows="5" wrap="soft" class="form-control form-control-lg" />
                  </d-col>
                </d-form-row>
                <d-form-row>
                  <d-col md="12" class="form-group">
                    <label>Medicine</label>
                    <textarea v-model="input.medicine" placeholder="Medicine" rows="5" wrap="soft" class="form-control form-control-lg" />
                  </d-col>
                </d-form-row>
                <d-button v-on:click="finishConsultPatient(ongoingConsultDetail._id, ongoingConsultDetail.patient_name)">Finish</d-button>
              </d-col>
            </d-row>
          </d-container>
        </d-card-body>
      </d-card>
      <d-card class="card-small lo-stats h-100">

        <!-- Card Header -->
        <d-card-header class="border-bottom">
          <h6 class="m-0">Patient List</h6>
          <div class="block-handle"></div>
        </d-card-header>

        <d-card-body class="p-0">
          <d-container fluid class="px-0">

            <!-- Latest Orders List -->
            <table class="table mb-0">
              <thead class="py-2 bg-light text-semibold border-bottom">
                <tr>
                  <th class="text-center">Patient Name</th>
                  <th class="text-center">Check-in Date</th>
                  <th class="text-center">Status</th>
                  <th class="text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="consult in consults">
                  <td class="lo-stats__items text-center">{{ consult.patient_name }}</td>
                  <td class="lo-stats__items text-center">{{ consult.checkin_date }}</td>
                  <td class="lo-stats__status">
                    <div class="d-table mx-auto">
                      <d-badge pill :class="[getBadgeType(consult.status)]">{{ consult.status }}</d-badge>
                    </div>
                  </td>
                  <td class="lo-stats__actions">
                    <div class="text-center">
                      <d-button size="sm" class="btn-white" v-if="consult.status == 'pending'" v-on:click="consultWithPatient(consult._id, consult.patient_name)">Consult</d-button>
                      <d-button size="sm" class="btn-white" v-if="consult.status == 'ongoing'" v-on:click="finishConsultPatient(consult._id, consult.patient_name)">Finish</d-button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>

          </d-container>
        </d-card-body>
      </d-card>
    <!-- h3 Patient List:
    sui-table( celled)
      sui-table-header
        sui-table-row
          sui-table-header-cell Patient Name
          sui-table-header-cell Check-in Date
          sui-table-header-cell Status
          sui-table-header-cell Action
      sui-table-body
        sui-table-row( v-for="consult in consults")
          sui-table-cell {{consult.patient_name}}
          sui-table-cell {{consult.checkin_date}}
          sui-table-cell {{consult.status}}
          sui-table-cell
            sui-button( basic color="blue" v-if="consult.status == 'pending'" v-on:click="consultWithPatient(consult._id, consult.patient_name)") Consult
            sui-button( basic color="red" v-if="consult.status == 'ongoing'" v-on:click="finishConsultPatient(consult._id, consult.patient_name)") Finish -->
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
          input: {
            diagnosis: "",
            medicine: ""
          },
          consults: [],
          ongoingConsultDetail: {},
          currentCheckinDate: "",
          currentConsultDate: "",
          ongoingConsult: ""
      }
  },

  created: function()
  {
      this.fetchConsult();
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
            if(result.consults[i].doctor_name == this.$session.get('user').fullname) {
              if(result.consults[i].status == 'ongoing') {
                this.ongoingConsultDetail = result.consults[i];
                this.ongoingConsult = 1;
                break;
              }
            }
          }
        });
      });
    },
    fetchConsult() {
      this.axios.get(address + ":3000/get-consult", headers).then((response) => {
        let query = `query getAllConsult {
          consults {
            _id,
            patient_name,
            doctor_name,
            checkin_date,
            consult_date,
            diagnosis,
            medicine,
            status
          }
        }`;
        graphqlFunction.graphqlFetchAll(query, (result) => {
          for(let i = 0; i < result.consults.length; i++) {
            if(result.consults[i].doctor_name == this.$session.get('user').fullname) {
              if(result.consults[i].status != 'finished') {
                this.consults.push(result.consults[i]);
              }
            }
          }
        });
      })
    },
    consultWithPatient(id, name) {
      let doctor = this.$session.get('user').fullname;
      for(let i = 0; i < this.consults.length; i++) {
        if(this.consults[i]._id == id) {
          this.currentCheckinDate = this.consults[i].checkin_date;
        }
      }
      let dateObj = basicFunction.getDate();
      let consult_date = dateObj.date + " " + dateObj.month + " " + dateObj.year + " @ " + dateObj.hour + ":" + dateObj.minute + ":" + dateObj.second;
      let postObj = {
        _id: id,
        doctor_name: doctor,
        patient_name: name,
        checkin_date: this.currentCheckinDate,
        consult_date: consult_date,
        status: "ongoing"
      }
      this.axios.post(address + ':3000/update-consult', postObj, headers)
      .then((response) => {
        let query = `mutation updateSingleConsult($consultId: String!, $input: ConsultInput) {
            updateConsult(_id: $consultId, input: $input) {
                doctor_name
            }
        }`;
        let variables = {
          consultId: id,
          input: postObj
        }
        graphqlFunction.graphqlMutation(query, variables, (result) => {
          alert("Update Consult Success");
          this.$router.push('/doctor-consult');
          this.fetchConsult();
          this.checkOngoingConsult();
        });
      });
    },
    finishConsultPatient(id, name) {
      let doctor = this.$session.get('user').fullname;
      for(let i = 0; i < this.consults.length; i++) {
        if(this.consults[i]._id == id) {
          this.currentCheckinDate = this.consults[i].checkin_date;
          this.currentConsultDate = this.consults[i].consult_date;
        }
      }
      let postObj = {
        _id: id,
        doctor_name: doctor,
        patient_name: name,
        checkin_date: this.currentCheckinDate,
        consult_date: this.currentConsultDate,
        diagnosis: this.input.diagnosis,
        medicine: this.input.medicine,
        status: "finished"
      }
      console.log(postObj);
      this.axios.post(address + ':3000/update-consult', postObj, headers)
      .then((response) => {
        let query = `mutation updateSingleConsult($consultId: String!, $input: ConsultInput) {
            updateConsult(_id: $consultId, input: $input) {
                doctor_name
            }
        }`;
        let variables = {
          consultId: id,
          input: postObj
        }
        graphqlFunction.graphqlMutation(query, variables, (result) => {
          alert("Update Consult Success");
          this.$router.push('/doctor-consult');
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