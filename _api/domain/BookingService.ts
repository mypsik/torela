import {Db, ObjectId} from 'mongodb';
import {Booking} from './Booking';

export class BookingService {
  db: Db

  constructor(db: Db) {
    this.db = db
  }

  bookings(): Promise<Array<Booking>> {
    return this.db.collection('bookings').find().sort({date: 1, time: 1}).toArray()
  }

  delete(id: string): Promise<any> {
    return this.db.collection('bookings').deleteOne({_id: new ObjectId(id)})
  }
}
