import { useState, useRef, useEffect } from 'react'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

function ThreeDemo() {
    const domRef: any = useRef<HTMLDivElement>(null)

    const onInit = () => {
        const domEle = domRef.current

        const scene = new THREE.Scene()
        // camera.updateProjectionMatrix()
        const camera = new THREE.PerspectiveCamera(
            60,
            domEle.clientWidth / domEle.clientHeight,
            1,
            500
        )
        const radius = 100
        camera.position.set(2 * radius, 2 * radius, 2 * radius)
        camera.lookAt(0, 0, 0)

        const renderer = new THREE.WebGLRenderer({ antialias: true })
        renderer.setSize(domEle.clientWidth, domEle.clientHeight)
        domEle.appendChild(renderer.domElement)

        const controls = createWithOptions(new OrbitControls(camera, renderer.domElement), {
            // autoRotate: true,
        })

        // render
        // const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 })
        // const geometry = new THREE.SphereGeometry(100, 3, 3)
        const geometry = new THREE.IcosahedronGeometry(100, 2)

        const meshMaterial = new THREE.MeshPhongMaterial({
            color: 0xfffffff,
            opacity: 1,
            emissive: 0x111111,
        })

        // materials
        const lineMaterial = new THREE.LineBasicMaterial({
            color: 0xaaaaaa,
            transparent: true,
            opacity: 0.8,
        })

        const cube = new THREE.Mesh(geometry, meshMaterial)
        scene.add(cube)

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

        // draw
        function animate() {
            cube.rotation.x += 0.01
            cube.rotation.y += 0.01
            controls.update()
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

    return <div style={{ width: '100vw', height: '100vh' }} ref={domRef}></div>
}

function createWithOptions<T>(instance: T, options: Record<string, any> = {}): T {
    for (const [key, value] of Object.entries(options)) {
        if (Object.prototype.hasOwnProperty.call(options, key)) {
            const obj = instance as any
            if (typeof options[key] !== 'object' || options[key] === null) {
                obj[key] = value
            } else {
                createWithOptions(obj[key], value)
            }
        }
    }
    return instance
}

export default ThreeDemo
