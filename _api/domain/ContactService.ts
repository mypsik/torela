import {Collection, Db} from 'mongodb';
import Contact from './Contact'

export default class ContactService {
  data: Collection<Contact>

  constructor(db: Db) {
    this.data = db.collection('contacts')
  }

  contacts(): Promise<Array<Contact>> {
    return this.data.find().toArray()
  }

  save(contact: Contact) {
    return this.data.insertOne(contact);
  }
}
