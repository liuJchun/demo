// components/model/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    handleReady: function ({detail}) {
      this.scene = detail.value;
      const xrFrameSystem = wx.getXrFrameSystem();
      this.camera = this.scene.getElementById('camera').getComponent(xrFrameSystem.Camera);
      this.helmet = {el: this.scene.getElementById('helmet'), color: 'rgba(44, 44, 44, 0.5)'};
      this.miku = {el: this.scene.getElementById('miku'), color: 'rgba(44, 44, 44, 0.5)'};
      this.tmpV3 = new (xrFrameSystem.Vector3)();
    },
    handleAssetsProgress: function ({ detail }) {
      console.log('assets progress', detail.value);
    },
    handleAssetsLoaded: function ({ detail }) {
      console.log('assets loaded', detail.value);
    }
  }
})
