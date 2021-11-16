import http from "@/utils/request";

export const passwordChange = (data) => {
  return http({
    url: "/user/passwordChange",//接口
    method: "post",
    data: data,
  });
};

export default {passwordChange};