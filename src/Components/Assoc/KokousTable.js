import React, { useState } from 'react'
import request from '../Shared/HttpRequests'
import { Link } from 'react-router-dom'
import { FaInfoCircle, FaKey } from 'react-icons/fa';

const KokousTable = ({ kokous, yhdistys }) => {

    const pvmForm = { month: 'numeric', day: 'numeric', year: 'numeric' };
    const pvmYear = { year: 'numeric' };
    const [loading, setLoading] = useState(false)

    const openKokous = (id) => {
        if (window.confirm('Haluatko avata kokoustilan osallistujille?')) {
            setLoading(true)
            const body = JSON.stringify({ call: 'openkokous', id: id })
            console.log('body', body)
            request.kokous(body).then(res => {
                alert(res.data.message)
                window.location.reload()
            }).catch(err => {
                alert(err.response.data.message)
            })
        }
    }
    if (!loading) {
        return (
            <div>
                <table className="table table-hover">
                    <thead>
                        <tr className="table-primary"><th>Kokous</th><th>kokousnro</th><th>alku</th><th>loppu</th><th></th><th></th></tr>
                    </thead>
                    <tbody>
                        {kokous.map((item) =>
                            <tr key={item.kokousnro}>
                                <td>{item.otsikko}</td>
                                <td>{item.kokousnro}/{(new Date(item.endDate)).toLocaleDateString('fi-FI', pvmYear)}</td>
                                <td>{(new Date(item.startDate)).toLocaleDateString('fi-FI', pvmForm)}</td>
                                <td>{(new Date(item.endDate)).toLocaleDateString('fi-FI', pvmForm)}</td>
                                {item.avoinna === '1'
                                    ? <>
                                        <td>Kokoustila on avoinna</td>
                                        <td><Link to={`/kokous/${yhdistys}/${item.id}`} title="Tarkastele kokouksen tietoja" className="btn btn-outline-primary btn-sm btn-block" style={{ marginTop: '-5px' }}><FaInfoCircle /></Link></td>
                                    </>
                                    : <>
                                        <td>kokoustila on suljettu</td>
                                        {item.role === 'puheenjohtaja' ? <td><button onClick={() => openKokous(item.id)} id={item.id} title="Avaa kokoustila" className="btn btn-outline-primary btn-sm btn-block" style={{ marginTop: '-5px' }}><FaKey /></button></td>
                                            : <td></td>}
                                    </>
                                }
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        )
    } else {
        return <></>
    }
}
export default KokousTable