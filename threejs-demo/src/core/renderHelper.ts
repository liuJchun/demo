// 完成相机初始化
// 场景初始化
// 更新逻辑与申明
// 初始化物体时，参数的快捷设置

import THREE, { Scene } from 'three'
import { BaseHelper } from './Base'

type addObjFnType = (instace?: THREE.Object3D, options?: Record<string, any>) => void

export default class Helper {
    scene: THREE.Scene | null = null
    updateRenderFn: Function[] = []

    helperDeps: BaseHelper[] = []

    constructor() {
        this.scene = new THREE.Scene()
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

    renderAnimation() {
        this.updateRenderFn.forEach(updatorFn => {
            typeof updatorFn === 'function' && updatorFn()
        })
    }

    render() {
        this.helperDeps.forEach(helper => {
            helper.update()
        })
    }
}

export function createWithOptions<T>(instance: T, options: Record<string, any> = {}): T {
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
