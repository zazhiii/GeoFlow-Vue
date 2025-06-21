<template>
    <div class="color-composite-container">
        <h2>彩色合成</h2>

        <div class="band-selection">
            <el-form label-width="120px">
                <el-form-item label="红色波段 (R)">
                    <el-select v-model="redBand" placeholder="请选择红色波段文件">
                        <el-option v-for="item in tiffFiles" :key="item.id" :label="item.fileName" :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="绿色波段 (G)">
                    <el-select v-model="greenBand" placeholder="请选择绿色波段文件">
                        <el-option v-for="item in tiffFiles" :key="item.id" :label="item.fileName" :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="蓝色波段 (B)">
                    <el-select v-model="blueBand" placeholder="请选择蓝色波段文件">
                        <el-option v-for="item in tiffFiles" :key="item.id" :label="item.fileName" :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="拉伸方式">
                    <el-radio-group v-model="stretchMode">
                        <el-radio label="SIMPLE">简单拉伸</el-radio>
                        <el-radio label="LINEAR">线性拉伸</el-radio>
                    </el-radio-group>
                </el-form-item>

                <el-form-item>
                    <el-button type="primary" @click="generateComposite" :loading="loading">生成彩色合成图</el-button>
                </el-form-item>
            </el-form>
        </div>

        <div class="instruction-container">
            <el-alert
                title="彩色合成说明"
                type="info"
                description="选择三个波段后点击生成按钮，合成结果将自动上传到服务器。完成后可在文件列表中查看。"
                show-icon
                :closable="false">
            </el-alert>
        </div>
    </div>
</template>

<script>
import { list } from '@/api/geo-file';
import { combineRGB } from '@/api/operation';

export default {
    name: 'ColorCompositeView',
    data() {
        return {
            tiffFiles: [],
            redBand: '',
            greenBand: '',
            blueBand: '',
            stretchMode: 'SIMPLE',
            loading: false
        };
    },
    created() {
        this.fetchTiffFiles();
    },
    methods: {
        async fetchTiffFiles() {
            try {
                const { data } = await list({
                    fileName: '',
                    fileType: 'TIFF'
                });
                // 筛选出 TIFF 文件
                this.tiffFiles = data.data
            } catch (error) {
                this.$message.error('获取文件列表失败');
                console.error(error);
            }
        },
        async generateComposite() {
            if (!this.redBand || !this.greenBand || !this.blueBand) {
                this.$message.warning('请选择所有三个波段');
                return;
            }

            this.loading = true;
            try {
                await combineRGB(this.redBand, this.greenBand, this.blueBand, this.stretchMode);
                this.$message.success('彩色合成成功，请在文件列表中查看');
                // 重置选择
                this.redBand = '';
                this.greenBand = '';
                this.blueBand = '';
            } catch (error) {
                this.$message.error('彩色合成失败');
                console.error(error);
            } finally {
                this.loading = false;
            }
        }
    }
};
</script>

<style scoped>
.color-composite-container {
    padding: 20px;
    height: 100%;
    display: flex;
    flex-direction: column;
}

.band-selection {
    margin-bottom: 20px;
    background-color: #fff;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.instruction-container {
    flex: 1;
    margin-top: 20px;
}
</style>