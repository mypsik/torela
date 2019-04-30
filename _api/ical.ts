import {Router} from 'express'
import {Db} from 'mongodb'
import config from './config'
import BookingService from "./domain/BookingService";

export default function ical(db: Db): Router {
  const ical = Router()
  const bookingService = new BookingService(db)

  ical.get('/' + config.password + '.ics', (req, res) => {
    res.contentType('text/calendar; charset=UTF-8')
    res.header('Content-Disposition', 'attachment; filename="torela.ics"')
    return bookingService.bookings().then(result => res.send(
`BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Torela//EN
NAME:Torela
TIMEZONE:Europe/Tallinn
X-WR-CALNAME:Torela
X-WR-TIMEZONE:Europe/Tallinn
${result.map(b =>
`BEGIN:VEVENT
UID:${b._id}@torela.ee
DTSTAMP:${ts(b.createdAt)}
ORGANIZER;CN="${b.parentName}":MAILTO:${b.email}
DTSTART:${ts(b.date + ' ' + b.time)}
DTEND:${ts(b.date + ' ' + b.until)}
SUMMARY:"${b.childName}/${b.childAge}"
DESCRIPTION:"${b.parentName} ${b.phone} ${Object.keys(b).filter(k => k != 'terms' && b[k] == 'on').join(', ')}${b.comments ? ' - ' + b.comments.replace(/\n/g, '\\n') : ''}"
END:VEVENT
`).join('')}`.replace(/\n/g, '\r\n')))
  })

  function ts(dateTime: string|Date) {
    if (!dateTime) dateTime = new Date()
    return new Date(dateTime).toISOString().replace(/[-:]/g, '').replace(/.\d{3}Z/, 'Z')
  }

  return ical
}
