import _axios from "@/utils/_axios";

// 用户注册
export function register({username, password}) {
    return _axios({
        url: '/user/register',
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
        url: '/user/login',
        method: 'post',
        params: {
            username,
            password
        }
    })
}

export function getUserInfo() {
    return _axios({
        url: '/user/info',
        method: 'get'
    })
}


export function update({ username, email, avatar, password, newPassword }) {
    return _axios({
        url: '/user/update',
        method: 'post',
        data: {  // 使用 data 而不是 params
            username,
            email,
            avatar,
            password,
            newPassword
        }
    })
}