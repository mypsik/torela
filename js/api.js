class API {
  constructor(url) {
    this.url = url || (location.hostname.startsWith('localhost') ? 'http://172.20.0.2:5000' : 'https://torela.codeborne.com')
  }

  bookings() {
    return $.get(this.url + '/api/bookings').then(bookings =>
      bookings.reduce((r, b) => {r[`${b.date} ${b.time}`] = b; return r}, {}))
  }

  book(booking) {
    return this.post('/api/bookings', booking)
  }

  saveContact(contact) {
    return this.post('/api/contacts', contact)
  }

  post(path, data) {
    return $.post({url: this.url + path, data: JSON.stringify(data), contentType: 'application/json'})
  }
}
