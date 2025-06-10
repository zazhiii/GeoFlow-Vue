<template>
      <div class="p-6">
           <h2 class="text-xl font-semibold mb-4">NDVI 植被指数计算</h2>
           <el-form :inline="true" class="mb-4">
                <el-form-item label="红波段 (Red)">
                     <el-select v-model="redBand" placeholder="请选择红波段">
                          <el-option v-for="file in tiffFiles" :key="file.id" :label="file.fileName" :value="file.id" />
                         </el-select>
                    </el-form-item>
                <el-form-item label="近红外波段 (NIR)">
                     <el-select v-model="nirBand" placeholder="请选择近红外波段">
                          <el-option v-for="file in tiffFiles" :key="file.id" :label="file.fileName" :value="file.id" />
                         </el-select>
                    </el-form-item>
                  <el-form-item>
                        <el-button type="primary" :loading="loading" @click="handleNDVI">计算 NDVI</el-button>
                      </el-form-item>
                </el-form>
             <div v-if="resultMsg" class="mt-4 text-green-600">{{ resultMsg }}</div>
          </div>
</template>

<script>
import { list } from '@/api/geo-file'
import { computeNDVI } from '@/api/operation'
export default {
    data() {
        return {
            tiffFiles: [],
            redBand: null,
            nirBand: null,
            loading: false,
            resultMsg: ''
        }
    },
    created() {
    },
    mounted() {
    this.fetchTiffFiles()
    },
    methods: {
        async fetchTiffFiles() {
            try {
                const { data } = await list({
                    fileName: '',
                    fileType: 'TIFF'
                });
                this.tiffFiles = data.data
                console.log('获取到的文件列表:', this.tiffFiles)
            } catch (error) {
                console.error('获取文件列表失败:', error)
                alert('获取文件列表失败') // 使用 alert 替换 Element Plus 的消息提示
            }
        },
        async handleNDVI() {
            if (!this.redBand || !this.nirBand) {
                this.$message.warning('请先选择两个波段文件')
                return
            }
            this.loading = true
            try {
                const res = await computeNDVI(
                    this.redBand,
                   this.nirBand
                )
                this.resultMsg = res.message || 'NDVI计算成功'
                this.$message.success(this.resultMsg)
            } catch (error) {
                this.$message.error('NDVI计算失败')
            } finally {
                this.loading = false
            }
        }
    }
}
</script>