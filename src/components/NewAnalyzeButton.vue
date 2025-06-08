<template>
  <div class="menu-item" @click="handleClick">
    <el-icon><PieChart /></el-icon>
    <span class="menu-label">植被分析</span>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { PieChart } from '@element-plus/icons-vue'

const router = useRouter()

const handleClick = () => {
  router.push('/data-analyze/veg-statistics')
}
</script>

<style scoped>
.menu-item {
  display: flex;
  align-items: center;
  padding: 12px 20px;
  cursor: pointer;
  font-size: 15px;
  color: #606266;
  transition: all 0.3s;
}

.menu-item:hover {
  background-color: #ecf5ff;
  color: #409EFF;
}

.menu-label {
  margin-left: 10px;
}
</style>












