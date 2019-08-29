export default class Purchase {
  constructor () {
    this.key = ''
    this.category = -1
    this.venue = -1
    this.date = ''
    this.month = -1
    this.year = -1
    this.sum = 0.0
  }

  static fromObject (o) {
    // Check necessary data
    var problems = []
    if (typeof o.key !== 'string' || o.key === '') {
      problems.push('key')
    }
    if (typeof o.category !== 'number' || o.category < 0) {
      problems.push('category')
    }
    if (typeof o.venue !== 'number' || o.venue < 0) {
      problems.push('venue')
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
    if (typeof o.sum !== 'number' || o.sum < 0) {
      problems.push('sum')
    }

    if (problems.length > 0) {
      throw `cannot construct Purchase from information with problems:\n\n- ${problems.join("\n- ")}`
    }
    
    // Copy possible values
    var res = new Purchase()
    Object.keys(res).forEach(k => {
      if (typeof o[k] !== 'undefined') {
        res[k] = o[k]
      }
    })

    return res
  }
}