export default class Category {
  constructor () {
    this._key = ''
    this.name = ''
  }

  static fromObject (o) {
    // Check necessary data
    const problems = []
    if (typeof o._key !== 'string' || o._key === '') {
      problems.push('key')
    }
    if (typeof o.name !== 'string' || o.name === '') {
      problems.push('name')
    }

    if (problems.length > 0) {
      throw `cannot construct Category from information with problems:\n\n- ${problems.join("\n- ")}`
    }

    // Copy possible values
    const res = new Category()
    Object.keys(o).forEach(k => {
      if (typeof o[k] !== 'undefined') {
        res[k] = o[k]
      }
    })

    return res
  }
}