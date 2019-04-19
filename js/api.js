function API(url) {
  this.url = url || (location.hostname.indexOf('localhost') === 0 ? 'http://172.20.0.2:5000' : 'https://torela.codeborne.com')

  this.bookings = function() {
    return $.get(this.url + '/api/bookings').then(function(bookings) {
      return bookings.reduce(function(r, b) {
        r[b.date + ' ' + b.time] = b
        return r
      }, {})
    })
  }

  this.book = function(booking) {
    return this.post('/api/bookings', booking)
  }

  this.saveContact = function(contact) {
    return this.post('/api/contacts', contact)
  }

  this.post = function(path, data) {
    return $.post({url: this.url + path, data: JSON.stringify(data), contentType: 'application/json'})
  }
}
