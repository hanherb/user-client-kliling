<template>
  <div class="main-content-container container-fluid h-100 px-4">
    <d-row no-gutters class="h-100">
      <d-col lg="3" md="5" class="auth-form mx-auto my-auto">
        <d-card>
          <d-card-body>
            <!-- Logo -->
            <!-- <img class="auth-form__logo d-table mx-auto mb-3" src="@/assets/images/logo.gif" alt="ESDM Dashboards - Login"> -->

            <!-- Title -->
            <h5 class="auth-form__title text-center mb-4">Access Your Account</h5>

            <!-- Form Fields -->
            <div class="form-group">
              <label for="exampleInputEmail1">Email address</label>
              <d-input type="email" v-model="input.email" id="exampleInputEmail1" placeholder="Enter email" />
            </div>
            <div class="form-group">
              <label for="exampleInputPassword1">Password</label>
              <d-input type="password" v-model="input.password" id="exampleInputPassword1" placeholder="Password" />
            </div>
            <div class="form-group mb-3 d-table mx-auto">
              <d-checkbox value="remember">Remember me for 30 days.</d-checkbox>
            </div>
            <d-button pill v-on:click="login" class="btn-accent d-table mx-auto">Access Account</d-button>
          </d-card-body>

          <!-- Social Icons -->
        </d-card>

        <!-- Meta Details -->
        <div class="auth-form__meta d-flex mt-4">
          <d-link tag="a" to="forgot-password">Forgot your password?</d-link>
          <d-link tag="a" to="register" class="ml-auto">Create a new account?</d-link>
        </div>
      </d-col>
    </d-row>
  </div>
</template>
<script>
import address from '@/address';
export default {
  name: 'login',
  props: {
    /**
       * The component's title.
       */
    title: {
      type: String,
      default: 'Application',
    },
  },
  data(){
      return {
        input: {
          email: "",
          password: ""
        }
      }
  },

  methods: {
    login() {
      if(this.input.email != "" && this.input.password != "") {
        this.axios.post(address + ':3000/login-user', {
          email: this.input.email, 
          password: this.input.password
        })
        .then((response) => {
          console.log(response.data);
          if(response.data.token) {
            alert("Login Success");
            this.$router.push('/home');
            this.$session.start();
            this.$session.set('user', response.data.response);
            document.cookie = "token=" + response.data.token;
            document.cookie = "user_session=" + this.$session.get('user')._id;
            document.cookie = "user_authority=" + this.$session.get('user').authority;
            localStorage.setItem('user_role', this.$session.get('user').role);
            localStorage.setItem('user_authority', this.$session.get('user').authority);
          }
          else {
            alert("Incorrect Credential");
          }
        });
      }
      else {
        alert("Email and password cannot be empty");
      }
    }
  }
};
</script>
