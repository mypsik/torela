import Booking from '../../domain/Booking'
import {styles} from './styles'
import {menu} from './menu'
import {e} from './utils'
import config from '../../config'

export function bookingsView(bookings: Array<Booking>, from: string) {
  return `${styles}${menu}
    <form onchange="this.submit()">
      <h1>Broneeringud alates <input type="date" name="from" value="${from}"></h1>
    </form>
    <table>
      <thead>
        <tr>
          <th>Päev</th>
          <th>Aeg</th>
          <th>Keel</th>
          <th>Nimi</th>
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
        ${bookings.map(b => `
          <tr class="${b.publicEvent ? 'public' : ''}">
            <td>${b.date}</td>
            <td>
              ${b.time}
              <form action="/admin/bookings/${b._id}/public" method="post">
                <button title="Make public" name="public" value="${!b.publicEvent}">P</button>
              </form>
            </td>
            <td>${b.lang}</td>
            <td>
              ${e(b.childName)}
              <form action="/admin/bookings/${b._id}" method="post">
                <button name="childName" onclick="this.value = prompt('Lapse/Sündmuse nimi', '${b.childName || ''}'); return !!this.value">✎</button>
              </form>              
            </td>
            <td>${e(b.childAge)}</td>
            <td>${e(b.parentName)}</td>
            <td><a href="mailto:${e(b.email)}">${e(b.email)}</a></td>
            <td><a href="tel:${e(b.phone)}">${e(b.phone)}</a></td>
            <td>
              ${e(b.comments)}
              <div><strong>${e(b.adminComments)}</strong></div>
              <form action="/admin/bookings/${b._id}" method="post">
                <button name="adminComments" onclick="this.value = prompt('Kommentaar', '${b.adminComments || ''}'); return !!this.value">+i</button>
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
  `
}