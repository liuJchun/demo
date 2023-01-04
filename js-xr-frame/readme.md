### 目的：xr-frame 是否适合用于生产环境，和 threejs 的实现有什么不同？

    xr-frame 目前处于 beat 版本，设计使用标签的的方式来（ ECS ）描述 threejs 的场景、资源，但是只能使用最新的微信开发版工具和基础库只能使用 2.28 以上的版本，暂时不建议用于生产环境，但微信小程序原生支持 xr-frame 会给我们带来：

-   优势：

    上手简单，轻快的开发体验

    使用 xml 的方式来描述 3D 场景，并集成了 AR、物理、动画、粒子、后处理等等。

    性能

    混合方案，渲染性能逼近原生，xr-frame-cli 可以对外部 glTF 文件进行优化，来提高加载性能，还有完善的缓存机制保证二次进入的加载性能。

    注意：渲染管线从设计上是可定制的，未来将会逐步开放给开发者。

-   使用 xr-frame 的一些限制：

    https://developers.weixin.qq.com/miniprogram/dev/component/xr-frame/overview/#%E9%99%90%E5%88%B6%E5%92%8C%E5%B1%95%E6%9C%9B

### 使用过程的一些对比：

-   对比 load 加载不同的资源：

    xr-frame 允许开发者定制资源加载器，来添加自己所需的资源类型。所有的资源加载器都需要派生自 AssetLoader 类，然后使用上一章的方法在 xml 中或者手动使用。

    https://developers.weixin.qq.com/miniprogram/dev/component/xr-frame/assets/loader.html

    不同的是，xr-frame 有 weight 属性

    ```xml

    <!-- 加载资源/模型都是使用标签加载，前后依赖是有前后顺序的问题。 -->
    <xr-assets bind:progress="handleAssetsProgress" bind:loaded="handleAssetsLoaded">
        <xr-asset-load type="texture" asset-id="waifu" src="/assets/waifu.png" weight="2" />
        <xr-asset-load type="texture" asset-id="waifu2" src="/assets/waifu2.png" weight="1" />
    </xr-assets>
    ```

    对于高级用户，有时候会想手动加载、获取或者释放资源，资源系统暴露了一系列接口来满足这样的需求：

-   运行场景、灯光、阴影，使用 xml 标签来运行

    基本的使用（灯光、环境等）

    ```xml
    <xr-scene ar-system="modes:Marker">
        <!-- 多个环境组件，后面的会覆盖前面的。 -->
        <xr-env env-data="env1" sky-map="video-vt" is-sky2d="false" rotation="30" diffuse-exp="1" specular-exp="1" />
        <!-- light -->
        <xr-light type="ambient" color="1 1 1" intensity="0.1" />
        <xr-light type="directional" rotation="40 170 0" color="1 1 1" intensity="0.2" />
        <xr-light type="point" position="0 0 0" color="1 0 0" range="3" intensity="3" />
        <xr-light type="spot" position="0.1 0 -0.1" color="0 0 1" range="12" intensity="10" rotation="0 120 0" inner-cone-angle="80" outer-cone-angle="90" />
    </xr-scene>
    ```

    如何使用阴影

    当然，在实际使用中会有一些需要关注的地方：
    支持自己给自己投影，可以同时开启产生和接收阴影。
    可能需要视情况调整 shadow-distance 来避免阴影投影过大或者过小。
    适当调整 shadow-bias 来防止自阴影。

    ```xml
    <xr-scene ar-system="modes:Marker">
        <!-- 给plane这个xr-mesh开启了receive-shadow去接收阴影，然后开启了xr-gltf的cast-shadow来产生阴影，最后开启了主光源的cast-shadow总开关允许灯光产生阴影。 -->
        <xr-mesh node-id="plane" position="0 -0.4 0" scale="5 0.2 5" geometry="cube"  uniforms="u_baseColorFactor:0.48 0.78 0.64 1" receive-shadow
    />
        <xr-gltf model="test-gltf" cast-shadow/>
        <xr-camera
        position="3 3 3" target="plane"
        />
        <xr-light type="directional" rotation="60 0 0" color="1 1 1" intensity="2.5" cast-shadow />
    </xr-scene>
    ```

