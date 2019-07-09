import {Collection, Db, ObjectId} from 'mongodb';
import Booking from './Booking';

export default class BookingService {
  data: Collection<Booking>

  constructor(db: Db) {
    this.data = db.collection('bookings')
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

  delete(id: string): Promise<any> {
    return this.data.deleteOne({_id: new ObjectId(id)})
  }

  addPayment(id: string, amount: number): Promise<any> {
    return this.data.updateOne({_id: new ObjectId(id)}, {$push: {payments: {amount, dateTime: new Date()}}})
  }

  update(id: string, fields: Booking): Promise<any> {
    return this.data.updateOne({_id: new ObjectId(id)}, {$set: fields})
  }
}
