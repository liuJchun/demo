import { useState, useMemo } from 'react'
import './App.css'
import AutoResizeGlb from './pages/AutoResizeGlb'

const allModelUrls: string[] = [
    '/rabbit.glb',
    '/ace-apple-right.glb',
    '/lovelight-bamboo-1947.glb',
    '/phone.glb',
]

function App() {
    const [urls, setUrls] = useState<string[]>(allModelUrls.slice(0, 1))

    const handlerChangeModel = (url?: string) => {
        if (url) {
            setUrls([url])
        } else {
            setUrls(allModelUrls)
        }
    }

    return (
        <div className="App">
            <div className="container">
                <div className="content">
                    {urls.map(item => {
                        return (
                            <div className="content-item" key={item}>
                                <AutoResizeGlb url={item} />
                            </div>
                        )
                    })}
                </div>
                <div className="operate">
                    <div>
                        <div
                            className="operate-item"
                            onClick={() => {
                                handlerChangeModel()
                            }}
                        >
                            <button>all 模型</button>
                        </div>
                        {allModelUrls.map((item, index) => {
                            return (
                                <div
                                    className="operate-item"
                                    key={item}
                                    onClick={() => {
                                        handlerChangeModel(item)
                                    }}
                                >
                                    <span>模型{index + 1}:</span>
                                    <br />
                                    <span>name:{item.slice(1)}</span>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default App
