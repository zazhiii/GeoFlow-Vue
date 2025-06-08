<template>
  <div class="veg-statistics">
    <h2>NDVI 计算</h2>
    <input v-model="redBandId" placeholder="输入 redBandId" />
    <input v-model="nirBandId" placeholder="输入 nirBandId" />
    <button @click="fetchNDVI">计算 NDVI</button>

    <div v-if="ndviImage">
      <h3>NDVI 结果图：</h3>
      <img :src="ndviImage" alt="NDVI 结果图像" />
    </div>

    <div v-else-if="resultText">
      <h3>NDVI 结果数据：</h3>
      <pre>{{ resultText }}</pre>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'VegStatistics',
  data() {
    return {
      redBandId: '',
      nirBandId: '',
      ndviImage: null,
      resultText: ''
    }
  },
  methods: {
    fetchNDVI() {
      axios.get('http://47.109.197.221:8080/api/operation/ndvi', {
        params: {
          redBandId: this.redBandId,
          nirBandId: this.nirBandId
        },
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      })
      .then(response => {
        const contentType = response.headers['content-type'];

        if (contentType.includes('application/json') || contentType.includes('text/plain')) {
          this.resultText = typeof response.data === 'string'
            ? response.data
            : JSON.stringify(response.data, null, 2);
          this.ndviImage = null;
        } else if (contentType.includes('image')) {
          const blob = new Blob([response.data], { type: contentType });
          this.ndviImage = URL.createObjectURL(blob);
          this.resultText = '';
        } else {
          this.resultText = '未知响应类型';
        }
      })
      .catch(error => {
        console.error('请求失败：', error);
        this.resultText = '请求失败，请检查控制台或服务器状态';
        this.ndviImage = null;
      });
    }
  }
}
</script>

<style scoped>
.veg-statistics {
  margin: 20px;
}
.veg-statistics input {
  margin-right: 10px;
}
.veg-statistics img {
  max-width: 100%;
  height: auto;
  border: 1px solid #ccc;
  margin-top: 10px;
}
</style>

