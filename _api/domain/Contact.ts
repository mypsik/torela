import Auditable from './Auditable'

export default interface Contact extends Auditable {
  email: string
}