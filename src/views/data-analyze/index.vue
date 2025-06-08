<template>
  <div class="analyze-container" style="display: flex;">
    <el-menu :default-active="activeIndex" mode="vertical" router class="side-menu" @select="handleSelect">
      <el-menu-item index="/data-analyze/color-composite" class="menu-item">
        <i class="el-icon-picture"></i>
        彩色合成
      </el-menu-item>

      <el-menu-item index="/data-analyze/histogram" class="menu-item">
        <i class="el-icon-data-analysis"></i>
        直方图分析
      </el-menu-item>

      <el-menu-item index="/data-analyze/image-crop" class="menu-item">
        <i class="el-icon-crop"></i>
        图像裁剪
      </el-menu-item>

      <el-menu-item index="/data-analyze/ndvi" class="menu-item">
        <i class="el-icon-s-data"></i>
        NDVI 植被指数分析
      </el-menu-item>
    </el-menu>

    <div class="content-area">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
export default {
  name: 'DataAnalyze',
  data() {
    return {
      activeIndex: '/data-analyze/color-composite'
    };
  },
  methods: {
    handleSelect(key) {
      this.activeIndex = key;
      // this.$router.push(key);
    }
  },
  mounted() {
    if (this.$route.path) {
      this.activeIndex = this.$route.path;
    }
  }
};
</script>

<style scoped>
.analyze-container {
  display: flex;
  height: calc(100vh - 60px);
  padding: 15px;
  background-color: #f5f7fa;
}

/* 侧边菜单样式 */
.side-menu {
  width: 220px;
  background-color: #ffffff;
  border-radius: 10px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  height: 100%;
  margin-right: 20px;
}

/* 菜单项样式 */
.menu-item {
  height: 56px;
  line-height: 56px;
  padding-left: 20px;
  color: #606266;
  font-size: 15px;
  border-left: 3px solid transparent;
  transition: all 0.3s;
  display: flex;
  align-items: center;
}

.menu-item:hover {
  background-color: #ecf5ff;
  color: #409EFF;
}

.el-menu-item.is-active {
  background-color: #ecf5ff;
  color: #409EFF;
  border-left: 3px solid #409EFF;
}

.content-area {
  flex: 1;
  background-color: #ffffff;
  border-radius: 10px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  padding: 20px;
  height: 100%;
  overflow: auto;
}
</style>
