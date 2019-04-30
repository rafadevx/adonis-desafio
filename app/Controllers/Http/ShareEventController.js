'use strict'

const Kue = use('Kue')
const Job = use('App/Jobs/NewShareMail')
const Event = use('App/Models/Event')

class ShareEventController {
  async store ({ params, request, auth }) {
    const { email } = request.only(['email'])
    const event = await Event.findOrFail(params.id)
    const { user } = auth

    Kue.dispatch(Job.key, { email, user, event }, { attempts: 3 })
  }
}

module.exports = ShareEventController
