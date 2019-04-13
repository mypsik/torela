import {Router} from 'express'
import * as basicAuth from 'express-basic-auth'
import {Db} from "mongodb";
import config from './config'

export default function admin(db: Db): Router {
  const admin = Router()

  admin.use(basicAuth({
    users: {'torela': config.password},
    challenge: true,
    realm: 'Torela'
  }))

  admin.get('/contacts', (req, res) => {
    db.collection('contacts').find().toArray().then(result => res.json(result))
  })

  admin.get('/bookings', (req, res) => {
    db.collection('bookings').find().toArray().then(result => res.json(result))
  })

  return admin
}
