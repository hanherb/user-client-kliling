import Vue from 'vue';
import Router from 'vue-router';

import OnlineStore from './views/OnlineStore.vue';
import HeaderNavigation from './views/HeaderNavigation.vue';
import IconSidebarNav from './views/IconSidebarNav.vue';
import PersonalBlog from './views/PersonalBlog.vue';
import EditUserProfile from './views/EditUserProfile.vue';
import Home from './views/Home.vue';
import Front from './views/Front.vue';
import Login from './views/Login.vue';
import Register from './views/Register.vue';
import ForgotPassword from './views/ForgotPassword.vue';
import ChangePassword from './views/ChangePassword.vue';
import FileManagerList from './views/FileManagerList.vue';
import FileManagerCards from './views/FileManagerCards.vue';
import TransactionHistory from './views/TransactionHistory.vue';
import AddNewPost from './views/AddNewPost.vue';
import Errors from './views/Errors.vue';
import ComponentsOverview from './views/ComponentsOverview.vue';
import Tables from './views/Tables.vue';
import BlogPosts from './views/BlogPosts.vue';
import CompanyList from './views/CompanyList.vue';

Vue.use(Router);

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  linkActiveClass: 'active',
  linkExactActiveClass: 'exact-active',
  scrollBehavior() {
    return { x: 0, y: 0 };
  },
  routes: [
    {
      path: '/',
      name: 'front',
      meta: { layout: 'no-session' },
      component: Front,
    },
    {
      path: '/home',
      name: 'home',
      component: Home,
    },
    {
      path: '/user-profile',
      name: 'user-profile',
      component: () => import('./views/UserProfile.vue'),
    },
    {
      path: '/edit-user-profile',
      name: 'edit-user-profile',
      component: EditUserProfile,
    },
    {
      path: '/login',
      name: 'login',
      meta: { layout: 'no-session' },
      component: Login,
    },
    {
      path: '/register',
      name: 'register',
      meta: { layout: 'no-session' },
      component: Register,
    },
    {
      path: '/forgot-password',
      name: 'forgot-password',
      meta: { layout: 'icon-sidebar' },
      component: ForgotPassword,
    },
    {
      path: '/change-password',
      name: 'change-password',
      meta: { layout: 'icon-sidebar' },
      component: ChangePassword,
    },
    {
      path: '/blog',
      name: 'blog',
      component: () => import('./plugins/blog/views/Blog.vue'),
    },
    {
      path: '/add-blog',
      name: 'add-blog',
      component: () => import('./plugins/blog/views/Add-blog.vue'),
    },
    {
      path: '/update-blog',
      name: 'update-blog',
      component: () => import('./plugins/blog/views/Update-blog.vue'),
    },
    {
      path: '/delete-blog',
      name: 'delete-blog',
      component: () => import('./plugins/blog/views/Delete-blog.vue'),
    },
    {
      path: '/buy-commerce',
      name: 'buy-commerce',
      component: () => import('./plugins/commerce/views/Buy-commerce.vue'),
    },
    {
      path: '/patient-consult',
      name: 'patient-consult',
      component: () => import('./plugins/consult/views/Patient-consult.vue'),
    },
    {
      path: '/doctor-consult',
      name: 'doctor-consult',
      component: () => import('./plugins/consult/views/Doctor-consult.vue'),
    },
    {
      path: '/file-manager-list',
      name: 'file-manager-list',
      component: FileManagerList,
    },
    {
      path: '/file-manager-cards',
      name: 'file-manager-cards',
      component: FileManagerCards,
    },
    {
      path: '/transaction-history',
      name: 'transaction-history',
      component: TransactionHistory,
    },
    {
      path: '/company-list',
      name: 'company-list',
      component: CompanyList,
    },
    {
      path: '/add-new-post',
      name: 'add-new-post',
      component: AddNewPost,
    },
    {
      path: '/errors',
      name: 'errors',
      component: Errors,
    },
    {
      path: '/components-overview',
      name: 'components-overview',
      component: ComponentsOverview,
    },
    {
      path: '/tables',
      name: 'tables',
      component: Tables,
    },
    {
      path: '/blog-posts',
      name: 'blog-posts',
      component: BlogPosts,
    },
    {
      path: '/header-navigation',
      name: 'header-navigation',
      meta: { layout: 'header-navigation' },
      component: HeaderNavigation,
    },
    {
      path: '/icon-sidebar-nav',
      name: 'icon-sidebar-nav',
      meta: { layout: 'icon-sidebar' },
      component: IconSidebarNav,
    }, 
    {
      path: '/not-admin',
      name: 'not-admin',
      component: () => import('./views/NotAdmin.vue'),
    },
    {
      path: '/not-authenticated',
      name: 'not-authenticated',
      component: () => import('./views/NotAuthenticated.vue'),
    },
    {
      path: '*',
      redirect: '/errors',
    },
  ],
});
