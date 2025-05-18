<template>
	<canvas ref="canvas" :width="width" :height="height" @click="explode"></canvas>
</template>

<script>
	import { ref, onMounted, onUnmounted } from 'vue'

	export default {
		name: 'ParticleSphere',
		setup() {
			const canvas = ref(null)
			const width = ref(window.innerWidth)
			const height = ref(window.innerHeight)
			const particles = []
			const numParticles = 1000 // Количество частиц
			const radius = ref(150) // Радиус сферы (теперь реактивный)
			const center = { x: width.value / 2, y: height.value / 2 } // Центр сферы
			const isExploding = ref(false) // Флаг для анимации взрыва

			class Particle {
				constructor() {
					// Начальные координаты внутри сферы
					const angle = Math.random() * Math.PI * 2
					const r = Math.random() * radius.value
					this.x = center.x + Math.cos(angle) * r
					this.y = center.y + Math.sin(angle) * r

					// Скорость частицы
					this.vx = (Math.random() - 0.5) * 1
					this.vy = (Math.random() - 0.5) * 1

					// Размер частицы (меньше разброс)
					this.size = Math.random() * 1 + 0.5 // От 0.5 до 1.5

					// Сохраняем начальные координаты для возврата
					this.originX = this.x
					this.originY = this.y
				}

				update() {
					if (isExploding.value) {
						// Если анимация взрыва активна, частицы разлетаются
						this.x += this.vx * 2 // Увеличиваем скорость
						this.y += this.vy * 2
					} else {
						// Иначе частицы возвращаются к своим начальным координатам
						const dx = this.originX - this.x
						const dy = this.originY - this.y
						this.x += dx * 0.1 // Плавное возвращение
						this.y += dy * 0.1
					}
				}

				draw(ctx) {
					ctx.beginPath()
					ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
					ctx.fillStyle = 'rgba(255, 255, 255, 0.8)'
					ctx.fill()
				}
			}

			const initParticles = () => {
				for (let i = 0; i < numParticles; i++) {
					particles.push(new Particle())
				}
			}

			const animate = () => {
				const ctx = canvas.value.getContext('2d')
				ctx.clearRect(0, 0, width.value, height.value)

				// Отрисовываем сферу (для визуализации)
				ctx.beginPath()
				ctx.arc(center.x, center.y, radius.value, 0, Math.PI * 2)
				ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)'
				ctx.stroke()

				// Обновляем и отрисовываем частицы
				particles.forEach((particle) => {
					particle.update()
					particle.draw(ctx)
				})

				requestAnimationFrame(animate)
			}

			const explode = () => {
				isExploding.value = true // Запускаем анимацию взрыва

				// Уменьшаем радиус сферы
				radius.value *= 0.8

				// Через некоторое время возвращаем сферу в исходное состояние
				setTimeout(() => {
					isExploding.value = false
					radius.value = 150 // Возвращаем радиус к исходному значению
				}, 500) // Длительность анимации взрыва
			}

			onMounted(() => {
				initParticles()
				animate()
			})

			onUnmounted(() => {
				// Очистка ресурсов, если необходимо
			})

			return {
				canvas,
				width,
				height,
				explode,
			}
		},
	}
</script>

<style scoped>
	canvas {
		position: absolute;
		top: 0;
		left: 0;
		z-index: -1;
		cursor: pointer; /* Добавляем курсор, чтобы было понятно, что на сферу можно кликнуть */
	}
</style>
