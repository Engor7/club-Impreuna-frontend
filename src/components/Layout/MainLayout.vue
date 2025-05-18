<script setup lang="ts">
	import MainNav from '@/components/UI/MainNav.vue'
	import Notification from '@/components/UI/Notification.vue'
</script>

<template>
	<div class="main-layout">
		<div class="main-layout__page"><router-view /></div>
		<div class="main-layout__bottom"><MainNav /></div>
	</div>
	<Notification />
</template>

<style lang="scss">
	.main-layout {
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		overflow: hidden;

		height: 100vh;
		height: 100svh;

		&__page {
			flex-grow: 1;
			overflow: auto;
			padding: 8px;
			scrollbar-width: none;

			&::-webkit-scrollbar {
				display: none;
			}
		}

		&__bottom {
			padding: 12px 8px max(env(safe-area-inset-bottom), 8px) 8px;
			border-top: 1px solid var(--border-nav-top);
			background: var(--bg-body);
		}
	}
</style>
