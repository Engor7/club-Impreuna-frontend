<template>
	<div class="block-color">
		<div class="block-color__item user-card-style_st-1"></div>
		<div class="block-color__item user-card-style_st-2 block-color__item_active"></div>
		<div class="block-color__item user-card-style_st-3"></div>
		<div class="block-color__item user-card-style_st-4"></div>
		<div class="block-color__item user-card-style_st-5"></div>
		<div class="block-color__item-more">Еще...</div>
	</div>
	<p>Адаптивный</p>
</template>

<style scoped lang="scss">
	.block-color {
		display: grid;
		grid-template-columns: repeat(5, 43px) auto;
		justify-content: space-between;
		margin-bottom: 12px;
		cursor: pointer;

		&__item {
			width: 100%;
			aspect-ratio: 1 / 1;
			max-height: 48px;
			max-width: 48px;
			background: var(--bg-style);
			border-radius: 50%;

			&_active {
				position: relative;
				transform: scale(0.91);

				&:before {
					content: '';
					position: absolute;
					inset: -3px;
					border: 1.5px solid var(--text-primary);
					border-radius: 50%;
					opacity: 0.6;
				}
			}
		}

		&__item-more {
			@include flex-center;
			background: var(--border-block);
			max-height: 48px;
			border-radius: 16px;
			padding: 0 12px;
		}
	}
</style>
