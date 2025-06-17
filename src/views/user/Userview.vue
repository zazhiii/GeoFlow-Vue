<template>
  <div class="user-profile-container">
    <!-- 操作按钮区域 -->
    <div class="action-buttons">
      <el-button 
        type="primary" 
        icon="el-icon-link"
        @click="$router.push('/')"
        plain>
        返回首页
      </el-button>
      <el-button 
        type="danger" 
        icon="el-icon-switch-button"
        @click="handleLogout"
        plain>
        退出账号
      </el-button>
    </div>

    <!-- 主内容卡片 -->
    <el-card class="main-card" shadow="hover">
      <!-- 头像上传区域 -->
      <div class="avatar-section">
        <el-upload
          class="avatar-uploader"
          action="/api/user/uploadAvatar"  
          :show-file-list="false"
          :http-request="handleAvatarUpload"
          :before-upload="beforeAvatarUpload"
          :disabled="avatarUploading">
          <div class="avatar-wrapper">
            <img v-if="userInfoForm.avatar" :src="userInfoForm.avatar" class="avatar">
            <i v-else class="el-icon-user avatar-uploader-icon"></i>
            <div class="avatar-mask">
              <i class="el-icon-camera"></i>
            </div>
          </div>
        </el-upload>
        <div class="avatar-info">
          <h3>{{ userInfoForm.username }}</h3>
          <p>{{ userInfoForm.email }}</p>
          <div class="avatar-uploader-tip">
            {{ avatarUploading ? '上传中...' : '点击修改头像' }}
          </div>
        </div>
      </div>

      <el-form ref="userForm" :model="userInfoForm" :rules="rules" label-width="100px" label-position="top">
        <!-- 基本信息 -->
        <el-card class="form-section" shadow="never">
          <div slot="header" class="section-header">
            <span class="section-title">基本信息</span>
            <div class="section-actions">
              <el-button
                v-if="!basicInfoEditing"
                type="text"
                icon="el-icon-edit"
                @click="startBasicInfoEdit">
                修改
              </el-button>
              <template v-else>
                <el-button
                  type="text"
                  icon="el-icon-check"
                  @click="saveBasicInfo"
                  :loading="basicInfoLoading">
                  保存
                </el-button>
                <el-button
                  type="text"
                  icon="el-icon-close"
                  @click="cancelBasicInfoEdit">
                  取消
                </el-button>
              </template>
            </div>
          </div>
          
          <el-row :gutter="24">
            <el-col :xs="24" :sm="12">
              <el-form-item label="用户名" prop="username">
                <el-input 
                  v-model="userInfoForm.username" 
                  :disabled="!basicInfoEditing" 
                  placeholder="请输入用户名"
                  clearable>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12">
              <el-form-item label="电子邮箱" prop="email">
                <el-input 
                  v-model="userInfoForm.email" 
                  :disabled="!basicInfoEditing" 
                  placeholder="请输入电子邮箱"
                  clearable>
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-card>

        <!-- 账号安全 -->
        <el-card class="form-section" shadow="never">
          <div slot="header" class="section-header">
            <span class="section-title">账号安全</span>
            <div class="section-actions">
              <el-button
                v-if="!securityEditing"
                type="text"
                icon="el-icon-edit"
                @click="startSecurityEdit">
                修改密码
              </el-button>
              <template v-else>
                <el-button
                  type="text"
                  icon="el-icon-check"
                  @click="saveSecurity"
                  :loading="securityLoading">
                  保存
                </el-button>
                <el-button
                  type="text"
                  icon="el-icon-close"
                  @click="cancelSecurityEdit">
                  取消
                </el-button>
              </template>
            </div>
          </div>
          
          <el-row :gutter="24">
            <el-col :xs="24" :sm="24" :md="8">
              <el-form-item label="旧密码" prop="password">
                <el-input
                  v-model="userInfoForm.password"
                  type="password"
                  :disabled="!securityEditing"
                  placeholder="请输入当前密码"
                  show-password
                  autocomplete="off"></el-input>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="24" :md="8">
              <el-form-item label="新密码" prop="newPassword">
                <el-input
                  v-model="userInfoForm.newPassword"
                  type="password"
                  :disabled="!securityEditing"
                  placeholder="请输入新密码"
                  show-password
                  autocomplete="off"></el-input>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="24" :md="8">
              <el-form-item label="确认密码" prop="confirmPassword">
                <el-input
                  v-model="userInfoForm.confirmPassword"
                  type="password"
                  :disabled="!securityEditing"
                  placeholder="请再次输入新密码"
                  show-password
                  autocomplete="off"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-card>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { update, getUserInfo } from '@/api/user'
