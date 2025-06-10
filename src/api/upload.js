import _axios from "@/utils/_axios";



const initTask = (identifier, totalSize, chunkSize, fileName) => {
    return _axios.post("http://47.109.197.221:8080/api/upload", {}, {
        params: {
            identifier,
            totalSize,
            chunkSize,
            fileName
        }
    });
}

const getPresignedObjectUrl = (identifier, partNumber) => {
    return _axios.get(`http://47.109.197.221:8080/api/upload/${identifier}/${partNumber}`)
}

const getTaskInfo = (identifier) => {
    return _axios.get(`http://47.109.197.221:8080/api/upload/${identifier}`)
}

const merge = (identifier) => {
    return _axios.post(`http://47.109.197.221:8080/api/upload/merge/${identifier}`)
}

const uploadSlice = (slice, url) => {
    return _axios.request({
        url,
        method: "PUT",
        data: slice,
        headers: {
            "Content-Type": "application/octet-stream"
        }
    })
}

export{
    initTask,
    getPresignedObjectUrl,
    getTaskInfo,
    merge,
    uploadSlice
}