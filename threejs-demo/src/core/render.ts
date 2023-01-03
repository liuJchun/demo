// 完成相机初始化
// 场景初始化
// 更新逻辑与申明
// 初始化物体时，参数的快捷设置
// cerateWebglRenderFn

import THREE, { Scene } from 'three'
import BaseHelper from './helper/baseInterface'
import { createWithOptions } from './utils/index'

type addObjFnType = (instace?: THREE.Object3D, options?: Record<string, any>) => void

export default class Helper {
    scene: THREE.Scene | null = null
    updateRenderFn: Function[] = []
    renderer: THREE.WebGLRenderer
    camera: THREE.Camera

    helperDeps: BaseHelper[] = []

    constructor() {
        this.scene = new THREE.Scene()
        this.renderer = new THREE.WebGLRenderer({ antialias: true })
        this.camera = new THREE.Camera()
    }

    addObj2Scene(
        instance: THREE.Object3D,
        options?: Record<string, any> | addObjFnType,
        updateFn?: Function
    ) {
        if (typeof options === 'function') {
            options(instance, { scene: this.scene })
        } else {
            createWithOptions(instance, options)
        }

        if (typeof updateFn === 'function') {
            this.add2UpdateRender(updateFn)
        }

        this.add2Scene(instance)
        return instance
    }

    add2Scene(ins: THREE.Object3D) {
        this.scene!.add(ins)
    }

    addHelper(obj: any) {
        if (this.helperDeps.indexOf(obj) !== -1) {
            this.helperDeps.push(obj)
        }
    }

    add2UpdateRender(fn: Function) {
        if (this.updateRenderFn.indexOf(fn) !== -1) {
            this.updateRenderFn.push(fn)
        }
    }

    _update() {
        this.helperDeps.forEach(helper => {
            helper.update()
        })
    }

    resizeRendererToDisplaySize(renderer: THREE.Renderer) {
        const canvas = renderer.domElement
        let width = window.innerWidth
        let height = window.innerHeight
        let canvasPixelWidth = canvas.width / window.devicePixelRatio
        let canvasPixelHeight = canvas.height / window.devicePixelRatio
        const needResize = canvasPixelWidth !== width || canvasPixelHeight !== height

        if (needResize) {
            renderer.setSize(width, height, false)
        }
        return needResize
    }

    render() {
        const animate = () => {
            if (this.resizeRendererToDisplaySize(this.renderer)) {
                const canvas = this.renderer.domElement
                this.camera.aspect = canvas.clientWidth / canvas.clientHeight
                this.camera.updateProjectionMatrix()
            }

            this._update()

            this.renderer.render(this.scene, this.camera)

            requestAnimationFrame(animate)
        }

        animate()
    }
}
