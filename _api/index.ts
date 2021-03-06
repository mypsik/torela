import * as express from 'express'
import * as morgan from 'morgan'
import {MongoClient} from 'mongodb'
import config from './config'
import admin from './admin/admin'
import ical from './ical'
import mailer from './mailer'
import BookingService from './domain/BookingService'
import ContactService from './domain/ContactService'
import Booking, {Participation} from './domain/Booking'
import Contact from './domain/Contact'

require('express-async-errors')

const app = express()
app.use(express.json())
app.use(express.urlencoded({extended: true}))

morgan.token('remote-addr', req => req.headers['x-forwarded-for'] || req.connection.remoteAddress);
morgan.token('body', req => JSON.stringify(req.body));
const logger = morgan('[:date] :remote-addr :method :url :body :status :res[content-length] :referrer :user-agent - :response-time ms', {
  skip: req => req.path == '/api/bookings' && (req.connection.remoteAddress == ':ffff:127.0.0.1' || (req.header('User-Agent') || '').includes('UptimeRobot'))
})
app.use(logger)

app.use((req, res, next) => {
  if (req.header('Origin')) {
    res.header('Access-Control-Allow-Origin', config.allowedCorsHost)
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
  }
  next()
})

const mongoClient = new MongoClient(`mongodb://${config.mongoHost}:27017`, {
  auth: {user: 'torela', password: config.password},
  useNewUrlParser: true, useUnifiedTopology: true
})

mongoClient.on('close', () => {
  console.log('Mongo connection lost, exiting')
  process.exit(1)
})

console.log('Connecting to Mongo...')
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

  app.post('/api/bookings/:id', async (req, res) => {
    const participation = getData(req) as Participation
    await bookingService.addParticipation(req.params.id, participation)
    const event = await bookingService.booking(req.params.id)
    mailer.sendParticipation(event, participation)
    res.send(req.params.id)
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
