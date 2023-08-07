<template>
	<tr>
		<td class="text-start">
			<img :key="user.username" alt="" class="table-img profile-img me-2" :src="user.profile_image_url ? user.profile_image_url : `https://unavatar.io/${user.username}`">
			<span>{{ position }}. </span>
			<span>{{ user.username }}</span>
			<sup class="ms-2">
				<UserBadges :lb="user" :position="position"></UserBadges>
			</sup>
		</td>
		<td>{{ user.score }}</td>
	</tr>
</template>

<script>
import UserBadges from "@/components/UserBadges";

export default {
	name: "UserRow",
	components: {UserBadges},
	props: {
		user: {
			type: Object,
			required: true
		},
		position: {
			type: Number,
			required: true
		}
	}
}
</script>

<style scoped>

</style>