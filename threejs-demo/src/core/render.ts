// 完成相机初始化
// 场景初始化
// 更新逻辑与申明
// 初始化物体时，参数的快捷设置

// cerateWebglRenderFn

import THREE, { Scene } from 'three'
import BaseHelper from './helper/baseInterface'

type addObjFnType = (instace?: THREE.Object3D, options?: Record<string, any>) => void

export default class Helper {
    scene: THREE.Scene | null = null
    updateRenderFn: Function[] = []
    renderer: THREE.WebGLRenderer

    helperDeps: BaseHelper[] = []

    constructor() {
        this.scene = new THREE.Scene()
        this.renderer = new THREE.WebGLRenderer({ antialias: true })
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

    render() {
        const animate = () => {
            this._update()
            requestAnimationFrame(animate)
        }
    }
}
