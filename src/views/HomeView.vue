<script setup lang="ts">
	import { onMounted, ref } from 'vue'
	import axios from 'axios'

	const loadingGetUsers = ref(false)
	const users = ref([])
	const getUsers = async () => {
		loadingGetUsers.value = true

		try {
			await axios.get(`${import.meta.env.VITE_API_URL}/api/users`).then((response) => {
				console.log(response.data)
				users.value = response.data
			})
		} catch (error) {
			console.log(error, 1)
		} finally {
			loadingGetUsers.value = false
		}
	}

	const addUser = async () => {
		try {
			await axios.get(`${import.meta.env.VITE_API_URL}/api/users/add`).then(() => {})
		} catch (error) {
			console.log(error, 1)
		}
	}

	onMounted(() => {
		console.log()
	})
</script>

<template>
	<div class="create-page">
		<div class="create-page__buttons">
			<button @click="addUser">Add users</button>
			<button @click="getUsers">Get users</button>
		</div>
		<div class="create-page__content">
			<div>...qwerq</div>
			<div>
				<h3>Users</h3>
				<p v-if="loadingGetUsers">Loading</p>
				<p v-else>{{ users }}</p>
			</div>
		</div>
	</div>
</template>

<style scoped lang="scss">
	.create-page {
		margin-bottom: 30px;

		&__buttons {
			display: flex;
			gap: 12px;
			justify-content: center;

			button {
				width: 100%;
			}
		}

		&__content {
			display: flex;
			flex-direction: column;
			gap: 12px;
			margin-top: 16px;

			div {
				border: 1px solid #bbb;
				padding: 12px;
			}
		}
	}
</style>
