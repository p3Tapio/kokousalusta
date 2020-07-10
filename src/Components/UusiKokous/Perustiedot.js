import React from 'react'
import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import fi from 'date-fns/locale/fi';

const Perustiedot = ({ setShowComponent, handlePerustiedotChange, perustiedot,setPerustiedot }) => {

    registerLocale('fi', fi)

    return (
        <div className="col-md-6  m-auto">
            <h5 className="mb-4">Kokouksen perustiedot</h5>
            <div >
                <div className="form-group">
                    <label>Otsikko</label>
                    <input type="text" className="form-control" name="otsikko" onChange={handlePerustiedotChange} value={perustiedot.otsikko} />
                </div>
                <div className="form-group">
                    <label>Kokouksen numero</label>
                    <input type="text" className="form-control" name="kokousnro" onChange={handlePerustiedotChange} value={perustiedot.kokousNro} />
                </div>
                <div className="form-group">
                    <label>Kokous alkaa</label><br />
                    <DatePicker
                        name='startdate'
                        locale="fi"
                        dateFormat="dd/MM/yyyy"
                        className="form-control"
                        selected={perustiedot.startDate}
                        onChange={date => setPerustiedot({...perustiedot, startDate:date})}
                        selectsStart
                        startDate={perustiedot.startDate}
                        endDate={perustiedot.endDate}
                    />
                </div>
                <div className="form-group">
                    <label>Kokous päättyy</label><br />
                    <DatePicker
                        locale="fi"
                        dateFormat="dd/MM/yyyy"
                        className="form-control"
                        selected={perustiedot.endDate}
                        onChange={date => setPerustiedot({...perustiedot, endDate:date})}
                        selectsEnd
                        startDate={perustiedot.startDate}
                        endDate={perustiedot.endDate}
                        minDate={perustiedot.startDate}
                    />
                </div>
                <div className="text-right">
                    <button onClick={() => setShowComponent('esityslista')} className="btn btn-outline-primary mt-3">Seuraava</button>
                </div>
            </div>
            <hr />
        </div>
    )
}
export default Perustiedot