import {Router} from 'express'
import {Db} from 'mongodb'
import config from './config'

export default function ical(db: Db): Router {
  const ical = Router()

  ical.get('/' + config.password, (req, res) => {
    res.contentType('text/calendar; charset=UTF-8')
    return db.collection('bookings').find().toArray().then(result => res.send(
`BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//hacksw/handcal//NONSGML v1.0//EN    
${result.map(b =>
`BEGIN:VEVENT
UID:${b._id}@torela.ee
DTSTAMP:${ts(b.createdAt)}
ORGANIZER:CN=${b.parentName};MAILTO:${b.email}
DTSTART:${ts(b.date + ' ' + b.time)}
DTEND:${ts(b.date + ' ' + b.until)}
SUMMARY:${b.childName}/${b.childAge}
DESCRIPTION:${b.parentName} ${b.phone} ${Object.keys(b).filter(k => k != 'terms' && b[k] == 'on').join(', ')}${b.comments ? ' - ' + b.comments : ''}
END:VEVENT
`).join('')}`))
  })

  function ts(dateTime: string) {
    if (!dateTime) return ''
    return new Date(dateTime).toISOString().replace(/[-:]/g, '').replace('.000Z', 'Z')
  }

  return ical
}
