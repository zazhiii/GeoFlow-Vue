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
      <div class="chart-container" ref="chart" style="width: 100%; height: 700px;"></div>
    </div>

    <div v-else class="error-message">
      <el-empty description="暂无数据"></el-empty>
    </div>
  </div>
</template>

<script>
import { getHistogram, list } from '@/api/geo-file'
import * as echarts from 'echarts'

export default {
  name: 'HistogramView',
  data() {
    return {
      loading: false,
      histogram: null,
      binSize: 100, // 分组数量，这个变量实际上没有用到，因为后端已经提供了分组数据
      selectedFile: '',
      tiffFiles: [],
      chartInstance: null // ECharts 实例
    }
  },
  created() {
    this.fetchTiffFiles()
  },
  mounted() {
  this.$nextTick(() => {
    console.log('this.$refs:', this.$refs);
    if (this.$refs.chart) {
      this.chartInstance = echarts.init(this.$refs.chart);
    } else {
      console.error('图表容器未找到');
    }
  });
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
    transformData(dataObj) {
      const bins = Object.keys(dataObj).map(key => `${key}-${parseInt(key, 10) + 100}`);
      const values = Object.values(dataObj);
      console.log('Bins:', bins); // 打印 bins 数组
      console.log('Values:', values); // 打印 values 数组
      return { bins, values };
    },
    async getHistogram() {
  if (!this.selectedFile) {
    this.$message.warning('请先选择文件');
    return;
  }

  // 取消之前的请求
  if (this.currentRequest) {
    this.currentRequest.abort();
  }

  this.loading = true;
  try {
    // 保存当前请求以便可以取消
    this.currentRequest = getHistogram(this.selectedFile, 0, this.binSize);
    const response = await this.currentRequest;

    // 检查组件是否仍然挂载
    if (!this._isMounted) return;

    if (response.data?.code === 1) {
      this.histogram = this.transformData(response.data.data);
      // 确保 DOM 更新完成后再调用 updateChart
      this.$nextTick(() => {
        this.updateChart();
      });
    } else {
      throw new Error(response.data?.msg || '无效的响应数据');
    }
  } catch (error) {
    if (error.name !== 'AbortError') {
      console.error('获取直方图失败:', error);
      this.$message.error(error.message || '生成直方图失败');
    }
  } finally {
    if (this._isMounted) {
      this.loading = false;
    }
    this.currentRequest = null;
  }
},
    updateChart() {
  try {
    // 确保 DOM 更新完成
    this.$nextTick(() => {
      // 1. 检查必要条件
      if (!this.$refs.chart) {
        console.error('图表容器未找到');
        return;
      }

      if (!this.histogram || !this.histogram.bins || !this.histogram.values) {
        console.warn('直方图数据未准备好', this.histogram);
        return;
      }

      // 2. 初始化图表实例（如果不存在）
      if (!this.chartInstance) {
        try {
          this.chartInstance = echarts.init(this.$refs.chart);
          console.log('ECharts实例初始化成功');
        } catch (e) {
          console.error('图表初始化失败:', e);
          return;
        }
      }

      // 3. 准备数据（处理大数据量情况）
      const { bins, values } = this.histogram;
      const displayCount = 100; // 最大显示的柱状图数量
      const step = Math.max(1, Math.floor(bins.length / displayCount));

      const displayBins = [];
      const displayValues = [];

      // 抽样数据以避免过多数据点
      for (let i = 0; i < bins.length; i += step) {
        displayBins.push(bins[i]);

        // 计算区间内的平均值
        let sum = 0;
        const count = Math.min(step, bins.length - i);
        for (let j = 0; j < count; j++) {
          sum += values[i + j] || 0;
        }
        displayValues.push(sum / count);
      }

      console.log('处理后数据:', {
        originalLength: bins.length,
        displayLength: displayBins.length,
        sampleStep: step
      });

      // 4. 配置项
      const option = {
        title: {
          text: '遥感图像直方图',
          left: 'center',
          top: 10
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          },
          formatter: params => {
            const dataIndex = params[0].dataIndex;
            const originalIndex = dataIndex * step;
            const binRange = bins[originalIndex] || 'N/A';
            const value = values[originalIndex] || 0;
            return `
              <div style="font-weight:bold">${binRange}</div>
              <div>原始值: ${value.toLocaleString()}</div>
              <div>显示值: ${params[0].value.toLocaleString()}</div>
            `;
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '10%',
          top: '15%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          data: displayBins,
          axisLabel: {
            interval: 0,
            rotate: 45,
            fontSize: 10,
            formatter: (value) => {
              // 简化显示长区间标签
              if (value.length > 12) {
                return value.replace(/-.*?(\d{3})/, '...$1');
              }
              return value;
            }
          },
          axisTick: {
            alignWithLabel: true
          },
          name: '像素值区间',
          nameLocation: 'middle',
          nameGap: 30
        },
        yAxis: {
          type: 'value',
          name: '频率',
          axisLabel: {
            formatter: (value) => {
              if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
              if (value >= 1000) return `${(value / 1000).toFixed(1)}K`;
              return value;
            }
          },
          splitLine: {
            show: true,
            lineStyle: {
              type: 'dashed'
            }
          }
        },
        dataZoom: [
          {
            type: 'slider',
            xAxisIndex: 0,
            start: 0,
            end: 100,
            bottom: 20,
            height: 20,
            handleSize: '100%',
            brushSelect: false
          },
          {
            type: 'inside',
            xAxisIndex: 0,
            zoomOnMouseWheel: false,
            moveOnMouseMove: true,
            moveOnMouseWheel: true
          }
        ],
        series: [
          {
            name: '频率',
            type: 'bar',
            data: displayValues,
            itemStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: '#83bff6' },
                { offset: 0.5, color: '#188df0' },
                { offset: 1, color: '#0052a3' }
              ])
            },
            emphasis: {
              itemStyle: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  { offset: 0, color: '#f87979' },
                  { offset: 0.7, color: '#ed3232' },
                  { offset: 1, color: '#aa0000' }
                ])
              }
            },
            barWidth: '60%',
            barCategoryGap: '20%',
            label: {
              show: true,
              position: 'top',
              formatter: '{c}'
            }
          }
        ],
        animation: true,
        animationDuration: 1000,
        animationEasing: 'cubicOut'
      };

      // 5. 应用配置
      this.chartInstance.setOption(option, {
        notMerge: true,
        lazyUpdate: false
      });

      // 6. 添加窗口大小变化监听
      window.addEventListener('resize', this.handleResize);
      this.chartInstance.on('finished', () => {
        console.log('图表渲染完成');
      });
    });
  } catch (error) {
    console.error('更新图表时出错:', error);
    this.$message.error('图表更新失败');
  }
},
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