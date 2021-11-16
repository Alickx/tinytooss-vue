import http from "@/utils/request";

export const userLogout = () => {
  return http({
    url: "/user/logout",
    method: "get",
  });
};

export const userIsLogin = () => {
  return http({
    url: '/user/isLogin',
    method: 'get'
  });
}


export default {userLogout, userIsLogin};