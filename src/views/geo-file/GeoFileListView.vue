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
                    width="300">
                </el-table-column>
                <el-table-column
                    prop="fileType"
                    label="文件类型"
                    width="150">
                </el-table-column>
                <el-table-column
                    :formatter="(row) => (row.fileSize / 1024 / 1024).toFixed(2) + ' MB'"
                    label="文件大小"
                    width="150">
                </el-table-column>
                <el-table-column
                    prop="createTime"
                    label="上传时间"
                    width="200">
                </el-table-column>
                <el-table-column
                    label="操作"
                    width="200">
                    <template slot-scope="scope">
                        <el-button size="mini" type="primary" @click="jump(`preview/${scope.row.id}`)">预览</el-button>
                        <el-button size="mini" type="danger" @click.native.prevent="deleteGeoFile(scope.row.id)">删除</el-button>
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
import { getGeoFileList } from '@/api/geo-file'
import { deleteGeoFile } from '@/api/geo-file'

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
                const { data } = await getGeoFileList(this.queryParams)
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
