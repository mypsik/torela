class API {
  constructor(url) {
    this.url = url || (location.hostname.startsWith('localhost') ? 'http://localhost:5000' : 'https://torela.codeborne.com')
  }

  bookings() {
    return $.get(this.url + '/api/bookings').then(bookings =>
      bookings.reduce((r, b) => {r[`${b.date} ${b.time}`] = b; return r}, {}))
  }

  book(booking) {
    return $.post(this.url + '/api/bookings', booking)
  }
}