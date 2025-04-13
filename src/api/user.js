import _axios from "@/utils/_axios";

// 用户注册
export function register(username, password) {
    return _axios({
        url: '/api/user/register',
        method: 'post',
        params: {
            username,
            password
        }
    })
}

// 用户登录
export function login(username, password) {
    return _axios({
        url: '/api/user/login',
        method: 'post',
        params: {
            username,
            password
        }
    })
}

export function getUserInfo() {
    return _axios({
        url: '/api/user/info',
        method: 'get'
    })
}

