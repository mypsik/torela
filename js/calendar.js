class Calendar {

    constructor(id) {
        this.displayed_date = new Date()                    //date wich calendar displays now
        this.current_day    = this.displayed_date.getDate() //current world time
        this.selected_date  = this.displayed_date           //date that user's selected

        this.drawToDom(this.displayed_date, id)

        this.body_node  = document.getElementById('calendar-body')
        this.year_node  = document.getElementById('calendar-year')
        this.month_node = document.getElementById('calendar-month')

        this.moveLeft      = this.moveLeft.bind(this)
        this.moveRight     = this.moveRight.bind(this)
        this.selectHandler = this.selectHandler.bind(this)
        this.setDateTo     = this.setDateTo.bind(this)

        this.body_node.addEventListener('click', this.selectHandler)

        document
            .getElementById('calendar-left-btn') //adds listeners for buttons
            .addEventListener('click', this.moveLeft)
        document
            .getElementById('calendar-right-btn')
            .addEventListener('click', this.moveRight)
    }

    //draws the calendar when the document is loaded
    drawToDom(date, id) {
        let
            year  = date.getFullYear(),
            month = this.getMonthName(date)

        document.getElementById(id).innerHTML = `
            <div id='calendar' class="calendar">
                <header class="calendar__head">
                    <div class="calendar__nav">
                        <div id='calendar-left-btn' class="calendar__btn">
                            <span class="icon-arrow-left"></span>
                        </div>
                        <div class="calendar__head-text">
                            <span id='calendar-month' class="calender-header-text-month">${month}</span>
                            <span id='calendar-year' class="calender-header-text-year">${year}</span>
                        </div>
                        <div id='calendar-right-btn' class="calendar__btn">
                            <span class="icon-arrow-right"></span>
                        </div>
                    </div>
                    <table class="calendar__head-days">
                        <td class='calendar__head-days-item'>MON</td>
                        <td class='calendar__head-days-item'>TUE</td>
                        <td class='calendar__head-days-item'>WED</td>
                        <td class='calendar__head-days-item'>THU</td>
                        <td class='calendar__head-days-item'>FRI</td>
                        <td class='calendar__head-days-item'>SAT</td>
                        <td class='calendar__head-days-item'>SUN</td>
                    </table>
                </header>
                <table id="calendar-body" class='calendar__body'></table>
            </div>`

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
            prev_month_last_day = new Date( //number of the last day of the previous month
                date.getFullYear(),
                date.getMonth(),
                0
            ).getDate(),

            first_week_day = new Date( //number of the first day of the current month f.e. monday->1, wednesday->3
                date.getFullYear(),
                date.getMonth(),
                1
            ).getDay(),

            current_month_last_day = new Date(
                date.getFullYear(),
                date.getMonth() + 1,
                0
            ).getDate(),

            days_array = new Array(42),

            i = 0 // iterator for all three parts of array

        if (first_week_day == 0) first_week_day = 7 //if it was sunday

        let first_array_element = prev_month_last_day - first_week_day + 2

        //adds last days of previous month
        for (i = 0; i < first_week_day - 1; ++i){
            days_array[i] = {
                number: first_array_element + i,
                from: 'prev month'
            }
        }

        //adds days of current month
        for (let k = 1; k <= current_month_last_day; ++k) {
            days_array[i] = {
                number: k,
                from: 'currnet month',
                weekend: i % 7 > 4
            }
            i++
        }

        //adds days of next month
        for (let k = 0; i < days_array.length; ++k) {
            days_array[i] = {
                number: k + 1,
                from: 'next month'
            }
            i++
        }

        return days_array
    }

    //returns a  fulfilled and styled table DOM element
    createCalendarBody(date, current_month = false ) {
        let
            days_array = this.createDaysArray(date),
            table = document.createDocumentFragment(),
            i = 0

        for (let j = 0; j < 6; ++j) {
            let tr = document.createElement('tr')

            for (let k = 0; k < 7; ++k) {
                let td = document.createElement('td')
                td.innerHTML = days_array[i].number
                tr.appendChild(td)

                //add the styles that depend on what month the day belongs to
                td.classList.add('calendar-cell')
                if (days_array[i].from !== 'currnet month') {
                    td.classList.add('calendar-cell-gray')
                } else {
                    if (current_month && this.selected_date.getDate() == days_array[i].number) {
                        td.classList.add('calendar-cell-selected')
                        td.id = 'selected_date'
                    }

                    if (days_array[i].weekend)
                        td.classList.add('calendar-cell-green')

                    if (current_month && this.current_day == days_array[i].number) {
                        td.classList.add('calendar-cell-today')
                    }
                }
                ++i
            }
            tr.classList.add('calendar-body-row')
            table.appendChild(tr)
        }

        return table
    }

    //returns month name from date
    getMonthName(date) {
        const month_names = [
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
        ]

        return month_names[date.getMonth()]
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
            new_body      = this.createCalendarBody(date, current_month)

        this.year_node.innerHTML  = date.getFullYear()
        this.month_node.innerHTML = this.getMonthName(date)
        this.body_node.innerHTML  = ''
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
        if (!e.target.classList.contains('calendar-cell')) return //if it was   n't a click on a cell

        let prev_selected = document.getElementById('selected_date')

        if (prev_selected) {
            prev_selected.classList.remove('calendar-cell-selected')
            prev_selected.id = ''
        }

        this.selected_date = new Date(
            this.displayed_date.getFullYear(),
            this.displayed_date.getMonth(),
            e.target.innerHTML
        )

        e.target.id = 'selected_date'
        e.target.classList.add('calendar-cell-selected')
    }
}