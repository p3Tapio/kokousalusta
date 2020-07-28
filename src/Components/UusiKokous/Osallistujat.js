import React, { useEffect } from 'react'

const Osallistujat = ({ puheenjohtaja, osallistujat, setOsallistujat, saveOsallistujat, varalla, setVaralla, setShowComponent }) => {

    useEffect(() => {
        saveOsallistujat()
    }, [osallistujat])

    const handleVaralleClick = (ev) => {
        const vara = osallistujat.filter(x => x.email === ev.target.name)
        setVaralla(varalla.concat(vara))
        setOsallistujat(osallistujat.filter(x => x.email !== ev.target.name))
    }
    const handleOsallistuuClick = (ev) => {
        const osallistuja = varalla.filter(x => x.email === ev.target.name)
        setOsallistujat(osallistujat.concat(osallistuja))
        setVaralla(varalla.filter(x => x.email !== ev.target.name))
    }

    return (
        <div className="mt-5 mx-auto col-md-10">
            <h5 className="mb-4">Osallistujat</h5>
            <h6>Puheenjohtaja:{' '} {puheenjohtaja[0].firstname} {puheenjohtaja[0].lastname} ({puheenjohtaja[0].email})</h6>
            <div className="mt-1">
                {osallistujat.length > 0
                    ? <>
                        <h5 className="mt-4">Kokousosallistujat</h5>
                        < table className="table table-hover">
                            <thead>
                                <tr className="table-primary"><th>Etunimi</th><th>Sukunimi</th><th>Sähköpostiosoite</th><th></th></tr>
                            </thead>
                            <tbody>
                                {osallistujat.map((item, key) =>
                                    <tr key={key + item.firstname}>
                                        <td>{item.firstname}</td>
                                        <td>{item.lastname}</td>
                                        <td>{item.email}</td>
                                        <td><button onClick={handleVaralleClick} className="btn btn-outline-primary btn-sm" name={item.email}>Poista osallistujalistalta</button></td>
                                    </tr>
                                )}
                            </tbody>
                        </table></>
                    :
                    <h6>Kokouksessa ei ole osallistujia</h6>
                }
                {varalla.length > 1
                    ? <>
                        <h5 className="mt-4">Muut yhdistyksen jäsenet</h5>
                        < table className="table table-hover">
                            <thead>
                                <tr className="table-primary"><th>Etunimi</th><th>Sukunimi</th><th>Sähköpostiosoite</th><th></th></tr>
                            </thead>
                            <tbody>
                                {varalla.filter(x => x.email !== puheenjohtaja[0].email).map((item, key) =>
                                    <tr key={key + item.firstname}>
                                        <td>{item.firstname}</td>
                                        <td>{item.lastname}</td>
                                        <td>{item.email}</td>
                                        <td><button onClick={handleOsallistuuClick} className="btn btn-outline-primary btn-sm" name={item.email} >Siirrä kokousosallistujaksi</button></td>
                                    </tr>
                                )}
                            </tbody>
                        </table></>
                    :
                    <h6>Kaikki yhdistyksen jäsenet ovat osallistujalistalla</h6>
                }
            </div>
            {/* <div className="form-group text-right">
                <button onClick={() => { setShowComponent('paatosvaltaisuus'); saveOsallistujat() }} type="submit" className="btn btn-outline-primary mt-3">Seuraava</button>
            </div> */}
            <hr />
        </div >

    )
}
export default Osallistujat
