import {Collection, Db, ObjectId} from 'mongodb';
import Booking from './Booking';

export default class BookingService {
  data: Collection<Booking>

  constructor(db: Db) {
    this.data = db.collection('bookings')
  }

  bookings(): Promise<Array<Booking>> {
    return this.data.find().sort({date: 1, time: 1}).toArray()
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

  setComments(id: string, text: string): Promise<any> {
    return this.data.updateOne({_id: new ObjectId(id)}, {$set: {adminComments: text}})
  }
}
