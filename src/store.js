/*
SPDX-FileCopyrightText: Maurice Bleuel <mandrakey@litir.de>
SPDX-License-Identifier: BSD-3-Clause
*/

import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    user: null,
    venues: [],
    categories: [],
    shoppers: [],
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

    shoppers (state, data) {
      state.shoppers = data
    },

    setPurchaseTimestamps (state, data) {
      state.purchaseTimestamps = data
    }
  }
})

export default store