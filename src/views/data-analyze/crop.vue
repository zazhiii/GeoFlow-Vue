<template>
  <div class="crop-container">
    <h2>TIFF 图像裁剪</h2>

    <div class="crop-form">
      <el-form label-width="120px">
        <el-form-item label="选择TIFF文件">
          <el-select
            v-model="selectedImage"
            placeholder="请选择TIFF文件"
            @change="handleSelect"
            clearable
            filterable
            :loading="loading"
          >
            <el-option
              v-for="item in tiffFiles"
              :key="item.id"
              :label="item.fileName"
              :value="item.id"
            />
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-button
            type="primary"
            @click="cropImage"
            :loading="loading"
            :disabled="!canCrop"
          >执行裁剪</el-button>
          <el-button @click="resetCropper">重置选区</el-button>
        </el-form-item>
      </el-form>
    </div>

    <div class="preview-container">
      <h3>预览图</h3>
      <div class="image-box">
        <img
          v-if="targetImageSrc"
          :src="targetImageSrc"
          ref="targetImage"
          alt="预览图"
          crossorigin="anonymous"
        />
        <div v-else class="empty-preview">
          <i class="el-icon-picture-outline"></i>
          <p>请选择文件</p>
        </div>
      </div>
    </div>

    <div class="note-container">
      <el-alert
        title="说明"
        type="info"
        description="裁剪区域可以通过鼠标选择，点击执行裁剪后生成新文件。"
        show-icon
        :closable="false"
      />
    </div>
  </div>
</template>

<script>
import '@cropper/elements';

import Cropper from 'cropperjs';
import 'cropperjs/dist/cropper.css';
import { list, previewTiff } from '@/api/geo-file';
import { cropTiff } from '@/api/operation';
import { getMetadata } from '@/api/geo-file'

export default {
  name: 'TiffCropView',
  data() {
    return {
      tiffFiles: [],
      selectedImage: '',
      targetImageSrc: '',
      cropper: null,
      loading: false
    };
  },
  computed: {
    canCrop() {
      return this.selectedImage && this.cropper;
    }
  },
  created() {
    this.fetchTiffFiles();
  },
  methods: {
    async fetchTiffFiles() {
      try {
        this.loading = true;
        const { data } = await list({ fileType: 'TIFF', pageSize: 100 });
        this.tiffFiles = data?.data || [];
      } catch (error) {
        this.$message.error('获取TIFF文件失败');
        console.error(error);
      } finally {
        this.loading = false;
      }
    },

    async handleSelect(fileId) {
      if (!fileId) return this.clearCropper();

      try {
        this.loading = true;
        const response = await previewTiff(fileId, { format: 'jpeg' });
        const imageURL = URL.createObjectURL(new Blob([response.data], { type: 'image/jpeg' }));
        this.targetImageSrc = imageURL;
        await this.$nextTick();
        this.initCropper();
      } catch (error) {
        this.$message.error('预览加载失败');
        console.error(error);
        this.clearCropper();
      } finally {
        this.loading = false;
      }
    },

    initCropper() {
      if (this.cropper) this.cropper.destroy();
      this.cropper = new Cropper(this.$refs.targetImage, {
        viewMode: 1,
        autoCropArea: 0.8,
        movable: true,
        scalable: true,
        zoomable: true,
        rotatable: true,
        background: false,
        checkCrossOrigin: true
      });
    },

    // async getMetadata() {
    //         this.loading = true
    //         try {
    //             const { data } = await getMetadata(this.$route.params.id)
    //             this.metadata = data.data
    //         } catch (error) {
    //             this.$message.error('获取元数据失败')
    //         }
    //         this.loading = false
    //     },

    async cropImage() {
      if (!this.canCrop) return;

      try {
        this.loading = true;
        const crop = this.cropper.getData();

        const { data } = await getMetadata(this.selectedImage)
        const minX = data.data.minX
        const minY = data.data.minY
        const rx = data.data.resolutionX
        const ry = data.data.resolutionY 
        const imageHeight = data.data.height;

        console.log(minX, minY);
        const pixelYBottom = imageHeight - crop.y - crop.height;
        const pixelYTop = imageHeight - crop.y;
        
        // 这里传像素坐标，如果后端需要地理坐标，需额外转换
        
        await cropTiff(
          this.selectedImage,
          Math.round(minX+crop.x*rx),
          Math.round(minY+pixelYBottom*ry),
          Math.round(minX+crop.x*rx + crop.width*rx),
          Math.round(minY+pixelYTop*ry)
        );

        this.$message.success('裁剪成功，结果已上传，请在文件列表查看');
      } catch (error) {
        this.$message.error(error.response?.data?.msg || '裁剪失败');
        console.error(error);
      } finally {
        this.loading = false;
      }
    },

    resetCropper() {
      this.cropper?.reset();
    },

    clearCropper() {
      if (this.targetImageSrc?.startsWith('blob:')) {
        URL.revokeObjectURL(this.targetImageSrc);
      }
      this.targetImageSrc = '';
      this.cropper?.destroy();
      this.cropper = null;
    }
  },
  beforeDestroy() {
    this.clearCropper();
  }
};
</script>

<style scoped>
.crop-container {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.crop-form {
  margin-bottom: 20px;
  background: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.preview-container {
  background: #fff;
  padding: 20px;
  border-radius: 8px;
}

.image-box {
  height: 500px;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #fafafa;
  border: 1px solid #ebeef5;
}

.image-box img {
  max-width: 100%;
  max-height: 100%;
}

.empty-preview {
  text-align: center;
  color: #909399;
}

.empty-preview i {
  font-size: 48px;
  margin-bottom: 10px;
}

.note-container {
  margin-top: 20px;
}
</style>
