<template>
    <div class="open-file-container">
        <div v-loading="loading" element-loading-text="图像加载中..." class="image-container">
            <el-image 
                v-if="imageSrc" 
                :src="imageSrc" 
                :preview-src-list="[imageSrc]"
                fit="contain"
                class="preview-image">
                <div slot="error" class="image-slot">
                    <i class="el-icon-picture-outline"></i>
                </div>
            </el-image>
        </div>
        <div class="button-container">
            <el-button @click="loadImage" :loading="loading" type="primary">加载图像</el-button>
        </div>
    </div>
</template>

<script>
import { previewTiff } from '@/api/geo-file';

export default {
    name: 'OpenFile',
    data() {
        return {
            imageSrc: '',
            loading: false
        };
    },
    methods: {
        async loadImage() {
            this.loading = true;
            try {
                const response = await previewTiff(this.$route.params.id);
                const blob = new Blob([response.data], { type: 'image/png' });
                this.imageSrc = URL.createObjectURL(blob);
            } catch (error) {
                this.$message.error('加载图像失败');
            }
            this.loading = false;
        }
    },
    beforeDestroy() {
        // 组件销毁前释放临时URL
        if (this.imageSrc) {
            URL.revokeObjectURL(this.imageSrc);
        }
    }
};
</script>

<style scoped>
.open-file-container {
    padding: 20px;
    height: calc(100vh - 120px);
    display: flex;
    flex-direction: column;
}

.image-container {
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    background: #f5f7fa;
    border-radius: 4px;
    margin-bottom: 20px;
}

.preview-image {
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
}

.button-container {
    text-align: center;
}

.image-slot {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
    background: #f5f7fa;
    color: #909399;
    font-size: 30px;
}
</style>