import axios from "axios";
import { getToken } from "../utils/cookie"

const _axios = axios.create({
    // baseURL: "http://47.108.51.109:8080",
    baseURL: "http://localhost:8081",
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
            this.$message.error(data.message)
        }
        return response;
    },
    function (error) {
        // 超出 2xx, 比如 4xx, 5xx 走这里
        return Promise.reject(error);
    }
);

export default _axios