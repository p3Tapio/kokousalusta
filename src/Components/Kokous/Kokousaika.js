import React, { useState } from 'react'
import request from '../../Components/Shared/HttpRequests'
import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import fi from 'date-fns/locale/fi';

const Kokousaika = ({ kokousId, kokous, setKokous}) => {

    const [pickerDate, setPickerDate] = useState(Date.parse(kokous.endDate))
    // const end = Date.parse(kokous.endDate)
    const start = Date.parse(kokous.startDate)
    registerLocale('fi', fi)

    const handleVaihdaKokousaika = (date) => {

        if (typeof date === 'object' && Date.parse(date) !== Date.parse(kokous.endDate)) {

            const pvmForm = { month: 'numeric', day: 'numeric', year: 'numeric' };
            const uusiPvm = date.toISOString().split('T')[0]

            if (window.confirm(`Haluatko vaihtaa kokouksen uudeksi päättymispäiväksi ${(new Date(uusiPvm)).toLocaleDateString('fi-FI', pvmForm)}?`)) {
                setKokous({ ...kokous, endDate: uusiPvm })
                const body = JSON.stringify({ call: 'vaihdapvm', kokousid: kokousId, enddate: date })
                request.kokous(body).then(res => {
                    alert(res.data.message)
                }).catch(err => alert(err.response.data.message))
            }
        } else {
            alert("Määritä uusi päättymispäivä ennen tallentamista")
        }
    }
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
