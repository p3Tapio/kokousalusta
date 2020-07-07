import React, { useState } from 'react'
import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import fi from 'date-fns/locale/fi';

const Kokousaika = ({ kokous,  handleVaihdaKokousaika }) => {

    const [pickerDate, setPickerDate] = useState(Date.parse(kokous.endDate))
    const start = Date.parse(kokous.startDate)
    registerLocale('fi', fi)

    return (
        <div className="row">
            <div className="col-md-5 m-auto">
                <div className="card card-body mt-3">
                    <div className="form-group">
                        <label className="mb-3">Vaihda kokouksen päättymisajankohta: </label><br />
                        <DatePicker
                            locale="fi"
                            dateFormat="dd/MM/yyyy"
                            className="form-control"
                            selected={pickerDate}
                            onChange={date => setPickerDate(date)}
                            selectsEnd
                            endDate={pickerDate}
                            minDate={start}
                        /><br />
                        <button onClick={() => handleVaihdaKokousaika(pickerDate)} className="btn btn-outline-primary btn-sm mt-4">Tallenna</button>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default Kokousaika