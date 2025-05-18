<template>
	<canvas ref="canvas" style="display: block"></canvas>
</template>

<script>
	export default {
		data() {
			return {
				canvas: null,
				ctx: null,
				width: 0,
				height: 0,
				waves: [],
				particles: [],
				animationFrameId: null,
			}
		},
		mounted() {
			this.canvas = this.$refs.canvas
			this.ctx = this.canvas.getContext('2d')
			this.resizeCanvas()
			window.addEventListener('resize', this.resizeCanvas)
			this.initWaves()
			this.initParticles()
			this.startAnimation()
		},
		beforeUnmount() {
			window.removeEventListener('resize', this.resizeCanvas)
			this.stopAnimation()
		},
		methods: {
			resizeCanvas() {
				this.width = window.innerWidth
				this.height = window.innerHeight
				this.canvas.width = this.width
				this.canvas.height = this.height
			},
			initWaves() {
				this.waves = []
				const numWaves = 5
				const waveHeight = this.height / (numWaves + 2)
				for (let i = 0; i < numWaves; i++) {
					this.waves.push({
						y: waveHeight * (i + 1),
						amplitude: waveHeight / 3,
						frequency: 0.02 + i * 0.008, // разная частота
						phase: Math.random() * Math.PI * 2,
						color: `hsl(${Math.random() * 360}, 70%, 50%)`, // случайный цвет
					})
				}
			},
			initParticles() {
				this.particles = []
				const numParticles = 100
				for (let i = 0; i < numParticles; i++) {
					this.particles.push({
						x: Math.random() * this.width,
						y: Math.random() * this.height,
						radius: Math.random() * 2 + 1,
						speedX: (Math.random() - 0.5) * 0.5,
						speedY: (Math.random() - 0.5) * 0.5,
						color: `rgba(255, 255, 255, ${Math.random() * 0.7 + 0.2})`,
					})
				}
			},
			startAnimation() {
				const animate = () => {
					this.update()
					this.draw()
					this.animationFrameId = requestAnimationFrame(animate)
				}
				animate()
			},
			stopAnimation() {
				cancelAnimationFrame(this.animationFrameId)
			},
			update() {
				this.waves.forEach((wave) => {
					wave.phase += 0.01 // Скорость движения волн
				})

				this.particles.forEach((particle) => {
					particle.x += particle.speedX
					particle.y += particle.speedY

					if (particle.x > this.width) particle.x = 0
					if (particle.x < 0) particle.x = this.width
					if (particle.y > this.height) particle.y = 0
					if (particle.y < 0) particle.y = this.height
				})
			},
			draw() {
				this.ctx.clearRect(0, 0, this.width, this.height)

				this.drawWaves()
				this.drawParticles()
			},
			drawWaves() {
				this.waves.forEach((wave) => {
					this.ctx.beginPath()
					this.ctx.moveTo(0, wave.y)
					for (let x = 0; x < this.width; x++) {
						const y = wave.y + Math.sin(x * wave.frequency + wave.phase) * wave.amplitude
						this.ctx.lineTo(x, y)
					}
					this.ctx.lineTo(this.width, wave.y)
					this.ctx.fillStyle = wave.color
					this.ctx.lineTo(this.width, this.height)
					this.ctx.lineTo(0, this.height)
					this.ctx.fill()
					this.ctx.closePath()
				})
			},
			drawParticles() {
				this.particles.forEach((particle) => {
					this.ctx.beginPath()
					this.ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2)
					this.ctx.fillStyle = particle.color
					this.ctx.fill()
				})
			},
		},
	}
</script>

<style scoped>
	canvas {
		position: fixed;
		top: 0;
		left: 0;
		z-index: -1;
	}
</style>
