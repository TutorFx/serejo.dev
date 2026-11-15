<script setup lang="ts">
import { useElementSize, useIntersectionObserver, usePreferredReducedMotion } from '@vueuse/core'

/**
 * Text printed on a satin ribbon that waves and rocks across its container.
 *
 * Drawn on a 2D canvas: the text is rendered once to a texture, and each frame copies it in thin vertical slices
 * along a sine path. Every slice is sheared to follow the slope, squeezed by how far the ribbon is turned away
 * from the viewer, and shaded by the same angle.
 */
const props = withDefaults(
  defineProps<{
    text: string
    separator?: string
    /** Ribbon colour. Any CSS colour, `var(--token)` included */
    color?: string
    textColor?: string
    /** Width of the band, in px */
    ribbonWidth?: number
    /** Text height as a share of the band */
    textScale?: number
    /** Height of the wave, in px */
    amplitude?: number
    /** Length of one wave, in px */
    wavelength?: number
    /** How fast the text travels along the ribbon, in px/s. Negative moves it to the right */
    speed?: number
    /** How fast the wave itself moves, in radians/s */
    waveSpeed?: number
    /** How far the ribbon rocks around its own length: 0 stays flat, 1 turns edge-on */
    twist?: number
    /** Rotation of the whole ribbon, in degrees */
    tilt?: number
    /** Darkening of the parts turned away from the light, 0 to 1 */
    shading?: number
    /** Strength of the satin highlight, 0 to 1 */
    sheen?: number
  }>(),
  {
    separator: ' · ',
    color: 'var(--brand-7)',
    textColor: '#ffffff',
    ribbonWidth: 76,
    textScale: 0.5,
    amplitude: 56,
    wavelength: 900,
    speed: 70,
    waveSpeed: 0.5,
    twist: 0.55,
    tilt: -5,
    shading: 0.55,
    sheen: 0.4,
  },
)

/** Width of one slice in CSS px: smaller is smoother and costs more draw calls */
const SLICE = 2
/** Slices overlap by this much, otherwise the seams between them show */
const OVERLAP = 0.6
/** Fill styles of the light layer: 128 leaves the ribbon as it is, below darkens it, above lightens it */
const GRAYS = Array.from({ length: 256 }, (_, level) => `rgb(${level} ${level} ${level})`)

const root = ref<HTMLElement>()
const canvas = ref<HTMLCanvasElement>()
const { width, height } = useElementSize(root)
const reducedMotion = usePreferredReducedMotion()
const colorMode = useColorMode()

let texture: HTMLCanvasElement | undefined
/** Off-screen layer with the light of each slice, blended over the ribbon at the end of the frame */
let light: HTMLCanvasElement | undefined
/** Length of one repetition of the text, in CSS px */
let period = 0
let dpr = 1
let frame = 0
let last = 0
let travel = 0
let phase = 0
let visible = false

function resolveColor(value: string) {
  const probe = document.createElement('span')
  probe.style.color = value
  root.value?.append(probe)
  const resolved = getComputedStyle(probe).color
  probe.remove()

  return resolved
}

function buildTexture() {
  if (!root.value) return

  dpr = Math.min(window.devicePixelRatio || 1, 2)

  const unit = `${props.text}${props.separator}`
  const bandHeight = Math.round(props.ribbonWidth * dpr)
  const font = `700 ${props.ribbonWidth * props.textScale * dpr}px ${getComputedStyle(root.value).fontFamily}`

  const next = document.createElement('canvas')
  const context = next.getContext('2d')
  if (!context) return

  context.font = font
  const unitWidth = Math.ceil(context.measureText(unit).width)
  // One repetition plus room for the last slice, so a slice never has to wrap around the texture
  const spare = Math.ceil((SLICE + OVERLAP) * dpr) + 1
  next.width = unitWidth + spare
  next.height = bandHeight

  context.fillStyle = resolveColor(props.color)
  context.fillRect(0, 0, next.width, bandHeight)

  context.font = font
  context.textBaseline = 'middle'
  context.fillStyle = resolveColor(props.textColor)
  context.fillText(unit, 0, bandHeight / 2)
  context.fillText(unit, unitWidth, bandHeight / 2)

  // Satin: a soft light band across the width of the ribbon, darker towards the lower edge
  const satin = context.createLinearGradient(0, 0, 0, bandHeight)
  satin.addColorStop(0, `rgb(0 0 0 / ${0.12 * props.sheen})`)
  satin.addColorStop(0.3, `rgb(255 255 255 / ${0.4 * props.sheen})`)
  satin.addColorStop(0.55, 'rgb(255 255 255 / 0)')
  satin.addColorStop(1, `rgb(0 0 0 / ${0.35 * props.sheen})`)
  context.fillStyle = satin
  context.fillRect(0, 0, next.width, bandHeight)

  texture = next
  period = unitWidth / dpr
}

