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

	const initialPurpose = (user?.purpose ?? 1) as 1 | 2 | 3 | 4
	const purpose = ref<1 | 2 | 3 | 4>(initialPurpose)

	interface PurposeOption {
		id: 1 | 2 | 3 | 4
		label: string
	}

	const purposeOptions: PurposeOption[] = [
		{ id: 1, label: 'Серьёзные отношения' },
		{ id: 2, label: 'Дружба и общение' },
		{ id: 3, label: 'Романтика и флирт' },
		{ id: 4, label: 'Короткие встречи' },
	]

	const buttonText = computed(() => {
		return purpose.value === initialPurpose ? 'Оставить как есть' : 'Сохранить'
	})

	const showErrorNotification = (message: string) => {
		mainButtonVisible.value = false
		notificationStore.showNotification(message, 'error', 'Ошибка', 'Повторить', () => {
			mainButtonVisible.value = true
		})
	}

	const handleSave = async () => {
		if (purpose.value === initialPurpose) {
			visible.value = false
			return
		}

		loading.value = true
		try {
			const response = await axios.patch(
				`${import.meta.env.VITE_API_URL}/api/user/purpose`,
				{ purpose: purpose.value },
				{ headers: { Authorization: `Bearer ${token}` } }
			)

			if (user) {
				user.purpose = response.data.data.purpose
			}

			visible.value = false
		} catch (error: any) {
			const errorMessage = error.response?.data?.message || error.message || 'Ошибка при обновлении цели'
			showErrorNotification(errorMessage)
		} finally {
			loading.value = false
		}
	}
</script>

<template>
	<div class="page-edit-view">
		<div class="page-edit-view__header">Цель знакомства</div>
		<div class="page-edit-view__body">
			<div class="purpose">
				<div
					v-for="option in purposeOptions"
					:key="option.id"
					class="purpose__item"
					:class="{ purpose__item_active: purpose === option.id }"
					@click="purpose = option.id"
				>
					{{ option.label }}
				</div>
			</div>
		</div>
	</div>

	<MainButton :text="buttonText" @click="handleSave" :visible="mainButtonVisible" :progress="loading" />
	<BackButton @click="visible = false" />
</template>

<style scoped lang="scss">
	.purpose {
		display: flex;
		flex-direction: column;
		gap: 12px;

		&__item {
			border: 1px solid var(--border-block);
			padding: 16px;
			border-radius: 12px;
			text-align: center;
			cursor: pointer;

			&_active {
				background: var(--bg-button);
				border-color: var(--bg-button);
				color: #fff;
			}
		}
	}
</style>
