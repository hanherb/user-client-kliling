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
        <d-button size="sm" class="btn-accent ml-auto" v-on:click="updateBlog">
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
  name: 'update-blog',
  components: {
    anpSidebarCategories: SidebarCategories,
  },

  data(){
      return{
        input:{
          title: "",
          content: "",
        },
        blog: []
      }
  },

  created: function()
  {
      this.fetchBlog();
  },

  methods: {
      fetchBlog() {
        let id = window.location.href.split("?id=")[1];
        this.axios.get(address + ":3000/get-blog", headers).then((response) => {
          let query = `query getSingleBlog($blogId: String!) {
            blog(_id: $blogId) {
              _id
              title
              content
            }
          }`;
          let variable = {
            blogId: id
          };
          graphqlFunction.graphqlFetchOne(query, variable, (result) => {
            this.input.title = result.blog.title;
            this.input.content = result.blog.content;
            this.blog = result.blog;
          });
        });
      },
      updateBlog() {
        let dateObj = basicFunction.getDate();
        let author = this.$session.get('user').fullname;
        let postObj = {
          _id: this.blog._id,
          title: this.input.title, 
          content: this.input.content,
          date: dateObj.date,
          month: dateObj.month,
          year: dateObj.year,
          author: author
        };
        this.axios.post(address + ':3000/update-post', postObj, headers)
        .then((response) => {
          let query = `mutation updateSingleBlog($blogId: String!, $input:BlogInput) {
              updateBlog(_id: $blogId, input: $input) {
                  title
              }
          }`;
          let variables = {
            blogId: this.blog._id,
            input: postObj
          }
          graphqlFunction.graphqlMutation(query, variables, (result) => {
            console.log(result);
            alert("Update Blog Success");
            this.$router.push('/blog');
          });
        });
      }
  }
};
</script>