function draw() {
  const element = canvas.value
  const context = element?.getContext('2d')
  light ??= document.createElement('canvas')
  const lightContext = light.getContext('2d')
  if (!element || !context || !lightContext || !texture || !width.value || !height.value) return

  const pixelWidth = Math.round(width.value * dpr)
  const pixelHeight = Math.round(height.value * dpr)
  if (element.width !== pixelWidth || element.height !== pixelHeight) {
    element.width = pixelWidth
    element.height = pixelHeight
    light.width = pixelWidth
    light.height = pixelHeight
  }

  context.setTransform(1, 0, 0, 1, 0, 0)
  context.clearRect(0, 0, pixelWidth, pixelHeight)
  lightContext.setTransform(1, 0, 0, 1, 0, 0)
  lightContext.clearRect(0, 0, pixelWidth, pixelHeight)

  const tilt = (props.tilt * Math.PI) / 180
  const cos = Math.cos(tilt)
  const sin = Math.sin(tilt)
  const centerX = width.value / 2
  const centerY = height.value / 2
  // The tilted ribbon has to run past both edges of the container
  const reach = centerX / Math.max(Math.abs(cos), 0.2) + props.ribbonWidth
  const waveNumber = (Math.PI * 2) / props.wavelength
  const sliceWidth = SLICE + OVERLAP

  for (let u = -reach; u < reach; u += SLICE) {
    const angle = u * waveNumber + phase
    const y = props.amplitude * Math.sin(angle)
    const slope = props.amplitude * waveNumber * Math.cos(angle)
    // Rotation around the length of the ribbon: it rocks at half the pace of the wave
    const rock = props.twist * (Math.PI / 2) * Math.sin(angle * 0.5 + phase * 0.7 + 1.3)
    const facing = Math.cos(rock)
    const bandHeight = props.ribbonWidth * facing

    // The slice is sheared to the slope of the wave, moved onto the path, tilted, and centred in the container
    const a = (cos - sin * slope) * dpr
    const b = (sin + cos * slope) * dpr
    const c = -sin * dpr
    const d = cos * dpr
    const e = (cos * u - sin * y + centerX) * dpr
    const f = (sin * u + cos * y + centerY) * dpr
    context.setTransform(a, b, c, d, e, f)

    const offset = (((u + travel) % period) + period) % period
    context.drawImage(
      texture,
      offset * dpr,
      0,
      sliceWidth * dpr,
      texture.height,
      0,
      -bandHeight / 2,
      sliceWidth,
      bandHeight,
    )

    // Light comes from above: the parts leaning down go dark, the ones leaning up catch a highlight.
    // It is painted as opaque grey on its own layer: translucent slices over the ribbon would leave a stripe at
    // every seam, where their antialiased edges cover less
    const lean = Math.sin(rock)
    const shade = Math.min(props.shading * (1 - facing + Math.max(0, -lean) * 0.6), 0.85)
    const highlight = props.sheen * Math.max(0, lean) ** 3 * 0.5
    lightContext.setTransform(a, b, c, d, e, f)
    lightContext.fillStyle = GRAYS[Math.round(128 + (highlight - shade) * 127)] ?? '#808080'
    lightContext.fillRect(0, -bandHeight / 2, sliceWidth, bandHeight)
  }

  // Trim the light layer to the shape of the ribbon, then blend it: hard-light darkens under mid grey and
  // lightens above it
  lightContext.setTransform(1, 0, 0, 1, 0, 0)
  lightContext.globalCompositeOperation = 'destination-in'
  lightContext.drawImage(element, 0, 0)
  lightContext.globalCompositeOperation = 'source-over'

  context.setTransform(1, 0, 0, 1, 0, 0)
  context.globalCompositeOperation = 'hard-light'
  context.drawImage(light, 0, 0)
  context.globalCompositeOperation = 'source-over'
}

function tick(now: number) {
  const elapsed = Math.min((now - last) / 1000, 0.1)
  last = now
  travel += props.speed * elapsed
  phase += props.waveSpeed * elapsed
  draw()
  frame = requestAnimationFrame(tick)
}

function stop() {
  cancelAnimationFrame(frame)
  frame = 0
}

/** Animates only while on screen; under reduced motion it draws a single still frame */
function sync() {
  stop()
  if (!texture) return

  if (reducedMotion.value === 'reduce' || !visible) {
    draw()
    return
  }

  last = performance.now()
  frame = requestAnimationFrame(tick)
}

function rebuild() {
  buildTexture()
  sync()
}

useIntersectionObserver(root, (entries) => {
  visible = entries.at(-1)?.isIntersecting ?? false
  sync()
})

onMounted(async () => {
  // The texture is drawn with the page font, so it has to be loaded first
  await document.fonts.ready
  rebuild()
})

onBeforeUnmount(stop)

watch([width, height], () => {
  if (!frame) draw()
})
watch(reducedMotion, sync)
watch(() => [props.text, props.separator, props.ribbonWidth, props.textScale, props.sheen], rebuild)
// The colours may be CSS variables that change with the theme; wait for the new class to reach the page
watch(
  () => [props.color, props.textColor, colorMode.value],
  () => nextTick(rebuild),
)
</script>

<template>
  <div ref="root" role="img" :aria-label="text" class="relative min-h-48 overflow-hidden">
    <canvas ref="canvas" aria-hidden="true" class="absolute inset-0 size-full" />
  </div>
</template>
