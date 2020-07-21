import React from 'react'

const KokousOsallistujat = ({ osallistujat, jasenet, puheenjohtaja, kokousRooli, handleOsallistujatClick }) => {

    jasenet = jasenet.filter(jasen => !osallistujat.find(({ email }) => jasen.email === email))
    jasenet = jasenet.filter(jasen => !puheenjohtaja.find(({ email }) => jasen.email === email))
   
    return (
        <div>
            <div className="mb-4 mt-4">
                <button className="btn btn-outline-danger mb-2 ml-2" title="Peru osallistumisesi kokoukseen" id="poistu" onClick={handleOsallistujatClick}>Peru osallistumisesi</button>
            </div>
            <h5>Osallistujat</h5>
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
                            {kokousRooli === 'puheenjohtaja' ? <td><button className="btn btn-outline-danger btn-sm" name={item.email} id="varalle" onClick={handleOsallistujatClick}>Poista kokouksesta</button></td> : <td></td>}
                        </tr>)}
                </tbody>
            </ table>
            {jasenet.length !== 0
                ? <>
                    <h5>Muut yhdistyksen jäsenet</h5>
                    < table className="table table-hover">
                        <thead>
                            <tr className="table-primary"><th>Etunimi</th><th>Sukunimi</th><th>Sähköpostiosoite</th><th></th></tr>
                        </thead>
                        <tbody>
                            {jasenet.map((item, key) =>
                                <tr key={key + item.firstname}>
                                    <td>{item.firstname}</td>
                                    <td>{item.lastname}</td>
                                    <td>{item.email}</td>
                                    {kokousRooli === 'puheenjohtaja' ? <td><button className="btn btn-outline-success btn-sm" name={item.email} id="osallistujaksi" onClick={handleOsallistujatClick}>Siirrä kokoukseen</button></td> : <td></td>}
                                </tr>)}

                        </tbody>
                    </ table> </>
                : <p>Kaikki yhdistyksen jäsenet ovat kokousosallistujia.</p>}
        </div>
    )
}

export default KokousOsallistujat
    // PJ: Voi siirtää kokousosallistujan tilaan “Estynyt” ja voi nostaa nimeämänsä varakokousosallistujan varsinaiseksi kokousosallistujaksi  ????
    // Kokousosallistuja: Voi ilmoittaa esteellisyydestä yksittäiseen kokoukseen ja nimetä varakokousedustajan kokousosallistujaksi tilalleen  ????
