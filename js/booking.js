function BookingDialog(selector, api, lang) {
  this.msg = bookingMessages[lang]
  this.dialog = $(selector)

  const fieldsToPrefill = ['parentName', 'email', 'phone']

  this.init = function() {
    this.dialog.find('.close').on('click', function() {history.back()})
    this.addLabels()
    this.dialog.on('submit', this.submit.bind(this))
    this.dialog.find('.services input[type=checkbox]').on('change', this.serviceToggled.bind(this))
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
    for (let categoryKey in additionalServices) {
      const category = additionalServices[categoryKey]
      const catEl = $('<details><summary>' + category[lang] + '</summary></details>').appendTo(services)
      for (let key in category) {
        if (key.length === 2) continue
        const service = category[key]
        const priceUnitText = service.priceUnit ? ' / ' + (this.msg[service.priceUnit] || service.priceUnit) : ''
        const el = $('<label>' +
          '<input type="checkbox" name="' + key + '" data-category="' + categoryKey + '"> ' +
          '<span>' + service[lang] + ' <a class="info" href="/lisateenused/#' + key + '" target="_blank" title="Info">i</a> <i class="price">' + service.price + '€' + priceUnitText + '</i></span>' +
        '</label>').appendTo(catEl)
        if (service.requestCount)
          el.append('<input type="number" min="0" max="100" placeholder="' + this.msg['count'] + '">')
      }
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

  this.serviceToggled = function(e) {
    const countInput = $(e.target).closest('label').find('input[type=number]')
    const checked = e.target.checked
    countInput.toggle(checked).attr('required', checked)
    if (checked) countInput.focus()
  }

  this.submit = function(e) {
    e.preventDefault()
    const booking = {additionalServices: []}
    this.dialog.find(':input').each(function(i, input) {
      if (input.name) {
        if (input.type === 'checkbox') {
          if (input.checked && input.name !== 'terms' && input.name !== 'mailConsent') {
            const service = additionalServices[input.dataset.category][input.name]
            const countInput = $(input).closest('label').find('input[type=number]')
            booking.additionalServices.push({
              name: input.name,
              description: service[lang],
              price: service.price,
              count: countInput.val()
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
    if (this.dialog.find('[name=mailConsent]').is(':checked')) {
      api.saveContact({email: booking.email, lang: booking.lang})
    }
  }

  this.success = function() {
    this.close()
    const msg = this.msg.success
    setTimeout(function() {
      alert(msg)
      location.reload()
    }, 100)
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
    mailConsent: 'Join Torela mailing list',
    comments: 'Comments/Discount code',
    services: '<a href="/en/services/" target="_blank">Additional services</a>',
    count: 'How many?',
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
    mailConsent: 'Soovin liituda Torela meililistiga',
    comments: 'Lisainfo/Sooduskood',
    services: '<a href="/lisateenused/" target="_blank">Lisateenused</a>',
    person: 'inimene',
    set: 'kmpl',
    count: 'Mitu?',
    success: 'Aitäh broneeringu eest! Kinnitus saadeti teie e-postile. Kui mõni lisateenus jäi valimata, siis kirjutage meile!'
  },
  ru: {
    book: 'Бронировать',
    childName: 'Имя ребёнка или мероприятия',
    childAge: 'Возраст ребёнка',
    parentName: 'Полное имя родителя',
    email: 'E-mail',
    phone: 'Телефон',
    terms: 'Соглашаюсь соблюдать <a href="/ru/rules/" target="_blank">правила игровой комнаты</a>',
    mailConsent: 'Добавить меня в список рассылки Торела',
    comments: 'Комментарии/промо-код',
    services: '<a href="/ru/services/" target="_blank">Дополнительные услуги</a>',
    person: 'человек',
    set: 'комплект',
    count: 'Кол-во',
    success: 'Спасибо за бронировку! Подтверждение будет отослано вам на e-mail. Если какая-то дополнительная услуга осталась невыбранной, то пишите нам!'
  }
}

const additionalServices = {
  general: {
    en: 'Torela services',
    et: 'Torela teenused',
    ru: 'Услуги Торелы',
    cleaning: {
      en: 'Cleaning',
      et: 'Koristus',
      ru: 'Уборка',
      price: 25,
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
      et: 'Korduvkasutatavate nõude pesemine',
      ru: 'Мойка многоразовая посуды',
      price: 15,
      priceUnit: ''
    },
  },  
  catering: {
    en: 'Catering',
    et: 'Toitlustus',
    ru: 'Питание',
    KookerPancakes: {
      en: 'Kooker Pancakes for 5',
      et: 'Kookeri pannkoogid 5-le',
      ru: 'Блинчики Kooker для 5',
      price: 70,
      priceUnit: ''
    },
    TarkCatering1: {
      en: 'Catering Tasty for 15',
      et: 'Taskukohane pakett 15-le',
      ru: 'Вкусное Меню для 15',
      price: 119,
      priceUnit: ''  
    }, 
    TarkCatering2: {
      en: 'Catering Abundant for 15',
      et: 'Laste pakett 15-le',
      ru: 'Раскошное Меню для 15',
      price: 149,
      priceUnit: ''
      
    },
    lemonade: {
      en: 'Õie lemonade 3,5L',
      et: 'Õie limonaad 3,5L',
      ru: 'Лимонад 3,5Л',
      price: 18,
      priceUnit: ''
    },
    retroWaffels: {
      en: 'Retro waffels',
      et: 'Retrovahvlid',
      ru: 'Ретро вафли',
      price: 0.8,
      priceUnit: 'tk',
      requestCount: true
    },   
    donuts: {
      en: 'Donuts',
      et: 'Sõõrikud',
      ru: 'Пончики',
      price: 2,
      priceUnit: 'tk',
      requestCount: true
    },
    icecreamMachine: {
      en: 'Icecream machine',
      et: 'Jäätisemasin',
      ru: 'Машина для изготовления мороженного',
      price: 59,
      priceUnit: ''
    },   
    icecreamExtra: {
      en: 'IcecreamExtra',
      et: 'Jäätise lisandid',
      ru: 'Украшения для мороженое',
      price: 9,
      priceUnit: 'kmpl',
      requestCount: true
    },
    popcornMachine: {
      en: 'Popcorn machine',
      et: 'Popcornimasin',
      ru: 'Машина для попкорн',
      price: 69,
      priceUnit: ''
    },
    icecreampopcornMachine: {
      en: 'Icecream+Popcorn machine',
      et: 'Jäätise- ja popcornimasin',
      ru: 'Машина для изготовления мороженного и попкорн',
      price: 109,
      priceUnit: ''
    },
    cottoncandy: {
      en: 'Cottoncandy machine',
      et: 'Suhkruvatimasin',
      ru: 'Машина сахарной ваты',
      price: 55,
      priceUnit: ''
    },
  },
  memories: {
    en: 'Memories',
    et: 'Mälestused',
    ru: 'На память',
    photographer: {
      en: 'Photographer',
      et: 'Fotograaf',
      ru: 'Фотограф',
      price: 155,
      priceUnit: ''
    },
    videographer: {
      en: 'Videographer',
      et: 'Videograaf',
      ru: 'Видеограф',
      price: 300,
      priceUnit: '3h'
    },
  },
  entertainment: {
    en: 'Entertainment',
    et: 'Lõbustused',
    ru: 'Развлечения',
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
      price: 85,
      priceUnit: '1h'
    },
    partyAnimator: {
      en: 'Animator, from',
      et: 'Peojuht, alates',
      ru: 'Аниматор, от',
      price: 180,
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
      en: 'Science theater, from',
      et: 'Teadusteater, alates',
      ru: 'Научный театр, от',
      price: 110,
      priceUnit: '45min'
    },
    bugsShow: {
      en: 'Bugs program',
      et: 'Putukaprogramm',
      ru: 'Программа с насекомыми',
      price: 160,
      priceUnit: '45min'
    },
    bubbleShow: {
      en: 'Bubble Show, from',
      et: 'Mullishow, alates',
      ru: 'Мыльное шоу, от',
      price: 125,
      priceUnit: '40min'
    },
  },
  decorations: {
    en: 'Decorations',
    et: 'Dekoratsioonid',
    ru: 'Оформление',
    peobox: {
      en: 'Peobox, from',
      et: 'Peobox, alates',
      ru: 'Пеобокс, от',
      price: 49,
      priceUnit: ''
    },   
    cakeTopperBanner: {
      en: 'Cake topper and banner, from',
      et: 'Koogitopper ja bänner, alates',
      ru: 'Торт Топпер и баннер, от',
      price: 6,
      priceUnit: ''
    },   
    balloons: {
      en: 'Balloons, from',
      et: 'Õhupallid, alates',
      ru: 'Надувные шары, от',
      price: 26,
      priceUnit: ''
    },
  },
}
