import Auditable from './Auditable'

export default interface Booking extends Auditable {
  date: string
  time: string
  until: string
  email: string
  phone: string
  childName: string
  childAge: string
  parentName: string
  comments: string
}