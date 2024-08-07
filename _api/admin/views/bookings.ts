import Booking from '../../domain/Booking'
import {styles} from './styles'
import {menu} from './menu'
import {d, dow, e, html, iso2eu} from './utils'
import config from '../../config'

export function bookingsView(bookings: Array<Booking>, from: string, cancelled?: boolean) {
  return html('Bookings', `${styles}${menu}
    <script>var validTimes = ['10:00', '14:00', '18:00']</script>
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
          <th>Vastutaja</th>
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
              <div style="white-space: nowrap">${iso2eu(b.date)} ${dow(b.date)}</div>
              <button title="Muuda kuupäev" name="date" value="${e(b.date)}" onclick="this.value = prompt('Uus kuupäev, yyyy-mm-dd', this.value) || ''; return !!this.value.match(/^\\d{4}-\\d{2}-\\d{2}$/) || !!alert('Vale kuupäeva formaat')" style="left: 0">@</button>
              <button title="${b.publicEvent ? 'Tee tavaliseks broneeringuks' : 'Tee sündmuseks'}" name="publicEvent" value="${!b.publicEvent}">S</button>
              <button title="Lisa sündmuse link (nt Facebook)" name="externalUrl" value="${e(b.externalUrl)}" onclick="this.value = prompt('URL', this.value) || ''; return !!this.value">L</button>
            </td>
            <td width="50">
              ${b.time} ${b.correctedTime ? '<b>(' + b.correctedTime + ')</b>' : ''}
              <button title="Muuda aeg" name="time" value="${e(b.time)}" onclick="this.value = prompt('Uus aeg, ' + validTimes.join(', '), this.value) || ''; return validTimes.includes(this.value) || !!alert('Vale aeg')" style="left: 0">@</button>
              <button title="Korrigeeri aeg (+/-)" name="correctedTime" value="${e(b.correctedTime || b.time)}" onclick="this.value = prompt('Korrigeeritud aeg', this.value) || ''; return !!this.value" style="right: 0">✎</button>
            </td>
            <td width="20">${b.lang}</td>
            <td>
              ${e(b.responsible)}
              <button class="edit" name="responsible" value="${e(b.responsible)}" onclick="this.value = prompt('Vastutaja nimi', this.value) || ''; return !!this.value">✎</button>
            </td>
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
