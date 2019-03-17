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

$(window).on('hashchange', function() {
  document.body.style.backgroundImage = 'url(/img/' + location.hash.substring(1) + ')'
})

if (location.hash) {
  $(window).trigger('hashchange')
}