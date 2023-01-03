Component({
    properties: {},

    data: {
        loaded: false,
    },
    methods: {
        handleReady: function ({ detail }) {
            this.scene = detail.value
        },

        handleAssetsLoaded: function ({ detail }) {
            console.log(detail, '====handleAssetsLoaded')
            this.setData({ loaded: true })

            const el = this.scene.getElementById('tracker')
            this.tracker = el.getComponent(wx.getXrFrameSystem().ARTracker)
            this.gesture = -1
        },
        handleTrackerSwitch: function ({ detail }) {
            const active = detail.value
            const video = this.scene.assets.getAsset('video-texture', 'hikari')
            active ? video.play() : video.stop()
        },
        handleTick: function () {
            if (!this.tracker) return
            const { gesture, score } = this.tracker
            if (score < 0.5 || gesture === this.gesture) {
                return
            }

            this.gesture = gesture
            gesture === 6 && wx.showToast({ title: '好！' })
            gesture === 14 && wx.showToast({ title: '唉...' })
        },
    },
})
