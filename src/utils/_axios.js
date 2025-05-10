import axios from "axios";
import { getToken } from "../utils/cookie"
import { Message } from "element-ui"

const _axios = axios.create({
    baseURL: process.env.VUE_APP_BASE_API,
})

// 比如在这里添加统一的 headers
_axios.interceptors.request.use(
    function (config) {
        config.headers = {
            Authorization: getToken()
        }
        return config;
    });

_axios.interceptors.response.use(
    function (response) {
        const { data } = response;
        if(data.code == 0){
            return Promise.reject(data)
        }
        return response;
    },
    function (error) {
        // 超出 2xx, 比如 4xx, 5xx 走这里
        if (error.response.status == 401) {
            // 跳转到登录页面
            window.location.href = '/#/login'
            // 在 axios 拦截器中无法直接使用 this.$message,因为这里的 this 不是 Vue 实例
            // 可以考虑使用 Element UI 的 Message 组件
            // 需要在文件顶部引入 import { Message } from 'element-ui'
            Message.error('请先登录')
        }
        return Promise.reject(error);
    }
);

export default _axios