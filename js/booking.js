class BookingDialog {
  constructor(selector, api, lang) {
    this.api = api
    this.lang = lang
    this.msg = bookingMessages[lang]
    this.dialog = $(selector)

    this.dialog.find('.close').on('click', () => history.back())
    this.addLabels()
    this.dialog.on('submit', this.submit.bind(this))
  }

  addLabels() {
    for (let key of Object.keys(this.msg)) {
      const el = $('#' + key, this.dialog)
      if (el.length)
        el.html(this.msg[key])
      else
        $(`[name="${key}"]`, this.dialog).attr('placeholder', this.msg[key])
    }

    var services = this.dialog.find('.services')
    for (let service of Object.keys(this.msg.additionalServices)) {
      services.append(`<label><input type="checkbox" name="${service}"> <span>${this.msg.additionalServices[service]}</span></label>`)
    }
  }

  open(event) {
    this.dialog.find('#time').text(event.date + ' ' + event.time + ' - ' + event.until)
    this.dialog.find('[name=date]').val(event.date)
    this.dialog.find('[name=time]').val(event.time)
    this.dialog.find('[name=until]').val(event.until)
    this.dialog.show()
    this.dialog.find('input:visible:first').focus()
    history.pushState('booking', 'Booking');
    $(window).one('popstate', () => this.close());
  }

  close() {
    this.dialog.hide()
  }

  submit(e) {
    e.preventDefault()
    const booking = {}
    this.dialog.find(':input').each((i, input) => {
      if (input.name && (input.type !== 'checkbox' || input.checked))
        booking[input.name] = input.value
    })
    this.api.book(booking).then(this.success.bind(this))
  }

  success() {
    this.close()
    alert(this.msg.success)
    location.reload()
  }
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
    success: 'Thank you for booking! Please pay the booking fee to our bank account',
    services: '<a href="/en/services/" target="_blank">Additional services</a>',
    additionalServices: {
      bugsShow: 'Bugs program (125€/45min)',
      videographer: 'Videographer (300€/3h)',
      photographer: 'Photographer (135€)',
      partyAnimator: 'Animator',
      magician: 'Magician (115€/30min)',
      facePainting: 'Face paintings (45€/1,5h)',
      balloonAnimals: 'Balloon Animals (70€/1h)' ,
      catering: 'Kids\' Favorites (80€)',
      icecreamMachine: 'Icecream machine (71€)',
      cottoncandy: 'Cottoncandy machine',
      cleaning: 'Cleaning (25€)'
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
    success: 'Täname broneeringu eest, ootame teid külla! Palun tasuge broneerimistasu meie kontole',
    comments: 'Lisainfo',
    services: '<a href="/lisateenused/" target="_blank">Lisateenused</a>',
    additionalServices: {
      bugsShow: 'Putukaprogramm (125€/45min)',
      videographer: 'Videograaf (300€/3h)',
      photographer: 'Fotograaf (135€)',
      partyAnimator: 'Peojuht',
      magician: 'Mustkunstnik (115€/30min)',
      facePainting: 'Näomaalingud (45€/1,5h)',
      balloonAnimals: 'Õhupalliloomad (70€/1h)' ,
      catering: 'Laste lemmikud (80€)',
      icecreamMachine: 'Jäätisemasin (71€)',
      cottoncandy: 'Suhkruvatimasin',
      cleaning: 'Koristus (25€)'
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
    success: 'Спасибо за бронировку, ждём вас в гости! Не забудьте перевести предоплату на наш счёт',
    comments: 'Комментарии',
    services: '<a href="/ru/services/" target="_blank">Дополнительные услуги</a>',
    additionalServices: {
      bugsShow: 'Программа с насекомыми (125€/45min)',
      videographer: 'Видеограф (300€/3h)',
      photographer: 'Фотограф (135€)',
      partyAnimator: 'Аниматор',
      magician: 'Фокусник (115€/30min)',
      facePainting: 'Крашенье лица (45€/1,5h)',
      balloonAnimals: 'Животные из воздушных шаров (70€/1h)' ,
      catering: 'Любимое детей (80€)',
      icecreamMachine: 'Машина для изготовления мороженного (71€)',
      cottoncandy: 'Машина сахарной ваты',
      cleaning: 'Уборка (25€)'
    }
  }
}
