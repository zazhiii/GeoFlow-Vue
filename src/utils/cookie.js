// 这行代码从 'js-cookie' 库中导入了 Cookies 对象。
// js-cookie 是一个简单、轻量级的处理浏览器 cookie 的 JavaScript API。
// 通过导入 Cookies，我们可以在这个文件中使用它来读取、写入和删除 cookie。
import Cookies from 'js-cookie'

// 定义一个常量 TokenKey，用于存储授权令牌的 cookie 键名。
const TokenKey = 'Authorization'

export function getToken() {
    return Cookies.get(TokenKey)
}

export function setToken(token) {
    return Cookies.set(TokenKey, token)
}

export function removeToken() {
    return Cookies.remove(TokenKey)
}