import { uploadAvatar } from '@/api/upload'

export default {
  name: 'UserProfile',
  computed: {
    ...mapState(['userInfo']),
  },
async mounted() {
  try {
    console.log('开始获取用户信息...'); // 调试日志
    const response = await getUserInfo();
    console.log('获取用户信息API响应:', response); // 打印完整响应

    if (response.data && response.data.code === 1) {
      const userData = response.data.data;
      console.log('原始用户数据:', JSON.parse(JSON.stringify(userData))); // 深度拷贝后打印

      // 确保avatar是完整URL
      let avatarUrl = userData.avatar;
      console.log('原始avatar值:', avatarUrl); // 打印原始avatar值

      if (avatarUrl && !avatarUrl.startsWith('http')) {
        avatarUrl = `http://47.109.197.221:9000/geoflow/${avatarUrl}`;
        console.log('处理后的avatar URL:', avatarUrl); // 打印处理后的URL
      }

      this.userInfoForm = {
        username: userData.username,
        email: userData.email,
        avatar: avatarUrl || 'http://47.109.197.221:9000/geoflow/f9c74dab-c2d3-48a4-a7a6-a5684c0c5a25',
        password: '',
        newPassword: '',
        confirmPassword: ''
      };

      this.originalForm = JSON.parse(JSON.stringify(this.userInfoForm));
      console.log('最终表单数据:', this.userInfoForm); // 打印最终表单数据
      console.log('Vuex中的用户信息:', this.userInfo); // 打印Vuex store中的用户信息
    } else {
      throw new Error(response.data?.msg || 'API返回非成功状态');
    }
  } catch (error) {
    console.error('获取用户信息失败:', error);
    console.error('错误堆栈:', error.stack); // 打印错误堆栈
    this.$message.error('获取用户信息失败，请刷新重试');

    // 回退处理
    const defaultAvatar = 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png';
    console.log('使用回退数据，Vuex用户信息:', this.userInfo); // 打印Vuex数据
    
    this.userInfoForm = {
      ...this.userInfo,
      avatar: this.userInfo.avatar || defaultAvatar,
      password: '',
      newPassword: '',
      confirmPassword: ''
    };
    
    this.originalForm = JSON.parse(JSON.stringify(this.userInfoForm));
    console.log('回退后的表单数据:', this.userInfoForm); // 打印回退数据
  } finally {
    console.log('当前头像URL:', this.userInfoForm.avatar)
// 检查DOM中的实际img标签
setTimeout(() => {
  const img = document.querySelector('.avatar-uploader .avatar')
  console.log('DOM中img的src:', img?.src)
  console.log('img加载状态:', img?.complete ? 'loaded' : 'loading')
}, 500)
  }
},
  data() {
    const validatePassword = (rule, value, callback) => {
      if (this.securityEditing && !value) {
        callback(new Error('请输入密码'))
      } else {
        callback()
      }
    }
    
    const validateNewPassword = (rule, value, callback) => {
      if (this.securityEditing && !value) {
        callback(new Error('请输入新密码'))
      } else if (value && value.length < 6) {
        callback(new Error('密码长度不能少于6位'))
      } else {
        callback()
      }
    }
    
    const validateConfirmPassword = (rule, value, callback) => {
      if (this.securityEditing && value !== this.userInfoForm.newPassword) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    
    return {
      userInfoForm: {
        username: '',
        avatar: '',
        email: '',
        password: '',
        newPassword: '',
        confirmPassword: ''
      },
      basicInfoEditing: false,
      basicInfoLoading: false,
      securityEditing: false,
      securityLoading: false,
      avatarUploading: false,
      originalForm: {},
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱地址', trigger: 'blur' },
          { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }
        ],
        password: [
          { validator: validatePassword, trigger: 'blur' }
        ],
        newPassword: [
          { validator: validateNewPassword, trigger: 'blur' }
        ],
        confirmPassword: [
          { validator: validateConfirmPassword, trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    async handleLogout() {
      try {
        await this.$confirm('确定要退出登录吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        
        this.$message.success('退出成功')
        this.$router.push('/login')
      } catch (error) {
        if (error !== 'cancel') {
          console.error('退出失败:', error)
          this.$message.error('退出失败，请重试')
        }
      }
    },

    startBasicInfoEdit() {
      this.basicInfoEditing = true
      this.originalForm = JSON.parse(JSON.stringify(this.userInfoForm))
    },

    cancelBasicInfoEdit() {
      this.basicInfoEditing = false
      this.userInfoForm = JSON.parse(JSON.stringify(this.originalForm))
      this.$refs.userForm.clearValidate()
    },

    async saveBasicInfo() {
      try {
        const valid = await this.$refs.userForm.validate()
        if (!valid) return
        
        this.basicInfoLoading = true
        
        const updateData = {
          username: this.userInfoForm.username,
          email: this.userInfoForm.email,
          avatar: this.userInfoForm.avatar
        }
        
        await update(updateData)
        
        this.$message.success('基本信息更新成功')
        this.basicInfoEditing = false
        this.originalForm = JSON.parse(JSON.stringify(this.userInfoForm))
        
      } catch (error) {
        console.error('更新失败:', error)
        this.$message.error(error.response?.data?.msg || '更新失败，请重试')
      } finally {
        this.basicInfoLoading = false
      }
    },
    
    startSecurityEdit() {
      this.securityEditing = true
      this.userInfoForm.password = ''
      this.userInfoForm.newPassword = ''
      this.userInfoForm.confirmPassword = ''
    },
    
    cancelSecurityEdit() {
      this.securityEditing = false
      this.userInfoForm.password = ''
      this.userInfoForm.newPassword = ''
      this.userInfoForm.confirmPassword = ''
      this.$refs.userForm.clearValidate(['password', 'newPassword', 'confirmPassword'])
    },
    
    async saveSecurity() {
  try {
    // 1. 执行表单验证
    await this.$refs.userForm.validateField([
      'password', 
      'newPassword', 
      'confirmPassword'
    ]);

    // 2. 调用API
    await update({
      password: this.userInfoForm.password,
      newPassword: this.userInfoForm.newPassword
    });

    // 3. 仅显示成功提示
    this.$message.success('密码修改成功');

  } catch (error) {
    // 静默处理错误（不显示错误提示）
    console.error('密码修改失败:', error);
  }
},

    beforeAvatarUpload(file) {
      const isImage = ['image/jpeg', 'image/png'].includes(file.type)
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isImage) {
        this.$message.error('头像图片只能是 JPG/PNG 格式!')
        return false
      }
      if (!isLt2M) {
        this.$message.error('头像图片大小不能超过 2MB!')
        return false
      }
      return true
    },
    
    async handleAvatarUpload({ file }) {
  try {
    this.avatarUploading = true;
    
    // 生成临时预览URL（仅用于本地预览）
    const tempUrl = URL.createObjectURL(file);
    this.userInfoForm.avatar = tempUrl;

    // 调用上传API（只需确认是否成功）
    await uploadAvatar(file);
    
    this.$message.success('头像上传成功');
  } catch (error) {
    console.error('上传失败:', error);
    this.$message.error(error.response?.data?.msg || '上传失败');
    this.userInfoForm.avatar = this.originalForm.avatar;
  } finally {
    this.avatarUploading = false;
  }
}
  }
}
</script>

<style scoped>
.user-profile-container {
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
}

.action-buttons {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 20px;
  gap: 10px;
}

.avatar-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 20px;
}

.avatar-uploader {
  text-align: center;
  margin-bottom: 10px;
}

.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 50%;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: all 0.3s;
  width: 120px;
  height: 120px;
}

.avatar-uploader .el-upload:hover {
  border-color: #409EFF;
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 120px;
  height: 120px;
  line-height: 120px;
  text-align: center;
}

.avatar {
  width: 120px;
  height: 120px;
  display: block;
  border-radius: 50%;
  object-fit: cover;
}

.avatar-uploader-tip {
  font-size: 12px;
  color: #909399;
  margin-top: 5px;
}

.form-section {
  margin-bottom: 20px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 16px;
  font-weight: bold;
  color: #409EFF;
}

.section-actions {
  display: flex;
  align-items: center;
}

.el-row {
  margin-bottom: 10px;
}
</style>