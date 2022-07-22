import request from "../utils/request"

export const loginApi = (params = {}) => {
    return request.post("/user/login", params)
}
