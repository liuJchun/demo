import React, { useState, useRef, useEffect, FC } from 'react'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

const clock: THREE.Clock = new THREE.Clock()
const mixers: Array<THREE.AnimationMixer> = []

interface IAutoResize {
    width?: number | string
    height?: number | string
    url: string
}

const AutoResizeGlb: FC<IAutoResize> = props => {
    const { width, height, url } = props

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

    const initModal = ({ scene, camera }: any) => {
        const loader = new GLTFLoader()
        const group = new THREE.Group()

        loader.load(url, function (gltf: any) {
            console.log('=========loader load gltf is=========:', gltf)

            const { scene: model, animations } = gltf

            model.scale.set(1, 1, 1)
            model.traverse(function (object: any) {
                if (object.isMesh) {
                    object.castShadow = true
                }
            })
            group.add(model)

            group.position.set(0, 0, 0)

            // 调整合适的大小
            const bbox = new THREE.Box3().setFromObject(group)

            let blenX = bbox.max.x - bbox.min.x
            let blenY = bbox.max.y - bbox.min.y
            let blenZ = bbox.max.z - bbox.min.z

            // the distance of bettwen camera with group
            const distZ = Math.abs(camera.position.z - group.position.z - blenZ / 2)

            // transform fov
            const vFov = camera.fov * (Math.PI / 180)

            // 可见视野高度
            const vHeight = 2 * Math.tan(vFov * 0.5) * distZ

            // 可见高度分数
            const fraction = blenY / vHeight

            const { clientWidth: width, clientHeight: height } = domRef.current

            // 立方体高度（unit：px）
            const finalHeight = height * fraction
            const finalWidth = finalHeight * (blenX / blenY)

            const scale = Math.min(width / finalWidth, height / finalHeight)
            group.scale.setScalar(scale)
            scene.add(group)

            // adjust position
            const { max, min } = new THREE.Box3().setFromObject(group)
            let gLenX = max.x - min.x
            let gLenY = max.y - min.y
            let gLenZ = max.z - min.z
            group.position.set(-(max.x + min.x) / 2, -(max.y + min.y) / 2, -(max.z + min.z) / 2)

            scene.add(new THREE.AxesHelper(100))

            // animation
            const mixer = new THREE.AnimationMixer(model)
            mixers.push(mixer)
            for (const clip of animations) {
                const action = mixer.clipAction(clip)
                action.play()
            }
        })
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
        initModal({ scene, camera })

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

    return <div style={{ width, height }} ref={domRef}></div>
}

export default AutoResizeGlb

AutoResizeGlb.defaultProps = {
    width: '100%',
    height: '100%',
}
