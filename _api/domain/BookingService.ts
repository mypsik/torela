import {Collection, Db, FilterQuery, ObjectId} from 'mongodb'
import Booking, {Participation} from './Booking'

export default class BookingService {
  data: Collection<Booking>
  deletedData: Collection<Booking>

  constructor(db: Db) {
    this.data = db.collection('bookings')
    this.deletedData = db.collection('bookingsDeleted')
  }

  bookings(from?: string, cancelled?: boolean): Promise<Array<Booking>> {
    const query = from ? {date: {$gte: from}} : {} as FilterQuery<Booking>
    query.cancelledAt = cancelled ? {$ne: null} : null
    return this.data.find(query).sort({date: 1, time: 1}).toArray()
  }

  booking(id: string): Promise<Booking | null> {
    return this.data.findOne({_id: new ObjectId(id)})
  }

  save(booking: Booking) {
    return this.data.insertOne(booking);
  }

  async cancel(id: string, cancelReason: string): Promise<any> {
    return this.update(id, {cancelledAt: new Date().toISOString(), cancelReason})
  }

  async delete(id: string): Promise<any> {
    const booking = await this.booking(id)
    await this.deletedData.insertOne(booking)
    return this.data.deleteOne({_id: new ObjectId(id)})
  }

  addPayment(id: string, amount: number): Promise<any> {
    return this.data.updateOne({_id: new ObjectId(id)}, {$push: {payments: {amount, dateTime: new Date()}}})
  }

  update(id: string, fields: Partial<Booking>): Promise<any> {
    return this.data.updateOne({_id: new ObjectId(id)}, {$set: fields})
  }

  addParticipation(id: string, participation: Participation) {
    return this.data.updateOne({_id: new ObjectId(id)}, {$push: {participations: participation}})
  }

  toPublicMultiple(b: Booking): Partial<Booking> {
    return {
      _id: b._id,
      date: b.date,
      time: b.time,
      correctedTime: b.correctedTime,
      until: b.until,
      childName: b.childName,
      publicEvent: b.publicEvent,
      externalUrl: b.externalUrl
    };
  }

  toPublicSingle(b: Booking): Partial<Booking> {
    return {...this.toPublicMultiple(b),
      parentName: b.parentName,
      email: b.email,
      phone: b.phone
    };
  }

  async stats(from?: string, until?: string): Promise<Stats> {
    const query = {date: {}}
    if (from) query.date['$gte'] = from
    if (until) query.date['$lte'] = until

    const stats = new Stats()

    await this.data.find(query).forEach((b: Booking) => {
      if (!b.publicEvent) {
        stats.totalBookings++
        if (b.additionalServices) {
          stats.totalServices += (b.additionalServices.length || 0)
          for (const s of b.additionalServices) {
            stats.services[s.name] = (stats.services[s.name] || 0) + 1
          }
        }

        const ua = b.userAgent || ''
        if (ua.includes('Edge')) stats.browsers.Edge++
        else if (ua.includes('Chrome')) { if (ua.includes('Mobile')) stats.browsers.ChromeMobile++; else stats.browsers.Chrome++ }
        else if (ua.includes('Safari')) { if (ua.includes('Mobile')) stats.browsers.SafariMobile++; else stats.browsers.Safari++ }
        else if (ua.includes('MSIE') || ua.includes('Trident')) stats.browsers.IE++
        else if (ua.includes('Gecko')) stats.browsers.Firefox++
        else stats.browsers.Other++

        const date = new Date(b.date)
        stats.months[date.getMonth()]++
        const weekday = date.getDay() - 1
        stats.weekdays[weekday < 0 ? 6 : weekday]++
        stats.times[b.time] = (stats.times[b.time] || 0) + 1

        if (b.createdAt) {
          const bookingDate = new Date(b.createdAt)
          stats.bookingHours[bookingDate.getHours()]++
        }

        stats.langs[b.lang] = (stats.langs[b.lang] || 0) + 1
        stats.ages[b.childAge] = (stats.ages[b.childAge] || 0) + 1
      }
      else stats.totalEvents++
    })

    return stats
  }
}

export class Stats {
  browsers = {
    Firefox: 0,
    Chrome: 0,
    ChromeMobile: 0,
    Safari: 0,
    SafariMobile: 0,
    IE: 0,
    Edge: 0,
    Other: 0
  }
  totalBookings = 0
  totalEvents = 0
  totalServices = 0
  services = {}
  months = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
  weekdays = [0, 0, 0, 0, 0, 0, 0]
  times = {}
  bookingHours = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
  ages = {}
  langs = {}
}