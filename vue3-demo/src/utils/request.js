import axios from "axios"
import { message } from "ant-design-vue"
const instance = axios.create({
    baseURL: "/api"
})

// 现在，在超时前，所有请求都会等待 2.5 秒
instance.defaults.timeout = 2500

// 添加请求拦截器
instance.interceptors.request.use(
    function (config) {
        // 在发送请求之前做些什么
        return config
    },
    function (error) {
        // 对请求错误做些什么
        return Promise.reject(error)
    }
)

// 添加响应拦截器
instance.interceptors.response.use(
    function (response) {
        // 对响应数据做点什么
        if (response.status === 200 && response?.data?.code === "200") {
            return response.data
        } else {
            message.error(response.data.message || "请求出错！")
            return Promise.reject(response.data)
        }
    },
    function (error) {
        // 对响应错误做点什么
        return Promise.reject(error)
    }
)

export default instance
