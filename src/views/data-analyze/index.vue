<template>
    <div class="analyze-container" style="display: flex;">
        <el-menu :default-active="this.$route.path" mode="vertical" router class="side-menu">

            <el-menu-item index="/data-analyze/color-composite" class="menu-item">
                <i class="el-icon-picture"></i>
                彩色合成
            </el-menu-item>

            <el-menu-item index="/data-analyze/histogram" class="menu-item">
                <i class="el-icon-data-analysis"></i>
                直方图分析
            </el-menu-item>

            <!-- <el-menu-item index="/data-analyze/image-filter" class="menu-item">
                <i class="el-icon-picture"></i>
                图像滤波
            </el-menu-item> -->

            <el-menu-item index="/data-analyze/image-crop" class="menu-item">
                <i class="el-icon-crop"></i>
                图像裁剪
            </el-menu-item>
            <el-menu-item index="/data-analyze/ndvi">
             <i class="el-icon-crop"></i>
                <span>NDVI 植被指数</span>
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
            activeIndex: '/data-analyze/open-file'
        };
    },
    methods: {
        handleSelect(key) {
            this.activeIndex = key;
        }
    },
    mounted() {
        // 初始化时设置默认选中项
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
    /* 设置侧边菜单的宽度 */
    background-color: #ffffff;
    /* 白色背景 */
    border-radius: 10px;
    /* 添加圆角 */
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    /* 添加阴影 */
    height: 100%;
    /* 侧边菜单高度占满父容器 */
    margin-right: 20px;
}

/* 菜单项样式 */
.menu-item {
    height: 56px;
    /* 设置菜单项的高度 */
    line-height: 56px;
    /* 设置菜单项的行高，使文字垂直居中 */
    padding-left: 20px;
    /* 左侧内边距 */
    color: #606266;
    /* 默认文字颜色 */
    font-size: 15px;
    /* 设置菜单项的文字大小 */
    border-left: 3px solid transparent;
    /* 透明左边框，选中时会变色 */
    transition: all 0.3s;
    /* 添加过渡效果 */
}

/* 鼠标悬停时的样式 */
.menu-item:hover {
    background-color: #ecf5ff;
    /* 鼠标悬停时的背景 */
    color: #409EFF;
    /* 鼠标悬停时的文字颜色 */
}

/* 选中状态的样式 */
.el-menu-item.is-active {
    background-color: #ecf5ff;
    color: #409EFF;
    border-left: 3px solid #409EFF;
}

.content-area {
    flex: 1;
    /* 占据剩余空间 */
    background-color: #ffffff;
    /* 背景颜色 */
    border-radius: 10px;
    /* 圆角 */
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    /* 阴影 */
    padding: 20px;
    /* 内边距 */
    height: 100%;
    overflow: auto;
    /* 添加滚动条，防止内容溢出 */
}
</style>