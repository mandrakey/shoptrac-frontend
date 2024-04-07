/*
SPDX-FileCopyrightText: Maurice Bleuel <mandrakey@litir.de>
SPDX-License-Identifier: BSD-3-Clause
*/

import Console from '@/utils/Console'

import purchasesList from './data/purchasesList'
import venuesList from './data/venues'
import categoriesList from './data/categories'
import shoppersList from './data/shoppers'
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

  static getPurchases () {
    return this.fetch(
      { status: 200, data: purchasesList.map(e => Purchase.fromObject(e)) },
      1000
    )
  }

  static getPurchasesUnfiltered () {
    return this.fetch(
      { status: 200, data: statistics },
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
    const d = new Date()
    const year = d.getFullYear()
    const month = d.getMonth() + 1

    const res = []

    // Add the past 6 months
    for (let i = 6; i > 0; --i) {
      let m = month - i
      
      let y = year
      if (m < 1) {
        y -= 1
        m = 12 + m
      }
      res.push({ month: m, year: y })
    }

    // Add the next 6 months
    for (let i = 0; i < 7; ++i) {
      let m = month + i

      let y = year
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

  static postLogin (username, password, rememberMe = false) {
    Console.debug(`postLogin('${username}', '${password}', ${rememberMe})`)

    return this.fetch({
      status: 200,
      data: {
        uuid: 'session1',
        remember_me_token: 'token1'
      }
    }, 600)
  }

  static getLogout () {
    Console.debug('getLogout()')

    return this.fetch({
      status: 201
    }, 100)
  }

  static getProfile () {
    Console.debug('getProfile()')

    return this.fetch({
      status: 200,
      data: {
        _key: 'user1',
        username: 'jdoe',
        email: 'jdoe@my.dau.fun',
        name: 'John Doe',
        level: 99
      }
    }, 200)
  }

  static patchProfile (data = null) {
    if (typeof data !== 'object' || data === null) {
      throw new Error('Profile update data must be an object.')
    }

    Console.log(`patchProfile('${JSON.stringify(data)}')`)
    return this.fetch({
      status: 204
    }, 500)
  }

  static postProfileUpdatePassword (currentPassword, newPassword, confirmation) {
    Console.debug(`postProfileUpdatePassword('${currentPassword}', '${newPassword}', '${confirmation}')`)

    return this.fetch({
      status: 204
    }, 1100)
  }

  static getUsers () {
    Console.debug('getUsers()')

    return this.fetch({
      status: 200,
      data: [
        { _key: 'user1', username: 'jdoe', name: 'John Doe', email: 'jdoe@my.dau.fun', level: 99 },
        { _key: 'user2', username: 'bleuel', name: 'Maurice Bleuel', email: 'mbleuel@my.dau.fun', level: 0 }
      ]
    }, 400)
  }

  static putUsers (user, password, confirmation) {
    Console.debug(`putUser('${JSON.stringify(user)}', '${password}', '${confirmation}')`)

    user._key = Api.randomString(5)
    return this.fetch({
      status: 200,
      data: user
    }, 1200)
  }

  static patchUsers (user, newPassword = null, confirmation = null) {
    Console.debug(`patchUser('${JSON.stringify(user)}', '${newPassword}', '${confirmation}')`)

    const time = newPassword !== null ? 1200 : 800

    return this.fetch({
      status: 204
    }, time)
  }

  static deleteUsers (key) {
    Console.debug(`deleteUser('${key}')`)

    return this.fetch({
      status: 204
    }, 500)
  }

  static getShoppers() {
    Console.debug('getShoppers()')

    return this.fetch({
      status: 200,
      data: shoppersList
    }, 600)
  }

  static putShoppers(shopper) {
    Console.debug(`putShoppers('${JSON.stringify(shopper)}')`)

    shopper._key = Api.randomString()
    return this.fetch({
      status: 200,
      data: shopper
    }, 400)
  }

  static patchShoppers(shopper) {
    Console.debug(`patchShoppers('${JSON.stringify(shopper)}')`)

    return this.fetch({
      status: 204
    }, 700)
  }

  static deleteShoppers(shopper) {
    Console.debug(`deleteShoppers('${JSON.stringify(shopper)}')`)

    return this.fetch({
      status: 204
    }, 500)
  }

  static randomString(length = 5) {
    const chars = 'abcdefghijklmnopqrstuvwxyz01234567890'
    let res = ''
    for (let i = 0; i < length; ++i) {
      const r = parseInt(Math.random() * 100) % chars.length
      res += chars[r]
    }
    return res
  }
}