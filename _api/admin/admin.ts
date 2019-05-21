import {Router} from 'express'
import * as basicAuth from 'express-basic-auth'
import {Db} from 'mongodb'
import config from '../config'
import BookingService from '../domain/BookingService'
import ContactService from '../domain/ContactService'
import {styles} from './views/styles'
import {menu} from './views/menu'
import {contactsView} from './views/contacts'
import {e} from './views/utils'

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
    res.send(menu)
  })

  admin.get('/contacts.json', (req, res) => {
    contactService.contacts().then(result => res.json(result))
  })

  admin.get('/contacts', (req, res) => {
    return contactService.contacts().then(result => res.send(contactsView(result)))
  })

  admin.get('/bookings.json', (req, res) => {
    bookingService.bookings().then(result => res.json(result))
  })

  admin.get('/bookings', (req, res) => {
    const from = req.query.from || new Date().toISOString().replace(/T.*/, '')
    bookingService.bookings(from).then(result => res.send(`${styles}${menu}
      <form onchange="this.submit()">
        <h1>Broneeringud alates <input type="date" name="from" value="${from}"></h1>
      </form>
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
            <th>Makstud</th>
            <th></th>
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
              <td>
                ${e(b.comments)}
                <div><strong>${e(b.adminComments)}</strong></div>
                <form action="/admin/bookings/${b._id}/comments" method="post">
                  <button name="text" onclick="this.value = prompt('Kommentaar', '${b.adminComments || ''}'); return !!this.value">+i</button>
                </form>
              </td>
              <td>${Object.keys(b).filter(k => k != 'terms' && b[k] == 'on').map(k => `<div>${e(k)}</div>`).join('')}</td>
              <td title="${e(b.userAgent)}">${new Date(b.createdAt).toDateString()}</td>
              <td>
                ${(b.payments || []).map(p => `<div>${p.amount}€ @ ${p.dateTime.toDateString()}</div>`).join('')}
                ${b.payments && b.payments.length > 1 ? `<div><strong>Kokku: ${b.payments.reduce((s, p) => s + p.amount, 0)}€</strong></div>` : ''}
                <form action="/admin/bookings/${b._id}/payment" method="post">               
                  <button name="amount" onclick="this.value = prompt('Summa', '${config.bookingFee.amount}'); return !!parseFloat(this.value)">+€</button>
                </form>            
              </td>
              <td>
                <form action="/admin/bookings/${b._id}/delete" method="post" onsubmit="return confirm('Kustutada broneering lapsele ${e(b.childName)}?')">
                  <button>❌</button>
                </form>
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `))
  })

  admin.post('/bookings/:id/payment', async (req, res) => {
    await bookingService.addPayment(req.params.id, parseFloat(req.body.amount))
    res.redirect('/admin/bookings')
  })

  admin.post('/bookings/:id/comments', async (req, res) => {
    await bookingService.setComments(req.params.id, req.body.text)
    res.redirect('/admin/bookings')
  })

  admin.post('/bookings/:id/delete', async (req, res) => {
    await bookingService.delete(req.params.id)
    res.redirect('/admin/bookings')
  })

  return admin
}
