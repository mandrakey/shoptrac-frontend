/*
SPDX-FileCopyrightText: Maurice Bleuel <mandrakey@litir.de>
SPDX-License-Identifier: BSD-3-Clause
*/

export default class Session {
  static #sessionIdKey = 'sessionId'
  static #rememberMeTokenKey = 'rememberMe'

  static #storage = window.localStorage
  static #user = null

  static getSessionId () {
    const sessionId = Session.#storage.getItem(Session.#sessionIdKey)
    return typeof sessionId === 'string' && sessionId !== '' ? sessionId : null
  }

  static setSessionId (sessionId) {
    if (sessionId === null) {
      Session.#storage.removeItem(Session.#sessionIdKey)
    } else if (typeof sessionId === 'string' && sessionId !== '') {
      Session.#storage.setItem(Session.#sessionIdKey, sessionId)
    } else {
      throw new Error('Session id must be a non-empty string or NULL.')
    }
  }

  static getRememberMeToken () {
    const token = Session.#storage.getItem(Session.#rememberMeTokenKey)
    return typeof token === 'string' && token !== '' ? token : null
  }

  static setRememberMeToken (token) {
    if (token === null) {
      Session.#storage.removeItem(Session.#rememberMeTokenKey)
    } else if (typeof token === 'string' && token !== '') {
      Session.#storage.setItem(Session.#rememberMeTokenKey, token)
    } else {
      throw new Error('Remember me token must be a non-empty string or NULL.')
    }
  }

  static isLoggedIn () {
    return Session.getSessionId() !== null
  }

  static getUser () {
    return Session.#user
  }

  static setUser (user) {
    if (user === null) {
      Session.#user = null
      return
    }
    
    if (typeof user !== 'object' 
        || typeof user._key !== 'string'
        || typeof user.username !== 'string'
        || typeof user.email !== 'string'
        || typeof user.name !== 'string'
        || typeof user.level !== 'number') {
      throw new Error("Invalid user object")
    }
    Session.#user = user
  }
}