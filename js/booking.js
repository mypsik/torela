function BookingDialog(selector, api, lang) {
  this.msg = bookingMessages[lang]
  this.dialog = $(selector)

  const fieldsToPrefill = ['parentName', 'email', 'phone']

  this.init = function() {
    this.dialog.find('.close').on('click', function() {history.back()})
    this.addLabels()
    this.dialog.on('submit', this.submit.bind(this))
  }

  this.addLabels = function() {
    for (let key in this.msg) {
      let el = $('#' + key, this.dialog)
      if (el.length)
        el.html(this.msg[key])
      else {
        el = $('[name="' + key + '"]', this.dialog).attr('placeholder', this.msg[key])
        if (fieldsToPrefill.indexOf(key) >= 0) el.val(localStorage['booking.' + key])
      }
    }

    const services = this.dialog.find('.services')
    for (let key in additionalServices) {
      const service = additionalServices[key]
      services.append('<label><input type="checkbox" name="' + key + '"> <span>' + service[lang] + ' <i>' + service.price + '€' + (service.priceUnit ? ' / ' + service.priceUnit : '') + '</i></span></label>')
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
    const booking = {additionalServices: []}
    this.dialog.find(':input').each(function(i, input) {
      if (input.name) {
        if (input.type === 'checkbox') {
          if (input.checked && input.name !== 'terms') {
            const service = additionalServices[input.name]
            booking.additionalServices.push({
              name: input.name,
              description: service[lang],
              price: service.price
            })
          }
        }
        else {
          booking[input.name] = input.value
          if (fieldsToPrefill.indexOf(input.name) >= 0)
            localStorage['booking.' + input.name] = input.value
        }
      }
    })
    api.book(booking).then(this.success.bind(this))
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
    childName: 'Child or event name',
    childAge: 'Child\'s age',
    parentName: 'Parent\'s name',
    email: 'Email',
    phone: 'Phone',
    terms: 'Agree with <a href="/en/rules/" target="_blank">house rules</a>',
    comments: 'Comments',
    services: '<a href="/en/services/" target="_blank">Additional services</a>',
    success: 'Thank you for your booking! The confirmation has been sent to your email.'
  },
  et: {
    book: 'Broneeri',
    childName: 'Lapse või sündmuse nimi',
    childAge: 'Kui vanaks saab?',
    parentName: 'Lapsevanema täisnimi',
    email: 'E-post',
    phone: 'Telefon',
    terms: 'Olen nõus mängutoa <a href="/kodukord/" target="_blank">kodukorraga</a>',
    comments: 'Lisainfo',
    services: '<a href="/lisateenused/" target="_blank">Lisateenused</a>',
    success: 'Aitäh broneeringu eest! Kinnitust saadeti teie e-postile. Kui mingi lisateenus jäi valimata, siis kirjutage meile!'
  },
  ru: {
    book: 'Бронировать',
    childName: 'Имя ребёнка или мероприятия',
    childAge: 'Возраст ребёнка',
    parentName: 'Полное имя родителя',
    email: 'E-mail',
    phone: 'Телефон',
    terms: 'Соглашаюсь соблюдать <a href="/en/rules/" target="_blank">правила игровой комнаты</a>',
    comments: 'Комментарии',
    services: '<a href="/ru/services/" target="_blank">Дополнительные услуги</a>',
    success: 'Спасибо за бронировку! Подтверждение будет отослано вам на e-mail. Если какая-то дополнительная услуга осталась невыбранной, то пишите нам!'
  }
}

const additionalServices = {
  cleaning: {
    en: 'Cleaning',
    et: 'Koristus',
    ru: 'Уборка',
    price: 25,
    priceUnit: ''
  },
  facePainting: {
    en: 'Face painting',
    et: 'Näomaalingud',
    ru: 'Крашенье лиц',
    price: 50,
    priceUnit: '1h'
  },
  balloonAnimals: {
    en: 'Balloon Animals',
    et: 'Õhupalliloomad',
    ru: 'Животные из воздушных шаров',
    price: 70,
    priceUnit: '1h'
  },
  catering: {
    en: 'Kids\' Favorites',
    et: 'Laste lemmikud',
    ru: 'Любимое детей',
    price: 80,
    priceUnit: ''
  },
  icecreamMachine: {
    en: 'Icecream machine',
    et: 'Jäätisemasin',
    ru: 'Машина для изготовления мороженного',
    price: 59,
    priceUnit: ''
  },
  cottoncandy: {
    en: 'Cottoncandy machine',
    et: 'Suhkruvatimasin',
    ru: 'Машина сахарной ваты',
    price: 55,
    priceUnit: ''
  },
  photographer: {
    en: 'Photographer',
    et: 'Fotograaf',
    ru: 'Фотограф',
    price: 135,
    priceUnit: ''
  },
  videographer: {
    en: 'Videographer',
    et: 'Videograaf',
    ru: 'Видеограф',
    price: 300,
    priceUnit: '3h'
  },
  bugsShow: {
    en: 'Bugs program',
    et: 'Putukaprogramm',
    ru: 'Программа с насекомыми',
    price: 125,
    priceUnit: '45min'
  },
  partyAnimator: {
    en: 'Animator, from',
    et: 'Peojuht, alates',
    ru: 'Аниматор, от',
    price: 150,
    priceUnit: '1-1,5h'
  },
  magician: {
    en: 'Magician',
    et: 'Mustkunstnik',
    ru: 'Фокусник',
    price: 115,
    priceUnit: '30min'
  },
  scienceTheater: {
    en: 'Science theater',
    et: 'Teadusteater',
    ru: 'Научный театр',
    price: 132,
    priceUnit: '45min'
  },
  scienceWorkshop: {
    en: 'Science workshop',
    et: 'Teadustöötuba',
    ru: 'Научная мастерская',
    price: 132,
    priceUnit: '45min'
  },
  scienceShow: {
    en: 'Science show',
    et: 'Teadusshow',
    ru: 'Научное шоу',
    price: 270,
    priceUnit: '30min'
  },
  bubbleShow: {
    en: 'Bubble show',
    et: 'Mullishow',
    ru: 'Шоу мыльных пузырей',
    price: 80,
    priceUnit: '30min'
  },
  cakeTopperBanner: {
    en: 'Cake topper and banner, from',
    et: 'Koogitopper ja bänner, alates',
    ru: 'Торт Топпер и баннер, от',
    price: 6,
    priceUnit: ''
  },
  reusableTablewareFree: {
    en: 'Reusable tableware',
    et: 'Korduvkasutatavad nõud',
    ru: 'Многоразовая посуда',
    price: 0,
    priceUnit: ''
  },
  reusableTablewareWash: {
    en: 'Reusable tableware washing',
    et: 'Korduvkasutatavate nõuete pesemine',
    ru: 'Мойка многоразовая посуды',
    price: 10,
    priceUnit: ''
  },
  disposableTableware: {
    en: 'Disposable tableware (set)',
    et: 'Ühekordsed nõud (kmp)',
    ru: 'Одноразовая посуда (комплект)',
    price: 1,
    priceUnit: ''
  }
}
