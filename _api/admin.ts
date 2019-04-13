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

  const style = `<style>
    th, td { text-align: left; vertical-align: top; padding: 5px; }
  </style>`

  const menu = `<p><a href="contacts">Contacts</a> | <a href="bookings">Booking</a></p>`

  admin.get('/', (req, res) => {
    res.send(menu)
  })

  admin.get('/contacts.json', (req, res) => {
    db.collection('contacts').find().toArray().then(result => res.json(result))
  })

  admin.get('/contacts', (req, res) => {
    db.collection('contacts').find().sort({date: 1, time: 1}).toArray().then(result => res.send(`${style}${menu}
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
              <td><a href="mailto:${e(c.email)}">${e(c.email)}</a></td>
              <td>${e(c.lang)}</td>
              <td>${e(c.createdAt)}</td>
              <td>${e(c.userAgent)}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `))
  })

  admin.get('/bookings.json', (req, res) => {
    db.collection('bookings').find().toArray().then(result => res.json(result))
  })

  admin.get('/bookings', (req, res) => {
    db.collection('bookings').find().toArray().then(result => res.send(`${style}${menu}
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
            <th>Lisatud</th>
            <th>Brauser</th>
          </tr>
        </thead>
        <tbody>
          ${result.map(b => `
            <tr>
              <td>${b.date}</td>
              <td>${b.time}</td>
              <td>${b.lang}</td>
              <td>${e(b.childName)}</td>
              <td>${e(b.childAge)}</td>
              <td>${e(b.parentName)}</td>
              <td><a href="mailto:${e(b.email)}">${e(b.email)}</a></td>
              <td><a href="tel:${e(b.phone)}">${e(b.phone)}</a></td>
              <td>${e(b.comments)}</td>
              <td>${Object.keys(b).filter(k => k != 'terms' && b[k] == 'on').map(k => `<div>${e(k)}</div>`).join('')}</td>
              <td>${e(b.createdAt)}</td>
              <td>${e(b.userAgent)}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `))
  })

  function e(s: string) {
    if (!s) return '';
    return s.replace('<', '&lt;').replace('\'', '&apos;').replace('"', '&quot;');
  }

  return admin
}
