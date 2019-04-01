class BookingDialog {
  constructor(selector, api, lang) {
    this.api = api
    this.lang = lang
    this.msg = this.messages[lang]
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

  messages = {
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
      services: 'Additional services',
      photographer: 'Photographer'
    },
    et: {
      book: 'Broneeri',
      childName: 'Lapse eesnimi',
      childAge: 'Lapse vanus',
      parentName: 'Vanema täisnimi',
      email: 'E-post',
      phone: 'Telefon',
      terms: 'Olen nõus mängutoa <a href="/kodukord/" target="_blank">kodukorraga</a>',
      success: 'Täname broneerimise eest, ootame teid külla! Palun tasuge broneerimistasu meie kontole',
      comments: 'Lisainfo',
      services: 'Lisateenused',
      photographer: 'Fotograaf'
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
      services: 'Дополнительные услуги',
      photographer: 'Фотограф'
    }
  }
}
