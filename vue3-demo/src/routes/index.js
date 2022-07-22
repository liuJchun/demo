import { createRouter, createWebHistory } from "vue-router"

const staticRoutes = [
    { path: "/login", name: "login", component: () => import("../pages/login/LoginIndex.vue") }
]
const router = createRouter({
    history: createWebHistory(),
    routes: [...staticRoutes]
})

export default router
