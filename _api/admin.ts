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
    res.json(db.collection('contacts').find().toArray())
  })

  admin.get('/bookings', (req, res) => {
    res.json(db.collection('bookings').find().toArray())
  })

  return admin
}
