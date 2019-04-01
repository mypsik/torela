class Calendar {

  constructor(id, lang, bookableEvents, firstDay) {
    this.lang = lang || 'en'
    this.bookableEvents = bookableEvents || []
    this.firstDay = firstDay
    this.bookings = {}
    this.displayed_date = new Date()                    //date wich calendar displays now
    this.current_day = this.displayed_date.getDate() //current world time
    this.selected_date = this.displayed_date           //date that user's selected

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

  setBookings(bookings) {
    this.bookings = bookings
    this.setDateTo(this.displayed_date)
  }

  //draws the calendar when the document is loaded
  drawToDom(date, id) {
    let
      year = date.getFullYear(),
      month = this.getMonthName(date)

    document.getElementById(id).innerHTML = `
            <table id='calendar' class="calendar">
                <thead class="calendar__head">
                    <tr class="calendar__nav">
                      <td colspan="7">
                        <div id='calendar-left-btn' class="calendar__btn">
                            <span class="icon-arrow-left">&lt;</span>
                        </div>
                        <div id='calendar-right-btn' class="calendar__btn">
                            <span class="icon-arrow-right">&gt;</span>
                        </div>
                        <div class="calendar__head-text">
                            <span id='calendar-month' class="calender-header-text-month">${month}</span>
                            <span id='calendar-year' class="calender-header-text-year">${year}</span>
                        </div>
                      </td>  
                    </tr>
                    <tr class="calendar__head-days">
                        <th class='calendar__head-days-item'>${this.weekday_names[this.lang][0]}</th>
                        <th class='calendar__head-days-item'>${this.weekday_names[this.lang][1]}</th>
                        <th class='calendar__head-days-item'>${this.weekday_names[this.lang][2]}</th>
                        <th class='calendar__head-days-item'>${this.weekday_names[this.lang][3]}</th>
                        <th class='calendar__head-days-item'>${this.weekday_names[this.lang][4]}</th>
                        <th class='calendar__head-days-item'>${this.weekday_names[this.lang][5]}</th>
                        <th class='calendar__head-days-item'>${this.weekday_names[this.lang][6]}</th>
                    </tr>
                </thead>
                <tbody id="calendar-body" class='calendar__body'></tbody>
            </table>`

    let body = this.createCalendarBody(
      this.displayed_date,
      true
    )

    document.getElementById('calendar-body').appendChild(body)
  }

  //creates an array of 42 objects corresponding to the given date
  /*[
  ...
      {
          number: 23,
          from: 'current month',  //can also be 'prev month', 'next month', used for styling
          weekend: true           //says if this day is a day off (for styling)
      },
  ...
  ]*/
  createDaysArray(date) {
    let
      prev_month_last_day = new Date(date.getFullYear(), date.getMonth(), 0).getDate(),
      prev_month = new Date(date.getFullYear(), date.getMonth(), 0).getMonth() + 1,

      first_week_day = new Date( //number of the first day of the current month f.e. monday->1, wednesday->3
        date.getFullYear(), date.getMonth(), 1).getDay(),
      current_month = date.getMonth() + 1,

      current_month_last_day = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate(),
      next_month = new Date(date.getFullYear(), date.getMonth() + 1, 1).getMonth() + 1,

      days_array = new Array(42),

      i = 0 // iterator for all three parts of array

    if (first_week_day == 0) first_week_day = 7 //if it was sunday

    let first_array_element = prev_month_last_day - first_week_day + 2

    for (i = 0; i < first_week_day - 1; ++i) {
      days_array[i] = {
        number: first_array_element + i,
        from: 'prev month',
        month: prev_month,
        weekend: i % 7 > 4
      }
    }

    for (let k = 1; k <= current_month_last_day; ++k) {
      days_array[i] = {
        number: k,
        from: 'current month',
        month: current_month,
        weekend: i % 7 > 4
      }
      i++
    }

    for (let k = 0; i < days_array.length; ++k) {
      days_array[i] = {
        number: k + 1,
        month: next_month,
        from: 'next month',
        weekend: i % 7 > 4
      }
      i++
    }

    return days_array
  }

  zeroPad(n) {
    return n > 9 ? `${n}` : `0${n}`
  }

  //returns a filled and styled table DOM element
  createCalendarBody(date, current_month = false) {
    let
      days_array = this.createDaysArray(date),
      table = document.createDocumentFragment(),
      i = 0

    for (let j = 0; j < 6; ++j) {
      let tr = document.createElement('tr')

      for (let k = 0; k < 7; ++k) {
        let td = document.createElement('td')
        td.dataset.day = days_array[i].number
        td.id = `${date.getFullYear()}-${this.zeroPad(days_array[i].month)}-${this.zeroPad(days_array[i].number)}`
        td.innerHTML = `<div class="calendar__day">${days_array[i].number}</div>`
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
    }

    this.addBookableEvents(table, this.bookableEvents)

    return table
  }

  //returns month name from date
  getMonthName(date) {
    return this.month_names[this.lang][date.getMonth()]
  }

  //if the received date corresponds to the current month and year returns true
  isThisMonthCurrent(date) {
    let current = new Date()
    if (
      current.getFullYear() == date.getFullYear() &&
      current.getMonth() == date.getMonth()
    )
      return true
    else
      return false
  }

  //redraws the body according to the received date
  setDateTo(date) {
    let
      current_month = this.isThisMonthCurrent(date), //if it is current month, current day will be highlighted
      new_body = this.createCalendarBody(date, current_month)

    this.year_node.innerHTML = date.getFullYear()
    this.month_node.innerHTML = this.getMonthName(date)
    this.body_node.innerHTML = ''
    this.body_node.appendChild(new_body)
  }

  //redraws the calendar a month in backward
  moveLeft() {
    this.displayed_date = new Date( //set the day to prev month
      this.displayed_date.getFullYear(),
      this.displayed_date.getMonth() - 1,
      1
    )

    this.setDateTo(this.displayed_date)
  }

  //redraws the calendar a month in forward
  moveRight() {
    this.displayed_date = new Date( //set the day to next month
      this.displayed_date.getFullYear(),
      this.displayed_date.getMonth() + 1,
      1
    )

    this.setDateTo(this.displayed_date)
  }

  //handles user clicks on cells
  selectHandler(e) {
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

  addBookableEvents(table, events) {
    table.querySelectorAll('.calendar-cell').forEach(dayNode => {
      for (let event of events) {
        if (dayNode.id < this.firstDay) continue
        if (event.weekendOnly && !dayNode.classList.contains('calendar-cell-weekend')) continue
        const e = document.createElement('div')
        e.id = dayNode.id + ' ' + event.start
        e.dataset.date = dayNode.id
        e.dataset.time = event.start
        e.dataset.until = event.end
        e.classList.add('event')
        if (this.bookings[e.id]) e.classList.add('booked')
        e.innerText = `◴\u00A0${event.start.replace(':00', '')} - ${event.end}`
        dayNode.appendChild(e)
      }
    })
  }

  weekday_names = {
    en: [
      'Mon',
      'Tue',
      'Wed',
      'Thu',
      'Fri',
      'Sat',
      'Sun'
    ],
    et: [
      'E',
      'T',
      'K',
      'N',
      'R',
      'L',
      'P'
    ],
    ru: [
      'Пн',
      'Вт',
      'Ср',
      'Чт',
      'Пт',
      'Сб',
      'Вс'
    ]
  }

  month_names = {
    en: [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December'
    ],
    et: [
      'Jaanuar',
      'Veebruar',
      'Märts',
      'Aprill',
      'Mai',
      'Juuni',
      'Juuli',
      'August',
      'September',
      'Oktoober',
      'November',
      'Detsember'
    ],
    ru: [
      'Январь',
      'Февраль',
      'Март',
      'Апрель',
      'Май',
      'Июнь',
      'Июль',
      'Август',
      'Сентябрь',
      'Октябрь',
      'Ноябрь',
      'Декабрь'
    ]
  }
}