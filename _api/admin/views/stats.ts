import {styles} from './styles'
import {menu} from './menu'
import {html, today} from './utils'
import {Stats} from '../../domain/BookingService'

const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const weekdayNames = ['E', 'T', 'K', 'N', 'R', 'L', 'P']

export function statsView(stats: Stats, from: string, until?: string) {
  return html('Statistika', `${styles}${menu}
    <form onchange="this.submit()">
      <h1>
        Statistika alates 
        <input type="date" name="from" value="${from}">
        <label>
          <input type="checkbox" name="until" value="${today()}" ${until >= today() ? 'checked' : ''}>
          Ainult juba toimunud
        </label>
      </h1>
    </form>
    <table>
      <tbody>
        <tr>
          <th>Kokku sündmusi (public)</th>
          <td>${stats.totalEvents}</td>
        </tr>
        <tr>
          <th>Kokku broneeringuid (private)</th>
          <td>${stats.totalBookings}</td>
        </tr>
        <tr>
          <th>Keeled</th>
          ${bars(stats.langs)}
        </tr>
        <tr>
          <th>Lisateenuseid broneeringu kohta</th>
          <td>${Math.round(stats.totalServices / stats.totalBookings * 100) / 100}</td>
        </tr>
        <tr>
          <th>Lisateenused</th>
          ${bars(stats.services)}
        </tr>
        <tr>
          <th>Laste vanused</th>
          ${bars(stats.ages)}
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
          ${bars(stats.times)}
        </tr>
        <tr>
          <th>Brauserid</th>
          ${bars(stats.browsers)}
        </tr>
      </tbody>
    </table>
    <style>
      h1 label {
        font-size: 1rem;
      }
    
      th {
        width: 300px;
      }
    
      .bars {
        display: flex;
      }
      
      .bars .bar {
        min-width: 3em;
        max-width: 6em;
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
      }
      
      .bars .bar :not(.height) {
        z-index: 1;
        position: relative;
      }
    </style>
  `)
}

function bars(values, names?) {
  if (!names) {
    names = Object.keys(values).sort()
    values = names.map(n => values[n])
  }
  const max = values.reduce((r, m) => Math.max(r, m), 0)
  return `
  <td class="bars">
    ${values.map((v, i) => `
      <div class="bar">
        <div class="value">${v}</div>
        <div class="title">${wrap(names[i])}</div>
        <div class="height" style="height: ${v / max * 100}%"></div>
      </div>
    `).join('')}
  </td>
  `

  function wrap(name) {
    return name.replace ? name.replace(/([A-Z])/g, ' $1') : name
  }
}
