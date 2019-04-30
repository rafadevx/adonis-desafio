'use strict'

const Antl = use('Antl')

class AlterUser {
  get validateAll () {
    return true
  }

  get rules () {
    return {
      username: 'required',
      email: 'required|email',
      password: 'required|confirmed',
      oldPassword: 'required'
    }
  }

  get messages () {
    return Antl.list('validation')
  }
}

module.exports = AlterUser
