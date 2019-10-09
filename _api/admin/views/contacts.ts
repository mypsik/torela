import Contact from '../../domain/Contact'
import {styles} from './styles'
import {menu} from './menu'
import {e, html} from './utils'

export function contactsView(contacts: Array<Contact>) {
  return html('Contacts', `${styles}${menu}
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
            <td>${e(c.createdAt)}</td>
            <td><div class="shorten">${e(c.userAgent)}</div></td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  `)
}