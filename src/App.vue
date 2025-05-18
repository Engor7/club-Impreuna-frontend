<script setup lang="ts">
	import { onMounted } from 'vue'
	import { useWebApp, useWebAppViewport, useWebAppTheme, useWebAppMainButton } from 'vue-tg'
	import { useI18n } from 'vue-i18n'
	import { useUserStore } from '@/stores/user.ts'
	import ErrorView from '@/views/ErrorView.vue'
	import LoadingIcon from '@/components/Icons/LoadingIcon.vue'
	import EditPhoto from '@/components/EditViews/EditPhoto.vue'

	// init
	const { initDataUnsafe, platform } = useWebApp()
	const { expand, disableVerticalSwipes } = useWebAppViewport()
	const { colorScheme, setBackgroundColor, setHeaderColor, onThemeChanged } = useWebAppTheme()
	const { setMainButtonParams } = useWebAppMainButton()
	const { locale } = useI18n()

	// Store
	const userStore = useUserStore()

	// Supported platforms
	const supportedPlatforms = ['ios', 'android', 'macos', 'tdesktop']

	// Set theme interface
	const setColorTheme = (): void => {
		const htmlElement = document.documentElement
		const isDarkTheme = colorScheme.value === 'dark'

		htmlElement.classList.toggle('dark-theme', isDarkTheme)

		const colorViewport: any = isDarkTheme ? '#000000' : '#ffffff'
		setBackgroundColor(colorViewport)
		setHeaderColor(colorViewport)

		// main button color
		const buttonTextColor = isDarkTheme ? '#000000' : '#ffffff'
		const buttonBgColor = isDarkTheme ? '#ffffff' : '#000000'
		setMainButtonParams({ color: buttonBgColor, text_color: buttonTextColor })
	}

	// Set Language
	const setLanguage = (): void => {
		const userLanguage = initDataUnsafe.user?.language_code || 'ru'
		locale.value = ['ru', 'en'].includes(userLanguage) ? userLanguage : 'ru'
	}

	onMounted(() => {
		expand()
		disableVerticalSwipes()

		setColorTheme()
		setLanguage()

		if (supportedPlatforms.includes(platform)) {
			userStore.authUser()
		}
	})

	onThemeChanged(() => setColorTheme())
</script>

<template>
	<template v-if="supportedPlatforms.includes(platform)">
		<template v-if="userStore.loadingAuth">
			<div class="main-loading">
				<LoadingIcon />
			</div>
		</template>
		<template v-else-if="userStore.authError || userStore.retryInProgress">
			<ErrorView />
		</template>
		<template v-else>
			<template v-if="!userStore.user?.photoUrl"> <EditPhoto /> </template>
			<router-view v-else />
		</template>
	</template>
	<p v-else class="use-mobile-app">{{ $t('warning.useMobileApp') }}</p>
</template>

<style scoped lang="scss">
	.use-mobile-app {
		padding: 16px;
	}

	.main-loading {
		@include flex-center;
		height: 100vh;
		height: 100svh;

		svg {
			width: 32px;
			height: 32px;
		}
	}
</style>
