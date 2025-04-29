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




