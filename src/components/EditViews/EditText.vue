<script setup lang="ts">
	import { defineModel, ref, watch, onMounted, nextTick, computed } from 'vue'
	import { BackButton, MainButton } from 'vue-tg'
	import axios from 'axios'
	import { useUserStore } from '@/stores/user'
	import { useNotificationStore } from '@/stores/notification'

	const userStore = useUserStore()
	const { user, token } = userStore
	const notificationStore = useNotificationStore()

	const visible = defineModel<boolean>('visible')
	const textareaRef = ref<HTMLTextAreaElement | null>(null)
	const initialText = user?.aboutText || ''
	const text = ref(initialText)
	const loading = ref(false)
	const showInput = ref(true)
	const mainButtonVisible = ref(true)

	const setFocus = () => {
		if (textareaRef.value) {
			textareaRef.value.focus()
			const length = textareaRef.value.value.length
			textareaRef.value.setSelectionRange(length, length)
		}
	}

	watch(visible, (val) => {
		if (val) {
			showInput.value = true
			mainButtonVisible.value = true
			nextTick(setFocus)
		}
	})

	const onBlur = () => {
		setTimeout(setFocus, 0)
	}

	onMounted(() => {
		nextTick(setFocus)
	})

	const charCount = computed(() => text.value.length)

	const formatText = (val: string) => val.replace(/\s+/g, ' ').slice(0, 200)

	const onInput = () => {
		text.value = formatText(text.value)
	}

	const isChanged = computed(() => text.value.trim() !== initialText.trim())

	const buttonText = computed(() => {
		if (!isChanged.value) return 'Оставить как есть'
		return text.value.trim() === '' ? 'Оставить пустым' : 'Сохранить'
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

	const handleSave = async () => {
		if (!isChanged.value) {
			visible.value = false
			return
		}

		loading.value = true
		try {
			await axios.patch(
				`${import.meta.env.VITE_API_URL}/api/user/about`,
				{ aboutText: text.value.trim() },
				{ headers: { Authorization: `Bearer ${token}` } }
			)

			if (user) {
				user.aboutText = text.value.trim()
			}

			visible.value = false
		} catch (error: any) {
			const errorMessage = error.response?.data?.message || error.message || 'Ошибка при обновлении текста'
			showErrorNotification(errorMessage)
		} finally {
			loading.value = false
		}
	}
</script>

<template>
	<div class="page-edit-view">
		<div class="page-edit-view__header">Текст анкеты</div>
		<div class="page-edit-view__body">
			<textarea
				v-if="showInput"
				class="my-textarea"
				ref="textareaRef"
				v-model="text"
				@input="onInput"
				@blur="onBlur"
				placeholder="Что вы ожидаете"
			/>
		</div>
		<div class="page-edit-view__sub-info">{{ charCount }} символов из 200</div>
	</div>

	<MainButton :text="buttonText" @click="handleSave" :progress="loading" :visible="mainButtonVisible" />
	<BackButton @click="visible = false" />
</template>

<style scoped lang="scss">
	.my-textarea {
		border: none;
		width: 80%;
		height: 170px;
		color: var(--text-primary);
		background: none;
		outline: none;
		resize: none;
		font-size: 16px;
		line-height: 140%;
	}

	.page-edit-view__body {
		display: flex;
		justify-content: center;
	}
</style>
