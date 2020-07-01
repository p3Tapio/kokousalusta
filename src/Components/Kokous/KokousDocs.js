import React, { useState, useEffect } from 'react'
import request from '../Shared/HttpRequests'

const KokousDocs = ({ kokous, yhdistys }) => {

    const [kokousDocuments, setKokousDocuments] = useState([])

    useEffect(() => {

        const body = JSON.stringify({ call: 'getdocuments', kokousnro: kokous.kokousnro, yhdistys: yhdistys })
        request.documents(body).then(res => {
            setKokousDocuments(res.data)
        }).catch(err => console.log('err.response.data.message', err.response.data.message))

    }, [kokous.kokousnro, yhdistys])

    return (
        <div>
            <table className="table table-hover mt-4">
                <thead>
                <tr className="table-primary">
                        <th>Kokousasiakirjat</th><th></th>
                    </tr>
                </thead>
                <tbody>
                    {kokousDocuments.map((item, key) =>                 // name? otsikko? joku muu mikä? (tallennuksessa siis jsonissa eri kentässä ja tK:ssa sama)
                        <tr key={key}>
                            <td>{item.type}</td><td><button className="btn btn-outline-primary btn-sm">avaa</button></td>
                        </tr>)}
                </tbody>
            </table>
        </div>
    )
}

export default KokousDocs
