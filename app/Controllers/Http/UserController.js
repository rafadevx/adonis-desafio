'use strict'

const User = use('App/Models/User')

class UserController {
  async store ({ request }) {
    const data = request.only(['username', 'email', 'password'])

    const user = await User.create(data)

    return user
  }

  async update ({ request, response, auth }) {
    try {
      const { email, oldPassword, username, password } = request.all()

      await auth.attempt(email, oldPassword)

      const user = await User.findByOrFail('email', email)
      user.username = username
      user.password = password
      user.save()

      return user
    } catch (err) {
      return response.status(err.status).send({ error: { message: 'Algo não deu certo, esse email existe?' } })
    }
  }
}

module.exports = UserController
