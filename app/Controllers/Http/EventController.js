'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const Event = use('App/Models/Event')
const moment = require('moment')

/**
 * Resourceful controller for interacting with events
 */
class EventController {
  /**
   * Show a list of all events.
   * GET events
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async index ({ request, response, auth }) {
    const { date } = request.only(['date'])
    console.log(date)
    const events = await Event.query().where('user_id', auth.user.id).andWhere('date', date).fetch()

    return events
  }

  /**
   * Create/save a new event.
   * POST events
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store ({ request, response, auth }) {
    const data = request.only([
      'title',
      'localization',
      'date',
      'time'
    ])
    const existsEvent = await Event.query().where({ user_id: auth.user.id, date: data.date, time: data.time }).first()

    if (existsEvent) {
      return response.status(400).send({ error: { message: 'Já existe compromisse nessa data/horário' } })
    }
    const event = await Event.create({ ...data, user_id: auth.user.id })

    return event
  }

  /**
   * Display a single event.
   * GET events/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show ({ params, request, response, auth }) {
    const event = await Event.query().where({ id: params.id, user_id: auth.user.id }).first()

    await event.load('user')

    return event
  }

  /**
   * Update event details.
   * PUT or PATCH events/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update ({ params, request, response, auth }) {
    const data = request.only([
      'title',
      'localization',
      'date',
      'time'
    ])
    const event = await Event.query().where({ id: params.id, user_id: auth.user.id }).first()
    const eventPassed = moment().isAfter(event.date)
    if (eventPassed) {
      return response.status(400).send({ error: { message: 'Esse evento já aconteceu, não pode ser alterado' } })
    }
    event.merge(data)
    await event.save()
    return event
  }

  /**
   * Delete a event with id.
   * DELETE events/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy ({ params, response, auth }) {
    const event = await Event.query().where({ id: params.id, user_id: auth.user.id }).first()
    const eventPassed = moment().isAfter(event.date)
    if (eventPassed) {
      return response.status(400).send({ error: { message: 'Esse evento já aconteceu, não pode ser deletado' } })
    }
    await event.delete()
  }
}

module.exports = EventController
