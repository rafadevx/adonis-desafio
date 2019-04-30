'use strict'

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')

Route.post('users', 'UserController.store').validator('User')
Route.put('users', 'UserController.update').validator('AlterUser')
Route.post('sessions', 'SessionController.store')

Route.group(() => {
  Route.resource('events', 'EventController').apiOnly().validator(new Map([
    [['events.store'], ['Event']]
  ]))
  Route.post('share/:id', 'ShareEventController.store')
}).middleware(['auth'])
