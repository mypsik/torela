(function invitation() {
  window.onhashchange = invitation

  var friendNameEl = $('#friendName')
  var messageEl = $('#message')

  var parts = location.hash.substring(1).split(':', 3)
  var id = parts[0]
  if (parts[1]) friendNameEl.text(' ' + decodeURIComponent(parts[1]))
  if (parts[2]) messageEl.text(decodeURIComponent(parts[2]))

  $('.add-name').off('click').on('click', function() {
    var newName = prompt($(this).text(), $.trim(friendNameEl.text()))
    friendNameEl.text(newName ? ' ' + newName : '')
    updateHash()
  })

  $('.edit-message').off('click').on('click', function() {
    var msg = prompt($(this).text(), messageEl.text())
    if (msg) messageEl.text(msg)
    updateHash()
  })

  function updateHash() {
    var name = friendNameEl.text().trim()
    var msg = messageEl.text()
    location.hash = id + (name || msg ? ':' + encodeURIComponent(name) : '') + (msg ? ':' + encodeURIComponent(msg) : '')
  }

  $('.lang a').each(function() {
    this.href = this.href.replace(/#.*/, '') + location.hash
  })

  if (!id) return

  api.booking(id).then(function(b) {
    var dateParts = b.date.split('-')
    $('#date').text(dateParts[2] + '.' + dateParts[1])
    $('#time').text(b.correctedTime || b.time)
    $('#childName').text(b.childName)
    $('#parentName').text(b.parentName.split(' ')[0])
    $('a[href="tel:"]').text(b.phone).attr('href', 'tel:' + b.phone)
    $('a[href="mailto:"]').text(b.email).attr('href', 'mailto:' + b.email)
  })
})()
