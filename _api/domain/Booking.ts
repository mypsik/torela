import Auditable from './Auditable'

export default interface Booking extends Auditable {
  date: string
  time: string
  correctedTime?: string
  until: string
  email: string
  phone: string
  childName: string
  childAge: string
  parentName: string
  comments: string
  payments?: Array<Payment>
  adminComments?: string
  publicEvent?: boolean
}

export interface Payment {
  amount: number
  dateTime: Date
}
