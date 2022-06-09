export default class Session {
  static #sessionIdKey = 'sessionId'
  static #rememberMeTokenKey = 'rememberMe'

  static #storage = window.localStorage

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
}