import { defineStore } from 'pinia'
import { ref } from 'vue'
import { IUser } from '@/types/IUser.ts'
import axios from 'axios'
import { useWebApp } from 'vue-tg'

const { initData } = useWebApp()

export const useUserStore = defineStore('user', () => {
	const user = ref<IUser | null>(null)
	const token = ref<string | null>(null)
	const isNewUser = ref<boolean | null>(null)
	const loadingAuth = ref(true)
	const authError = ref(false)
	const retryInProgress = ref(false)

	const parseUser = (data: any): IUser => ({
		...data,
		lastFirstNameChange: new Date(data.lastFirstNameChange),
		lastNameChange: new Date(data.lastNameChange),
		lastGenderChange: new Date(data.lastGenderChange),
		premiumExpireAt: data.premiumExpireAt ? new Date(data.premiumExpireAt) : null,
		age: data.age === null ? null : data.age,
	})

	const authUser = async (isRetry = false): Promise<void> => {
		if (!import.meta.env.VITE_API_URL) {
			authError.value = true
			return
		}

		if (isRetry) retryInProgress.value = true
		else loadingAuth.value = true

		authError.value = false

		try {
			const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth`, { initData })
			const { success, data } = response.data

			if (!success) {
				authError.value = true
				return
			}

			user.value = parseUser(data.user)
			token.value = data.token
			isNewUser.value = data.isNewUser
		} catch (error: any) {
			authError.value = true
		} finally {
			if (isRetry) {
				retryInProgress.value = false
			} else {
				loadingAuth.value = false
			}
		}
	}

	return {
		user,
		token,
		loadingAuth,
		authError,
		retryInProgress,
		authUser,
	}
})
