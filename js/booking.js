class BookingDialog {
  constructor(selector, lang) {
    this.lang = lang
    this.msg = this.messages[lang]
    this.dialog = $(selector)

    this.dialog.find('.close').on('click', this.close.bind(this))

    for (let key of Object.keys(this.msg)) {
      const el = $('#' + key, this.dialog)
      if (el.is('input'))
        el.attr('placeholder', this.msg[key])
      else
        el.text(this.msg[key])
    }
  }

  open(time) {
    this.dialog.find('#time').text(time)
    this.dialog.show()
  }

  close() {
    this.dialog.hide()
  }

  messages = {
    en: {
      when: 'When',
      book: 'Book',
      childName: 'Child\'s name',
      ownName: 'Parent\'s name',
      email: 'Email',
      phone: 'Phone',
      services: 'Additional services',
      photographer: 'Photographer'
    },
    et: {
      when: 'Aeg',
      book: 'Broneeri',
      childName: 'Lapse nimi',
      ownName: 'Vanema nimi',
      email: 'E-post',
      phone: 'Telefon',
      services: 'Lisateenused',
      photographer: 'Fotograaf'
    }
  }
}
