function API(url) {
  url = url || 'https://torela.codeborne.com'
  
  window.onerror = function (message, source, lineno, colno, error) {
    $.get({url: url + '/api/error/js?details=' + encodeURIComponent(message + ':' + source + ':' + lineno + ':' + colno + ':' + error + ':' + error && error.stack), global: false})
  }

  $(document).ajaxError(function(e, req, settings, error) {
    $.get({url: url + '/api/error/ajax?details=' + settings.url + ':' + req.status + ':' + error, global: false})
    alert('Probleem serveriga suhtlemisel. Palun proovige uuesti ja kui ikka ei tööta, siis kirjutage meile millise brauseriga on tegu!')
  })

  this.bookings = function() {
    return $.get(url + '/api/bookings').then(function(bookings) {
      return bookings.reduce(function(r, b) {
        r[b.date + ' ' + b.time] = b
        return r
      }, {})
    })
  }

  this.booking = function(id) {
    return $.get(url + '/api/bookings/' + id)
  }

  this.book = function(booking) {
    return this.post('/api/bookings', booking)
  }

  this.saveContact = function(contact) {
    return this.post('/api/contacts', contact)
  }

  this.post = function(path, data) {
    return $.post({url: url + path, data: JSON.stringify(data), contentType: 'application/json'})
  }
}
