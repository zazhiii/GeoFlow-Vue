<template>
  <div class="histogram-container">
    <div class="control-panel">
      <el-form :inline="true">
        <el-form-item label="选择文件">
          <el-select v-model="selectedFile" placeholder="请选择文件">
            <el-option v-for="file in tiffFiles" :key="file.id" :label="file.fileName" :value="file.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="分组数量">
          <el-input-number v-model="binSize" :min="10" :max="500" :step="10"></el-input-number>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="getHistogram" :loading="loading" :disabled="!selectedFile">生成直方图</el-button>
        </el-form-item>
      </el-form>
    </div>

    <div v-if="loading" class="loading-indicator">
      <el-card class="loading-card">
        <i class="el-icon-loading"></i>
        <span class="loading-text">加载中...</span>
      </el-card>
    </div>

    <!-- TODO: 直方图展示 -->
    <div v-else-if="!loading && histogram" class="histogram-content">
      <div class="chart-container" ref="chart">
        {{ JSON.stringify(histogram) }}
      </div>
    </div>

    <div v-else class="error-message">
      <el-empty description="暂无数据"></el-empty>
    </div>
  </div>
</template>

<script>
import { getHistogram, list } from '@/api/geo-file'

export default {
  name: 'HistogramView',
  data() {
    return {
      loading: false,
      histogram: null,
      binSize: 100,
      selectedFile: '',
      tiffFiles: []
    }
  },
  created() {
    this.fetchTiffFiles()
  },
  mounted() {

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
        this.$message.error('获取文件列表失败')
      }
    },
    async getHistogram() {
      this.loading = true
      const { data } = await getHistogram(this.selectedFile, 0, this.binSize)
      this.histogram = data
      this.loading = false
    }
  }
}
</script>

<style scoped>
.histogram-container {
  padding: 20px;
}

.control-panel {
  margin-bottom: 20px;
}

.chart-container {
  width: 100%;
  height: 400px;
  border: 1px solid #eee;
  border-radius: 4px;
}

.loading-indicator {
  text-align: center;
  margin: 40px 0;
}

.loading-card {
  width: 200px;
  margin: 0 auto;
  text-align: center;
}

.loading-text {
  margin-left: 10px;
}
</style>