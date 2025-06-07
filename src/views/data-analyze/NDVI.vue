<template>
  <div class="vegetation-index-view">
    <h2>植被指数 (NDVI) 计算</h2>
    <div class="upload-section">
      <label for="imageUpload">上传图像：</label>
      <input
        type="file"
        id="imageUpload"
        accept="image/*"
        @change="onFileChange"
      />
    </div>
    <div class="image-display" v-if="imageUrl">
      <div class="image-container">
        <h3>原始图像</h3>
        <img :src="imageUrl" alt="Original Image" />
      </div>
      <div class="image-container">
        <h3>NDVI 图像</h3>
        <canvas ref="ndviCanvas"></canvas>
      </div>
    </div>
    <button v-if="imageUrl" @click="downloadNDVI" class="download-btn">下载 NDVI 图像</button>
  </div>
</template>

<script>
import { ref } from '@vue/composition-api';

export default {
  name: 'VegetationIndexView',
  setup() {
    const imageUrl = ref(null);
    const ndviCanvas = ref(null);

    // 处理文件上传
    function onFileChange(event) {
      const file = event.target.files[0];
      if (!file) {
        return;
      }
      const reader = new FileReader();
      reader.onload = (e) => {
        const dataUrl = e.target.result;
        // 更新原始图像的 URL
        imageUrl.value = dataUrl;
        // 创建一个图像对象用于处理
        const img = new Image();
        img.onload = () => {
          // 创建离屏 Canvas 来获取图像像素数据
          const width = img.width;
          const height = img.height;
          const offCanvas = document.createElement('canvas');
          offCanvas.width = width;
          offCanvas.height = height;
          const offCtx = offCanvas.getContext('2d');
          offCtx.drawImage(img, 0, 0, width, height);
          const imageData = offCtx.getImageData(0, 0, width, height);
          const data = imageData.data;

          // 设置 NDVI Canvas 尺寸
          const canvas = ndviCanvas.value;
          canvas.width = width;
          canvas.height = height;
          const ndviCtx = canvas.getContext('2d');
          const ndviImageData = ndviCtx.createImageData(width, height);
          const ndviData = ndviImageData.data;

          // 计算 NDVI 并进行颜色映射
          // NDVI = (NIR - R) / (NIR + R)
          // 假设 NIR 数据存储在图像的 alpha 通道 (如果是四通道图像)
          for (let i = 0; i < data.length; i += 4) {
            const R = data[i];
            // const G = data[i + 1]; // 未使用
            // const B = data[i + 2]; // 未使用
            const NIR = data[i + 3];
            let ndvi = 0;
            if (NIR + R === 0) {
              ndvi = 0;
            } else {
              ndvi = (NIR - R) / (NIR + R);
            }
            // 将 NDVI 值映射到 0-1 之间 (从 -1~1 映射到 0~1)
            const normalized = (ndvi + 1) / 2;
            const t = Math.max(0, Math.min(1, normalized));
            // 从红色 (低 NDVI) 到绿色 (高 NDVI) 线性插值
            const rCol = 255 * (1 - t);
            const gCol = 255 * t;
            ndviData[i] = rCol;
            ndviData[i + 1] = gCol;
            ndviData[i + 2] = 0;
            ndviData[i + 3] = 255;
          }
          ndviCtx.putImageData(ndviImageData, 0, 0);
        };
        img.src = dataUrl;
      };
      reader.readAsDataURL(file);
    }

    // 下载 NDVI 图像
    function downloadNDVI() {
      const canvas = ndviCanvas.value;
      if (!canvas) return;
      const link = document.createElement('a');
      link.href = canvas.toDataURL('image/png');
      link.download = 'ndvi.png';
      // 模拟点击以触发下载
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }

    return {
      imageUrl,
      ndviCanvas,
      onFileChange,
      downloadNDVI,
    };
  },
};
</script>

<style scoped>
.vegetation-index-view {
  max-width: 800px;
  margin: 0 auto;
  font-family: Arial, sans-serif;
  padding: 20px;
  text-align: center;
}

.upload-section {
  margin-top: 20px;
}

.upload-section input[type="file"] {
  margin-left: 10px;
}

.image-display {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  margin-top: 20px;
}

.image-container {
  margin: 10px;
  text-align: center;
}

.image-container img,
.image-container canvas {
  max-width: 100%;
  border: 1px solid #ccc;
  margin-top: 10px;
}

.download-btn {
  margin-top: 20px;
  padding: 10px 20px;
  background-color: #4caf50;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.download-btn:hover {
  background-color: #45a049;
}
</style>