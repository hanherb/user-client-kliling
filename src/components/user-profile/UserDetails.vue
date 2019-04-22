<template>
  <d-card class="card-small user-details mb-4">

    <!-- Card Header -->
    <d-card-header class="p-0">
      <div class="user-details__bg">
        <img :src="coverImg" :alt="user.fullname">
      </div>
    </d-card-header>

    <d-card-body class="p-0">

      <!-- User Avatar -->
      <div class="user-details__avatar mx-auto">
        <img :src="avatarImg" :alt="user.fullname">
      </div>

      <!-- User Name -->
      <h4 class="text-center m-0 mt-2">{{ user.fullname }}</h4>

      <!-- User Social -->
      <ul class="user-details__social user-details__social--primary d-table mx-auto mb-4">
        <li v-if="social.facebook" class="mx-1"><a :href="social.facebook"><i class="fab fa-facebook-f"></i></a></li>
        <li v-if="social.twitter" class="mx-1"><a :href="social.twitter"><i class="fab fa-twitter"></i></a></li>
        <li v-if="social.github" class="mx-1"><a :href="social.github"><i class="fab fa-github"></i></a></li>
        <li v-if="social.slack" class="mx-1"><a :href="social.slack"><i class="fab fa-slack"></i></a></li>
      </ul>

      <!-- User Data -->
      <div class="user-details__user-data border-top border-bottom p-4">
        <div class="row mb-3">
          <div class="col w-50">
            <span>Email</span>
            <span>{{ user.email }}</span>
          </div>
          <div class="col w-50">
            <span>Location</span>
            <span>Jakarta</span>
          </div>
        </div>
        <div class="row">
          <div class="col w-50">
            <span>Phone</span>
            <span>089982934575</span>
          </div>
          <div class="col w-50">
            <span>Account Number</span>
            <span>1234</span>
          </div>
        </div>
      </div>

      <!-- User Tags -->
      <div class="user-details__tags p-4">
        <span v-for="(tag, idx) in tags" :key="idx" class="badge badge-pill badge-light text-light text-uppercase mb-2 border">{{ tag }}</span>
      </div>

    </d-card-body>
  </d-card>
</template>

<script>
export default {
  name: 'user-details',
  data(){
    return {
      user: [],
      coverImg: require('@/assets/images/user-profile/up-user-details-background.jpg'),
      avatarImg: require('@/assets/images/avatars/0.jpg'),
      social: {
        facebook: '#',
        twitter: '#',
        github: '#',
        slack: '#',
      },
      tags: [
        'User Experience',
        'UI Design',
        'React JS',
        'HTML & CSS',
        'JavaScript',
        'Bootstrap 4',
      ],
    }
  },

  created: function()
  {
      this.fetchSession();
  },

  methods: {
    fetchSession() {
      this.user = this.$session.get('user');
    },
  }
};
</script>
