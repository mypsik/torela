class BookingDialog {
  constructor(selector, api, lang) {
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
        el.text(this.msg[key])
      else
        $(`[name="${key}"]`, this.dialog).attr('placeholder', this.msg[key])
    }
  }

  open(time) {
    this.dialog.find('#time').text(time)
    this.dialog.show()
  }

  close() {
    this.dialog.hide()
  }

  submit(e) {
    e.preventDefault()
    alert(this.dialog.serialize())
  }

  messages = {
    en: {
      when: 'When',
      book: 'Book',
      childName: 'Child\'s name',
      childAge: 'Child\'s age',
      parentName: 'Parent\'s name',
      email: 'Email',
      phone: 'Phone',
      services: 'Additional services',
      photographer: 'Photographer'
    },
    et: {
      when: 'Aeg',
      book: 'Broneeri (veel ei tööta)',
      childName: 'Lapse eesnimi',
      childAge: 'Lapse vanus',
      parentName: 'Vanema täisnimi',
      email: 'E-post',
      phone: 'Telefon',
      services: 'Lisateenused',
      photographer: 'Fotograaf'
    },
    ru: {
      when: 'Когда',
      book: 'Бронировать',
      childName: 'Имя ребёнка',
      childAge: 'Возраст ребёнка',
      parentName: 'Полное имя родителя',
      email: 'E-mail',
      phone: 'Телефон',
      services: 'Дополнительные услуги',
      photographer: 'Фотограф'
    }
  }
}
