import {Router} from 'express'
import * as basicAuth from 'express-basic-auth'
import {Db} from 'mongodb'
import config from '../config'
import BookingService from '../domain/BookingService'
import ContactService from '../domain/ContactService'
import {menu} from './views/menu'
import {contactsView} from './views/contacts'
import {bookingsView} from './views/bookings'
import {today} from './views/utils'

export default function admin(db: Db): Router {
  const admin = Router()
  const bookingService = new BookingService(db)
  const contactService = new ContactService(db)

  admin.use(basicAuth({
    users: {'torela': config.password},
    challenge: true,
    realm: 'Torela'
  }))

  admin.get('/', (req, res) => {
    res.send(menu)
  })

  admin.get('/contacts.json', async (req, res) => {
    res.json(await contactService.contacts())
  })

  admin.get('/contacts', async (req, res) => {
    res.send(contactsView(await contactService.contacts()))
  })

  admin.get('/bookings.json', async (req, res) => {
    const from = req.query.from || today()
    res.json(await bookingService.bookings(from))
  })

  admin.get('/bookings', async (req, res) => {
    const from = req.query.from || today()
    res.send(bookingsView(await bookingService.bookings(from), from))
  })

  admin.post('/bookings/:id/payment', async (req, res) => {
    await bookingService.addPayment(req.params.id, parseFloat(req.body.amount))
    res.redirect(req.header('referer'))
  })

  admin.post('/bookings/:id/comments', async (req, res) => {
    await bookingService.setComments(req.params.id, req.body.text)
    res.redirect(req.header('referer'))
  })

  admin.post('/bookings/:id/public', async (req, res) => {
    await bookingService.makePublic(req.params.id, req.body.public === 'true')
    res.redirect(req.header('referer'))
  })

  admin.post('/bookings/:id/delete', async (req, res) => {
    await bookingService.delete(req.params.id)
    res.redirect(req.header('referer'))
  })

  return admin
}
