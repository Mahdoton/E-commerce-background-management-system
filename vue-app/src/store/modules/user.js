const user = {
  state: sessionStorage.getItem('state') ? JSON.parse(sessionStorage.getItem('state')) : {
    user: {
      username: "",
    }
  },

  // 监听state对象值的最新状态（计算属性）
  getters: {
    getUser(state) {
      return state.user;
    }
  },

  // 唯一一个可以修改state值的方法（同步执行，阻塞）
  mutations: {
    updateUser(state, user) {
      state.user = user;
    }
  },

  // 异步执行mutations方法
  actions: {
    asyncUpdateUser(context, user) {
      context.commit("updateUser", user)
    }
  }
}

export default user;