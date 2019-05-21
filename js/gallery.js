(function initGallery() {
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
})()
