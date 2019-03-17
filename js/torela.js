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

  initGallery()

  $(window).on('hashchange', function() {
    document.body.style.backgroundImage = 'url(/img/' + location.hash.substring(1) + ')'
  })

  if (location.hash) {
    $(window).trigger('hashchange')
  }
})

function initGallery() {
  $('.thumbs img').on('click', function() {
    var thumb = $(this)
    thumb.addClass('active').siblings().removeClass('active')
    $('#big-image img').attr('src', thumb.attr('src'))
  })

  $('#big-image .prev').on('click', function() {
    var prev = $('.thumbs img.active').prev()
    if (!prev.length) prev = $('.thumbs img').last()
    prev.trigger('click')
  })

  $('#big-image .next').on('click', function() {
    var next = $('.thumbs img.active').next()
    if (!next.length) next = $('.thumbs img').first()
    next.trigger('click')
  })
}
