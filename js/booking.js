class BookingDialog {
  constructor(selector, api, lang) {
    this.api = api
    this.lang = lang
    this.msg = bookingMessages[lang]
    this.dialog = $(selector)

    this.dialog.find('.close').on('click', this.close.bind(this))
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
  }

  close() {
    this.dialog.hide()
  }

  submit(e) {
    e.preventDefault()
    const booking = {}
    this.dialog.find(':input').each((i, input) => {
      if (input.name)
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
      photographer: 'Photographer',
      videographer: 'Video',
      facePainting: 'Face painting',
      icecreamMachine: 'Icecream machine',
      cleaning: 'Cleaning'
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
      photographer: 'Fotograaf',
      videographer: 'Videograaf (3h/300€)',
      facePainting: 'Näomaalingud (1,5h/50€)',
      icecreamMachine: 'Jäätise masin (59€+km)',
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
      photographer: 'Фотограф',
      videographer: 'Видеограф',
      facePainting: 'Крашенье лица',
      icecreamMachine: 'Машина для изготовления мороженного',
      cleaning: 'Уборка'
    }
  }
}
