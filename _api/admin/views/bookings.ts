import Booking from '../../domain/Booking'
import {styles} from './styles'
import {menu} from './menu'
import {d, e, html, iso2eu} from './utils'
import config from '../../config'

export function bookingsView(bookings: Array<Booking>, from: string, cancelled?: boolean) {
  return html('Bookings', `${styles}${menu}
    <form onchange="this.submit()">
      <h1>
        Broneeringud alates 
        <input type="date" name="from" value="${from}">
        <label>
          <input type="checkbox" name="cancelled" value="true" ${cancelled ? 'checked' : ''}>
          Tühistatud
        </label>
      </h1>
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
          <th>${cancelled ? 'Tühistatud' : ''}</th>
        </tr>
      </thead>
      <tbody>
        ${bookings.map(b => `
        <form action="/admin/bookings/${b._id}" method="post">
          <tr class="${b.publicEvent ? 'public' : ''}">
            <td width="80">
              <div style="white-space: nowrap">${iso2eu(b.date)}</div>
              <button title="${b.publicEvent ? 'Tee tavaliseks broneeringuks' : 'Tee sündmuseks'}" name="publicEvent" value="${!b.publicEvent}">S</button>
              <button title="Lisa sündmuse link (nt Facebook)" name="externalUrl" value="${e(b.externalUrl)}" onclick="this.value = prompt('URL', this.value) || ''; return !!this.value">L</button>
            </td>
            <td width="50">
              ${b.time} ${b.correctedTime ? '<b>(' + b.correctedTime + ')</b>' : ''}
              <button title="Korrigeeri aega" name="correctedTime" value="${e(b.correctedTime || b.time)}" onclick="this.value = prompt('Korrigeeritud aeg', this.value) || ''; return !!this.value">✎</button>
            </td>
            <td width="20">${b.lang}</td>
            <td>
              ${e(b.childName)}
              <button class="edit" name="childName" value="${e(b.childName)}" onclick="this.value = prompt('Lapse/Sündmuse nimi', this.value) || ''; return !!this.value">✎</button>
            </td>
            <td>${e(b.childAge)}</td>
            <td>${e(b.parentName)}</td>
            <td><a href="mailto:${e(b.email)}">${e(b.email)}</a></td>
            <td><a href="tel:${e(b.phone)}">${e(b.phone)}</a></td>
            <td>
              ${e(b.comments)}
              <div><strong>${e(b.adminComments)}</strong></div>
              <button name="adminComments" value="${e(b.adminComments)}" onclick="this.value = prompt('Kommentaar', this.value) || ''; return !!this.value">+i</button>
            </td>
            <td>${additionalServices(b).map(k => `<div>${e(k)}</div>`).join('')}</td>
            <td title="${e(b.userAgent)}">${iso2eu(d(b.createdAt))}</td>
            <td>
              ${(b.payments || []).map(p => `<div>${p.amount}€ @ ${iso2eu(d(p.dateTime))}</div>`).join('')}
              ${b.payments && b.payments.length > 1 ? `<div><strong>Kokku: ${b.payments.reduce((s, p) => s + p.amount, 0)}€</strong></div>` : ''}
              <button name="paymentAmount" onclick="this.value = prompt('Summa', '${config.bookingFee.amount}') || ''; return !!parseFloat(this.value)">+€</button>
            </td>
            <td>
              ${cancelled ?
                `${iso2eu(b.cancelledAt)}: ${e(b.cancelReason)} <button name="deleteBooking" title="Kustutada" value="true" onclick="return confirm('Kustutada ${e(b.childName)}?')">❌</button>` :
                `<button name="cancelBooking" title="Tühistada" onclick="this.value = prompt('${e(b.childName)} tühistamise põhjus') || ''; return !!this.value">❌</button>`
              }
            </td>
          </tr>
        </form>
        `).join('')}
      </tbody>
    </table>
  `)
}

export function additionalServices(b: Booking): Array<string> {
  if (b.additionalServices) return b.additionalServices.map(s => `${s.description} ${s.count ? ' ' + s.count + '×' : ''}${s.price}€`)
  else return Object.keys(b).filter(k => k != 'terms' && b[k] == 'on') // backwards compatibility
}
