import http from '@/utils/request'

export const ossUpdate = data => {
  return http({
    url: "/user/AliossUpdate",//接口
    method: "post",
    data: data
  });
};

export const getUserOssInfo = data => {

  return http({
    url: "/user/getOssInfo",
    method: 'get',
    data: data
  })

}


export default {ossUpdate};
