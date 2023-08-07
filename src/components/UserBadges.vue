<template>
	<span>
		<img v-if="isStaff" alt="Staff Member" class="table-img" :class="isLarge ? 'table-img-lg' : 'table-img-sm'" src="@/assets/crown.png"
				title="Staff Member (Ineligible for rewards)">
		<img v-else-if="isBot" alt="Bot" class="table-img" :class="isLarge ? 'table-img-lg' : 'table-img-sm'" src="@/assets/bot.png"
				title="Botting Detected (Ineligible for rewards)">
		<img v-if="getMedalRanking !== ''" :alt="getRank" class="table-img ms-2" :class="isLarge ? 'table-img-lg' : 'table-img-sm'"
				:src="getMedalRanking"
				:title="getRank">
	</span>
</template>

<script>

export default {
	name: "UserBadges",
	props: {
		position: {
			type: Number,
			required: true
		},
		lb: {
			required: true
		},
		isLarge: {
			type: Boolean,
			default: false
		}
	},
	computed: {
		isStaff() {
			return this.lb.is_staff
		},
		isBot() {
			return this.lb.is_bot
		},

		getRank() {
			if (this.position > 3)
				return ''

			switch (this.position) {
				case 1:
					return "First"
				case 2:
					return "Second"
				case 3:
					return "Third"
				default:
					return ''
			}
		},
		getMedalRanking() {
			if (this.lb.is_staff || this.lb.is_bot)
				return ''

			if (this.position > 3)
				return ''

			switch (this.position) {
				case 1:
					return "/img/icons/medal_first.png"
				case 2:
					return "/img/icons/medal_second.png"
				case 3:
					return "/img/icons/medal_third.png"
				default:
					return ''
			}
		}
	},
	beforeMount() {
		console.log("LB", this.lb)
	}
}
</script>

<style scoped>

</style>