import * as nodemailer from 'nodemailer'
import config from "./config"

const mailTransport = nodemailer.createTransport({
  host: config.smtpHost,
  port: 25
})

export class Mailer {
  sendContact(contact) {
    this.send({
      from: `Torela <${config.adminEmail}>`,
      to: config.adminEmail,
      subject: `Uus kontakt veebilehelt`,
      text: `${contact.email}\n\n` + JSON.stringify(contact)
    })
  }

  sendBooking(booking) {
    this.send({
      from: `Torela <${config.adminEmail}>`,
      to: booking.email,
      bcc: config.adminEmail,
      subject: `Mängutuba broneeritud ${booking.date} ${booking.time} - ${booking.until}`,
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
      Lisateenused: ${Object.keys(booking).filter(k => k != 'terms' && booking[k] == 'on')}
      
      Broneerimistasu 40€ tuleb tasuda 3 päeva jooksul. Kui ülekanne ei ole tähtaegselt laekunud, siis broneering tühistatakse.
      
      Ülekande andmed:
      Torela OÜ
      IBAN: EE477700771003581431 (LHV)
      Makse selgitusse palume märkida ürituse kuupäev, kellaaeg ja lapse nimi.
      
      Ülejäänud summa saab tasuda ülekandega enne ürituse toimumist või sularahas kohapeal.
      Arved edastame ka e-posti teel.
      Rohkem infot: https://torela.ee/hinnakiri/
    
      Täiendavate küsimuste korral võtke julgesti ühendust!
      
      Toredat pidu!

      Mirjam ja Sirli
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
