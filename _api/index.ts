import * as express from 'express'
import * as morgan from 'morgan'
import {MongoClient} from 'mongodb'
import * as nodemailer from 'nodemailer'
import config from './config'

const app = express()
app.use(express.json())

const logger = morgan('[:date] :method :url :status :res[content-length] - :response-time ms')
app.use(logger)

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', config.allowedCorsHost);
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

const mailTransport = nodemailer.createTransport({
  host: config.smtpHost,
  port: 25
});

const mongoClient = new MongoClient(`mongodb://${config.mongoHost}:27017`, {auth: {user: 'torela', password: 't0relas3cret'}})
mongoClient.connect().then(() => {
  const db = mongoClient.db('torela')

  app.get('/', (req, res) => res.redirect('https://torela.ee/'))

  app.get('/api/bookings', (req, res) => {
    return db.collection('bookings').find().toArray().then(bookings => res.json(bookings))
  })

  app.post('/api/bookings', (req, res) => {
    const booking = req.body
    return db.collection('bookings').insertOne(booking).then(result => {
      let mail = {
        from: `"Torela" <${config.adminEmail}>`,
        to: booking.email,
        bcc: config.adminEmail,
        subject: `Mängutuba broneeritud ${booking.date} ${booking.time} - ${booking.until}`,
        text: `
        Täname! Broneering on tehtud ja ootab ettemaksu.
        
        Lapse nimi: ${booking.childName}
        Lapse vanus: ${booking.childAge}
        Lapsevanem: ${booking.parentName}
        Keel: ${booking.lang}
        Telefon: ${booking.phone}
        Email: ${booking.email}
        Lisainfo: ${booking.comments}
        
        Palun kandke broneerimistasu Torela kontole.
        Rohkem infot: https://torela.ee/hinnakiri/
        
        ` + JSON.stringify(booking)
      };
      mailTransport.sendMail(mail, (error, info) => {
        if (error) console.error(error);
      });

      res.send(result.insertedId);
    })
  })

  app.post('/api/contacts', (req, res) => {
    return db.collection('contacts').insertOne(req.body).then(result => res.send(result.insertedId))
  })

  app.use(express.static('../_site'))

  app.listen(config.port, () => console.log(`Listening on port ${config.port}`))
})
