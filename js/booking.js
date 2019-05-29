function BookingDialog(selector, api, lang) {
  this.api = api
  this.lang = lang
  this.msg = bookingMessages[lang]
  this.dialog = $(selector)

  this.init = function() {
    this.dialog.find('.close').on('click', function() {history.back()})
    this.addLabels()
    this.dialog.on('submit', this.submit.bind(this))
  }

  this.addLabels = function() {
    for (let key in this.msg) {
      const el = $('#' + key, this.dialog)
      if (el.length)
        el.html(this.msg[key])
      else
        $('[name="' + key + '"]', this.dialog).attr('placeholder', this.msg[key])
    }

    var services = this.dialog.find('.services')
    for (let service in this.msg.additionalServices) {
      services.append('<label><input type="checkbox" name="' + service + '"> <span>' + this.msg.additionalServices[service] + '</span></label>')
    }
  }

  this.open = function(event) {
    this.dialog.find('#time').text(event.date + ' ' + event.time + ' - ' + event.until)
    this.dialog.find('[name=date]').val(event.date)
    this.dialog.find('[name=time]').val(event.time)
    this.dialog.find('[name=until]').val(event.until)
    this.dialog.show()
    this.dialog.find('input:visible:first').focus()
    history.pushState('booking', 'Booking');
    $(window).one('popstate', this.close.bind(this));
  }

  this.close = function() {
    this.dialog.hide()
  }

  this.submit = function(e) {
    e.preventDefault()
    const booking = {}
    this.dialog.find(':input').each(function(i, input) {
      if (input.name && (input.type !== 'checkbox' || input.checked))
        booking[input.name] = input.value
    })
    this.api.book(booking).then(this.success.bind(this))
  }

  this.success = function() {
    this.close()
    alert(this.msg.success)
    location.reload()
  }

  this.init()
}

const bookingMessages = {
  en: {
    book: 'Book',
    childName: 'Child\'s name',
    childAge: 'Child\'s age',
    parentName: 'Parent\'s name',
    email: 'Email',
    phone: 'Phone',
    terms: 'Agree with <a href="/en/rules/" target="_blank">house rules</a>',
    comments: 'Comments',
    success: 'Thank you for your booking!',
    services: '<a href="/en/services/" target="_blank">Additional services</a>',
    additionalServices: {
      cleaning: 'Cleaning (25€)',
      facePainting: 'Face paintings (45€/1,5h)',
      balloonAnimals: 'Balloon Animals (70€/1h)',
      catering: 'Kids\' Favorites (80€)',
      icecreamMachine: 'Icecream machine (71€)',
      cottoncandy: 'Cottoncandy machine (55€)',
      photographer: 'Photographer (135€)',
      videographer: 'Videographer (300€/3h)',
      bugsShow: 'Bugs program (125€/45min)',
      partyAnimator: 'Animator (from 150€/1-1,5h)',
      magician: 'Magician (115€/30min)',
      scienceTheater: 'Science theater (132€/45min)',
      scienceWorkshop: 'Science workshop (132€/45min)',
      scienceShow: 'Science show (270€/30min)',
      cakeTopperBanner: 'Cake topper and banner (from 6€)',
      reusableTableware: 'Reusable tableware (8€)',
      disposableTableware: 'Disposable tableware (1€/set)'
      
      
    }
  },
  et: {
    book: 'Broneeri',
    childName: 'Lapse eesnimi',
    childAge: 'Lapse vanus',
    parentName: 'Lapsevanema täisnimi',
    email: 'E-post',
    phone: 'Telefon',
    terms: 'Olen nõus mängutoa <a href="/kodukord/" target="_blank">kodukorraga</a>',
    success: 'Aitäh broneeringu eest!',
    comments: 'Lisainfo',
    services: '<a href="/lisateenused/" target="_blank">Lisateenused</a>',
    additionalServices: {
      cleaning: 'Koristus (25€)',
      facePainting: 'Näomaalingud (45€/1,5h)',
      balloonAnimals: 'Õhupalliloomad (70€/1h)',
      catering: 'Laste lemmikud (80€)',
      icecreamMachine: 'Jäätisemasin (71€)',
      cottoncandy: 'Suhkruvatimasin (55€)',
      photographer: 'Fotograaf (135€)',
      videographer: 'Videograaf (300€/3h)',
      bugsShow: 'Putukaprogramm (125€/45min)',
      partyAnimator: 'Peojuht (al 150€/1-1,5h)',
      magician: 'Mustkunstnik (115€/30min)',
      scienceTheater: 'Teadusteater (132€/45min)',
      scienceWorkshop: 'Teadustöötuba (132€/45min)',
      scienceShow: 'Teadusshow (270€/30min)',
      cakeTopperBanner: 'Koogitopper ja bänner (al 6€)',
      reusableTableware: 'Korduvkasutatavad nõud (8€)',
      disposableTableware: 'Ühekordsed nõud (1€/kmp)'
      
    }
  },
  ru: {
    book: 'Бронировать',
    childName: 'Имя ребёнка',
    childAge: 'Возраст ребёнка',
    parentName: 'Полное имя родителя',
    email: 'E-mail',
    phone: 'Телефон',
    terms: 'Соглашаюсь соблюдать <a href="/en/rules/" target="_blank">правила игровой комнаты</a>',
    success: 'Спасибо за бронировку!',
    comments: 'Комментарии',
    services: '<a href="/ru/services/" target="_blank">Дополнительные услуги</a>',
    additionalServices: {
      cleaning: 'Уборка (25€)',
      facePainting: 'Крашенье лица (45€/1,5h)',
      balloonAnimals: 'Животные из воздушных шаров (70€/1h)',
      catering: 'Любимое детей (80€)',
      icecreamMachine: 'Машина для изготовления мороженного (71€)',
      cottoncandy: 'Машина сахарной ваты (55€)',
      photographer: 'Фотограф (135€)',
      videographer: 'Видеограф (300€/3h)',
      bugsShow: 'Программа с насекомыми (125€/45min)',
      partyAnimator: 'Аниматор (от 150€/1-1,5h)',
      magician: 'Фокусник (115€/30min)',
      scienceTheater: 'Научный театр (132€/45min)',
      scienceWorkshop: 'Научная мастерская (132€/45min)',
      scienceShow: 'Научное шоу (270€/30min)',
      cakeTopperBanner: 'Торт Топпер и баннер (от 6€)',
      reusableTableware: 'Многоразовая посуда (8€)',
      disposableTableware: 'Одноразовая посуда (1€/сет)'
      
      
    }
  }
}