-   除了以上的基本使用，xr-frame 原生提供了 ar 追踪器，可以直接实现我们之前 kivicube-scene 插件的功能

    ```html
    <xr-ar-tracker mode="Marker" src="/assets/2d-marker.png">
        <xr-gltf model="gltf-damageHelmet"></xr-gltf>
    </xr-ar-tracker>
    ```

### 渲染

-   定制 geometry

    ```javascript
    // 构造一个 Geometry 需要提供好几个参数，他们是：
    const geometry = scene.createGeometry(vertexLayout, vertexBuffer, indexBuffer, indexType)
    ```

-   纹理

    纹理 Texture 是 GPU 中的图像，供着色器采样使用。在框架中其一般被作为材质的一部 uniforms 使用。
    创建普通纹理一般有以下几种方式：

    ```xml
    <xr-asset-load type="texture" asset-id="waifu" src="/assets/waifu.png" options="wrapU:1,wrapV:2" />
    ```

    也可以使用代码加载：

    ```javascript
    scene.assets.loadAsset({ type: 'texture', assetId: 'waifu', src: '/assets/waifu.png' })
    ```

-   gltf

    GLTF 是一种被广泛使用的文件格式，用来储存 3D 模型和 3D 场景。在 xr-frame 里你可以非常轻松地引入任意 GLTF 模型，并将其渲染出来。

    ```html
    <xr-asset-load type="gltf" asset-id="gltfModel" src="/assets/xxx.gltf" />
    <!-- xr-gltf标签对应的元素为Shadow元素，所以请不要在xml里为xr-gltf添加子标签。 -->
    <xr-gltf id="myGLTF" model="gltfModel" anim-autoplay></xr-gltf>
    ```

    使用 js 来控制 gltf 动画，three 中也是你能通过 js 来控制播放动画，且要借助 animationMixer，相对而言 使用 xr-frame 来描述模型动画就要简短很多。

    ```xml
        <xr-gltf id="myGLTF" model="gltfModel" bind:gltf-loaded="handleGLTFLoaded"></xr-gltf>
    ```

    ```javascript
    function handleGLTFLoaded({ detail }) {
        const el = detail.value.target
        const animator = el.getComponent('animator')
        animator.play('idle')
    }
    ```

-   ar 系统

        使用 xr-frame 来实现 ar 识别的能力变得更加容易，我们可以看官方给出的示例，其中大多数还是效果比较好的，但有些的表现不是很稳定，也许随着时间官方会解决这些问题。

        https://developers.weixin.qq.com/miniprogram/dev/component/xr-frame/overview/#%E7%A4%BA%E4%BE%8B

        我们更多的是关注 ar 识别的能力，

        ```xml
        <!-- 目前的小程序AI系统限制，modes只能存在一个，不能多种模式同时开启 -->
        <!-- 前置相机依赖于客户端版本8.0.31 -->
        <xr-scene ar-system="modes:Plane;camera:Back">
            // somethings 。。。
        </xr-scene>
        ```

        -   其中2d的 ar 跟踪效果还不错

        ```xml
            <xr-ar-tracker mode="Marker" src="/assets/2d-marker.png">
                <xr-gltf model="gltf-damageHelmet"></xr-gltf>
            </xr-ar-tracker>
        ```

        其中经过测试有一些问题的（以下都是基于3星手机的测试）：

        `卡其逃脱太` 案例：关闭页面还有声音，也许是应用代码的原因。

        典型案例：`扫描图片视频`（基于 2d marker 实现），扫描出现白色的空白区域，有时候会出现视频

        `AR OSD Marker` 识别是有一些抖动的

        `传送门` 效果不好，反复识别，界面会出现闪烁，有时候效果挺好的

        `AR 人脸` 识别特征无反应

        其他表现都是比较好的
        `OSD 扫描物体查看信息` 文字提示，扫描公仔出现提示信息。

-   分享系统

    将 xr-frame 渲染的结果分享给好友是个很常见的需求，所以我们内置了分享系统 ShareSystem 来协助开发者快速截屏分享。

    类似快照截图的功能，`kivicube-scene` 使用 `takePhoto` 的 api
