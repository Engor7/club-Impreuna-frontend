<script setup lang="ts">
	import { onMounted } from 'vue'
	import { useWebApp, useWebAppViewport, useWebAppTheme } from 'vue-tg'
	import { useI18n } from 'vue-i18n'

	const { initDataUnsafe, initData } = useWebApp()
	const { expand, disableVerticalSwipes } = useWebAppViewport()
	const { colorScheme, setBackgroundColor, setHeaderColor, onThemeChanged } = useWebAppTheme()
	const { locale } = useI18n()

	const setColorTheme = (): void => {
		const htmlElement = document.documentElement
		const isDarkTheme = colorScheme.value === 'dark'

		htmlElement.classList.toggle('dark-theme', isDarkTheme)

		const colorViewport: any = isDarkTheme ? '#111' : '#fff'
		setBackgroundColor(colorViewport)
		setHeaderColor(colorViewport)
	}

	const setLanguage = (): void => {
		const userLanguage = initDataUnsafe.user?.language_code || 'ru'
		locale.value = ['ru', 'en'].includes(userLanguage) ? userLanguage : 'ru'
	}

	onMounted(() => {
		expand()
		disableVerticalSwipes()

		setColorTheme()
		setLanguage()

		console.log(initData)
	})

	onThemeChanged(() => setColorTheme())
</script>

<template>
	<router-view />
</template>
