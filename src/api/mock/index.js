import store from '@/store'
import Console from '@/utils/Console'

import purchasesList from './data/purchasesList'
import venuesList from './data/venues'
import categoriesList from './data/categories'
import statistics from './data/statistics'

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

  static getPurchases () {
    return this.fetch(
      { status: 200, data: purchasesList.map(e => Purchase.fromObject(e)) },
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

  static getPurchaseTimestamps () {
    var d = new Date()
    var year = d.getFullYear()
    var month = d.getMonth() + 1

    var res = []

    // Add the past 6 months
    for (var i = 6; i > 0; --i) {
      var m = month - i
      
      var y = year
      if (m < 1) {
        y -= 1
        m = 12 + m
      }
      res.push({ month: m, year: y })
    }

    // Add the next 6 months
    for (i = 0; i < 7; ++i) {
      m = month + i

      y = year
      if (m > 12) {
        y += 1
        m = m - 12
      }
      res.push({ month: m, year: y })
    }

    return this.fetch({ status: 200, data: res })
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
    category._key = '99'
    return this.fetch({ status: 200, data: { category: category } }, 800)
  }

  static getYears () {
    return this.fetch({
      status: 200,
      data: [ 2018, 2019 ]
    }, 300)
  }

  static getOverviewStatistics (month, year) {
    Console.debug(`getOverviewStatistics(${month}, ${year})`)
    return this.fetch({
      status: 200,
      data: {
        lastMonth: { count: 12, sum: '245.45' },
        currentMonth: { count: 2, sum: '12.45' },
        allTime: { count: 14, sum: '257.90' }
      }
    }, 600)
  }

  static getStatisticsOverallDevelopment (month, year, type) {
    Console.debug(`getStatisticsOverallDevelopment(${month}, ${year}, '${type}')`)

    if (year === '' && month === '') {
      return this.fetch({
        status: 200,
        data: statistics.overall.development[type]['']
      }, 400)
    }
  }
}