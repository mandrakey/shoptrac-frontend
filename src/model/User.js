export default class User {
  constructor() {
    this._key = ''
    this.username = ''
    this.name = ''
    this.email = ''
    this.level = 0
  }

  static fromObject(o) {
    if (typeof o['_key'] !== 'string') {
      throw new Error('_key missing.')
    }
    if (typeof o['username'] !== 'string') {
      throw new Error('username missing.')
    }
    if (typeof o['name'] !== 'string') {
      throw new Error('name missing.')
    }
    if (typeof o['email'] !== 'string') {
      throw new Error('email missing.')
    }
    if (typeof o['level'] !== 'number') {
      throw new Error('level missing or not a number.')
    }

    const u = new User()
    u._key = o._key
    u.username = o.username
    u.name = o.name
    u.email = o.email
    u.level = o.level
    return u
  }

  static copyOf(o) {
    if (typeof o !== 'object' || !(o instanceof User)) {
      throw new Error('Need valid user object to copy.')
    }

    const u = new User()
    u._key = o._key
    u.username = o.username
    u.name = o.name
    u.email = o.email
    u.level = o.level
    return u
  }
}