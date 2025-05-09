import _axios from "@/utils/_axios";


export function getGeoFileList(params) {
    return _axios({
        url: '/geo-file/list',
        method: 'get',
        params: {
            pageNum: params.pageNum || 1,
            pageSize: params.pageSize || 10,
            fileName: params.fileName,
            fileType: params.fileType
        }
    })
}

export function previewTiff(id) {
    return _axios.get(`/geo-file/preview/tiff/${id}`, {
        responseType: 'blob' // 非常重要，告诉 axios 返回二进制流
    })
}



