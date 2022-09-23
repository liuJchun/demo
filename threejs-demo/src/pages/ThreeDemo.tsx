import { useState, useRef, useEffect } from "react"
import * as THREE from "three"

function ThreeDemo() {
    const domRef: any = useRef<HTMLDivElement>(null)

    const onInit = () => {
        const domEle = domRef.current

        const scene = new THREE.Scene()
        const camera = new THREE.PerspectiveCamera(
            75,
            domEle.clientWidth / domEle.clientHeight,
            1,
            500
        )
        // camera.updateProjectionMatrix()

        const renderer = new THREE.WebGLRenderer()
        renderer.setSize(domEle.clientWidth, domEle.clientHeight)
        domEle.appendChild(renderer.domElement)

        // render
        const geometry = new THREE.BoxGeometry(1, 1, 1)
        // const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 })
        const material = new THREE.MeshPhongMaterial({ color: 0x44aa88 })
        const cube = new THREE.Mesh(geometry, material)
        scene.add(cube)

        // line
        // const points = []
        // points.push(new THREE.Vector3(-10, 0, 0))
        // points.push(new THREE.Vector3(0, 10, 0))
        // points.push(new THREE.Vector3(10, 0, 0))
        // scene.add(
        //     new THREE.Line(
        //         new THREE.BufferGeometry().setFromPoints(points),
        //         new THREE.LineBasicMaterial({ color: 0x00ff00 })
        //     )
        // )

        // light
        const color = 0xffffff
        const intensity = 1
        const light = new THREE.DirectionalLight(color, intensity)
        light.position.set(-1, 2, 4)
        scene.add(light)

        camera.position.set(0, 0, 10)
        camera.lookAt(0, 0, 0)

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
            cube.rotation.x += 0.01
            cube.rotation.y += 0.01
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

    return <div style={{ width: "100vw", height: "100vh" }} ref={domRef}></div>
}

export default ThreeDemo
