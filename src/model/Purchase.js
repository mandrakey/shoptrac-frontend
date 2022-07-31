export default class Purchase {
  constructor () {
    this._key = ''
    this.category = ''
    this.venue = ''
    this.shopper = ''
    this.date = ''
    this.month = -1
    this.year = -1
    this.sum = '0'
  }

  static fromObject (o) {
    // Check necessary data
    var problems = []
    if (typeof o._key !== 'string' || o._key === '') {
      problems.push('key')
    }
    if (typeof o.category !== 'string' || o.category === '') {
      problems.push('category')
    }
    if (typeof o.venue !== 'string' || o.venue === '') {
      problems.push('venue')
    }
    if (typeof o.shopper !== 'string' || o.shopper === '') {
      problems.push('shopper')
    }
    if (typeof o.date !== 'string' || o.datetime === '') {
      problems.push('date')
    }
    if (typeof o.month !== 'number' || o.month < 1) {
      problems.push('month')
    }
    if (typeof o.year !== 'number' || o.year < 0) {
      problems.push('year')
    }
    if (typeof o.sum !== 'string' || o.sum === '') {
      problems.push('sum')
    }

    if (problems.length > 0) {
      throw `cannot construct Purchase from information with problems:\n\n- ${problems.join("\n- ")}`
    }
    
    // Copy possible values
    var res = new Purchase()
    Object.keys(o).forEach(k => {
      if (typeof o[k] !== 'undefined') {
        res[k] = o[k]
      }
    })

    return res
  }
}