import THREE, { Scene } from 'three'

import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'

type loadGltfType = {
    url: string
    loadHandler: Function
    useVerge3D?: boolean
    manager: any
}

export function loadGltf({
    url,
    loadHandler,
    useVerge3D = false,
    manager = THREE.LoadingManager,
}: loadGltfType) {
    const modelLoader = GLTFLoader
    const instance = new modelLoader(manager)


    const onLoadHandler = () => { 
        


    }
    

    


}

export function loadVerge3D({ url, loadHandler, useVerge3D = false }: loadGltfType) {
    const modelLoader = useVerge3D ? GLTFLoader : GLTFLoader

    return new Promise((resolve, reject) => {})
}
