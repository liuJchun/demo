import { useState, useRef, useEffect } from "react"
import * as THREE from "three"
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js"

function ThreeDemo() {
    const domRef: any = useRef<HTMLCanvasElement>(null)

    const initLight = () => {
        const dirLight = new THREE.DirectionalLight(0xffffff)
        dirLight.position.set(3, 10, 10)
        dirLight.castShadow = true
        dirLight.shadow.camera.top = 2
        dirLight.shadow.camera.bottom = -2
        dirLight.shadow.camera.left = -2
        dirLight.shadow.camera.right = 2
        dirLight.shadow.camera.near = 0.1
        dirLight.shadow.camera.far = 40
        return dirLight
    }

    const initModal = (scene: any) => {
        const loader = new GLTFLoader()
        loader.load("/rabbit.glb", function (gltf: any) {
            const model = gltf.scene
            scene.add(model)
            console.log("======loader-----", gltf)

            model.traverse(function (object: any) {
                if (object.isMesh) {
                    object.castShadow = true
                }
            })

            const skeleton = new THREE.SkeletonHelper(model)
            skeleton.visible = false
            scene.add(skeleton)

            const mixer = new THREE.AnimationMixer(model)
            const animations = gltf.animations

            for (const animation of animations) {
            }
        })
    }

    const initCamera = () => {}

    const onInit = () => {
        const domEle = domRef.current
        const scene = new THREE.Scene()

        const camera = new THREE.PerspectiveCamera(
            45,
            domEle.clientWidth / domEle.clientHeight,
            1,
            1000
        )
        camera.position.set(-1, 2, 3)
        camera.lookAt(0, 0, 0)

        // initLight
        const light = initLight()
        scene.add(light)

        initModal(scene)

        const mesh = new THREE.Mesh(
            new THREE.PlaneGeometry(100, 100),
            new THREE.MeshPhongMaterial({ color: 0x999999, depthWrite: false })
        )
        mesh.rotation.x = -Math.PI / 2
        mesh.receiveShadow = true
        scene.add(mesh)

        const renderer = new THREE.WebGLRenderer({ antialias: true, canvas: domEle })
        renderer.setSize(domEle.clientWidth, domEle.clientHeight)
        // 默认 LinearEncoding
        renderer.outputEncoding = THREE.sRGBEncoding
        //  阴影贴图
        renderer.shadowMap.enabled = true
        // domEle.appendChild(renderer.domElement)

        const controls = new OrbitControls(camera, renderer.domElement)
        // controls.enablePan = false
        controls.enableZoom = true
        // controls.target.set(0, 1, 0)
        controls.update()

        function resizeRendererToDisplaySize(renderer: any) {
            const canvas = renderer.domElement
            const pixelRatio = window.devicePixelRatio
            const width = (canvas.clientWidth * window.devicePixelRatio) | 0
            const height = (canvas.clientHeight * window.devicePixelRatio) | 0

            const needResize = canvas.width !== width || canvas.height !== height
            if (needResize) {
                renderer.setSize(width, height, false)
            }
            return needResize
        }

        function animate() {
            renderer.render(scene, camera)

            if (resizeRendererToDisplaySize(renderer)) {
                const canvas = renderer.domElement
                camera.aspect = canvas.clientWidth / canvas.clientHeight
                camera.updateProjectionMatrix()
            }

            requestAnimationFrame(animate)
        }

        animate()
    }

    useEffect(onInit, [])

    return <canvas style={{ width: "100%", height: "100%" }} ref={domRef}></canvas>
}

export default ThreeDemo
