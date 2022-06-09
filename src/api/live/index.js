import axios from 'axios'

import Session from '@/utils/Session'
import Base64 from '@/utils/Base64'

const API_BASE = process.env.VUE_APP_API_URL

export default class Api {
  static execute (options) {
    options = Api.addAuthenticationTo(options)
    const hasAuthentication = typeof options.headers === 'object' 
        && typeof options.headers.Authentication === 'string' && options.headers.Authentication !== ''

    return new Promise((resolve, reject) => {
      axios(options) // first try
        .then(resp1 => resolve(resp1))
        .catch(err1 => {
          if (err1.response.status === 401 && hasAuthentication) {
            const token = Session.getRememberMeToken()
            if (token === null) {
              reject(err1)
              return
            }

            axios({ // try session continuance
              method: 'post',
              url: `${API_BASE}/auth/continue`,
              data: { token: token },
              headers: { Authentication: options.headers.Authentication }
            })
              .then(() => {
                axios(options) // try the original again
                  .then(resp3 => resolve(resp3))
                  .catch(err3 => reject(err3))
              })
              .catch(err2 => reject(err2))
          } else {
            reject(err1)
          }
        })
    })
  }

  static getPurchases (month, year) {
    return this.execute({
      method: 'get',
      url: `${API_BASE}/purchases/${year}/${month}`
    })
  }

  static getPurchasesUnfiltered () {
    return this.execute({
      method: 'get',
      url: `${API_BASE}/statistics/purchases_unfiltered`
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

  static getPurchaseTimestamps () {
    return this.execute({
      method: 'get',
      url: `${API_BASE}/purchases/timestamps`
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

  static getOverviewStatistics (month, year) {
    return this.execute({
      method: 'get',
      url: `${API_BASE}/statistics/overview/${year}/${month}`
    })
  }

  static postLogin (username, password, rememberMe = false) {
    const pwd = Base64.encode(password)
    return this.execute({
      method: 'post',
      url: `${API_BASE}/auth/login`,
      data: {
        username: username,
        password: pwd,
        remember_me: rememberMe
      }
    })
  }

  static getLogout () {
    return this.execute({
      method: 'get',
      url: `${API_BASE}/auth/logout`
    })
  }

  static addAuthenticationTo (options) {
    const sessionId = Session.getSessionId()
    if (sessionId === null) {
      return options
    }

    if (typeof options['headers'] !== 'object') {
      options['headers'] = {}
    }
    options['headers']['Authentication'] = sessionId
    return options
  }
}