<template>
    <div class="metadata-view">
        <el-card v-loading="loading" element-loading-text="加载中...">
            <el-descriptions title="文件元数据" :column="2" border>
                <el-descriptions-item label="坐标范围">
                    左下角: ({{ metadata.minX }}, {{ metadata.minY }})
                    <br>
                    右上角: ({{ metadata.maxX }}, {{ metadata.maxY }})
                </el-descriptions-item>
                <el-descriptions-item label="图像尺寸">{{ metadata.width }} × {{ metadata.height }}</el-descriptions-item>
                <el-descriptions-item label="坐标参考系统">{{ metadata.crs }}</el-descriptions-item>
                <el-descriptions-item label="分辨率">{{ metadata.resolutionX }}m × {{ metadata.resolutionY }}m</el-descriptions-item>
                <el-descriptions-item label="波段数">{{ metadata.bandCount }}</el-descriptions-item>
                <el-descriptions-item label="位深度">{{ metadata.bitDepth.join(', ') }}</el-descriptions-item>
            </el-descriptions>
        </el-card>
    </div>
</template>

<script>
import { getMetadata } from '@/api/geo-file'

export default {
    name: 'MetadataView',
    data() {
        return {
            loading: false,
            metadata: {
                minX: 0,
                minY: 0,
                maxX: 0,
                maxY: 0,
                width: 0,
                height: 0,
                crs: '',
                resolutionX: 0,
                resolutionY: 0,
                bandCount: 0,
                bitDepth: []
            }
        }
    },
    created() {
        this.getMetadata()
    },
    methods: {
        async getMetadata() {
            this.loading = true
            try {
                const { data } = await getMetadata(this.$route.params.id)
                this.metadata = data.data
            } catch (error) {
                this.$message.error('获取元数据失败')
            }
            this.loading = false
        }
    }
}
</script>

<style>
.metadata-view {
    padding: 20px;
}
</style>