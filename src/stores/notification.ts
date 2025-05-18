import { defineStore } from 'pinia'
import { ref, reactive } from 'vue'

interface NotificationOptions {
	title: string
	message: string
	type: string
	okText: string
	okHandler: (() => void) | null
	cancelText: string | null
	cancelHandler: (() => void) | null
	isVisible: boolean
}

export const useNotificationStore = defineStore('notification', () => {
	const activeNotification = ref<NotificationOptions | null>(null)
	const notificationOptions = reactive<NotificationOptions>({
		title: '',
		message: '',
		type: 'default',
		okText: 'OK',
		okHandler: null,
		cancelText: null,
		cancelHandler: null,
		isVisible: false,
	})

	const showNotification = (
		message: string,
		type: string = 'default',
		title: string = '',
		okText: string = 'OK',
		okHandler: (() => void) | null = null,
		cancelText: string | null = null,
		cancelHandler: (() => void) | null = null
	) => {
		notificationOptions.title = title
		notificationOptions.message = message
		notificationOptions.type = type
		notificationOptions.okText = okText
		notificationOptions.okHandler = okHandler
		notificationOptions.cancelText = cancelText
		notificationOptions.cancelHandler = cancelHandler
		notificationOptions.isVisible = true

		activeNotification.value = { ...notificationOptions }
	}

	const closeNotification = () => {
		notificationOptions.isVisible = false
		activeNotification.value = null
	}

	const handleOk = () => {
		if (activeNotification.value?.okHandler) {
			activeNotification.value.okHandler()
		}
		closeNotification()
	}

	const handleCancel = () => {
		if (activeNotification.value?.cancelHandler) {
			activeNotification.value.cancelHandler()
		}
		closeNotification()
	}

	return {
		activeNotification,
		showNotification,
		closeNotification,
		handleOk,
		handleCancel,
	}
})
