import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
	{
		path: '/',
		name: 'Choose Winner',
		component: () => import(/* webpackChunkName: "home" */ '../views/ChooseWinnerView.vue'),
	},
]

const router = new VueRouter({
	mode: 'history',
	base: process.env.BASE_URL,
	scrollBehavior() {
		return {top: 0}
	},
	routes
})

export default router
