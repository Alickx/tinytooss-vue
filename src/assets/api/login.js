import http from "@/utils/request";

export const userLogin = (data) => {
  return http({
    url: "/user/login",//接口
    method: "post",
    data: data,
  });
};

export default {userLogin};