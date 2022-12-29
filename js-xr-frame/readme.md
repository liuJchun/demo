### 目的：xr-frame 是否适合用于生产环境，和threejs的实现有什么不同？

体现的优势：

- 上手简单
使用xml的方式来描述 3D 场景，并集成了AR、物理、动画、粒子、后处理等等。
- 性能
混合方案，渲染性能逼近原生，xr-frame-cli可以对外部 glTF 文件进行优化，来提高加载性能，还有完善的缓存机制保证二次进入的加载性能。


### 使用 xr-frame 的一些限制
https://developers.weixin.qq.com/miniprogram/dev/component/xr-frame/overview/#%E9%99%90%E5%88%B6%E5%92%8C%E5%B1%95%E6%9C%9B


### 开发中的问题
加载资源/模型都是使用标签加载，前后依赖是有前后顺序的问题。

modes:Marker 感觉效果还是挺好的

```bash
<xr-scene ar-system="modes:Marker">
    //....
</xr-scene>
```

