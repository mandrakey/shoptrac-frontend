import axios from 'axios'

const API_BASE = process.env.VUE_APP_API_URL

export default class Api {
  static execute (options) {
    return new Promise((resolve, reject) => {
      axios(options)
        .then(resp => {
          if (typeof resp.status !== 'number') {
            reject(`response statis is not a number`)
            return
          }

          resolve(resp)
        })
        .catch(err => reject(err))
    })
  }

  static getPurchases (month, year) {
    return this.execute({
      method: 'get',
      url: `${API_BASE}/purchases/${year}/${month}`
    })
  }

  static deletePurchase (purchase) {
    return this.execute({
      method: 'delete',
      url: `${API_BASE}/purchases/${purchase._key}`
    })
  }

  static updatePurchase (purchase) {
    return this.execute({
      method: 'post',
      url: `${API_BASE}/purchases/${purchase._key}`,
      data: purchase
    })
  }

  static addPurchase (purchase) {
    return this.execute({
      method: 'put',
      url: `${API_BASE}/purchases`,
      data: purchase
    })
  }

  static getVenues () {
    return this.execute({
      method: 'get',
      url: `${API_BASE}/venues/`
    })
  }

  static addVenue (venue) {
    return this.execute({
      method: 'put',
      url: `${API_BASE}/venues/`,
      data: venue
    })
  }

  static deleteVenue (venue) {
    return this.execute({
      method: 'delete',
      url: `${API_BASE}/venues/${venue._key}`
    })
  }

  static updateVenue (venue) {
    return this.execute({
      method: 'post',
      url: `${API_BASE}/venues/${venue._key}`,
      data: venue
    })
  }

  static getCategories () {
    return this.execute({
      method: 'get',
      url: `${API_BASE}/categories/`
    })
  }

  static addCategory (category) {
    return this.execute({
      method: 'put',
      url: `${API_BASE}/categories/`,
      data: category
    })
  }

  static deleteCategory (category) {
    return this.execute({
      method: 'delete',
      url: `${API_BASE}/categories/${category._key}`
    })
  }

  static updateCategory (category) {
    return this.execute({
      method: 'post',
      url: `${API_BASE}/categories/${category._key}`,
      data: category
    })
  }
}