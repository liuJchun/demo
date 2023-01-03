import THREE, { Scene, GLTFLoader as V3dGLTFLoader } from 'three'

import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'

type loadGltfType = {
    url: string
    loadHandler: Function
    useVerge3D?: boolean
}

export function loadGltf({ url, loadHandler, useVerge3D = false }: loadGltfType) {
    const modelLoader = useVerge3D ? GLTFLoader : GLTFLoader

    return new Promise((resolve, reject) => {})
}

export function loadVerge3D({ url, loadHandler, useVerge3D = false }: loadGltfType) {
    const modelLoader = useVerge3D ? GLTFLoader : GLTFLoader

    return new Promise((resolve, reject) => {})
}
