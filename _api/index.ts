import * as express from 'express'
import * as morgan from 'morgan'
import {MongoClient} from 'mongodb'
import config from './config'

const app = express()
app.use(express.json())
const logger = morgan('[:date] :method :url :status :res[content-length] - :response-time ms')
app.use(logger)

const mongoClient = new MongoClient('mongodb://172.22.0.2:27017', {auth: {user: 'torela', password: 't0relas3cret'}})
mongoClient.connect().then(() => {
  const db = mongoClient.db('torela')

  app.get('/api/bookings', (req, res) => {
    db.collection('bookings').find().toArray().then(bookings => res.json(bookings))
  })

  app.post('/api/bookings', (req, res) => {
    return db.collection('bookings').insertOne(req.body).then(result => res.send(result.insertedId))
  })

  app.use(express.static('../_site'))

  app.listen(config.port, () => console.log(`Listening on port ${config.port}`))
})
