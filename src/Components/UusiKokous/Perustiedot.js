import React from 'react'
import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import fi from 'date-fns/locale/fi';

const Perustiedot = ({ setShowComponent, handlePerustiedotChange, saveKokousDraft, perustiedot, setPerustiedot }) => {

    registerLocale('fi', fi)
    let x = perustiedot.avoinna ? "Avoinna" : "Kiinni"
    if (perustiedot) {
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
                        <input type="text" className="form-control" name="kokousnro" onChange={handlePerustiedotChange} value={perustiedot.kokousNro || ''} />
                    </div>
                    <div className="form-group">
                        <label>Kokous alkaa</label><br />
                        <DatePicker
                            name='startdate'
                            locale="fi"
                            dateFormat="dd/MM/yyyy"
                            className="form-control"
                            selected={perustiedot.startDate}
                            onChange={date => setPerustiedot({ ...perustiedot, startDate: date })}
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
                            onChange={date => setPerustiedot({ ...perustiedot, endDate: date })}
                            selectsEnd
                            startDate={perustiedot.startDate}
                            endDate={perustiedot.endDate}
                            minDate={perustiedot.startDate}
                        />
                    </div>
                    <div className="form-group custom-control custom-switch">
                        <input type="checkbox" className="custom-control-input" onChange={handlePerustiedotChange} id="avaa" value={perustiedot.avoinna} checked={perustiedot.avoinna} />
                        <label className="custom-control-label" htmlFor="avaa">Avaa kokoustila heti osallistujille</label>
                    </div><p>Tila: {x}</p>
                    <div className="text-right">
                        <button onClick={() => { setShowComponent('esityslista'); saveKokousDraft() }} className="btn btn-outline-primary mt-3">Seuraava</button>
                    </div>
                </div>
                <hr />
            </div>
        )
    }else {
        return <p>Loading .... </p>
    }
}
export default Perustiedot
