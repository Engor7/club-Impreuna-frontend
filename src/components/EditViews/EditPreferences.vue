<script setup lang="ts">
	import { computed, defineModel, ref } from 'vue'
	import { BackButton, MainButton } from 'vue-tg'
	import axios from 'axios'
	import { useUserStore } from '@/stores/user'
	import { useNotificationStore } from '@/stores/notification'

	const userStore = useUserStore()
	const notificationStore = useNotificationStore()

	const { user, token } = userStore

	const mainButtonVisible = ref(true)
	const loading = ref(false)
	const visible = defineModel<boolean>('visible')

	// Устанавливаем начальные значения, если они есть в userStore
	const initialMinAge = user?.minAgePreference ?? 18
	const initialMaxAge = user?.maxAgePreference ?? 30

	const minAgePreference = ref<number>(initialMinAge)
	const maxAgePreference = ref<number>(initialMaxAge)

	// Если пользователь не изменил значения, кнопка показывает "Оставить как есть"
	const buttonText = computed(() => {
		return minAgePreference.value === initialMinAge && maxAgePreference.value === initialMaxAge
			? 'Оставить как есть'
			: 'Сохранить'
	})

	// Функция для вывода уведомления об ошибке
	const showErrorNotification = (message: string) => {
		mainButtonVisible.value = false
		notificationStore.showNotification(message, 'error', 'Ошибка', 'Повторить', () => {
			mainButtonVisible.value = true
		})
	}

	// Обработка сохранения настроек
	const handleSave = async () => {
		// Если настройки не изменились, просто закрываем окно
		if (minAgePreference.value === initialMinAge && maxAgePreference.value === initialMaxAge) {
			visible.value = false
			return
		}

		loading.value = true
		try {
			const response = await axios.patch(
				`${import.meta.env.VITE_API_URL}/api/user/preferences`,
				{ minAgePreference: minAgePreference.value, maxAgePreference: maxAgePreference.value },
				{ headers: { Authorization: `Bearer ${token}` } }
			)

			if (user) {
				user.minAgePreference = response.data.data.minAgePreference
				user.maxAgePreference = response.data.data.maxAgePreference
			}

			visible.value = false
		} catch (error: any) {
			const errorMessage = error.response?.data?.message || error.message || 'Ошибка при обновлении настроек'
			showErrorNotification(errorMessage)
		} finally {
			loading.value = false
		}
	}
</script>

<template>
	<div class="page-edit-view">
		<div class="page-edit-view__header">Настройки возраста</div>
		<div class="page-edit-view__body">
			<div class="preferences">
				<label for="minAge">Минимальный возраст</label>
				<input id="minAge" type="number" v-model.number="minAgePreference" min="16" />

				<label for="maxAge">Максимальный возраст</label>
				<input id="maxAge" type="number" v-model.number="maxAgePreference" min="16" />
			</div>
		</div>
	</div>

	<MainButton :text="buttonText" @click="handleSave" :visible="mainButtonVisible" :progress="loading" />
	<BackButton @click="visible = false" />
</template>

<style scoped lang="scss">
	.preferences {
		display: flex;
		flex-direction: column;
		gap: 16px;
		margin: 16px;

		label {
			font-weight: bold;
		}

		input {
			padding: 8px;
			font-size: 16px;
			border: 1px solid var(--border-block);
			border-radius: 4px;
		}
	}
</style>
