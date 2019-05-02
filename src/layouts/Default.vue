<template>
  <d-container fluid>
    <d-row>
      <d-col class="main-content p-0" tag="main" lg="12" md="12" sm="12">

        <!-- Main Navbar -->
        <main-navbar />

        <!-- Content -->
        <slot />
      </d-col>

    </d-row>
  </d-container>
</template>

<script>
import MainNavbar from '@/components/layout/MainNavbar/MainNavbar.vue';
import MainSidebar from '@/components/layout/MainSidebar/MainSidebar.vue';
import MainFooter from '@/components/layout/MainFooter/MainFooter.vue';
export default { 
    name:'default',
    components: {
    MainNavbar,
    MainSidebar,
    MainFooter,
  },
}
</script>