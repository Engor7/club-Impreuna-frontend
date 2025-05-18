<script setup lang="ts">
	import { ref } from 'vue'
	import { useWebAppHapticFeedback } from 'vue-tg'

	import LikeIcon from '@/components/Icons/UserCardButtons/LikeIcon.vue'
	import MessageIcon from '@/components/Icons/UserCardButtons/MessageIcon.vue'
	import BackArrowIcon from '@/components/Icons/UserCardButtons/BackArrowIcon.vue'
	import CloseIcon from '@/components/Icons/CloseIcon.vue'

	const { impactOccurred } = useWebAppHapticFeedback()

	const showPhoto = ref(false)

	defineProps({
		styleNumber: {
			type: Number,
			default: 1,
		},
		photoUrl: {
			type: String,
			default: '0',
		},
	})

	const showModalPhoto = () => {
		showPhoto.value = true
		impactOccurred('soft')
	}
</script>

<template>
	<div class="user-card" :class="`user-card-style_st-${styleNumber}`">
		<div class="user-card__name">Stiy Kiano <span>21</span></div>
		<div class="user-card__photo-wrapper">
			<div class="user-card__photo" :style="{ backgroundImage: `url(${photoUrl})` }" @click="showModalPhoto"></div>
		</div>
		<div v-if="showPhoto" class="user-card__photo-modal" @click="showPhoto = false">
			<div class="user-card__photo-modal-body">
				<img :src="photoUrl" alt="" />
			</div>
		</div>
		<div class="user-card__about">
			<b>Москва</b>
			<p>
				Lorem ipsum dolor sit amet, consectetur adipisicing elit. Dolorum eum impedit ipsa minus obcaecati perspiciats
			</p>
		</div>
		<div class="user-card__buttons">
			<button class="user-card__back-button">
				<BackArrowIcon />
			</button>
			<button>
				<CloseIcon />
			</button>
			<button>
				<MessageIcon />
			</button>
			<button>
				<LikeIcon />
			</button>
		</div>
	</div>
</template>

<style scoped lang="scss">
	.user-card {
		display: flex;
		flex-direction: column;
		gap: 8px;
		height: 100%;
		padding: 12px 8px 8px 8px;
		background: var(--bg-style);
		border-radius: 28px;
		color: var(--text-color);
		user-select: none;
		-webkit-user-select: none;
		-moz-user-select: none;

		&__name {
			font-size: 26px;
			text-align: center;
			margin-bottom: 4px;

			span {
				opacity: 0.4;
			}
		}

		&__photo-wrapper {
			position: relative;
			flex-grow: 1;
			border-radius: 16px;
			overflow: hidden;
		}

		&__photo {
			height: 100%;
			background-size: cover;
			background-position: center center;
			border-radius: 8px;
			cursor: pointer;
			transition: all 0.3s;

			@keyframes zoom-animation-photo {
				from {
					transform: rotate(2deg) scale(1.05);
				}

				to {
					transform: rotate(0deg) scale(1);
				}
			}

			&:active {
				transform: scale(1.02);
			}
		}

		&__about {
			display: flex;
			flex-direction: column;
			gap: 4px;

			b {
				font-size: 16px;
				font-weight: 500;
			}

			p {
				line-height: 140%;
				font-size: 12px;
				opacity: 0.7;
			}
		}

		&__button-zoom-photo {
			width: 30px;
			height: 30px;
			background: #000;
			position: absolute;
			right: 6px;
			bottom: 6px;
			border-radius: 50%;
			z-index: 10;
			opacity: 0.6;
		}

		&__buttons {
			display: flex;
			justify-content: flex-end;
			gap: 16px;
			margin-top: 16px;

			button {
				@include flex-center;
				height: 48px;
				padding: 0 24px;
				border-radius: 60px;
				border: none;
				box-shadow: inset 0 0 34px rgba(255, 255, 255, 0.5);
				border: 1px solid rgba(255, 255, 255, 0.5);
				background: none;
				color: #fff;
				cursor: pointer;

				svg {
					width: 26px;
					height: 26px;
				}

				&.user-card__back-button {
					margin-right: auto;
					padding: 0;
					width: 48px;
					color: rgba(255, 255, 255, 0.8);
					box-shadow: none !important;
					border: 1px solid rgba(255, 255, 255, 0.5);
					opacity: 0.8;
				}
			}
		}

		&__photo-modal {
			position: fixed;
			inset: 0;
			z-index: 30;
			background: var(--bg-body);
			padding: 8px 8px max(env(safe-area-inset-bottom), 8px) 8px;
			user-select: none;
			-webkit-user-select: none;
			-moz-user-select: none;
			-ms-user-select: none;
			cursor: pointer;
		}

		&__photo-modal-body {
			@include flex-center;
			height: 100%;
			border-radius: 8px;
			overflow: hidden;
			background-size: cover;
			background-position: center center;
			animation: zoom-animation-photo-modal 0.3s ease-in-out forwards;

			img {
				width: 100%;
				height: 100%;
				object-fit: contain;
				max-width: 100%;
				max-height: 100%;
			}

			@keyframes zoom-animation-photo-modal {
				from {
					transform: scale(0.95);
				}

				to {
					transform: scale(1);
				}
			}
		}
	}
</style>
