import * as express from 'express'
import * as morgan from 'morgan'
import {MongoClient} from 'mongodb'
import config from './config'
import admin from './admin/admin'
import ical from './ical'
import mailer from './mailer'
import BookingService from './domain/BookingService'
import ContactService from './domain/ContactService'
import Booking from './domain/Booking'
import Contact from './domain/Contact'

require('express-async-errors');

const app = express()
app.use(express.json())
app.use(express.urlencoded({extended: true}))

const logger = morgan('[:date] :remote-addr :method :url :status :res[content-length] :referrer - :response-time ms')
app.use(logger)

app.use((req, res, next) => {
  if (req.header('Origin')) {
    res.header('Access-Control-Allow-Origin', config.allowedCorsHost)
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
  }
  next()
})

const mongoClient = new MongoClient(`mongodb://${config.mongoHost}:27017`, {auth: {user: 'torela', password: config.password}, useNewUrlParser: true})
mongoClient.connect().then(() => {
  const db = mongoClient.db('torela')
  const bookingService = new BookingService(db)
  const contactService = new ContactService(db)

  app.get('/', (req, res) => res.redirect('https://torela.ee/'))

  app.get('/api/bookings', async (req, res) => {
    const bookings = await bookingService.bookings(req.params.from || new Date().toISOString().replace(/T.*/, ''))
    return res.json(bookings.map(b => bookingService.toPublicMultiple(b)))
  })

  app.get('/api/bookings/:id', async (req, res) => {
    return res.json(bookingService.toPublicSingle(await bookingService.booking(req.params.id)))
  })

  app.post('/api/bookings', async (req, res) => {
    const booking = getData(req) as Booking
    const result = await bookingService.save(booking)
    mailer.sendBooking(booking)
    res.send(result.insertedId)
  })

  app.post('/api/contacts', async (req, res) => {
    const contact = getData(req) as Contact
    const result = await contactService.save(contact)
    mailer.sendContact(contact)
    res.send(result.insertedId)
  })

  app.get('/api/error/:type', async (req, res) => {
    res.send('OK')
  })

  function getData(req) {
    const data = req.body
    data.createdAt = new Date().toISOString()
    data.userAgent = req.header('User-Agent')
    return data
  }

  app.use('/admin', admin(db))
  app.use('/ical', ical(db))

  app.use(express.static('../_site'))

  app.listen(config.port, () => console.log(`Listening on port ${config.port}`))
})
