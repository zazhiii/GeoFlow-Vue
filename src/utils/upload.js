import axios from 'axios';

// 初始化上传任务
const initTask = (identifier, totalSize, chunkSize, fileName) => {
  return axios.post("/upload", {}, {
    params: {
      identifier,
      totalSize,
      chunkSize,
      fileName
    }
  });
};

// 获取预签名 URL
const getPresignedObjectUrl = (identifier, partNumber) => {
  return axios.get(`/upload/${identifier}/${partNumber}`);
};

// 获取任务信息
const getTaskInfo = (identifier) => {
  return axios.get(`/upload/${identifier}`);
};

// 合并分片
const merge = (identifier) => {
  return axios.post(`/upload/merge/${identifier}`);
};

// 上传分片
const uploadSlice = (slice, url) => {
  return axios.request({
    url,
    method: "PUT",
    data: slice,
    headers: {
      "Content-Type": "application/octet-stream"
    }
  });
};

export {
  initTask,
  getPresignedObjectUrl,
  getTaskInfo,
  merge,
  uploadSlice
};