export default class Shopper {
  constructor() {
    this._key = ''
    this.name = ''
    this.image = ''
  }

  static fromObject(o) {
    const problems = []
    if (typeof o._key !== 'string' || o._key === '') {
      problems.push('key')
    }
    if (typeof o.name !== 'string' || o.name === '') {
      problems.push('name')
    }
    if (problems.length > 0) {
      throw new Error(`cannot construct Shopper from source with problematic fields:\n\n- ${problems.join("\n- ")}`)
    }

    const res = new Shopper()
    res._key = o._key
    res.name = o.name
    if (typeof o.image === 'string' && o.image !== '') {
      res.image = o.image
    }
    return res
  }
}
