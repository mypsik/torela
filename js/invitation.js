(function invitation() {
  var api = new API()
  var id = location.hash.substring(1);
  if (!id) return;

  $('.lang a').each(function() {
    this.href += location.hash
  });

  api.booking(id).then(function(b) {
    var dateParts = b.date.split('-')
    $('#date').text(dateParts[2] + '.' + dateParts[1])
    $('#time').text(b.time)
    $('#name').text(b.childName)
    $('a[href="tel:"]').text(b.phone).attr('href', 'tel:' + b.phone)
    $('a[href="mailto:"]').text(b.email).attr('href', 'mailto:' + b.email)
  })

  window.onhashchange = invitation
})()
