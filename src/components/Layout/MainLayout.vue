<template>
	<div class="main-layout">
		<main>
			<router-view />
		</main>
		<nav>
			<router-link to="/">Home</router-link>
			<router-link to="/profile">Profile</router-link>
		</nav>
	</div>
</template>

<style lang="scss">
	.main-layout {
		padding: 16px;
	}
</style>
