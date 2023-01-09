// pages/load-model/index.js
Component({
    /**
     * 组件的属性列表
     */
    properties: {},

    /**
     * 组件的初始数据
     */
    data: {
        showLoading: true,
        progress: 0,
    },

    /**
     * 组件的方法列表
     */
    methods: {
        handleOnProgress({ detail }) {
            const percent = (detail.progress * 100) | 0
            this.setData({
                progress: percent,
            })
        },

        handleOnLoaded(detail) {
            this.setData({
                showLoading: false,
            })
        },
    },
})
