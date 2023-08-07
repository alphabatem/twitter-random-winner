<template>
	<div class="header py-5 mb-5">
		<div class="container text-start">

			<div class="col-sm-12 col-md-10 col-lg-8 offset-0 offset-md-1 offset-lg-2">
				<div class="row">
					<div class="col-auto">
						<router-link to="/"><img alt="" src="https://blok.host/assets/images/logo_new.png" class="header-img"></router-link>
					</div>
					<div class="col">
						<h1 class="mb-0">Blok Host</h1>
						<h3>Community Interactions</h3>
					</div>
					<div class="col-auto link-container">
						<div class="mt-2"><a href="https://blok.host" target="_blank"><img alt="website" src="@/assets/link.png"> blok.host</a></div>
						<div class="mt-1"><a href="https://twitter.com/blok_host" target="_blank"><img alt="twitter" src="@/assets/link.png"> twitter.com/blok_host</a></div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
export default {
	name: "TopNav"
}
</script>

<style scoped>

</style>