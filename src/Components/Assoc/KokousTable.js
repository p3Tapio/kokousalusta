import React from 'react'
import { Link } from 'react-router-dom'

import { FaInfoCircle } from 'react-icons/fa';

const KokousTable = ({ kokous, yhdistys, status }) => {

    const pvmForm = { month: 'numeric', day: 'numeric', year: 'numeric' };
    const pvmYear = { year: 'numeric' };
    console.log('status', status)

    return (
        <div>
            <table className="table table-hover">
                <thead>
                    <tr className="table-primary"><th>Kokous</th><th>kokousnro</th><th>alku</th><th>loppu</th><th></th></tr>
                </thead>
                <tbody>
                    {kokous.map((item) =>
                        <tr key={item.kokousnro}>
                            <td>{item.otsikko}</td>
                            <td>{item.kokousnro}/{(new Date(item.endDate)).toLocaleDateString('fi-FI', pvmYear)}</td>
                            <td>{(new Date(item.startDate)).toLocaleDateString('fi-FI', pvmForm)}</td>
                            <td>{(new Date(item.endDate)).toLocaleDateString('fi-FI', pvmForm)}</td>
                            {status === 'kaynnissa' ? <td><Link to={`/kokous/${yhdistys}/${item.id}`} title="Tarkastele kokouksen tietoja" className="btn btn-outline-primary"><FaInfoCircle /></Link></td>
                                : <td><button className="btn btn-outline-secondary disabled"><FaInfoCircle /></button></td>}
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    )
}

export default KokousTable
