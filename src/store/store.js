import { createStore } from "vuex";

export default createStore({
  state(){
    return{
      isLogin: localStorage.getItem('isLogin') || false,
      tokenName: localStorage.getItem('tokenName') || null,
      tokenValue: localStorage.getItem('tokenValue') || null
    }
  },
  mutations:{

    setTokenName(state,data){
      state.tokenName = data;
      window.localStorage.setItem('tokenName',data);
    },

    setTokenValue (state,data) {
      state.tokenValue = data;
      window.localStorage.setItem('tokenValue',data);
    },

    setIsLogin (state,data) {
     state.isLogin = data;
      window.localStorage.setItem('isLogin',data);
    },

    logOut (state) {
      state.isLogin = false;
      state.tokenValue = null;
      state.tokenName = null;
      window.localStorage.removeItem('isLogin')
      window.localStorage.removeItem('tokenName');
      window.localStorage.removeItem('tokenValue');

    }

  },
  getters:{
    getIsLogin(state) {
      return state.isLogin
    },

    getTokenName(state) {
      return state.tokenName
    },

    getTokenValue(state) {
      return state.tokenValue;
    }
  }

})