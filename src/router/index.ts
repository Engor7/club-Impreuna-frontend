import { createRouter, createWebHistory } from 'vue-router'

import MainLayout from '../components/Layout/MainLayout.vue'
import ErrorLayout from '../components/Layout/ErrorLayout.vue'

import HomeView from '../views/HomeView.vue'
import ProfileView from '../views/ProfileView.vue'
import NotFoundView from '../views/NotFoundView.vue'

const routes = [
	{
		path: '/',
		component: MainLayout,
		children: [
			{ path: '', name: 'Home', component: HomeView },
			{ path: 'profile', name: 'Porifle', component: ProfileView },
		],
	},
	{
		path: '/:catchAll(.*)',
		component: ErrorLayout,
		children: [{ path: '', name: 'NotFound', component: NotFoundView }],
	},
]

const router = createRouter({
	history: createWebHistory(),
	routes,
})

export default router
