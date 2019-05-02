<template lang="pug">
  div.h-100
    d-row.h-50(align-v='center', align-h='center')
      h4 Delete {{blog.title}} ?
    d-row(align-v='center', align-h='center')
      d-link( to="/blog")
        d-button( pill) &larr; Cancel
      d-button( theme="danger" v-on:click="deleteBlog()" pill) Delete
</template>

<script>
import graphqlFunction from '@/graphqlFunction';
import basicFunction from '@/basicFunction';
import address from '@/address';
import headers from '@/headers';

export default {
  name: 'delete-blog',
  data(){
      return{
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
            this.blog = result.blog;
          });
        });
      },
      deleteBlog() {
        let postObj = {
          _id: this.blog._id
        };
        this.axios.post(address + ':3000/delete-post', postObj, headers)
        .then((response) => {
          let query = `mutation deleteSingleBlog($blogId: String!) {
              deleteBlog(_id: $blogId) {
                  title
              }
          }`;
          let variables = {
            blogId: this.blog._id
          }
          graphqlFunction.graphqlMutation(query, variables, (result) => {
            console.log(result);
            alert("Delete Blog Success");
            this.$router.push('/blog');
          });
        });
      }
  }
};
</script>