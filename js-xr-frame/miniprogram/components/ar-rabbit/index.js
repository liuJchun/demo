// pages/components/xr-start.js
Component({
    /**
     * 组件的属性列表
     */
    properties: {},

    /**
     * 组件的初始数据
     */
    data: {},

    /**
     * 组件的方法列表
     */
    methods: {
        handleReady() {
            const tracker = el.getComponent(xrFrameSystem.ARTracker)
            // 视情况需要自己同步`tracker`的`scale`和`rotation`特定节点。
            // 第一个参数是特征点编好，第二个是可选的复用结果，第三个是可选的是否相对于`ARTracker`。
            // 为`false`为世界空间的位置，需要配合`scale`自己使用
            const position = tracker.getPosition(98, new xrSystem.Vector3(), false)
        },
        handleAssetsLoaded() {},
    },
})
