import http from "@/utils/request";

export const ImageUpload = (data, onUploadProgress) => {
  return http({
    url: "/image/uploadImage",//接口
    method: "post",
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    data: data,
    onUploadProgress: onUploadProgress
  });
};

export default {ImageUpload};