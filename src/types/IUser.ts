export interface IUser {
	firstName: string // Имя пользователя
	lastFirstNameChange: Date // Дата последнего изменения имени
	aboutText: string // Описание пользователя ("Обо мне")
	photoUrl: string // Ссылка на фото профиля
	color: number // Цветовая тема профиля
	city: string // Город пользователя
	// Цель использования приложения:
	// 1 - Серьёзные отношения,
	// 2 - Дружба и общение,
	// 3 - Романтика и флирт,
	// 4 - Короткие встречи
	purpose: 1 | 2 | 3 | 4
	age: number | null // Возраст пользователя (может быть null, если не указан)
	gender: 'male' | 'female' | '' // Пол пользователя
	lastGenderChange: Date // Дата последнего изменения пола
	coords: {
		lat: number // Широта
		lon: number // Долгота
	}
	minAgePreference: number // Минимальный возраст предпочтений
	maxAgePreference: number // Максимальный возраст предпочтений
	isPremium: boolean // Статус премиум-подписки
	premiumExpireAt: Date | null // Дата окончания премиум-подписки
}
