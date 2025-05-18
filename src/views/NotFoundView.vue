<script setup lang="ts">
	import { BackButton } from 'vue-tg'
	import { useRouter } from 'vue-router'

	const router = useRouter()

	const backToHome = () => {
		router.push({ path: '/' })
	}
</script>

<template>
	<div class="page-not-fount">
		<h2>Page not found</h2>
		<p>The page you are looking for does not exist</p>
		<router-link to="/">Go to Home</router-link>
		<BackButton @click="backToHome" />
	</div>
</template>

<style scoped lang="scss">
	.page-not-fount {
		h2 {
			font-size: 24px;
			text-transform: uppercase;
			margin-bottom: 12px;
		}

		p {
			opacity: 0.8;
			font-size: 12px;
			margin-bottom: 32px;
		}

		a {
			font-size: 16px;
			text-decoration: none;
			color: var(--text-primary);
			text-transform: uppercase;
			font-weight: bold;
		}
	}
</style>
