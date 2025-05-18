<script setup lang="ts">
	import { defineModel, defineProps, ref, watch, onMounted, nextTick, computed } from 'vue'
	import { BackButton, MainButton } from 'vue-tg'
	import axios from 'axios'
	import { useUserStore } from '@/stores/user'
	import { useNotificationStore } from '@/stores/notification'

	const props = defineProps({
		saveDate: {
			type: Boolean,
			default: true,
		},
	})
	const visible = defineModel<boolean>('visible')

	const userStore = useUserStore()
	const notificationStore = useNotificationStore()
	const { user, token } = userStore

	const inputRef = ref<HTMLInputElement | null>(null)
	const showInput = ref(true)
	const mainButtonVisible = ref(true)
	const loading = ref(false)

	const initialText = user?.firstName || ''
	const text = ref(initialText)

	const setFocus = () => {
		if (inputRef.value) {
			inputRef.value.focus()
			const length = inputRef.value.value.length
			inputRef.value.setSelectionRange(length, length)
		}
	}

	watch(visible, (val) => {
		if (val) {
			showInput.value = true
			mainButtonVisible.value = true
			nextTick(setFocus)
		}
	})

	onMounted(() => {
		nextTick(setFocus)
	})

	const onBlur = () => {
		setTimeout(setFocus, 0)
	}

	const charCount = computed(() => text.value.length)
	const formatText = (val: string) => val.replace(/\s+/g, ' ').slice(0, 20)

	const onInput = () => {
		text.value = formatText(text.value)
	}

	const buttonText = computed(() => {
		return text.value.trim() === initialText.trim() ? 'Оставить как есть' : 'Сохранить'
	})

	const showErrorNotification = (message: string) => {
		showInput.value = false
		mainButtonVisible.value = false
		notificationStore.showNotification(message, 'error', 'Ошибка', 'Повторить', () => {
			showInput.value = true
			mainButtonVisible.value = true
			nextTick(setFocus)
		})
	}

	const confirmAndSave = () => {
		showInput.value = false
		mainButtonVisible.value = false

		notificationStore.showNotification(
			'Изменить имя можно только 1 раз в 7 дней. Вы уверены?',
			'warning',
			'Подтвердите действие',
			'Сохранить',
			async () => {
				showInput.value = true
				mainButtonVisible.value = true
				loading.value = true
				await nextTick(setFocus)

				try {
					const response = await axios.patch(
						`${import.meta.env.VITE_API_URL}/api/user/name`,
						{ firstName: text.value.trim(), skipDateUpdate: !props.saveDate },
						{ headers: { Authorization: `Bearer ${token}` } }
					)

					if (user) {
						user.firstName = response.data.data.firstName
						if (props.saveDate) {
							user.lastFirstNameChange = new Date()
						}
					}
					visible.value = false
				} catch (error: any) {
					const errorMessage = error.response?.data?.message || error.message || 'Ошибка при обновлении имени'
					showErrorNotification(errorMessage)
				} finally {
					loading.value = false
				}
			},
			'Отмена',
			() => {
				showInput.value = true
				mainButtonVisible.value = true
				nextTick(setFocus)
			}
		)
	}

	const handleSave = () => {
		const trimmedText = text.value.trim()

		if (trimmedText === initialText.trim()) {
			visible.value = false
			return
		}

		if (trimmedText === '') {
			showErrorNotification('Необходимо указать имя')
			return
		}

		confirmAndSave()
	}
</script>

<template>
	<div class="page-edit-view">
		<div class="page-edit-view__header">Имя</div>
		<div class="page-edit-view__body">
			<input v-if="showInput" class="my-input" ref="inputRef" v-model="text" @input="onInput" @blur="onBlur" />
		</div>
		<div class="page-edit-view__sub-info">{{ charCount }} символов из 20</div>
	</div>

	<MainButton :text="buttonText" @click="handleSave" :visible="mainButtonVisible" :progress="loading" />
	<BackButton @click="visible = false" />
</template>

<style scoped lang="scss">
	.my-input {
		border: none;
		width: 100%;
		color: var(--text-primary);
		background: none;
		outline: none;
		font-size: 16px;
		text-align: center;
	}

	.page-edit-view__body {
		display: flex;
		justify-content: center;
	}
</style>
