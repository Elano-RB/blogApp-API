<script>
	
	import Banner from '../components/Banner.vue';

	export default {
		components: {
			Banner,
			
		},

		data() {
			return {
				bannerProps: {
					title: "Connect",
					tagline: "See what everyone is sharing and join the conversation.",
					destination: "PostListPage",
					buttonLabel: "Join the Community"
				}
			}
		}
	}
</script>

<template>
  <div class="container-fluid">

    <Banner :bannerProps=bannerProps />
  </div>
</template>