import React from 'react'

const KokousOsallistujat = ({ osallistujat, jasenet, puheenjohtaja }) => {

    jasenet = jasenet.filter(jasen => !osallistujat.find(({ email }) => jasen.email === email))
    jasenet = jasenet.filter(jasen => !puheenjohtaja.find(({ email }) => jasen.email === email))

    return (
        <div>
            <h6>Puheenjohtaja: {puheenjohtaja[0].firstname} {puheenjohtaja[0].lastname} ({puheenjohtaja[0].email})</h6>
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
                            <td><button className="btn btn-outline-danger btn-sm" name={item.email}>Poista kokouksesta</button></td>
                        </tr>)}

                </tbody>
            </ table>
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
                            <td><button className="btn btn-outline-success btn-sm" name={item.email}>Siirrä kokoukseen</button></td>
                        </tr>)}

                </tbody>
            </ table>
        </div>
    )
}

export default KokousOsallistujat


// muutJasenet = jasenet.filter(jasen => !osallistujat.find(({ email }) => jasen.email === email))
// puheenjohtaja = osallistujat.filter(x => x.role === 'puheenjohtaja')
// osallistujat = osallistujat.filter(x => x.role === 'osallistuja')
