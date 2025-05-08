<template>
    <div class="login-container">
        <el-card class="login-card">
            <div class="title">{{ isLogin ? '登录' : '注册' }}</div>

            <el-form :model="formData" :rules="rules" ref="loginForm">
                <el-form-item prop="username">
                    <el-input v-model="formData.username" placeholder="用户名"></el-input>
                </el-form-item>

                <el-form-item prop="password">
                    <el-input v-model="formData.password" type="password" placeholder="密码"></el-input>
                </el-form-item>

                <el-form-item v-if="!isLogin" prop="confirmPassword">
                    <el-input v-model="formData.confirmPassword" type="password" placeholder="确认密码"></el-input>
                </el-form-item>

                <el-button type="primary" @click="handleSubmit" style="width: 100%">
                    {{ isLogin ? '登录' : '注册' }}
                </el-button>

                <div class="switch-text" @click="isLogin = !isLogin">
                    {{ isLogin ? '没有账号?去注册' : '已有账号?去登录' }}
                </div>
            </el-form>
        </el-card>
    </div>
</template>

<script>

import { login, register } from '@/api/user'
import { setToken } from '@/utils/cookie'

export default {
    name: 'LoginView',
    data() {
        const validatePass2 = (rule, value, callback) => {
            if (value !== this.formData.password) {
                callback(new Error('两次输入密码不一致!'))
            } else {
                callback()
            }
        }
        return {
            isLogin: true,
            formData: {
                username: '',
                password: '',
                confirmPassword: ''
            },
            rules: {
                username: [
                    { required: true, message: '请输入用户名', trigger: 'blur' },
                    { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' }
                ],
                password: [
                    { required: true, message: '请输入密码', trigger: 'blur' },
                    { min: 6, max: 20, message: '长度在 6 到 20 个字符', trigger: 'blur' }
                ],
                confirmPassword: [
                    { required: true, message: '请再次输入密码', trigger: 'blur' },
                    { validator: validatePass2, trigger: 'blur' }
                ]
            }
        }
    },
    methods: {
        handleSubmit() {
            this.$refs.loginForm.validate(async valid => {
                if (valid) {
                    if (this.isLogin) {
                        try {
                            const { data } = await login(this.formData.username, this.formData.password)
                            setToken(data.data)
                            this.$message.success('登录成功')
                            this.$router.push('/home')
                        } catch (error) {
                            this.$message.error("登录失败")
                        }
                    } else {
                        try{
                            await register(this.formData)
                            this.$message.success('注册成功')
                            this.isLogin = true
                        }catch{
                            this.$message.error("注册失败")
                        }
                    }
                }
            })
        }
    }
}
</script>

<style scoped>
.login-container {
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #f5f5f5;
}

.login-card {
    width: 400px;
}

.title {
    text-align: center;
    font-size: 24px;
    margin-bottom: 30px;
}

.switch-text {
    text-align: center;
    color: #409EFF;
    margin-top: 20px;
    cursor: pointer;
}

.switch-text:hover {
    text-decoration: underline;
}
</style>
