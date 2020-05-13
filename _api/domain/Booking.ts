import Auditable from './Auditable'

interface Registration extends Auditable {
  email: string
  phone: string
  childName: string
  childAge?: string
  parentName: string
  comments: string
  cancelledAt?: string
  cancelReason?: string
}

export default interface Booking extends Registration {
  date: string
  time: string
  correctedTime?: string
  until: string
  payments?: Array<Payment>
  adminComments?: string
  additionalServices?: Array<{name: string, description: string, price: number, count: number}>
  publicEvent?: boolean
  externalUrl?: string
  participations?: Array<Participation>
}

export interface Participation extends Registration {
}

export interface Payment {
  amount: number
  dateTime: Date
}
