export interface Auditable {
  lang: string
  userAgent: string
  createdAt: string
}

export interface Booking extends Auditable {
  _id: any
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
