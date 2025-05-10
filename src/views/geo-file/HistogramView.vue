<template>
  <div class="histogram-container">
    <div v-if="loading" class="loading-indicator">加载中...</div>
    <div v-else-if="!loading && Histogram" class="histogram-content">
      <h3>直方图数据</h3>
      <pre>{{ Histogram }}</pre>
      <!-- 可以根据实际需求进一步美化直方图的展示 -->
    </div>
    <div v-else class="error-message">暂无数据</div>
  </div>
</template>

<script>
import { getHistogram } from '@/api/geo-file'

export default {
  name: 'HistogramView',
  data() {
    return {
      loading: false,
      metadata: {
                
            }
    }
  },
  created() {
    this.getHistogram()
  },
  methods: {
    async getHistogram() {
            this.loading = true
            try {
                const { data } = await getHistogram(this.$route.params.id, 0, 256)
                this.Histogram = data.data
            } catch (error) {
                this.$message.error('获取失败')
            }
            this.loading = false
        },
    
  }
}
</script>

<style scoped>

</style>