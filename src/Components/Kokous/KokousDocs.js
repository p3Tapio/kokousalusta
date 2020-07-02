import React, { useState, useEffect } from 'react'
import DocumentView from '../../Components/Document/DocumentView'
import request from '../Shared/HttpRequests'

const KokousDocs = ({ kokous, yhdistys, setShowTable, showTable }) => {

    const [kokousDocuments, setKokousDocuments] = useState([])
    const [document, setDocument] = useState([])


    useEffect(() => {

        const body = JSON.stringify({ call: 'getdocuments', kokousnro: kokous.kokousnro, yhdistys: yhdistys })
        request.documents(body).then(res => {
            setKokousDocuments(res.data)
        }).catch(err => console.log('err.response.data.message', err.response.data.message))

    }, [kokous.kokousnro, yhdistys])

    const handleOpenDocumentClick = (item) => {
        console.log('item', item)
        setDocument(item)
        setShowTable(!showTable)
    }

    console.log('getDocument', document)

    return (
        <div>
            {showTable
                ?
                < table className="table table-hover mt-4">
                    <thead>
                        <tr className="table-primary">
                            <th>Kokousasiakirjat</th><th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {kokousDocuments.map(item =>                 // name? otsikko? joku muu mikä? (tallennuksessa siis jsonissa eri kentässä ja tK:ssa sama)
                            <tr key={item.id}>
                                <td>{item.type}</td><td><button className="btn btn-outline-primary btn-sm" onClick={() => handleOpenDocumentClick(item)}>avaa</button></td>
                            </tr>)}
                    </tbody>
                </table>

                : <DocumentView setShowTable={setShowTable} document={document}/>
            }
        </div >
    )
}

export default KokousDocs
