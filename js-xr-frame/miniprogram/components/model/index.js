// components/model/index.js
Component({
    properties: {},
    data: {},

    methods: {
        handleReady: function ({ detail }) {
            this.scene = detail.value
            // const xrFrameSystem = wx.getXrFrameSystem()
            // this.camera = this.scene.getElementById('camera').getComponent(xrFrameSystem.Camera)
            // this.helmet = {
            //     el: this.scene.getElementById('helmet'),
            //     color: 'rgba(44, 44, 44, 0.5)',
            // }
            // this.miku = { el: this.scene.getElementById('miku'), color: 'rgba(44, 44, 44, 0.5)' }
            // this.tmpV3 = new xrFrameSystem.Vector3()
        },

        handleAssetsProgress({ detail }) {
            this.triggerEvent('onProgress', detail.value)
        },

        handleAssetsLoaded({ detail }) {
            console.log('assets loaded', detail.value)
            this.triggerEvent('onLoaded', detail.value)
        },
    },
})
