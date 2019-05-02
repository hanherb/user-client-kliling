<template>
  <d-container fluid class="main-content-container px-4">
    <!-- Page Header -->
    <div class="page-header row no-gutters py-4">
      <div class="col-12 col-sm-4 text-center text-sm-left mb-0">
        <span class="text-uppercase page-subtitle">Components</span>
        <h3 class="page-title">Blog Posts</h3>
      </div>
    </div>
    <div>
      <d-link to="/add-blog">
        <d-button class="btn-white" v-d-tooltip.hover="'Add'">
          <i class="material-icons">&#xe145;</i>
        </d-button>
      </d-link>
    </div>
    <br>
    <d-row>
      <d-col v-for="(post, idx) in posts" :key="idx" lg="3" md="6" sm="12" class="mb-4">
        <d-card class="card-small card-post card-post--1">
          <div class="card-post__image" :style="{ backgroundImage: 'url(\'' + post.backgroundImage + '\')' }">
            <d-badge pill :class="['card-post__category', 'bg-' + post.categoryTheme ]">{{ post.category }}</d-badge>
            <div class="card-post__author d-flex">
              <a href="#" class="card-post__author-avatar card-post__author-avatar--small" :style="{ backgroundImage: 'url(\'' + post.authorAvatar + '\')' }">Written by {{ post.author }}</a>
            </div>
          </div>
          <d-card-body>
            <h5 class="card-title">
              <a href="#" class="text-fiord-blue">{{ post.title }}</a>
            </h5>
            <p class="card-text d-inline-block mb-3">{{ post.body }}</p>
            <br>
            <span class="text-muted">{{ post.date }} <br> by {{ post.author }}</span>
            <br><br>
            <d-link :to="'/update-blog?id=' + post.id">
              <d-button class="btn-white" v-d-tooltip.hover="'Edit'">
                <i class="material-icons">&#xE254;</i>
              </d-button>
            </d-link>
            <d-link :to="'/delete-blog?id=' + post.id">
              <d-button class="btn-white" v-d-tooltip.hover="'Delete'">
                <i class="material-icons">&#xE872;</i>
              </d-button>
            </d-link>
          </d-card-body>
        </d-card>
      </d-col>
    </d-row>
  </d-container>
</template>

<script>
import graphqlFunction from '@/graphqlFunction';
import address from '@/address';
import headers from '@/headers';

export default {
  name: 'blog',
  data(){
      return{
          posts: []
      }
  },

  created: function()
  {
      this.fetchItems();
  },

  methods: {
      fetchItems() {
        this.axios.get(address + ":3000/get-blog", headers).then((response) => {
          let query = `query getAllBlog {
            blogs {
                _id
              	title
    	        	content
    		        date
    		        month
    		        year
    		        author
            }
          }`;
          graphqlFunction.graphqlFetchAll(query, (result) => {
            for(var i = 0; i < result.blogs.length; i++) {
              this.posts.push({
                id: result.blogs[i]._id,
                backgroundImage: require('@/assets/images/content-management/1.jpeg'),
                category: 'Business',
                categoryTheme: 'dark',
                author: result.blogs[i].author,
                authorAvatar: require('@/assets/images/avatars/1.jpg'),
                title: result.blogs[i].title,
                body: result.blogs[i].content.substr(0,100) + '...',
                date: result.blogs[i].date + ' ' + result.blogs[i].month + ' ' + result.blogs[i].year,
              });
            }
          });
        });
      }
  }
};
</script>