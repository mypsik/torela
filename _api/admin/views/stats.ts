import {styles} from './styles'
import {menu} from './menu'
import {d, e, html, iso2eu} from './utils'
import {Stats} from '../../domain/BookingService'

const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const weekdayNames = ['E', 'T', 'K', 'N', 'R', 'L', 'P']

export function statsView(stats: Stats, from: string) {
  return html('Statistika', `${styles}${menu}
    <form onchange="this.submit()">
      <h1>Statistika alates <input type="date" name="from" value="${from}"></h1>
    </form>
    <table>
      <tbody>
        <tr>
          <th width="300">Kokku sündmusi</th>
          <td>${stats.totalEvents}</td>
        </tr>
        <tr>
          <th>Kokku broneeringuid</th>
          <td>${stats.totalBookings}</td>
        </tr>
        <tr>
          <th>Keeled</th>
          ${bars(Object.values(stats.langs), Object.keys(stats.langs))}
        </tr>
        <tr>
          <th>Lisateenuseid broneeringu kohta</th>
          <td>${Math.round(stats.totalServices / stats.totalBookings * 100) / 100}</td>
        </tr>
        <tr>
          <th>Lisateenused</th>
          ${bars(Object.values(stats.services), Object.keys(stats.services))}
        </tr>
        <tr>
          <th>Broneeringuid kuus</th>
          ${bars(stats.months, monthNames)}
        </tr>
        <tr>
          <th>Broneeringuid nädalapäevas</th>
          ${bars(stats.weekdays, weekdayNames)}
        </tr>
        <tr>
          <th>Broneeringute ajad</th>
          ${bars(Object.values(stats.times), Object.keys(stats.times))}
        </tr>
        <tr>
          <th>Brauserid</th>
          ${bars(Object.values(stats.browsers), Object.keys(stats.browsers))}
        </tr>
      </tbody>
    </table>
    <style>
      .bars {
        display: flex;
      }
      
      .bars .bar {
        min-width: 3em;
        margin-right: 0.5em;
        text-align: center;
        position: relative;
      }
      
      .bars .bar .height {
        background-color: greenyellow;
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        z-index: -1;        
      }
    </style>
  `)
}

function bars(values, names) {
  const max = values.reduce((r, m) => Math.max(r, m), 0)
  return `
  <td class="bars">
    ${values.map((v, i) => `
      <div class="bar">
        <div class="height" style="height: ${v / max * 100}%"></div>
        <div class="value">${v}</div>
        <div class="title">${names[i]}</div>
      </div>
    `).join('')}
  </td>
  `
}