import React from 'react'

const Jasenlista = ({members}) => {
    return (
        
        <div className="mt-5">
            <h5 className="mt-4">Yhdistyksen jäsenet</h5>
            <table className="table table-hover">
                <thead>
                    <tr className="table-primary"><th>Etunimi</th><th>Sukunimi</th><th>Sähköpostiosoite</th></tr>
                </thead>
                <tbody>
                    {members.map((item, key) =>
                        <tr key={key + item.firstname}>
                            <td>{item.firstname}</td>
                            <td>{item.lastname}</td>
                            <td>{item.email}</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    )
}
export default Jasenlista
