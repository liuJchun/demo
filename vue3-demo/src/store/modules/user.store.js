import { loginApi } from "../../apis/user.api"

const userStore = {
    namespaced: true,
    state: {},
    mutations: {},
    actions: {
        login(context, params) {
            console.log("============")
            const res = loginApi(params)
            localStorage.setItem("token", res.token)
            return res
        }
    }
}

export default userStore
