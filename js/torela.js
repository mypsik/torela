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
  initServices()
})

function initGallery() {
  var thumbs = $('.thumbs img').on('click', function() {
    var thumb = $(this)
    thumb.addClass('active').siblings().removeClass('active')
    $('#big-image img').attr('src', thumb.attr('src'))
  })

  thumbs.eq(Math.floor(Math.random() * thumbs.length)).trigger('click')

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

function initServices() {
  $('dl dt').on('click', function() {
    $(this).add($(this).next('dd')).toggleClass('open');
  })
}