document.querySelectorAll('nav > a').forEach(function(a) {
  if (location.pathname === a.getAttribute('href'))
    a.classList.add('active')
})
