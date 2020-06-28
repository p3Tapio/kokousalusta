import React from 'react'

const Osallistujat = ({members}) => {
    return (
        <div className="mt-5">
            <h5 className="mt-4">Valitse kokousosallistujat</h5>
            <table className="table table-hover">
                <thead>
                    <tr className="table-primary"><th>Etunimi</th><th>Sukunimi</th><th>Sähköpostiosoite</th><th></th></tr>
                </thead>
                <tbody>
                    {members.map((item, key) =>
                        <tr key={key + item.firstname}>
                            <td>{item.firstname}</td>
                            <td>{item.lastname}</td>
                            <td>{item.email}</td>
                            <td className="text-center"><button className="btn btn-outline-primary btn-sm mt-1 mx-1">Osallistuja</button>
                            <button className="btn btn-outline-primary btn-sm mt-1 mx-1">Varaosallistuja</button></td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    )
}
export default Osallistujat
