export default class Category {
  constructor () {
    this.key = -1
    this.name = ''
  }

  static fromObject (o) {
    // Check necessary data
    var problems = []
    if (typeof o.key !== 'number' || o.key < 0) {
      problems.push('key')
    }
    if (typeof o.name !== 'string' || o.name === '') {
      problems.push('name')
    }

    if (problems.length > 0) {
      throw `cannot construct Category from information with problems:\n\n- ${problems.join("\n- ")}`
    }

    // Copy possible values
    var res = new Category()
    Object.keys(res).forEach(k => {
      if (typeof o[k] !== 'undefined') {
        res[k] = o[k]
      }
    })

    return res
  }
}