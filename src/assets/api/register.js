import http from "@/utils/request";

export const userRegister = data => {
  return http({
    url: "/user/register",//接口
    method: "post",
    data: data
  });
};


export default {userRegister};

