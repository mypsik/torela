import * as nodemailer from 'nodemailer'
import config from "./config"
import Contact from './domain/Contact'
import Booking, {Participation} from './domain/Booking'
import {additionalServices} from './admin/views/bookings'
import {iso2eu} from './admin/views/utils'

const mailTransport = nodemailer.createTransport({
  host: config.smtpHost,
  port: 25
})

const paymentDetails = `Torela OÜ, LHV IBAN: EE477700771003581431`

export class Mailer {
  sendContact(contact: Contact) {
    this.send(config.adminEmail, {
      subject: `Uus kontakt veebilehelt`,
      text: `${contact.email}\n\n` + JSON.stringify(contact)
    })
  }

  sendBooking(booking: Booking) {
    this.send(booking.email,{
      subject: (booking.lang == 'en' ? `Playroom booked` : `Mängutuba broneeritud`) +
        ` ${iso2eu(booking.date)} ${booking.time} - ${booking.until}`,
      text: booking.lang == 'en' ? `
      Thanks for booking Torela playroom!
      
      Child/event name: ${booking.childName}
      Child age: ${booking.childAge}
      Parent: ${booking.parentName}
      Phone: ${booking.phone}
      Email: ${booking.email}
      Comments: ${booking.comments}
      Additional services: 
        ${additionalServices(booking).join(',\n  ')}
        
      Booking fee ${config.bookingFee.amount}€ has to be paid in ${config.bookingFee.days} days.
      If fee has not arrived, we would have to cancel the booking. 
      
      Please make a bank transfer to:
      ${paymentDetails}
      Specify event date, time and child's name as details.
      
      The outstanding amount has to be transferred either before the event takes place or in cash on arrival.

      Take a look at additional services that we offer: https://torela.ee/lisateenused/ 

      Here is an invitation link that you can share with your friends:
      https://torela.ee/kutse/#${booking._id.toString()}
      (You can send it as a link, print or save as PDF).
    
      Don't hesitate to ask questions if you need to!
      
      Have a great party!  
      
      ` : /* Estonian below */ `
      Aitäh, et broneerisite Torela mängutoa!
      
      Broneeringu ülevaade:
      
      Ürituse/Lapse nimi: ${booking.childName}
      Lapse vanus: ${booking.childAge}
      Lapsevanem: ${booking.parentName}
      Keel: ${booking.lang}
      Telefon: ${booking.phone}
      Email: ${booking.email}
      Lisainfo: ${booking.comments}
      Lisateenused: 
        ${additionalServices(booking).join(',\n  ')}
      
      Broneerimistasu ${config.bookingFee.amount}€ tuleb tasuda ${config.bookingFee.days} päeva jooksul. 
      Kui ülekanne ei ole tähtaegselt laekunud, siis broneering tühistatakse.
      
      Ülekande andmed:
      ${paymentDetails}
      Makse selgitusse palume märkida ürituse kuupäev, kellaaeg ja lapse nimi.
      
      Ülejäänud summa saab tasuda ülekandega enne ürituse toimumist või sularahas kohapeal.
      
      Meil on pakkuda ka väga palju vahvaid lisateenuseid: https://torela.ee/lisateenused/ 

      Siin on ettevalmistatud kutse sõpradele saatmiseks:
      https://torela.ee/kutse/#${booking._id.toString()}
      (Saab jagada lingina, printida või salvestada PDFiks).
    
      Täiendavate küsimuste korral võtke julgesti ühendust!
      
      Toredat pidu!      
      `
    })
  }

  sendParticipation(event: Booking, participation: Participation) {
    this.send(participation.email, {
      subject: `${event.childName} ${iso2eu(event.date)} ${event.time}`,
      text: `
      Aitäh, et registreerisite Torela sündmusele!
      
      Ülevaade:
      
      Ürituse nimi: ${event.childName}
      Lapse vanus: ${participation.childAge}
      Lapsevanem: ${participation.parentName}
      Keel: ${participation.lang}
      Telefon: ${participation.phone}
      Email: ${participation.email}
      Lisainfo: ${participation.comments}
      
      Osalustasu ${config.bookingFee.amount}€ saab tasuda kontole või tuua sularahas. 
      
      Ülekande andmed:
      ${paymentDetails}
      Makse selgitusse palume märkida ürituse kuupäev, kellaaeg ja lapse nimi.
      
      Täiendavate küsimuste korral võtke julgesti ühendust!
      `
    })
  }

  private footer() {
    return `
      Mirjam

      tore@torela.ee
      tel: 5695 5722
      https://torela.ee/
      facebook: https://www.facebook.com/Torelamangutuba/
      instagram: @torelamangutuba      
    `
  }

  private send(email, mail) {
    mailTransport.sendMail({
      from: `Torela <${config.fromEmail}>`,
      to: email,
      bcc: config.adminEmail,
      subject: mail.subject,
      text: (mail.text + this.footer()).replace(/^ {6}/gm, '')
    }, (error, info) => {
      if (error) console.error(error)
    })
  }
}

export default new Mailer()
