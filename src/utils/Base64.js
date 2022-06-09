export default class Base64 {

  static encodeUnicode (text) {
    if (typeof text !== 'string') {
      throw new Error('Can only encode strings.')
    }

    const units = new Uint16Array(text.length)
    for (let i = 0; i < units.length; ++i) {
      units[i] = text.charCodeAt(i)
    }
    const codes = new Uint8Array(units.buffer)
    
    let res = ''
    for (const c of codes) {
      res += String.fromCharCode(c)
    }

    return btoa(res)
  }

  static encode (text) {
    return btoa(text)
  }

  static decodeUnicode (b64) {
    if (typeof b64 !== 'string') {
      throw new Error('Can only decode strings.')
    }

    const decoded = atob(b64)
    const bytes = new Uint8Array(decoded.length)
    for (let i = 0; i < decoded.length; ++i) {
      bytes[i] = decoded.charCodeAt(i)
    }
    const codes = new Uint16Array(bytes.buffer)

    let res = ''
    for (const c of codes) {
      res += String.fromCharCode(c)
    }

    return res
  }

  static decode (b64) {
    return atob(b64)
  }

}