import store from '@/store'

import purchasesList from './data/purchasesList'
import venuesList from './data/venues'
import categoriesList from './data/categories'

import Purchase from '@/model/Purchase'

export default class Api {
  static fetch (data, delay = 0, errormessage = '') {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (errormessage !== '') {
          reject(errormessage)
        } else {
          resolve(data)
        }
      }, delay)
    })
  }

  static performLogout (vm) {
    store.commit('user', null)
    vm.$router.push('/')
  }

  static getPurchases (month, year) {
    var key = `${year}-${month}`
    if (typeof purchasesList[key] !== 'object') {
      return this.fetch({ status: 404, data: { message: `no purchases for month ${key}` } }, 1000)
    }

    return this.fetch(
      { status: 200, data: purchasesList[key].map(e => Purchase.fromObject(e)) },
      1000
    )
  }

  static deletePurchase () {
    return this.fetch({ status: 200, data: null }, 800)
  }

  static updatePurchase () {
    return this.fetch({ status: 200, data: null }, 800)
  }

  static addPurchase (purchase) {
    purchase._key = `${new Date().getTime()}`
    return this.fetch({ status: 200, data: purchase }, 800)
  }

  static getVenues () {
    return this.fetch({ status: 200, data: venuesList })
  }

  static deleteVenue () {
    return this.fetch({ status: 200, data: null }, 800)
  }

  static updateVenue () {
    return this.fetch({ status: 200, data: null }, 800)
  }

  static addVenue (venue) {
    venue._key = 99
    return this.fetch({ status: 200, data: { venue: venue } }, 800)
  }

  static getCategories () {
    return this.fetch({ status: 200, data: categoriesList })
  }

  static deleteCategory () {
    return this.fetch({ status: 200, data: null }, 800)
  }

  static updateCategory () {
    return this.fetch({ status: 200, data: null }, 800)
  }

  static addCategory (category) {
    category._key = 99
    return this.fetch({ status: 200, data: { category: category } }, 800)
  }
}