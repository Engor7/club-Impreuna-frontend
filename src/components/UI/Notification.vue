<script setup lang="ts">
	import { computed } from 'vue'
	import { useNotificationStore } from '@/stores/notification'
	import WarningIcon from '@/components/Icons/Notification/WarningIcon.vue'
	import SuccessIcon from '@/components/Icons/Notification/SuccessIcon.vue'
	import ErrorIcon from '@/components/Icons/Notification/ErrorIcon.vue'

	const $store = useNotificationStore()
	const notification = computed(() => $store.activeNotification)
</script>

<template>
	<div v-if="notification?.isVisible" class="my-notification">
		<div class="my-notification__body">
			<div class="my-notification__icon" :class="`my-notification__icon_${notification?.type}`">
				<WarningIcon v-if="notification?.type === 'warning'" />
				<SuccessIcon v-if="notification?.type === 'success'" />
				<ErrorIcon v-if="notification?.type === 'error'" />
			</div>
			<div class="my-notification__message">
				<h4>{{ notification?.title }}</h4>
				<p>
					{{ notification?.message }}
				</p>
			</div>
			<div class="my-notification__buttons">
				<button v-if="notification?.cancelText" class="my-notification__bt-cancel" @click="$store.handleCancel">
					<span>{{ notification?.cancelText }}</span>
				</button>
				<button @click="$store.handleOk" class="my-notification__bt-ok">
					<span>{{ notification?.okText }}</span>
				</button>
			</div>
		</div>
	</div>
</template>

<style scoped lang="scss">
	.my-notification {
		display: flex;
		justify-content: center;
		align-items: center;
		position: fixed;
		background: var(--bg-overlay);
		backdrop-filter: blur(10px);
		-webkit-backdrop-filter: blur(10px);
		inset: 0;
		z-index: 1100;

		&__body {
			width: 80%;
			max-width: 340px;
			background: var(--bg-body-modal);
			color: var(--text-primary);
			border-radius: 18px;
			overflow: hidden;
			border: 1px solid var(--border-body-modal);
			animation: animate-body-notification 0.3s ease-in-out forwards;
			box-shadow: var(--shadow-body-modal);

			@keyframes animate-body-notification {
				0% {
					transform: scale(0.9);
					opacity: 0;
				}
				100% {
					transform: scale(1);
					opacity: 1;
				}
			}
		}

		&__icon {
			display: flex;
			justify-content: center;
			padding-top: 18px;

			svg {
				width: 34px;
				height: 34px;
			}

			&_warning {
				color: orange;
			}

			&_success {
				color: green;
			}

			&_error {
				color: red;
			}
		}

		&__message {
			text-align: center;
			padding-top: 18px;
			padding-left: 16px;
			padding-right: 16px;

			h4 {
				font-size: 18px;
				font-weight: 500;
			}

			p {
				opacity: 0.6;
				margin-top: 8px;
			}
		}

		&__buttons {
			display: flex;
			gap: 6px;
			padding: 6px;
			margin-top: 28px;

			button {
				width: 100%;
				border: none;
				border-radius: 12px;
				height: 48px;
				cursor: pointer;
				-webkit-tap-highlight-color: transparent;
			}
		}

		&__bt-cancel {
			background: var(--bg-button-cancel);
			color: var(--text-primary);

			span {
				opacity: 0.6;
			}
		}

		&__bt-ok {
			background: var(--bg-button);
			color: #fff;
		}
	}
</style>
