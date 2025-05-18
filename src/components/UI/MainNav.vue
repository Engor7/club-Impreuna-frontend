<script setup lang="ts">
	import ChatIcon from '@/components/Icons/Nav/ChatIcon.vue'
	import HeartIcon from '@/components/Icons/Nav/HeartIcon.vue'
	import MatchingIcon from '@/components/Icons/Nav/MatchingIcon.vue'

	const urlAvatar = 'https://assets.lummi.ai/assets/QmSWywUvJNKQtMjDeR6QSCuchos8M3dCHrLoZRjzjXLQTw?auto=format&w=1500'
</script>

<template>
	<div class="main-nav">
		<router-link to="/chat" class="main-nav__item" exact-active-class="main-nav__item_active">
			<ChatIcon />
			<span>{{ $t('nav.chat') }}</span>
		</router-link>
		<router-link to="/people" class="main-nav__item" exact-active-class="main-nav__item_active">
			<HeartIcon />
			<span>{{ $t('nav.people') }}</span>
		</router-link>
		<router-link to="/matches" class="main-nav__item" exact-active-class="main-nav__item_active">
			<MatchingIcon />
			<span>{{ $t('nav.matches') }}</span>
		</router-link>
		<router-link to="/" class="main-nav__item" exact-active-class="main-nav__item_active">
			<div class="main-nav__user-avatar" :style="{ backgroundImage: `url(${urlAvatar})` }"></div>
			<span>{{ $t('nav.i') }}</span>
		</router-link>
	</div>
</template>

<style scoped lang="scss">
	$size-icon: 24px;

	.main-nav {
		display: flex;
		justify-content: space-between;

		&__item {
			display: flex;
			flex-direction: column;
			align-items: center;
			gap: 6px;
			text-decoration: none;
			width: 100%;
			color: var(--text-primary);
			-webkit-tap-highlight-color: transparent;

			span {
				font-size: 10px;
				line-height: 12px;
			}

			:deep(.icon-nav_active) {
				display: none;
			}

			:deep(.icon-nav_default) {
				width: $size-icon;
				height: $size-icon;
			}
		}

		&__item_active {
			:deep(.icon-nav_default) {
				display: none;
			}

			:deep(.icon-nav_active) {
				display: block;
				transform: scale(1.15);
			}

			.main-nav__user-avatar:before {
				display: block;
			}

			:deep(.animation-icon-heart) {
				animation: animate-heart 0.3s ease-in-out forwards;
			}
		}

		&__user-avatar {
			position: relative;
			width: $size-icon;
			height: $size-icon;
			border-radius: 50%;
			background-size: cover;

			&:before {
				content: '';
				display: none;
				position: absolute;
				inset: -2.5px;
				border: 1.5px solid var(--text-primary);
				border-radius: 50%;
			}
		}
	}
</style>
