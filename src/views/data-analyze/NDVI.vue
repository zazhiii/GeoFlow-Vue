<!-- <template>
  <div>
    <h2>NDVI 植被指数计算</h2>
    <form @submit.prevent="calculateNDVI">
      <div>
        <label for="redBand">Red 波段ID：</label>
        <input type="number" id="redBand" v-model.number="redBandId" required />
      </div>
      <div>
        <label for="nirBand">NIR 波段ID：</label>
        <input type="number" id="nirBand" v-model.number="nirBandId" required />
      </div>
      <button type="submit">计算 NDVI</button>
    </form>

    显示 NDVI 结果 -->
    <!-- <div v-if="ndviResult !== null" style="margin-top:16px;">
      <h3>计算结果：</h3>
      <pre>{{ ndviResult }}</pre>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import axios from 'axios'

// 定义响应式数据
const redBandId = ref(null)
const nirBandId = ref(null)
const ndviResult = ref(null)

// 计算 NDVI 的函数
const calculateNDVI = async () => {
  try {
    // 发起 GET 请求，传递红光波段ID和近红外波段ID作为查询参数
    const response = await axios.get('/api/operation/ndvi', {
      params: {
        redBandId: redBandId.value,
        nirBandId: nirBandId.value
      },
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'AfterScript': 'YOUR_AFTER_SCRIPT_VALUE' // TODO: 替换为实际的 AfterScript 值
      }
    })
    // 将返回结果保存到 ndviResult 中显示
    ndviResult.value = response.data
  } catch (error) {
    console.error('请求出错：', error)
    // 错误时将错误信息显示出来
    ndviResult.value = error.response ? error.response.data : error.message
  }
}
</script>

<style scoped>
/* 简单样式，可根据实际需求调整 */
div {
  margin-bottom: 8px;
}
label {
  display: inline-block;
  width: 100px;
}
input {
  width: 200px;
}
button {
  margin-top: 8px;
}
</style> -->
