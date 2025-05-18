import { createRouter, createWebHistory } from 'vue-router'

import MainLayout from '../components/Layout/MainLayout.vue'
import ErrorLayout from '../components/Layout/ErrorLayout.vue'

import PeopleView from '../views/PeopleView.vue'
import ProfileView from '../views/ProfileView.vue'
import MatchesView from '../views/MatchesView.vue'
import ChatView from '../views/ChatView.vue'
import NotFoundView from '../views/NotFoundView.vue'

const routes = [
	{
		path: '/',
		component: MainLayout,
		children: [
			{ path: '', name: 'Profile', component: ProfileView },
			{ path: 'people', name: 'People', component: PeopleView },
			{ path: 'matches', name: 'Matches', component: MatchesView },
			{ path: 'chat', name: 'Chat', component: ChatView },
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
