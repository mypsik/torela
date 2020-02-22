function Calendar(id, lang, bookableEvents, firstDay) {
    this.lang = lang || 'en'
    this.bookableEvents = bookableEvents || []
    this.firstDay = firstDay
    this.bookings = undefined
    this.displayed_date = new Date()                    //date wich calendar displays now
    this.current_day = this.displayed_date.getDate()    //current world time
    this.selected_date = this.displayed_date            //date that user's selected

    this.weekday_names = {
      en: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      et: ['E', 'T', 'K', 'N', 'R', 'L', 'P'],
      ru: ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс']
    }

    this.month_names = {
      en: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
      et: ['Jaanuar', 'Veebruar', 'Märts', 'Aprill', 'Mai', 'Juuni', 'Juuli', 'August', 'September', 'Oktoober', 'November', 'Detsember'],
      ru: ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь']
    }

  this.draw = function() {
    this.drawToDom(this.displayed_date, id)

    this.body_node = document.getElementById('calendar-body')
    this.year_node = document.getElementById('calendar-year')
    this.month_node = document.getElementById('calendar-month')

    this.moveLeft = this.moveLeft.bind(this)
    this.moveRight = this.moveRight.bind(this)
    this.selectHandler = this.selectHandler.bind(this)
    this.setDateTo = this.setDateTo.bind(this)

    this.body_node.addEventListener('click', this.selectHandler)

    document
      .getElementById('calendar-left-btn') //adds listeners for buttons
      .addEventListener('click', this.moveLeft)
    document
      .getElementById('calendar-right-btn')
      .addEventListener('click', this.moveRight)
  }

  this.setBookings = function(bookings) {
    this.bookings = bookings
    this.setDateTo(this.displayed_date)
  }

  //draws the calendar when the document is loaded
  this.drawToDom = function(date, id) {
    let year = date.getFullYear(),
        month = this.getMonthName(date)

    let calendar = document.getElementById(id);
    calendar.querySelector('.calender-header-text-month').textContent = month;
    calendar.querySelector('.calender-header-text-year').textContent = year;
    let tr = calendar.querySelector('.calendar__head-days')
    this.weekday_names[this.lang].forEach(function(name) {
      let th = document.createElement('th')
      th.className = 'calendar__head-days-item'
      th.innerText = name
      tr.appendChild(th)
    })

    document.getElementById('calendar-body').innerHTML = ''

    let body = this.createCalendarBody(
      this.displayed_date,
      true
    )

    document.getElementById('calendar-body').appendChild(body)
  }

  this.createDaysArray = function(date) {
    let
      prev_month = new Date(date.getFullYear(), date.getMonth(), 0)
      prev_month_last_day = prev_month.getDate(),
      first_week_day = new Date(date.getFullYear(), date.getMonth(), 1).getDay(),
      current_month_last_day = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate(),
      next_month = new Date(date.getFullYear(), date.getMonth() + 1, 1),
      days_array = new Array(42),
      i = 0 // iterator for all three parts of array

    if (first_week_day == 0) first_week_day = 7 //if it was sunday

    let first_array_element = prev_month_last_day - first_week_day + 2

    for (i = 0; i < first_week_day - 1; ++i) {
      days_array[i] = {
        number: first_array_element + i,
        from: 'prev month',
        month: prev_month.getMonth() + 1,
        year: prev_month.getFullYear(),
        weekend: i % 7 > 4
      }
    }

    for (let k = 1; k <= current_month_last_day; ++k) {
      days_array[i] = {
        number: k,
        from: 'current month',
        month: date.getMonth() + 1,
        year: date.getFullYear(),
        weekend: i % 7 > 4
      }
      i++
    }

    for (let k = 0; i < days_array.length; ++k) {
      days_array[i] = {
        number: k + 1,
        month: next_month.getMonth() + 1,
        year: next_month.getFullYear(),
        from: 'next month',
        weekend: i % 7 > 4
      }
      i++
    }

    return days_array
  }

  this.zeroPad = function(n) {
    return n > 9 ? '' + n : '0' + n
  }

  //returns a filled and styled table DOM element
  this.createCalendarBody = function(date, current_month) {
    let
      days_array = this.createDaysArray(date),
      table = document.createDocumentFragment(),
      i = 0

    for (let j = 0; j < 6; ++j) {
      let tr = document.createElement('tr')

      for (let k = 0; k < 7; ++k) {
        let td = document.createElement('td')
        td.dataset.day = days_array[i].number
        td.id = days_array[i].year + '-' + this.zeroPad(days_array[i].month) + '-' + this.zeroPad(days_array[i].number)
        td.innerHTML = '<div class="calendar__day">' + days_array[i].number + '</div>'
        tr.appendChild(td)

        //add the styles that depend on what month the day belongs to
        td.classList.add('calendar-cell')
        if (days_array[i].from !== 'current month') {
          td.classList.add('calendar-cell-gray')
        }
        else {
          if (current_month && this.selected_date.getDate() == days_array[i].number) {
            td.classList.add('calendar-cell-selected')
          }

          if (current_month && this.current_day == days_array[i].number) {
            td.classList.add('calendar-cell-today')
          }
        }

        if (days_array[i].weekend)
          td.classList.add('calendar-cell-weekend')


        ++i
      }
      tr.classList.add('calendar-body-row')
      table.appendChild(tr)

      if (days_array[i] && days_array[i].from == 'next month') break;
    }

    this.addBookableEvents(table, this.bookableEvents)

    return table
  }

  //returns month name from date
  this.getMonthName = function(date) {
    return this.month_names[this.lang][date.getMonth()]
  }

  //if the received date corresponds to the current month and year returns true
  this.isThisMonthCurrent = function(date) {
    let current = new Date()
    return current.getFullYear() == date.getFullYear() &&
      current.getMonth() == date.getMonth();
  }

  //redraws the body according to the received date
  this.setDateTo = function(date) {
    let
      current_month = this.isThisMonthCurrent(date), //if it is current month, current day will be highlighted
      new_body = this.createCalendarBody(date, current_month)

    this.year_node.innerHTML = date.getFullYear()
    this.month_node.innerHTML = this.getMonthName(date)
    this.body_node.innerHTML = ''
    this.body_node.appendChild(new_body)
  }

  //redraws the calendar a month in backward
  this.moveLeft = function() {
    this.displayed_date = new Date( //set the day to prev month
      this.displayed_date.getFullYear(),
      this.displayed_date.getMonth() - 1,
      1
    )

    this.setDateTo(this.displayed_date)
  }

  //redraws the calendar a month in forward
  this.moveRight = function() {
    this.displayed_date = new Date( //set the day to next month
      this.displayed_date.getFullYear(),
      this.displayed_date.getMonth() + 1,
      1
    )

    this.setDateTo(this.displayed_date)
  }

  //handles user clicks on cells
  this.selectHandler = function(e) {
    if (e.target.classList.contains('calendar-cell-gray')) return //only days of current month can be selected
    if (!e.target.classList.contains('calendar-cell')) return //if it wasn't a click on a cell

    let prev_selected = this.body_node.querySelector('.calendar-cell-selected')

    if (prev_selected) {
      prev_selected.classList.remove('calendar-cell-selected')
    }

    this.selected_date = new Date(
      this.displayed_date.getFullYear(),
      this.displayed_date.getMonth(),
      e.target.dataset.day
    )

    e.target.classList.add('calendar-cell-selected')
  }

  this.addBookableEvents = function(table, events) {
    let cells = table.querySelectorAll('.calendar-cell')

    function displayEventTime(start, end) {
      return '◴\u00A0' + start.replace(':00', '') + (end && '\u00A0-\u00A0' + end.replace(':00', ''));
    }

    for (let i = 0; i < cells.length; i++) {
      let dayNode = cells[i]
      for (let i in events) {
        let event = events[i]
        if (dayNode.id < this.firstDay) continue
        if (event.weekendOnly && !dayNode.classList.contains('calendar-cell-weekend')) continue
        const e = document.createElement('div')
        e.id = dayNode.id + ' ' + event.start
        e.dataset.date = dayNode.id
        e.dataset.time = event.start
        e.dataset.until = event.end
        e.classList.add('event')
        e.innerText = displayEventTime(event.start, event.end)

        if (!this.bookings) {
          e.classList.add('loading')
        }
        else {
          const booking = this.bookings[e.id]
          if (booking) {
            e.classList.add('booked')
            e.innerText = displayEventTime(booking.correctedTime || booking.time,
                          booking.correctedTime ? '' : booking.until) + ' ' + booking.childName
            if (booking.publicEvent) {
              e.classList.add('public')
              e.onclick = function() {location.href = booking.externalUrl || '/syndmused/'}
            }
          }
        }
        dayNode.appendChild(e)
      }
    }
  }

  this.draw();
}
