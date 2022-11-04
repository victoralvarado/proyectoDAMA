function padTo2Digits(num) {
            return String(num).padStart(2, '0');
        }

        ref.add({
            label: moment(s).format("h:mm A"),
            value: moment(s).format("h:mm A"),
            datetime: '' + s,
            h: parseInt(s.getHours() + "" + padTo2Digits(s.getMinutes()))
        })