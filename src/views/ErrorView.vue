<script setup lang="ts">
	import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
	import { useUserStore } from '@/stores/user'
	import ImageGirlIcon from '@/components/Icons/ImageGirlIcon.vue'
	import MyBaseButton from '@/components/UI/MyBaseButton.vue'
	import { useI18n } from 'vue-i18n'
	import { useWebAppCloudStorage } from 'vue-tg'

	const userStore = useUserStore()
	const { t } = useI18n()
	const { setStorageItem, getStorageItem } = useWebAppCloudStorage()

	// Config
	const retryDelay = ref(5 * 60 * 1000)

	// Локальные состояния
	const retryAttempts = ref(0)
	const lockUntil = ref<number | null>(null)
	const currentTime = ref(Date.now())
	const isErrorVisible = ref(false)

	let intervalId: NodeJS.Timeout | null = null

	const checkRetryLimit = async () => {
		try {
			const savedLockTime = await getStorageItem('errorRetryLock')
			const savedAttempts = await getStorageItem('errorRetryAttempts')

			if (savedLockTime) {
				lockUntil.value = parseInt(savedLockTime, 10)
			}

			if (savedAttempts) {
				retryAttempts.value = parseInt(savedAttempts, 10)
			}
		} catch (err) {
			console.error('Failed to load retry data:', (err as Error).message)
		}
	}

	const saveRetryData = async () => {
		try {
			if (lockUntil.value) {
				await setStorageItem('errorRetryLock', lockUntil.value.toString())
			}
			await setStorageItem('errorRetryAttempts', retryAttempts.value.toString())
		} catch (err) {
			console.error('Failed to save retry data:', (err as Error).message)
		}
	}

	const formatTimeLeft = (milliseconds: number) => {
		const totalSeconds = Math.ceil(milliseconds / 1000)
		const hours = Math.floor(totalSeconds / 3600)
		const minutes = Math.floor((totalSeconds % 3600) / 60)
		const seconds = totalSeconds % 60

		return `${hours.toString().padStart(2, '0')}:${minutes
			.toString()
			.padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
	}

	const isButtonDisabled = computed(() => {
		if (lockUntil.value && currentTime.value < lockUntil.value) {
			return true
		}
		return retryAttempts.value >= 5 || userStore.retryInProgress
	})

	const errorMessage = computed(() => {
		if (lockUntil.value && currentTime.value < lockUntil.value) {
			const remainingTime = lockUntil.value - currentTime.value
			return t('errors.retryLater', { time: formatTimeLeft(remainingTime) })
		}
		return ''
	})

	const setRetryLock = async () => {
		lockUntil.value = Date.now() + retryDelay.value
		retryAttempts.value = 5
		await saveRetryData()
	}

	const updateCurrentTime = () => {
		currentTime.value = Date.now()
	}

	const startTimer = () => {
		intervalId = setInterval(() => {
			updateCurrentTime()

			if (lockUntil.value && currentTime.value >= lockUntil.value) {
				lockUntil.value = null
				retryAttempts.value = 0
				saveRetryData()
			}
		}, 1000)
	}

	const stopTimer = () => {
		if (intervalId) {
			clearInterval(intervalId)
		}
	}

	const retryAuth = async () => {
		if (retryAttempts.value >= 5) {
			await setRetryLock()
			return
		}

		retryAttempts.value += 1
		await saveRetryData()

		await userStore.authUser(true)

		if (retryAttempts.value >= 5) {
			await setRetryLock()
		}
	}

	watch(errorMessage, (newValue) => {
		isErrorVisible.value = !!newValue
	})

	onMounted(async () => {
		await checkRetryLimit()
		startTimer()
	})

	onUnmounted(() => {
		stopTimer()
	})
</script>

<template>
	<div class="error-page">
		<div class="error-page__image">
			<ImageGirlIcon />
		</div>
		<div class="error-page__content">
			<h3>{{ t('errors.title') }}</h3>
			<p>
				{{ t('errors.description.line1') }}<br />
				{{ t('errors.description.line2') }}
			</p>
			<MyBaseButton
				:disabled="isButtonDisabled"
				@click="retryAuth"
				:text="t('common.retry')"
				:loading="userStore.retryInProgress"
			/>
			<div class="error-page__error-limit" :class="{ 'error-page__error-limit--visible': isErrorVisible }">
				{{ errorMessage }}
			</div>
		</div>
	</div>
</template>

<style lang="scss" scoped>
	.error-page {
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		align-items: center;
		padding: 16px 16px 96px 16px;
		height: 100vh;
		height: 100svh;

		&__image {
			display: flex;
			justify-content: center;
			align-items: center;
			flex-grow: 1;

			svg {
				width: 32%;
				height: auto;
				opacity: 0.8;
			}
		}

		&__content {
			display: flex;
			flex-direction: column;
			align-items: center;

			h3 {
				font-size: 28px;
				font-weight: 500;
			}

			p {
				text-align: center;
				opacity: 0.6;
				font-weight: 300;
				margin: 16px 0 48px 0;
				line-height: 1.4;
			}
		}

		&__error-limit {
			margin-top: 16px;
			font-size: 11px;
			line-height: 12px;
			height: 12px;
			opacity: 0;
			transition: opacity 0.3s ease;

			&--visible {
				opacity: 0.8;
			}
		}
	}
</style>
