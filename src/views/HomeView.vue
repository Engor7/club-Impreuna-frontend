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
		<div class="create-page__img">
			<img src="https://s3.timeweb.cloud/320d6128-c3b021bb-59f1-4c90-b27e-4428e48b03c6/logo_st.png" alt="" />
			<img src="/icon_fv.svg" alt="" />
			<img
				src="https://images.unsplash.com/photo-1734378377292-212b58560ff8?q=80&w=2599&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
				alt=""
			/>
		</div>
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

		&__img {
			img {
				width: 100px;
			}
		}
	}
</style>
