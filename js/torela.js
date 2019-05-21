$(function () {
  var lang = $('html').attr('lang')

  $('a[href=mailto]').each(function(i, a) {
    a.textContent = a.textContent.replace('$', '@')
    a.href = 'mailto:' + a.textContent
  })

  $('nav > a').each(function(i, a) {
    if (location.pathname === a.getAttribute('href'))
      a.classList.add('active')
  })

  $(document).on('submit', function() {
    $(this).find('button').prop('disabled', true)
  })

  initQuotes()
  initServices()
})

function initQuotes() {
  var quotes = window.quotes || []

  function changeQuote() {
    var quote = quotes[Math.floor(Math.random() * quotes.length)]
    $('blockquote').text(quote)
  }

  setInterval(changeQuote, 4000)
  changeQuote()
}

function initServices() {
  $('dl dt').on('click', function() {
    $(this).add($(this).next('dd')).toggleClass('open');
  })
}