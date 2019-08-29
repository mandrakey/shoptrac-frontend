import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    user: null,
    venues: [],
    categories: []
  },

  mutations: {
    venues (state, data) {
      // todo: Add validation logic
      state.venues = data
    },

    categories (state, data) {
      // todo: Add validation logic
      state.categories = data
    }
  }
})

export default store