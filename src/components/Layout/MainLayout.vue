<template>
	<div class="main-layout">
		<router-view />
		<nav>
			<router-link to="/">Home</router-link>
			<router-link to="/profile">Profile</router-link>
		</nav>
	</div>
</template>

<style lang="scss">
	.main-layout {
		padding: 16px;
		overflow: auto;
		height: 100svh;
	}
</style>
