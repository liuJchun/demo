import { createStore } from "vuex"

import userStore from "./modules/user.store"

const store = createStore({
    state: {
        text: "This is Vuex Root.state.text"
    },
    getters: {},
    mutations: {},
    actions: {},
    modules: {
        userStore
    }
})

export default store
