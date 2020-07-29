import React from 'react'

const KokousOsallistujat = ({ osallistujat, jasenet, puheenjohtaja, kokousRooli, handleOsallistujatClick, kokous }) => {

    jasenet = jasenet.filter(jasen => !osallistujat.find(({ email }) => jasen.email === email))
    jasenet = jasenet.filter(jasen => !puheenjohtaja.find(({ email }) => jasen.email === email))

    return (
        <div style={{ marginTop: "4px" }} >
            < table className="table table-hover table-responsive-sm">
                <thead>
                    <tr className="table-primary"><th>Etunimi</th><th>Sukunimi</th><th>Sähköpostiosoite</th><th></th></tr>
                </thead>
                <tbody>
                    {osallistujat.map((item, key) =>
                        <tr key={key + item.firstname}>
                            <td>{item.firstname}</td>
                            <td>{item.lastname}</td>
                            <td>{item.email}</td>
                            {kokousRooli === 'puheenjohtaja' && kokous.loppu === "0" ? <td><button className="btn btn-outline-danger btn-sm" name={item.email} id="varalle" onClick={handleOsallistujatClick}>Poista kokouksesta</button></td> : <td></td>}
                        </tr>)}
                </tbody>
            </ table>
            {jasenet.length !== 0
                ? <>
                    <h5 className="mx-2">Muut yhdistyksen jäsenet</h5>
                    < table className="table table-hover  table-responsive-sm">
                        <thead>
                            <tr className="table-primary"><th>Etunimi</th><th>Sukunimi</th><th>Sähköpostiosoite</th><th></th></tr>
                        </thead>
                        <tbody>
                            {jasenet.map((item, key) =>
                                <tr key={key + item.firstname}>
                                    <td>{item.firstname}</td>
                                    <td>{item.lastname}</td>
                                    <td>{item.email}</td>
                                    {kokousRooli === 'puheenjohtaja' && kokous.loppu === "0" ? <td><button className="btn btn-outline-success btn-sm" name={item.email} id="osallistujaksi" onClick={handleOsallistujatClick}>Siirrä kokoukseen</button></td> : <td></td>}
                                </tr>)}

                        </tbody>
                    </ table> </>
                : <><hr /><p className="ml-2">Kaikki yhdistyksen jäsenet osallistuvat kokoukseen.</p></>}
        </div>
    )
}

export default KokousOsallistujat
    // PJ: Voi siirtää kokousosallistujan tilaan “Estynyt” ja voi nostaa nimeämänsä varakokousosallistujan varsinaiseksi kokousosallistujaksi  ????
    // Kokousosallistuja: Voi ilmoittaa esteellisyydestä yksittäiseen kokoukseen ja nimetä varakokousedustajan kokousosallistujaksi tilalleen  ????
