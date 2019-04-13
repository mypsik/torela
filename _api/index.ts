import * as express from 'express'
import * as morgan from 'morgan'
import {MongoClient} from 'mongodb'
import config from './config'
import admin from './admin'
import mailer from './mailer'

const app = express()
app.use(express.json())

const logger = morgan('[:date] :method :url :status :res[content-length] - :response-time ms')
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

  app.get('/', (req, res) => res.redirect('https://torela.ee/'))

  app.get('/api/bookings', (req, res) => {
    return db.collection('bookings').find().toArray().then(bookings => res.json(bookings))
  })

  app.post('/api/bookings', (req, res) => {
    const booking = req.body
    return db.collection('bookings').insertOne(booking).then(result => {
      mailer.sendBooking(booking)
      res.send(result.insertedId)
    })
  })

  app.post('/api/contacts', (req, res) => {
    return db.collection('contacts').insertOne(req.body).then(result => res.send(result.insertedId))
  })

  app.use('/admin', admin(db))

  app.use(express.static('../_site'))

  app.listen(config.port, () => console.log(`Listening on port ${config.port}`))
})
