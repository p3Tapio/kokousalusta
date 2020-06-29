import React from 'react'
import { getUser } from '../Auth/Sessions'

const Osallistujat = ({ members }) => {

    const adminEmail = getUser().email
    const osallistujat = members.filter(x => x.email !== adminEmail)

    return (
        <div className="mt-5">
            <h5 className="mt-4">Kokousosallistujat</h5>
            <table className="table table-hover">
                <thead>
                    <tr className="table-primary"><th>Etunimi</th><th>Sukunimi</th><th>Sähköpostiosoite</th><th></th></tr>
                </thead>
                <tbody>
                    {osallistujat.map((item, key) =>
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
export default Osallistujat
