import * as nodemailer from 'nodemailer'
import config from "./config"
import Contact from './domain/Contact'
import Booking from './domain/Booking'
import {additionalServices} from './admin/views/bookings'
import {iso2eu} from './admin/views/utils'

const mailTransport = nodemailer.createTransport({
  host: config.smtpHost,
  port: 25
})

export class Mailer {
  sendContact(contact: Contact) {
    this.send({
      from: `Torela <${config.fromEmail}>`,
      to: config.adminEmail,
      subject: `Uus kontakt veebilehelt`,
      text: `${contact.email}\n\n` + JSON.stringify(contact)
    })
  }

  sendBooking(booking: Booking) {
    this.send({
      from: `Torela <${config.fromEmail}>`,
      to: booking.email,
      bcc: config.adminEmail,
      subject: `Mängutuba broneeritud ${iso2eu(booking.date)} ${booking.time} - ${booking.until}`,
      text: `
      Aitäh, et broneerisite Torela mängutoa!
      
      Broneeringu ülevaade:
      
      Lapse nimi: ${booking.childName}
      Lapse vanus: ${booking.childAge}
      Lapsevanem: ${booking.parentName}
      Keel: ${booking.lang}
      Telefon: ${booking.phone}
      Email: ${booking.email}
      Lisainfo: ${booking.comments}
      Lisateenused: ${additionalServices(booking).join(', ')}
      
      Broneerimistasu ${config.bookingFee.amount}€ tuleb tasuda ${config.bookingFee.days} päeva jooksul. 
      Kui ülekanne ei ole tähtaegselt laekunud, siis broneering tühistatakse.
      
      Ülekande andmed:
      Torela OÜ
      IBAN: EE477700771003581431 (LHV)
      Makse selgitusse palume märkida ürituse kuupäev, kellaaeg ja lapse nimi.
      
      Ülejäänud summa saab tasuda ülekandega enne ürituse toimumist või sularahas kohapeal.
      Rohkem infot: https://torela.ee/hinnakiri/
      
      Siin on ettevalmistatud kutse sõpradele saatmiseks:
      https://torela.ee/kutse/#${booking._id.toString()}
      (Saab jagada lingina, printida või salvestada PDFiks).
    
      Täiendavate küsimuste korral võtke julgesti ühendust!
      
      Toredat pidu!

      Mirjam & Sirli

      e-post: tore@torela.ee
      tel: 5695 5722 / 5908 1914
      koduleht: https://torela.ee/
      facebook: https://www.facebook.com/Torelamangutuba/
      instagram: @torelamangutuba      
      `
    })
  }

  private send(mail) {
    mailTransport.sendMail(mail, (error, info) => {
      if (error) console.error(error)
    })
  }
}

export default new Mailer()
