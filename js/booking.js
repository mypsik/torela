class BookingDialog {
  constructor(selector, lang) {
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
      ownName: 'Parent\'s name',
      email: 'Email',
      phone: 'Phone',
      services: 'Additional services',
      photographer: 'Photographer'
    },
    et: {
      when: 'Aeg',
      book: 'Broneeri (veel ei tööta)',
      childName: 'Lapse nimi',
      ownName: 'Vanema nimi',
      email: 'E-post',
      phone: 'Telefon',
      services: 'Lisateenused',
      photographer: 'Fotograaf'
    }
  }
}
