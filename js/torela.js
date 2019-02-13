var lang = $('html').attr('lang')

$('a[href=mailto]').each(function(i, a) {
  a.textContent = a.textContent.replace('$', '@')
  a.href = 'mailto:' + a.textContent
})

$('nav > a').each(function(i, a) {
  if (location.pathname === a.getAttribute('href'))
    a.classList.add('active')
})
