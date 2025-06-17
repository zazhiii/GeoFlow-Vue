<template>
    <div class="geo-file-list">
        <el-card>
            <div class="filter-container">
                <el-input
                    v-model="queryParams.fileName"
                    placeholder="文件名"
                    style="width: 200px;"
                    class="filter-item"
                    @keyup.enter.native="handleFilter"
                />
                <el-select v-model="queryParams.fileType" placeholder="文件类型" clearable style="width: 130px" class="filter-item">
                    <el-option label="tiff" value="TIFF"/>
                </el-select>
                <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
                    搜索
                </el-button>
            </div>

            <el-table
                :data="fileList"
                style="width: 100%"
                v-loading="loading">
                <el-table-column
                    prop="fileName"
                    label="文件名"
                    width="400">
                </el-table-column>
                <el-table-column
                    prop="fileType"
                    label="文件类型"
                    width="100">
                </el-table-column>
                <el-table-column
                    :formatter="(row) => (row.fileSize / 1024 / 1024).toFixed(2) + ' MB'"
                    label="文件大小"
                    width="100">
                </el-table-column>
                <el-table-column
                    :formatter="(row) => new Date(row.createTime).toLocaleString()"
                    label="上传时间"
                    width="180">
                </el-table-column>
                <el-table-column
                    label="操作"
                    width="350">
                    <template slot-scope="scope">
                        <template v-if="scope.row.status === 1">
                            <el-button size="mini" type="primary" @click="jump(`metadata/${scope.row.id}`)">元数据</el-button>
                            <el-button size="mini" type="success" @click="downloadFile(scope.row.fileName)">下载</el-button>
                            <el-button size="mini" type="primary" @click="jump(`preview/${scope.row.id}`)">预览</el-button>
                            <el-button size="mini" type="danger" @click.native.prevent="deleteGeoFile(scope.row.id)">删除</el-button>
                        </template>
                        <template v-else>
                            <span>{{ getFileStatus(scope.row.status) }}</span>
                        </template>
                    </template>
                </el-table-column>
            </el-table>

            <div class="pagination-container">
                <el-pagination
                    background
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="queryParams.pageNum"
                    :page-sizes="[10, 20, 30, 50]"
                    :page-size="queryParams.pageSize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="total">
                </el-pagination>
            </div>
        </el-card>
    </div>
</template>

<script>
import { page } from '@/api/geo-file'
import { deleteGeoFile } from '@/api/geo-file'
import { downloadGeoFile } from '@/api/geo-file'


export default {
    name: 'GeoFileListView',
    data() {
        return {
            loading: false,
            fileList: [],
            total: 0,
            queryParams: {
                pageNum: 1,
                pageSize: 10,
                fileName: '',
                fileType: ''
            }
        }
    },
    created() {
        this.getList()
    },
    methods: {
        getFileStatus(code){
            switch(code){
                case 0:
                    return '上传中'
                case 1:
                    return '上传完成'
                case 2:
                    return '上传失败'
                default:
                    return '未知状态'
            }
        },
        async deleteGeoFile(id){
            try{
                await deleteGeoFile(id)
                this.$message.success("删除成功")
                this.getList()
            }catch{
                this.$message.error("删除文件失败")
            }
        },
        async getList() {
            this.loading = true
            try {
                const { data } = await page(this.queryParams)
                this.fileList = data.data.records
                this.total = data.data.total
            } catch (error) {
                this.$message.error('获取文件列表失败')
            }
            this.loading = false
        },
        handleFilter() {
            this.queryParams.pageNum = 1
            this.getList()
        },
        handleSizeChange(val) {
            this.queryParams.pageSize = val
            this.getList()
        },
        handleCurrentChange(val) {
            this.queryParams.pageNum = val
            this.getList()
        },
        jump(path){
            this.$router.push(path)
        },
        async downloadFile(fileName) {
        try {
            const response = await downloadGeoFile(fileName)
            const blob = new Blob([response.data])
            const link = document.createElement('a')
            link.href = URL.createObjectURL(blob)
            link.download = fileName
            link.click()
            URL.revokeObjectURL(link.href)
        } catch (error) {
            this.$message.error("文件下载失败")
        }
    }
    }
}
</script>

<style scoped>
.geo-file-list {
    padding: 20px;
}
.filter-container {
    margin-bottom: 20px;
}
.filter-item {
    margin-right: 10px;
}
.pagination-container {
    margin-top: 20px;
    text-align: right;
}
</style>
