(function invitation() {
  window.onhashchange = invitation

  var api = new API()
  var friendNameEl = $('#friendName')

  var id = location.hash.substring(1)
  var colonPos = id.indexOf(':')
  if (colonPos > 0) {
    friendNameEl.text(' ' + decodeURIComponent(id.substring(colonPos + 1)))
    id = id.substring(0, colonPos)
  }

  $('.add-name').off('click').on('click', function() {
    var newName = prompt($(this).text(), $.trim(friendNameEl.text()))
    friendNameEl.text(newName ? ' ' + newName : '')
    location.hash = location.hash.replace(/:.*/, '') + (newName ? ':' + newName : '')
  })

  if (!id) return

  $('.lang a').each(function() {
    this.href = this.href.replace(/#.*/, '') + location.hash
  })

  api.booking(id).then(function(b) {
    var dateParts = b.date.split('-')
    $('#date').text(dateParts[2] + '.' + dateParts[1])
    $('#time').text(b.time)
    $('#childName').text(b.childName)
    $('#parentName').text(b.parentName)
    $('a[href="tel:"]').text(b.phone).attr('href', 'tel:' + b.phone)
    $('a[href="mailto:"]').text(b.email).attr('href', 'mailto:' + b.email)
  })
})()
