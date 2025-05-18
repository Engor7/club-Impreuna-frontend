<script setup lang="ts">
	import { useNotificationStore } from '@/stores/notification'

	const $store = useNotificationStore()

	const showError = () => {
		$store.showNotification('Это сообщение об ошибке!', 'error', 'Ошибка')
	}

	const showSuccess = () => {
		$store.showNotification('Это сообщение об успехе!', 'success', 'Успех')
	}

	const showWarning = () => {
		$store.showNotification('Это предупреждение!', 'warning', 'Внимание')
	}

	const showDefault = () => {
		$store.showNotification('Это обычное сообщение!', '', 'Уведомление')
	}

	const showCustom = () => {
		$store.showNotification(
			'Это сообщение с кастомной кнопкой!',
			'default',
			'Продолжить?',
			'Продолжить',
			() => {
				console.log('Обработчик кастомной кнопки выполнен!')
			},
			'Отмена',
			() => {
				console.log('Обработчик кнопки "Отмена" выполнен')
			}
		)
	}
</script>

<template>
	<div class="text-notification">
		<button @click="showError">Error</button>
		<button @click="showSuccess">Success</button>
		<button @click="showWarning">Warning</button>
		<button @click="showDefault">Default</button>
		<button @click="showCustom">Button</button>
	</div>
</template>

<style scoped lang="scss">
	.text-notification {
		display: flex;
		flex-wrap: wrap;
		gap: 6px;

		button {
			border: none;
			border-radius: 8px;
			padding: 6px 12px;
			color: var(--text-primary-reversal);
			background: var(--text-primary);
			cursor: pointer;
		}
	}
</style>
