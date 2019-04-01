class API {
  constructor(url) {
    this.url = url || (location.hostname.startsWith('localhost') ? 'http://172.20.0.2:5000' : 'https://torela.codeborne.com')
  }

  bookings() {
    return $.get(this.url + '/api/bookings').then(bookings =>
      bookings.reduce((r, b) => {r[`${b.date} ${b.time}`] = b; return r}, {}))
  }

  book(booking) {
    return $.post(this.url + '/api/bookings', JSON.stringify(booking))
  }

  saveContact(contact) {
    return $.post(this.url + '/api/contacts', JSON.stringify(contact))
  }
}
