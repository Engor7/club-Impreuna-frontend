<script setup lang="ts">
	import { ref, computed } from 'vue'
	import { MainButton } from 'vue-tg'
	import axios, { type AxiosProgressEvent } from 'axios'
	import { useNotificationStore } from '@/stores/notification'
	import { useUserStore } from '@/stores/user'

	const $store = useNotificationStore()
	const userStore = useUserStore()

	// Состояния компонента
	const selectedFile = ref<File | null>(null) // новый выбранный файл (ещё не загружен)
	const previewUrl = ref<string>('') // URL превью выбранного файла
	const uploadedPhoto = ref<string>(userStore.user?.photoUrl || '') // уже загруженное фото (если есть)

	const isUploading = ref(false)
	const progress = ref(0)

	const fileInput = ref<HTMLInputElement | null>(null)

	// Текст кнопки зависит от того, выбран файл или нет
	const buttonText = computed(() => (selectedFile.value ? 'загрузить это фото' : 'Выбрать фото'))

	// Для превью: если есть выбранный файл – показываем его превью, иначе уже загруженное фото
	const displayPhoto = computed(() => (selectedFile.value ? previewUrl.value : uploadedPhoto.value))

	// Открытие выбора файла
	function selectFile() {
		fileInput.value?.click()
	}

	// Обработчик выбора файла
	function onFileSelected(e: Event) {
		const target = e.target as HTMLInputElement
		const file = target.files?.[0]
		if (!file) return

		// Проверка поддерживаемых MIME типов (аналогичная серверной проверке)
		const allowedMimes = ['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/heif']
		if (!allowedMimes.includes(file.type)) {
			alert('Формат не поддерживается!')
			return
		}

		selectedFile.value = file
		previewUrl.value = URL.createObjectURL(file)

		// Сброс значения инпута, чтобы можно было выбрать тот же файл повторно
		target.value = ''
	}

	// Функция загрузки файла
	async function uploadFile() {
		if (!selectedFile.value) return

		isUploading.value = true
		progress.value = 0

		const formData = new FormData()
		formData.append('avatar', selectedFile.value)

		try {
			const token = userStore.token
			const response = await axios.put(`${import.meta.env.VITE_API_URL}/api/user/avatar`, formData, {
				headers: {
					Authorization: `Bearer ${token}`,
					'Content-Type': 'multipart/form-data',
				},
				onUploadProgress: (progressEvent: AxiosProgressEvent) => {
					if (progressEvent.total) {
						progress.value = Math.round((progressEvent.loaded * 100) / progressEvent.total)
					}
				},
			})

			const { success, data } = response.data
			if (success && data.photoUrl) {
				// Обновляем превью и userStore
				uploadedPhoto.value = data.photoUrl
				if (userStore.user) {
					userStore.user.photoUrl = data.photoUrl
				}
				// Очистка выбранного файла и превью после успешной загрузки
				selectedFile.value = null
				previewUrl.value = ''
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

	// Функция нотификации в случае ошибки с возможностью повторной загрузки
	function showCustom() {
		$store.showNotification('При загрузки возникла ошибка', 'error', 'Ошибка', 'Попробовать еще', () => {
			uploadFile()
		})
	}

	// Обработчик клика по MainButton:
	// Если файл выбран и не идёт загрузка – запускаем uploadFile,
	// иначе открываем выбор файла.
	function handleMainButtonClick() {
		if (selectedFile.value && !isUploading.value) {
			uploadFile()
		} else if (!selectedFile.value) {
			selectFile()
		}
	}
</script>

<template>
	<div class="page-edit-view">
		<div class="page-edit-view__header">Фото профиля</div>
		<div class="page-edit-view__body">
			<div class="upload-avatar">
				<!-- Если идёт загрузка – показываем индикатор -->
				<div v-if="isUploading" class="upload-avatar__indicator">{{ progress }}%</div>
				<!-- Если выбран файл или уже есть загруженное фото – показываем превью -->
				<div
					v-else-if="displayPhoto"
					class="upload-avatar__preview"
					:style="{ backgroundImage: `url(${displayPhoto})` }"
				>
					<div class="upload-avatar__selected-new" @click="selectFile">Выбрать другое</div>
				</div>
				<!-- Иначе – шаблон для выбора фото -->
				<div v-else class="upload-avatar__template" @click="selectFile">
					<p>Пожалуйста, загрузите свое фото</p>
				</div>
			</div>
			<!-- Скрытый инпут для выбора файла -->
			<input
				ref="fileInput"
				type="file"
				accept="image/jpeg, image/png, image/webp, image/*, .heic, .heif"
				@change="onFileSelected"
				style="display: none"
			/>
		</div>
	</div>
	<!-- Кнопка MainButton: передаём текст и, если загрузка идёт, прогресс в виде булевого флага -->
	<MainButton :text="buttonText" :progress="isUploading" @click="handleMainButtonClick" />
</template>

<style scoped lang="scss">
	.upload-avatar {
		height: 100%;

		&__template {
			@include flex-center;
			border: 3px dashed var(--border-block);
			border-radius: 12px;
			height: 100%;
			cursor: pointer;
		}

		&__indicator {
			@include flex-center;
			height: 100%;
		}

		&__preview {
			position: relative;
			height: 100%;
			max-height: 100%;
			background-size: cover;
			background-position: center center;
			background-color: red;
		}

		&__selected-new {
			position: absolute;
			top: 8px;
			right: 8px;
			background: green;
			padding: 12px;
			cursor: pointer;
		}
	}

	.page-edit-view__body {
		height: 100%;
		padding-bottom: 24px;
	}
</style>
