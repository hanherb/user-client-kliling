<template lang="pug">
div( class="front-page")
	div( class="container")
		div( class="transparent")
			p( class="front-heading") THIS IS A CMS
			d-link( to="/login" ) 
				d-button( class="front-btn") Sign In
			d-link( to="/register" ) 
				d-button( class="front-btn") Register
</template>

<script>
export default {
  name: 'front',
  components: {
  },
  created: function()
  {
  	if(this.$session.get('user')) {
  		this.$router.push('/home');;
  	}
  }
};
</script>

<style>
	.front-page {
		max-width: 100%;
		height: 100%;
		background-image: url('../assets/images/content-management/home.png');
		background-repeat:no-repeat;
		background-size:cover;
		background-position:center;
	}

	.container {
		max-width: 100%;
		height: 250px;
	  	position: absolute;
		top:0;
		bottom: 0;
		left: 0;
		right: 0;
		padding: 0;
	  	
		margin: auto;
	}

	.transparent {
		background: rgba(0, 0, 0, 0.6);
		height: 100%;
		text-align: center;
	}

	.front-heading {
		font-family: "Arial Black";
		font-size: 80px;
		color: white;
	}

	.front-btn {
		width: 120px;
		font-family: "Arial Black";
		text-align: center;
	}
</style>
