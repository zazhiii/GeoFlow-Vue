import _axios from "@/utils/_axios";



const initTask = (identifier, totalSize, chunkSize, fileName) => {
    return _axios.post("/upload", {}, {
        params: {
            identifier,
            totalSize,
            chunkSize,
            fileName
        }
    });
}

const getPresignedObjectUrl = (identifier, partNumber) => {
    return _axios.get(`/upload/${identifier}/${partNumber}`)
}

const getTaskInfo = (identifier) => {
    return _axios.get(`/upload/${identifier}`)
}

const merge = (identifier) => {
    return _axios.post(`/upload/merge/${identifier}`)
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

 const uploadAvatar = (file) => {
  const formData = new FormData()
  formData.append('file', file)  // 'file' 要与后端接口参数名一致
  
  return _axios({
    url: '/user/uploadAvatar',  // 确保与后端接口一致
    method: 'post',
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data'  // 必须设置这个header
    }
  })
}

export{
    initTask,
    getPresignedObjectUrl,
    getTaskInfo,
    merge,
    uploadSlice,
    uploadAvatar
}

