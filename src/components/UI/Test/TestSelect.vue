<template>
	<div class="year-picker">
		<div class="picker-container">
			<div
				class="picker-item"
				v-for="year in years"
				:key="year"
				:class="{ active: year === selectedYear }"
				@click="selectYear(year)"
			>
				{{ year }}
			</div>
		</div>
	</div>
</template>

<script>
	export default {
		name: 'YearPicker',
		props: {
			minYear: {
				type: Number,
				default: 2000,
			},
			maxYear: {
				type: Number,
				default: 2030,
			},
			value: {
				type: Number,
				default: new Date().getFullYear(),
			},
		},
		data() {
			return {
				selectedYear: this.value,
			}
		},
		computed: {
			years() {
				const range = []
				for (let i = this.minYear; i <= this.maxYear; i++) {
					range.push(i)
				}
				return range
			},
		},
		watch: {
			selectedYear(newVal) {
				this.$emit('input', newVal)
			},
		},
		methods: {
			selectYear(year) {
				this.selectedYear = year
			},
		},
	}
</script>

<style scoped>
	.year-picker {
		display: flex;
		justify-content: center;
		align-items: center;
		height: 200px;
		overflow: hidden;
		position: relative;
	}

	.picker-container {
		display: flex;
		flex-direction: column;
		align-items: center;
		height: 100%;
		overflow-y: auto;
		scroll-behavior: smooth;
		scrollbar-width: none; /* Скрыть скроллбар для Firefox */
	}

	.picker-container::-webkit-scrollbar {
		display: none; /* Скрыть скроллбар для Chrome, Safari */
	}

	.picker-item {
		font-size: 20px;
		padding: 10px 20px;
		cursor: pointer;
		user-select: none;
		transition:
			transform 0.2s,
			color 0.2s;
	}

	.picker-item.active {
		color: #007aff; /* Цвет активного элемента */
		font-weight: bold;
		transform: scale(1.2);
	}
</style>
