import React from 'react'
import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import fi from 'date-fns/locale/fi';

const Perustiedot = ({ setShowComponent, handlePerustiedotChange, otsikko, kokousNro, endDate, setEndDate, startDate, setStartDate }) => {

    registerLocale('fi', fi)

    return (
        <>
            <h5 className="mb-4">Kokouksen perustiedot</h5>
            <form >
                <div className="form-group">
                    <label>Otsikko</label>
                    <input type="text" className="form-control" name="otsikko" onChange={handlePerustiedotChange} value={otsikko} />
                </div>
                <div className="form-group">
                    <label>Kokouksen numero</label>
                    <input type="text" className="form-control" name="kokousnro" onChange={handlePerustiedotChange} value={kokousNro} />
                </div>
                <div className="form-group">
                    <label>Kokous alkaa</label><br />
                    <DatePicker
                        name='startdate'
                        locale="fi"
                        dateFormat="dd/MM/yyyy"
                        className="form-control"
                        selected={startDate}
                        onChange={date => setStartDate(date)}
                        selectsStart
                        startDate={startDate}
                        endDate={endDate}
                    />
                </div>
                <div className="form-group">
                    <label>Kokous päättyy</label><br />
                    <DatePicker
                        locale="fi"
                        dateFormat="dd/MM/yyyy"
                        className="form-control"
                        selected={endDate}
                        onChange={date => setEndDate(date)}
                        selectsEnd
                        startDate={startDate}
                        endDate={endDate}
                        minDate={startDate}
                    />
                </div>
                <div className="form-group text-right">
                    <button onClick={() => setShowComponent('esityslista')} type="submit" className="btn btn-outline-primary mt-3">Seuraava</button>
                </div>
            </form>
            <hr />
        </>
    )
}
export default Perustiedot
