import {Router} from 'express'
import * as basicAuth from 'express-basic-auth'
import {Db} from 'mongodb'
import config from '../config'
import BookingService from '../domain/BookingService'
import ContactService from '../domain/ContactService'
import {menu} from './views/menu'
import {contactsView} from './views/contacts'
import {bookingsView} from './views/bookings'
import {html, today} from './views/utils'
import {statsView} from './views/stats'
import {styles} from './views/styles'

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
    res.send(html('Admin', styles + menu))
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
    const cancelled = req.query.cancelled === 'true'
    res.send(bookingsView(await bookingService.bookings(from, cancelled), from, cancelled))
  })

  admin.post('/bookings/:id', async (req, res) => {
    const fields = req.body
    if (fields.cancelBooking) {
      await bookingService.cancel(req.params.id, fields.cancelBooking)
    }
    if (fields.deleteBooking === 'true') {
      await bookingService.delete(req.params.id)
    }
    else if (fields.paymentAmount) {
      await bookingService.addPayment(req.params.id, parseFloat(req.body.paymentAmount))
    }
    else {
      delete fields._id;
      if (typeof fields.publicEvent === 'string') fields.publicEvent = fields.publicEvent === 'true'
      await bookingService.update(req.params.id, fields)
    }
    res.redirect(req.header('referer'))
  })

  admin.get('/stats.json', async (req, res) => {
    const from = req.query.from || undefined
    const until = req.query.until || undefined
    res.json(await bookingService.stats(from, until))
  })

  admin.get('/stats', async (req, res) => {
    const from = req.query.from || '2019-01-01'
    const until = req.query.until || undefined
    res.send(statsView(await bookingService.stats(from, until), from, until))
  })

  return admin
}
