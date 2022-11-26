import { useState, useRef, useEffect } from "react"
import * as THREE from "three"
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js"

const clock: THREE.Clock = new THREE.Clock()
const mixers: Array<THREE.AnimationMixer> = []

function ThreeDemo() {
    const domRef: any = useRef<HTMLDivElement>(null)

    const initLight = (scene: any) => {
        const dirLight = new THREE.DirectionalLight(0xffffff)
        dirLight.position.set(3, 10, 10)
        dirLight.castShadow = true
        dirLight.shadow.camera.top = 2
        dirLight.shadow.camera.bottom = -2
        dirLight.shadow.camera.left = -2
        dirLight.shadow.camera.right = 2
        dirLight.shadow.camera.near = 0.1
        dirLight.shadow.camera.far = 40
        scene.add(dirLight)
    }

    const initModal = (scene: any) => {
        const loader = new GLTFLoader()
        loader.load("/rabbit.glb", function (gltf: any) {
            const { scene: model, animations } = gltf

            scene.add(model)

            // adjust model scale
            model.scale.set(4, 4, 4)

            model.traverse(function (object: any) {
                if (object.isMesh) {
                    object.castShadow = true
                }
            })

            const skeleton = new THREE.SkeletonHelper(model)
            skeleton.visible = false
            scene.add(skeleton)

            const mixer = new THREE.AnimationMixer(model)
            mixers.push(mixer)
            for (const clip of animations) {
                // dance
                const action = mixer.clipAction(clip)
                action.play()
            }
        })
    }

    const initGround = (scene: any) => {
        const mesh = new THREE.Mesh(
            new THREE.PlaneGeometry(1000, 1000),
            new THREE.MeshPhongMaterial({ color: 0x999999, depthWrite: false })
        )
        mesh.rotation.x = -Math.PI / 2
        mesh.receiveShadow = true
        scene.add(mesh)
    }

    const onInit = () => {
        const domEle = domRef.current
        const scene = new THREE.Scene()

        const camera = new THREE.PerspectiveCamera(
            45,
            domEle.clientWidth / domEle.clientHeight,
            1,
            50
        )
        camera.position.set(-1, 1, 1)
        camera.lookAt(0, 0, 0)

        // initLight
        initLight(scene)

        // load Modal
        initModal(scene)

        // ground
        initGround(scene)

        scene.add(new THREE.AxesHelper(1))

        // gl render
        const renderer = new THREE.WebGLRenderer({ antialias: true })
        renderer.setSize(domEle.clientWidth, domEle.clientHeight)
        // 默认 LinearEncoding
        renderer.outputEncoding = THREE.sRGBEncoding
        //  阴影贴图
        renderer.shadowMap.enabled = true
        domEle.appendChild(renderer.domElement)

        const controls = new OrbitControls(camera, renderer.domElement)
        // controls.enablePan = false
        controls.enableZoom = true
        // controls.target.set(0, 1, 0)
        controls.update()

        function resizeRendererToDisplaySize(renderer: any) {
            const canvas = renderer.domElement
            const pixelRatio = window.devicePixelRatio
            const width = (canvas.clientWidth * pixelRatio) | 0
            const height = (canvas.clientHeight * pixelRatio) | 0

            const needResize = canvas.width !== width || canvas.height !== height
            if (needResize) {
                renderer.setSize(width, height, false)
            }
            return needResize
        }

        function animate() {
            const mixUpdateDelta = clock.getDelta()
            mixers.forEach(mixer => mixer.update(mixUpdateDelta))
            renderer.render(scene, camera)

            if (resizeRendererToDisplaySize(renderer)) {
                const canvas = renderer.domElement
                camera.aspect = canvas.clientWidth / canvas.clientHeight
                camera.updateProjectionMatrix()
            }
            requestAnimationFrame(animate)
        }

        animate()

        return () => {
            domEle.removeChild(renderer.domElement)
        }
    }

    useEffect(onInit, [])

    return <div style={{ width: "100%", height: "100%" }} ref={domRef}></div>
}

export default ThreeDemo
