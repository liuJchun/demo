import { Scene } from 'three'

export class CustomScene extends Scene {
    private list: any[] = []
    add(val: any) {
        super.add(val)
        this.list.push(val)
        return this
    }
    initWebGl() {}

    updateRender(updateFn: Function) {
        // list updateRender
        updateFn.call(this)
    }
}
