'use strict'

const Mail = use('Mail')

class NewShareMail {
  // If this getter isn't provided, it will default to 1.
  // Increase this number to increase processing concurrency.
  static get concurrency () {
    return 1
  }

  // This is required. This is a unique key used to identify this job.
  static get key () {
    return 'NewShareMail-job'
  }

  // This is where the work is done.
  async handle ({ email, user, event }) {
    console.log('NewShareMail-job started')
    await Mail.send(
      ['emails.share_event'],
      { event, username: user.username },
      message => {
        message
          .to(email)
          .from(user.email, user.username)
          .subject('Compromisso agendado')
      }
    )
  }
}

module.exports = NewShareMail
