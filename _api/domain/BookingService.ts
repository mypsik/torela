import {Collection, Db, ObjectId} from 'mongodb';
import Booking, {Participation} from './Booking'

export default class BookingService {
  data: Collection<Booking>
  deletedData: Collection<Booking>

  constructor(db: Db) {
    this.data = db.collection('bookings')
    this.deletedData = db.collection('bookingsDeleted')
  }

  bookings(from?: string): Promise<Array<Booking>> {
    const query = from && {date: {$gte: from}}
    return this.data.find(query).sort({date: 1, time: 1}).toArray()
  }

  booking(id: string): Promise<Booking | null> {
    return this.data.findOne({_id: new ObjectId(id)})
  }

  save(booking: Booking) {
    return this.data.insertOne(booking);
  }

  async delete(id: string): Promise<any> {
    const booking = await this.booking(id)
    await this.deletedData.insertOne(booking)
    return this.data.deleteOne({_id: new ObjectId(id)})
  }

  addPayment(id: string, amount: number): Promise<any> {
    return this.data.updateOne({_id: new ObjectId(id)}, {$push: {payments: {amount, dateTime: new Date()}}})
  }

  update(id: string, fields: Booking): Promise<any> {
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
}
