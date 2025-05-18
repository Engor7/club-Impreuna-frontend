<script setup lang="ts">
	import { ref } from 'vue'
	import { useWebAppHapticFeedback } from 'vue-tg'
	import { useUserStore } from '@/stores/user'
	import ImageEditIcon from '@/components/Icons/ImageEditIcon.vue'
	import axios, { type AxiosProgressEvent } from 'axios'
	import { useNotificationStore } from '@/stores/notification'

	const userStore = useUserStore()
	const { impactOccurred } = useWebAppHapticFeedback()
	const $store = useNotificationStore()

	const showPhoto = ref(false)
	const isUploading = ref(false)
	const progress = ref(0)
	const fileInput = ref<HTMLInputElement | null>(null)

	const showModalPhoto = () => {
		showPhoto.value = true
		impactOccurred('soft')
	}

	function selectFile() {
		fileInput.value?.click()
	}

	function onFileSelected(e: Event) {
		const target = e.target as HTMLInputElement
		const file = target.files?.[0]
		if (!file) return

		// Проверка MIME-типов, аналогичная проверке на сервере
		const allowedMimes = ['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/heif']
		if (!allowedMimes.includes(file.type)) {
			alert('Формат не поддерживается!')
			return
		}

		// Начинаем загрузку сразу после выбора файла
		uploadFile(file)
		// Сбрасываем значение input, чтобы можно было выбрать тот же файл повторно
		target.value = ''
	}

	async function uploadFile(file: File) {
		isUploading.value = true
		progress.value = 0

		const formData = new FormData()
		formData.append('avatar', file)

		try {
			const token = userStore.token
			const response = await axios.put(`${import.meta.env.VITE_API_URL}/api/user/avatar`, formData, {
				headers: {
					Authorization: `Bearer ${token}`,
					'Content-Type': 'multipart/form-data',
				},
				// Используем типизированный параметр для onUploadProgress
				onUploadProgress: (progressEvent: AxiosProgressEvent) => {
					if (progressEvent.total) {
						progress.value = Math.round((progressEvent.loaded * 100) / progressEvent.total)
					}
				},
			})

			const { success, data } = response.data
			if (success && data.photoUrl) {
				// Обновляем аватар в хранилище пользователя
				if (userStore.user) {
					userStore.user.photoUrl = data.photoUrl
				}
			} else {
				showCustom()
			}
		} catch (err) {
			console.error('Upload error:', err)
			showCustom()
		} finally {
			isUploading.value = false
		}
	}

	function showCustom() {
		$store.showNotification('При загрузки возникла ошибка', 'error', 'Ошибка', 'Попробовать еще', () => {
			selectFile()
		})
	}
</script>

<template>
	<div class="avatar-block">
		<div
			class="avatar-block__image"
			:style="{ backgroundImage: `url(${userStore.user?.photoUrl || ''})` }"
			@click="showModalPhoto"
		>
			<div v-if="isUploading" class="avatar-block__image-upload-indicator">{{ progress }}%</div>
		</div>
		<div v-if="showPhoto" class="avatar-block__photo-modal" @click="showPhoto = false">
			<div class="avatar-block__photo-modal-body">
				<img :src="userStore.user?.photoUrl" alt="Аватар" />
			</div>
		</div>
		<div class="avatar-block__edit-avatar" @click="selectFile">
			<ImageEditIcon />
			<span>Изменить</span>
		</div>
		<!-- Скрытый input для выбора файла -->
		<input
			ref="fileInput"
			type="file"
			accept="image/jpeg, image/png, image/webp, image/*, .heic, .heif"
			@change="onFileSelected"
			style="display: none"
		/>
	</div>
</template>

<style scoped lang="scss">
	.avatar-block {
		padding-bottom: 16px;

		&__image {
			position: relative;
			width: 120px;
			height: 120px;
			overflow: hidden;
			border-radius: 50%;
			margin: 0 auto;
			@include flex-center;
			cursor: pointer;
			background-size: cover;
			background-position: center center;
		}

		&__image-upload-indicator {
			@include flex-center;
			background: var(--text-primary-reversal);
			color: var(--text-primary);
			position: absolute;
			inset: 0;
			z-index: 3;
			opacity: 0.6;
		}

		&__edit-avatar {
			position: relative;
			display: flex;
			justify-content: center;
			align-items: center;
			gap: 8px;
			padding: 18px 0;
			cursor: pointer;

			svg {
				width: 16px;
				height: 16px;
			}
		}

		&__photo-modal {
			position: fixed;
			inset: 0;
			z-index: 30;
			background: var(--bg-body);
			padding: 8px 8px max(env(safe-area-inset-bottom), 8px) 8px;
			user-select: none;
			-webkit-user-select: none;
			-moz-user-select: none;
			-ms-user-select: none;
			cursor: pointer;
		}

		&__photo-modal-body {
			@include flex-center;
			flex-direction: column;
			gap: 24px;
			height: 100%;
			overflow: hidden;
			background-size: cover;
			background-position: center center;
			animation: zoom-animation-photo-modal 0.3s ease-in-out forwards;

			:deep(.edit-avatar-button) {
				margin-bottom: 24px;
			}

			img {
				width: 100%;
				height: 100%;
				object-fit: contain;
				max-width: 100%;
				max-height: 100%;
			}

			@keyframes zoom-animation-photo-modal {
				from {
					transform: scale(0.95);
				}
				to {
					transform: scale(1);
				}
			}
		}
	}
</style>
