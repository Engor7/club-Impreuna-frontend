<script setup lang="ts">
	import LoadingIcon from '@/components/Icons/LoadingIcon.vue'

	defineProps({
		text: {
			type: String,
			required: true,
		},
		type: {
			type: String,
			required: false,
			default: 'default',
		},
		loading: {
			type: Boolean,
			required: false,
			default: false,
		},
		disabled: {
			type: Boolean,
			required: false,
			default: false,
		},
	})
</script>

<template>
	<button
		class="my-base-button"
		:class="`my-base-button_${type}`"
		:disabled="loading || disabled"
		:data-loading="loading"
	>
		<span class="my-base-button__content">
			<slot name="icon" />
			<span>{{ text }}</span>
		</span>
		<span v-show="loading" class="my-base-button__loading">
			<LoadingIcon />
		</span>
	</button>
</template>

<style scoped lang="scss">
	.my-base-button {
		position: relative;
		display: flex;
		align-items: center;
		background-color: var(--bg-button);
		border: none;
		color: #ffffff;
		border-radius: 12px;
		overflow: hidden;
		cursor: pointer;

		&:disabled:not([data-loading='true']) {
			opacity: 0.5;
			cursor: not-allowed;
		}

		&[data-loading='true'] {
			opacity: 1;
			cursor: default;
			pointer-events: none;
		}

		&__content {
			position: relative;
			display: flex;
			align-items: center;
			z-index: 1;
		}

		&__loading {
			position: absolute;
			@include flex-center;
			inset: 0;
			z-index: 2;
			background-color: var(--bg-button);
		}

		&_default {
			font-size: 16px;
			padding: 0 24px;
			height: 44px;
			line-height: 44px;

			.my-base-button__content {
				gap: 8px;

				:deep(svg) {
					width: 16px;
					height: 16px;
				}
			}
		}

		&_small {
			font-size: 14px;
			padding: 0 16px;
			height: 32px;
			line-height: 32px;

			.my-base-button__content {
				gap: 6px;

				:deep(svg) {
					width: 16px;
					height: 16px;
				}
			}
		}

		&_big {
			font-size: 16px;
			padding: 0 32px;
			height: 52px;
			line-height: 52px;

			.my-base-button__content {
				gap: 8px;
				font-weight: 500;

				:deep(svg) {
					width: 24px;
					height: 24px;
				}
			}
		}
	}
</style>
