<template>
  <div>
    <h2>NDVI 植被指数计算</h2>
    <form @submit.prevent="calculateNDVI">
      <div>
        <label for="redBand">Red 波段 ID：</label>
        <input type="number" id="redBand" v-model="redBandId" required />
      </div>
      <div>
        <label for="nirBand">NIR 波段 ID：</label>
        <input type="number" id="nirBand" v-model="nirBandId" required />
      </div>
      <button type="submit">计算 NDVI</button>
    </form>

    <div v-if="ndviResult !== null" style="margin-top: 16px;">
      <h3>计算结果：</h3>
      <pre>{{ ndviResult }}</pre>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'VegStatistics',
  data() {
    return {
      redBandId: null,
      nirBandId: null,
      ndviResult: null
    }
  },
  methods: {
    async calculateNDVI() {
      try {
        const response = await axios.get('/api/operation/ndvi', {
          params: {
            redBandId: this.redBandId,
            nirBandId: this.nirBandId
          },
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'AfterScript': 'YOUR_AFTER_SCRIPT_VALUE' // 替换成实际值
          }
        })
        this.ndviResult = response.data
      } catch (error) {
        this.ndviResult = error.response ? error.response.data : error.message
        console.error('NDVI 计算失败:', error)
      }
    }
  }
}
</script>

<style scoped>
label {
  display: inline-block;
  width: 100px;
}
input {
  width: 200px;
  margin-bottom: 8px;
}
button {
  margin-top: 8px;
}
</style>
