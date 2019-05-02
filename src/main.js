/* eslint-disable */
import Vue from 'vue';
import ShardsVue from 'shards-vue';
import VueAnalytics from 'vue-analytics';
import axios from 'axios';
import VueAxios from 'vue-axios';
import VueSession from 'vue-session';

// Styles
import 'bootstrap/dist/css/bootstrap.css';
import '@/assets/shards-dashboard-pro/shards-dashboards.scss';
import '@/assets/scss/date-range.scss';

// Core
import App from './App.vue';
import router from './router';

// Layouts
import Default from '@/layouts/Default.vue';
import NoSession from '@/layouts/NoSession.vue';
import HeaderNavigation from '@/layouts/HeaderNavigation.vue';
import IconSidebar from '@/layouts/IconSidebar.vue';

const isProd = process.env.NODE_ENV === 'production';

ShardsVue.install(Vue);

Vue.component('default-layout', Default);
Vue.component('no-session-layout',NoSession);
Vue.component('header-navigation-layout', HeaderNavigation);
Vue.component('icon-sidebar-layout', IconSidebar);

Vue.config.productionTip = false;
Vue.prototype.$eventHub = new Vue();

Vue.use(VueAxios, axios);
Vue.use(VueSession);

// Analytics
Vue.use(VueAnalytics, {
  id: isProd ? 'UA-115105611-1' : 'UA-115105611-2',
  router
});

router.beforeEach((to, from, next) => {
    if(localStorage.getItem('user_role')) {
        var user_role = localStorage.getItem('user_role');
    }
    if(localStorage.getItem('user_authority')) {
        var user_authority = localStorage.getItem('user_authority').split(',');
    }
    next();
});

new Vue({
  router,
  render: h => h(App),
}).$mount('#app');
