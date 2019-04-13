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

  admin.get('/contacts.json', (req, res) => {
    db.collection('contacts').find().toArray().then(result => res.json(result))
  })

  admin.get('/contacts', (req, res) => {
    db.collection('contacts').find().toArray().then(result => res.send(`
      <h1>Contacts</h1>
      <table>
        <thead>
          <th>Email</th>
          <th>Keel</th>
          <th>Lisatud</th>
          <th>Brauser</th>
        </thead>
        <tbody>
          ${result.map(c => `
            <tr>
              <td>${c.email}</td>
              <td>${c.lang}</td>
              <td>${c.createdAt}</td>
              <td>${c.userAgent}</td>
            </tr>
          `).join()}
        </tbody>
      </table>
    `))
  })

  admin.get('/bookings.json', (req, res) => {
    db.collection('bookings').find().toArray().then(result => res.json(result))
  })

  admin.get('/bookings', (req, res) => {
    db.collection('bookings').find().toArray().then(result => res.send(`
      <h1>Bookings</h1>
      <table>
        <thead>
          <tr>
            <th>Päev</th>
            <th>Aeg</th>
            <th>Keel</th>
            <th>Lapsenimi</th>
            <th>Vanus</th>
            <th>Lapsevanem</th>
            <th>Email</th>
            <th>Telefon</th>
            <th>Lisainfo</th>
            <th>Lisateenused</th>
            <th>Brauser</th>
          </tr>
        </thead>
        <tbody>
          ${result.map(b => `
            <tr>
              <td>${b.date}</td>
              <td>${b.time}</td>
              <td>${b.lang}</td>
              <td>${b.childName}</td>
              <td>${b.childAge}</td>
              <td>${b.parentName}</td>
              <td><a href="mailto:${b.email}">${b.email}</a></td>
              <td><a href="tel:${b.phone}">${b.phone}</a></td>
              <td>${b.comments}</td>
              <td>${Object.keys(b).filter(k => k != 'terms' && b[k] == 'on').map(k => `<div>${k}</div>`).join()}</td>
              <td>${b.userAgent}</td>
            </tr>
          `).join()}
        </tbody>
      </table>
    `))
  })

  return admin
}
