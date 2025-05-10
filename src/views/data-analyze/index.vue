<template>
    <div class="analyze-menu" style="display: flex;">
        <el-menu :default-active="this.$route.path" mode="vertical" router class="side-menu">
            
            <el-menu-item index="/open-file" class="menu-item">
                打开文件
            </el-menu-item>
            
            <el-menu-item index="/save-file" class="menu-item">
                保存文件
            </el-menu-item>
            
            <el-menu-item index="/geo-file" class="menu-item">
                文件管理
            </el-menu-item>
            
            <el-menu-item index="/upload" class="menu-item">
                文件上传
            </el-menu-item>
            
            <el-menu-item index="/historgram/:id" class="menu-item">
                计算直方图
            </el-menu-item>

        </el-menu>
        <div class="image-slot">
            <router-view></router-view>
        </div>
    </div>
</template>

<script>
export default {
    name: 'Analyze-Menu',
    data() {
        return {
            // 如果需要添加一些数据，可以在这里定义
        };
    },
    methods: {
        // 如果需要添加一些方法，可以在这里定义
    },
    
};
</script>

<style scoped>
/* 侧边菜单样式 */
.side-menu {
    width: 200px; /* 设置侧边菜单的宽度 */
    background-color: #f5f5f7f9; /* 苹果风格的浅灰色背景 */
    border-radius: 10px; /* 添加圆角 */
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); /* 添加阴影 */
    height: 100%; /* 侧边菜单高度占满父容器 */
}

/* 菜单项样式 */
.menu-item {
    height: 50px; /* 设置菜单项的高度 */
    line-height: 50px; /* 设置菜单项的行高，使文字垂直居中 */
    text-align: center; /* 设置菜单项的文字居中 */
    background-color: #ffffff; /* 苹果风格的白色背景 */
    color:  #409EFF; /* 苹果风格的黑色文字 */
    font-size: 16px; /* 设置菜单项的文字大小 */
    border-bottom: 1px solid #e1e5ea; /* 淡灰色的分隔线 */
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); /* 添加阴影 */
}

/* 鼠标悬停时的样式 */
.menu-item:hover {
    background-color: #e1e5ea; /* 鼠标悬停时的淡灰色背景 */
    color: #000000; /* 鼠标悬停时的文字颜色 */
}


.image-slot {
flex: 1; /* 占据剩余空间 */
    margin-left: 20px; /* 与侧边菜单的间距 */
    background-color: #f5f5f7; /* 背景颜色 */
    border-radius: 10px; /* 圆角 */
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); /* 阴影 */
    padding: 10px; /* 内边距 */
    height: 800px; 
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: auto; /* 添加滚动条，防止内容溢出 */
}
</style>