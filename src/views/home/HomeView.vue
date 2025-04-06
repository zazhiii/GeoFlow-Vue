<template>
    <div class="home">
        <div class="header">
            <h1>GeoFlow</h1>
            <p class="subtitle">地理空间数据处理与分析平台</p>
        </div>

        <div class="main-content">
            <el-row :gutter="20">
                <el-col :span="8">
                    <el-card class="feature-card">
                        <i class="el-icon-upload"></i>
                        <h3>数据上传</h3>
                        <p>支持大文件分片上传，断点续传</p>
                        <el-button type="primary" @click="$router.push('/upload')">开始上传</el-button>
                    </el-card>
                </el-col>

                <el-col :span="8">
                    <el-card class="feature-card">
                        <i class="el-icon-data-analysis"></i>
                        <h3>数据分析</h3>
                        <p>强大的地理空间数据分析能力</p>
                        <el-button type="primary">开始分析</el-button>
                    </el-card>
                </el-col>

                <el-col :span="8">
                    <el-card class="feature-card">
                        <i class="el-icon-view"></i>
                        <h3>数据可视化</h3>
                        <p>丰富的地理数据可视化展示</p>
                        <el-button type="primary">查看展示</el-button>
                    </el-card>
                </el-col>
            </el-row>
        </div>
    </div>
</template>

<script>
export default {
    name: 'HomeView'
}
</script>

<style scoped>
.home {
    padding: 20px;
}

.header {
    text-align: center;
    margin-bottom: 50px;
}

.header h1 {
    font-size: 48px;
    color: #409EFF;
    margin-bottom: 10px;
}

.subtitle {
    font-size: 20px;
    color: #606266;
}

.feature-card {
    text-align: center;
    padding: 20px;
}

.feature-card i {
    font-size: 50px;
    color: #409EFF;
    margin-bottom: 20px;
}

.feature-card h3 {
    font-size: 20px;
    margin-bottom: 10px;
}

.feature-card p {
    color: #606266;
    margin-bottom: 20px;
}
</style>
