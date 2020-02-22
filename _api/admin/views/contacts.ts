import Contact from '../../domain/Contact'
import {styles} from './styles'
import {menu} from './menu'
import {d, e, html, iso2eu} from './utils'

export function contactsView(contacts: Array<Contact>) {
  return html('Kontaktid', `${styles}${menu}
    <h1>Kontaktid</h1>
    <table>
      <thead>
        <th>Email</th>
        <th>Keel</th>
        <th>Broneeritud</th>
        <th>Brauser</th>
      </thead>
      <tbody>
        ${contacts.map(c => `
          <tr>
            <td><a href="mailto:${e(c.email)}">${e(c.email)}</a></td>
            <td>${e(c.lang)}</td>
            <td>${iso2eu(d(c.createdAt))}</td>
            <td><div class="shorten">${e(c.userAgent)}</div></td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  `)
}