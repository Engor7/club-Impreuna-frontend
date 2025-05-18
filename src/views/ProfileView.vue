<script setup lang="ts">
	import { ref, computed } from 'vue'
	import dayjs from 'dayjs'
	import PaletteIcon from '@/components/Icons/Profile/PaletteIcon.vue'
	import MessageIcon from '@/components/Icons/Profile/MessageIcon.vue'
	import SmileIcon from '@/components/Icons/Profile/SmileIcon.vue'
	import LightningIcon from '@/components/Icons/Profile/LightningIcon.vue'
	import FilterIcon from '@/components/Icons/Profile/FilterIcon.vue'
	import GenderIcon from '@/components/Icons/Profile/GenderIcon.vue'
	import DateIcon from '@/components/Icons/Profile/DateIcon.vue'
	import CityIcon from '@/components/Icons/Profile/CityIcon.vue'
	import EditText from '@/components/EditViews/EditText.vue'
	import EditName from '@/components/EditViews/EditName.vue'
	import { useUserStore } from '@/stores/user.ts'
	import EditPurpose from '@/components/EditViews/EditPurpose.vue'
	import EditPreferences from '@/components/EditViews/EditPreferences.vue'
	import AvatarBlock from '@/components/ProfileView/AvatarBlock.vue'
	import ColorBlock from '@/components/ProfileView/ColorBlock.vue'

	const { user } = useUserStore()

	const isShowEditMessage = ref(false)
	const isShowEditName = ref(false)
	const isShowEditPurpose = ref(false)
	const isShowEditPreference = ref(false)

	// Интервал изменения имени в днях
	const nameChangeInterval = 7

	// Проверка возможности изменения имени (раз в 7 дней от даты на беке)
	const canChangeName = computed(() => {
		if (!user?.lastFirstNameChange) return true
		return dayjs().isAfter(dayjs(user.lastFirstNameChange).add(nameChangeInterval, 'day'))
	})

	// Дата и время следующего доступного изменения имени
	const nextNameChangeAvailable = computed(() => {
		if (!user?.lastFirstNameChange) return ''
		return dayjs(user.lastFirstNameChange).add(nameChangeInterval, 'day').format('DD.MM.YYYY в HH:mm')
	})

	// Обработчик клика на имя с проверкой
	const handleEditName = () => {
		if (canChangeName.value) {
			isShowEditName.value = true
		}
	}

	// Purpose
	const purposeLabels = {
		1: 'Серьёзные отношения',
		2: 'Дружба и общение',
		3: 'Романтика и флирт',
		4: 'Короткие встречи',
	}

	const currentPurposeLabel = computed(() => {
		return purposeLabels[user?.purpose ?? 1]
	})
</script>

<template>
	<EditText v-if="isShowEditMessage" v-model:visible="isShowEditMessage" />
	<EditName v-if="isShowEditName" v-model:visible="isShowEditName" :save-date="true" />
	<EditPurpose v-if="isShowEditPurpose" v-model:visible="isShowEditPurpose" />
	<EditPreferences v-if="isShowEditPreference" v-model:visible="isShowEditPreference" />

	<div class="profile-page">
		<AvatarBlock />
		<div class="profile-page__settings">
			<!-- Color -->
			<div class="profile-page__setting-block">
				<div class="profile-page__setting-header">
					<PaletteIcon />
					<span>Цвет профиля</span>
				</div>
				<div class="profile-page__setting-content">
					<ColorBlock />
				</div>
			</div>
			<!-- Text -->
			<div v-if="false" class="profile-page__setting-block" @click="isShowEditMessage = true">
				<div class="profile-page__setting-header">
					<MessageIcon />
					<span>Текст анкеты</span>
				</div>
				<div class="profile-page__setting-content">
					<p>{{ user?.aboutText }}</p>
				</div>
			</div>
			<!-- Name -->
			<div v-if="false" class="profile-page__setting-block" @click="handleEditName">
				<div class="profile-page__setting-header">
					<SmileIcon />
					<span>Имя</span>
				</div>
				<div
					class="profile-page__setting-content"
					:class="{ 'profile-page__setting-content_disabled': !canChangeName }"
				>
					{{ user?.firstName }}
				</div>
				<div v-if="!canChangeName" class="profile-page__setting-sub-info">
					Можно изменить: {{ nextNameChangeAvailable }}
				</div>
			</div>
			<!-- Purpose -->
			<div v-if="false" class="profile-page__setting-block" @click="isShowEditPurpose = true">
				<div class="profile-page__setting-header">
					<LightningIcon />
					<span>Цель знакомства</span>
				</div>
				<div class="profile-page__setting-content">
					{{ currentPurposeLabel }}
				</div>
			</div>
			<!-- Age preference -->
			<div v-if="false" class="profile-page__setting-block" @click="isShowEditPreference = true">
				<div class="profile-page__setting-header">
					<FilterIcon />
					<span>Предпочтения в возрасте</span>
				</div>
				<div class="profile-page__setting-content">от {{ user?.minAgePreference }} до {{ user?.maxAgePreference }}</div>
			</div>
			<!-- City -->
			<div v-if="false" class="profile-page__setting-block">
				<div class="profile-page__setting-header">
					<CityIcon />
					<span>Город</span>
				</div>
				<div class="profile-page__setting-content">Москва</div>
			</div>
			<!-- Date -->
			<div v-if="false" class="profile-page__setting-block">
				<div class="profile-page__setting-header">
					<DateIcon />
					<span>Мой возраст</span>
				</div>
				<div class="profile-page__setting-content">16.05.1996 (28 лет)</div>
			</div>
			<!-- Gender -->
			<div v-if="false" class="profile-page__setting-block">
				<div class="profile-page__setting-header">
					<GenderIcon />
					<span>Мой пол</span>
				</div>
				<div class="profile-page__setting-content">Мужской</div>
			</div>
		</div>
	</div>
</template>

<style scoped lang="scss">
	.profile-page {
		padding-bottom: 16px;

		&__settings {
			display: flex;
			flex-direction: column;
			gap: 31px;
			margin-top: 32px;
			padding: 0 8px;
		}

		&__setting-block {
			display: flex;
			flex-direction: column;
			gap: 8px;
		}

		&__setting-header {
			display: flex;
			gap: 8px;
			align-items: center;
			opacity: 0.6;
			padding-left: 16px;

			svg {
				width: 14px;
				height: 14px;
			}
		}

		&__setting-content {
			border: 1px solid var(--border-block);
			padding: 16px;
			border-radius: 24px;
		}

		&__setting-content_disabled {
			opacity: 0.6;
			background: var(--border-block);
		}

		&__setting-sub-info {
			opacity: 0.6;
			font-size: 11px;
			text-align: right;
		}
	}
</style>
