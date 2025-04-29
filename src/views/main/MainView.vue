<template>
    <div id="app">
        <el-menu :default-active=this.$route.path mode="horizontal" router>
            <el-menu-item index="/home">
                主页
            </el-menu-item>
            <el-menu-item index="/geo-file">
                文件管理
            </el-menu-item>
            <el-menu-item index="/upload">
                文件上传
            </el-menu-item>
            
            <div style="float: right; margin-right: 20px; margin-top: 10px;">
                <el-button v-if="!token" type="primary" @click="$router.push('/login')">
                    "登录/注册"
                </el-button>
                <el-link v-else type="primary">{{ userInfo.username }}</el-link>
            </div>
        </el-menu>
        <router-view></router-view>
    </div>
</template>

<script>

import {getToken} from '@/utils/cookie';
import { mapActions, mapState } from 'vuex';

export default {
    name: 'MainView',
    mounted() {
        if(this.token){
            if(!this.userInfo.username) this.updateUserInfo();  // vuex 中没有用户信息，则更新用户信息
        }  
    },
    computed: {
        ...mapState(['userInfo']),
    },
    data() {
        return {
            token : getToken(),
        };
    },
    methods: {
        ...mapActions(['updateUserInfo'])
    }
};
</script>

<style>
#app {
    padding-left: 20px;
    padding-right: 20px;
}
</style>