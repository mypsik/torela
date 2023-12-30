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
  var quotes = $('main > blockquote')

  function showRandomQuote() {
    quotes.eq(Math.floor(Math.random() * quotes.length)).fadeIn()
  }

  function changeQuote() {
    quotes.filter(':visible').fadeOut(showRandomQuote)
  }

  setInterval(changeQuote, 10000)
  showRandomQuote()
}

function initServices() {
  $('#services h2').on('click', function() {
    $(this).add($(this).nextUntil('h2')).toggleClass('open')
    history.replaceState('', '', '#' + this.id)
  })
  if (location.hash) $('#services h2' + location.hash).trigger('click')
}
