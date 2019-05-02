<template>
  <d-container fluid>
    <d-row>
        <!-- Content -->
        <slot />
    </d-row>
  </d-container>
</template>

<script>
import MainNavbar from '@/components/layout/MainNavbar/MainNavbar.vue';
import MainSidebar from '@/components/layout/MainSidebar/MainSidebar.vue';
import MainFooter from '@/components/layout/MainFooter/MainFooter.vue';
export default { 
    name:'no-session',
    components: {
		MainNavbar,
		MainSidebar,
		MainFooter,
	},
}
</script>