import * as nodemailer from 'nodemailer'
import config from "./config"

const mailTransport = nodemailer.createTransport({
  host: config.smtpHost,
  port: 25
})

export class Mailer {
  sendContact(contact) {
    this.send({
      from: `"Torela" <${config.adminEmail}>`,
      to: config.adminEmail,
      subject: `Uus kontakt veebilehelt`,
      text: `${contact.email}<br><br>` + JSON.stringify(contact)
    })
  }

  sendBooking(booking) {
    this.send({
      from: `"Torela" <${config.adminEmail}>`,
      to: booking.email,
      bcc: config.adminEmail,
      subject: `Mängutuba broneeritud ${booking.date} ${booking.time} - ${booking.until}`,
      text: `
      Täname! Broneering on tehtud ja ootab ettemaksu.
      
      Lapse nimi: ${booking.childName}
      Lapse vanus: ${booking.childAge}
      Lapsevanem: ${booking.parentName}
      Keel: ${booking.lang}
      Telefon: ${booking.phone}
      Email: ${booking.email}
      Lisainfo: ${booking.comments}
      
      Palun kandke broneerimistasu Torela kontole.
      Rohkem infot: https://torela.ee/hinnakiri/
      
      ` + JSON.stringify(booking)
    })
  }

  private send(mail) {
    mailTransport.sendMail(mail, (error, info) => {
      if (error) console.error(error)
    })
  }
}

export default new Mailer()
