import { useState, useRef, useEffect } from 'react'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

function ThreeDemo() {
    const domRef: any = useRef<HTMLDivElement>(null)

    const data = {
        model: 'Icosahedron',
        wireframe: false,
        texture: false,
        detail: 4,
        rotationSpeed: 0.1,

        QuantizePosEncoding: false,
        NormEncodingMethods: 'None', // for normal encodings
        DefaultUVEncoding: false,

        totalGPUMemory: '0 bytes',
    }

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

        // light
        const lights = [
            {
                instance: new THREE.PointLight(0xffffff, 1, 0),
                position: [0, 2 * radius, 0],
            },
            {
                instance: new THREE.PointLight(0xffffff, 1, 0),
                position: [2 * radius, -2 * radius, 2 * radius],
            },
            {
                instance: new THREE.PointLight(0xffffff, 1, 0),
                position: [-2 * radius, -2 * radius, -2 * radius],
            },
        ]

        const color = 0xffffff

        lights.forEach((light: any) => {
            light.instance.position.set(...light.position)
            scene.add(light.instance)
        })

        // helper
        scene.add(new THREE.AxesHelper(radius * 5))

        const lineSegments = new THREE.LineSegments(
            new THREE.WireframeGeometry(geometry),
            lineMaterial
        )
        scene.add(lineSegments)

        // const light = new THREE.DirectionalLight(color, intensity)
        // const light = new THREE.PointLight(0xffffff, 1)
        // light.position.set(30, 30, 30)
        // scene.add(light)

        function createGeometry(data: any) {
            switch (data.model) {
                case 'Icosahedron':
                    return new THREE.IcosahedronGeometry(radius, data.detail)
                case 'Cylinder':
                    return new THREE.CylinderGeometry(radius, radius, radius * 2, data.detail * 6)
                case 'TorusKnot':
                    return new THREE.TorusKnotGeometry(
                        radius,
                        10,
                        data.detail * 20,
                        data.detail * 6,
                        3,
                        4
                    )
            }
        }

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
