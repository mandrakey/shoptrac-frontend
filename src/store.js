import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    user: null,
    venues: [],
    categories: [],
    purchaseTimestamps: []
  },

  mutations: {
    venues (state, data) {
      // todo: Add validation logic
      state.venues = data
    },

    categories (state, data) {
      // todo: Add validation logic
      state.categories = data
    },

    setPurchaseTimestamps (state, data) {
      state.purchaseTimestamps = data
    }
  }
})

export default store