<template lang="pug">
  <d-container fluid class="main-content-container px-4 pb-4">
    <!-- Page Header -->
    <d-row no-gutters class="page-header py-4">
      <!-- Page Title -->
      <d-col col sm="4" class="text-center text-sm-left mb-4 mb-sm-0">
        <span class="text-uppercase page-subtitle">Blog Posts</span>
        <h3 class="page-title">Add New Post</h3>
      </d-col>
    </d-row>

    <d-row>
      <!-- Editor -->
      <d-col lg="9" md="12">
        <d-card class="card-small mb-3">
          <d-card-body>
            <d-form class="add-new-post">
              <d-input v-model="input.title" size="lg" class="mb-3" placeholder="Your Post Title" />
              <textarea v-model="input.content" placeholder="Your Content" rows="15" wrap="soft" class="form-control form-control-lg" />
            </d-form>
          </d-card-body>
        </d-card>
      </d-col>

      <!-- Sidebar Widgets -->
      <d-col lg="3" md="12">
        <anp-sidebar-categories />
        <d-button size="sm" class="btn-accent ml-auto" v-on:click="addBlog">
          <i class="material-icons">file_copy</i> Publish
        </d-button>
      </d-col>
    </d-row>
  </d-container>
</template>

<script>
import graphqlFunction from '@/graphqlFunction';
import basicFunction from '@/basicFunction';
import address from '@/address';
import headers from '@/headers';
import SidebarCategories from '@/components/add-new-post/SidebarCategories.vue';

export default {
  name: 'add-blog',
  components: {
    anpSidebarCategories: SidebarCategories,
  },

  data(){
      return{
        input:{
          title: "",
          content: ""
        }
      }
  },

  methods: {
      addBlog() {
        let dateObj = basicFunction.getDate();
        let author = this.$session.get('user').fullname;
        let postObj = {
          title: this.input.title, 
          content: this.input.content,
          date: dateObj.date,
          month: dateObj.month,
          year: dateObj.year,
          author: author
        };
        this.axios.post(address + ':3000/add-post', postObj, headers)
        .then((response) => {
          postObj._id = response.data.insertedIds[0];
          let query = `mutation createSingleBlog($input:BlogInput) {
              createBlog(input: $input) {
                  title
              }
          }`;
          let variables = {
            input: postObj
          }
          graphqlFunction.graphqlMutation(query, variables, (result) => {
            alert("Add Blog Success");
            this.$router.push('/blog');
          });
        });
      }
  }
};
</script>