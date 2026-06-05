import * as THREE from 'three'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js'
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js'
import vertexShader from '~/components/UI/shaders/orb.vert.glsl?raw'
import fragmentShader from '~/components/UI/shaders/orb.frag.glsl?raw'
import alphaVertexShader from '~/components/UI/shaders/alpha.vert.glsl?raw'
import alphaFragmentShader from '~/components/UI/shaders/alpha.frag.glsl?raw'

export function useFluidOrb() {
  let scene: THREE.Scene | null = null
  let camera: THREE.PerspectiveCamera | null = null
  let renderer: THREE.WebGLRenderer | null = null
  let composer: EffectComposer | null = null
  let orb: THREE.Mesh | null = null
  let alphaPass: ShaderPass | null = null
  let material: THREE.ShaderMaterial | null = null
  let geometry: THREE.IcosahedronGeometry | null = null

  let animationFrameId: number | null = null
  let timer: THREE.Timer | null = null // Usando o novo Timer oficial
  let isPlaying = false
  let resizeObserver: ResizeObserver | null = null

  const uniforms = {
    uTime: { value: 0.0 },
    uLightColors: {
      value: [
        new THREE.Color('#f72585'),
        new THREE.Color('#4cc9f0'),
        new THREE.Color('#fca311'),
        new THREE.Color('#3a0ca3'),
        new THREE.Color('#9ef01a')
      ]
    }
  }

  const updateColors = (hexColors: string[]) => {
    for (let i = 0; i < Math.min(hexColors.length, 5); i++) {
      const color = hexColors[i]
      if (color && uniforms.uLightColors.value[i]) {
        uniforms.uLightColors.value[i]!.set(color)
      }
    }
  }

  const init = (container: HTMLElement, scale: number, isLightMode: boolean) => {
    scene = new THREE.Scene()
    scene.background = null

    camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100)
    camera.position.z = 4.5

    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'low-power' })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.0
    renderer.setClearColor(0x000000, 0)

    container.appendChild(renderer.domElement)

    material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms,
      side: THREE.FrontSide,
      transparent: true,
      blending: THREE.NormalBlending
    })

    geometry = new THREE.IcosahedronGeometry(0.9, 32)
    orb = new THREE.Mesh(geometry, material)
    orb.scale.setScalar(scale)
    scene.add(orb)

    const renderScene = new RenderPass(scene, camera)
    const bloomPass = new UnrealBloomPass(
      new THREE.Vector2(256, 256),
      0.4, 0.5, 0.3
    )

    composer = new EffectComposer(renderer)
    composer.addPass(renderScene)
    composer.addPass(bloomPass)

    alphaPass = new ShaderPass({
      uniforms: {
        tDiffuse: { value: null },
        uAspect: { value: 1.0 },
        uScale: { value: scale },
        uIsLight: { value: isLightMode ? 1.0 : 0.0 }
      },
      vertexShader: alphaVertexShader,
      fragmentShader: alphaFragmentShader
    })
    composer.addPass(alphaPass)

    timer = new THREE.Timer()
    timer.connect(document)

    resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const w = Math.max(1, entry.contentRect.width)
        const h = Math.max(1, entry.contentRect.height)
        if (camera && renderer && composer && alphaPass) {
          camera.aspect = w / h
          camera.updateProjectionMatrix()
          renderer.setSize(w, h)
          composer.setSize(w, h)
          if (alphaPass.uniforms.uAspect) {
            alphaPass.uniforms.uAspect.value = w / h
          }
        }
      }
    })
    resizeObserver.observe(container)
  }

  const setScale = (scale: number) => {
    if (orb && alphaPass) {
      orb.scale.setScalar(scale)
      if (alphaPass.uniforms.uScale) {
        alphaPass.uniforms.uScale.value = scale
      }
    }
  }

  const setLightMode = (isLight: boolean) => {
    if (alphaPass && alphaPass.uniforms.uIsLight) {
      alphaPass.uniforms.uIsLight.value = isLight ? 1.0 : 0.0
    }
  }

  const animate = (timestamp: number) => {
    if (!isPlaying || !composer || !scene || !camera || !timer) return
    animationFrameId = requestAnimationFrame(animate)

    timer.update(timestamp)
    const delta = timer.getDelta()

    uniforms.uTime.value += delta

    camera.lookAt(scene.position)
    composer.render()
  }

  const play = () => {
    if (!isPlaying) {
      isPlaying = true
      if (timer) timer.reset() // Reseta o delta ao voltar do pause
      animationFrameId = requestAnimationFrame(animate)
    }
  }

  const pause = () => {
    if (isPlaying) {
      isPlaying = false
      if (animationFrameId !== null) {
        cancelAnimationFrame(animationFrameId)
        animationFrameId = null
      }
    }
  }

  const dispose = () => {
    pause()
    if (resizeObserver) {
      resizeObserver.disconnect()
      resizeObserver = null
    }

    if (geometry) geometry.dispose()
    if (material) material.dispose()

    if (renderer) {
      renderer.dispose()
      const dom = renderer.domElement
      if (dom && dom.parentNode) {
        dom.parentNode.removeChild(dom)
      }
    }

    scene = null
    camera = null
    renderer = null
    composer = null
    orb = null
    alphaPass = null
    material = null
    geometry = null
    if (timer) {
      timer.dispose()
      timer = null
    }
  }

  return {
    init,
    play,
    pause,
    dispose,
    setScale,
    setLightMode,
    updateColors
  }
}
