import {Router} from 'express'
import {Db} from 'mongodb'
import config from './config'
import BookingService from "./domain/BookingService";

export default function ical(db: Db): Router {
  const ical = Router()
  const bookingService = new BookingService(db)

  ical.get('/' + config.password + '.ics', (req, res) => {
    res.contentType('text/calendar')
    res.header('Content-Disposition', 'attachment; filename="torela.ics"')
    return bookingService.bookings().then(result => res.send(
`BEGIN:VCALENDAR
PRODID:-//Anton//Torela//EN
VERSION:2.0
CALSCALE:GREGORIAN
METHOD:PUBLISH
NAME:Torela
TIMEZONE:Europe/Tallinn
X-WR-CALNAME:Torela
X-WR-TIMEZONE:Europe/Tallinn
${result.map(b =>
`BEGIN:VEVENT
UID:${b._id}@torela.ee
DTSTAMP:${ts(new Date())}
CREATED:${ts(b.createdAt)}
ORGANIZER;CN="${b.parentName}":MAILTO:${b.email}
DTSTART:${ts(b.date + ' ' + b.time)}
DTEND:${ts(b.date + ' ' + b.until)}
SUMMARY:"${b.childName}/${b.childAge}"
DESCRIPTION:"${b.parentName}"
END:VEVENT
`).join('')}`.replace(/\n/g, '\r\n')))
  })

  function ts(dateTime: string|Date) {
    if (!dateTime) dateTime = new Date()
    return new Date(dateTime).toISOString().replace(/[-:]/g, '').replace(/.\d{3}Z/, 'Z')
  }

  return ical
}
