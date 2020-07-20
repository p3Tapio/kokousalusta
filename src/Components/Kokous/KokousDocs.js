import React, { useState, useEffect } from 'react'
import DocumentReadOnly from '../../Components/Document/DocumentReadOnly'
import request from '../Shared/HttpRequests'

const KokousDocs = ({ kokous, yhdistys, setShowTable, showTable }) => {

    const [kokousDocuments, setKokousDocuments] = useState([])
    const [document, setDocument] = useState([])

    useEffect(() => {
        const body = JSON.stringify({ call: 'getdocuments', kokousid: kokous.id })
        request.documents(body).then(res => {
            setKokousDocuments(res.data)
        }).catch(err => console.log('err.response.data.message', err.response.data.message))

    }, [kokous.kokousnro, yhdistys])

    const handleOpenDocumentClick = (item) => {
        setDocument(item)
        setShowTable(!showTable)
    }

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
                        {kokousDocuments.map(item => 
                            <tr key={item.id}>
                                <td>{item.type}</td><td><button className="btn btn-outline-primary btn-sm" onClick={() => handleOpenDocumentClick(item)}>avaa</button></td>
                            </tr>)}
                    </tbody>
                </table>
                : <DocumentReadOnly setShowTable={setShowTable} document={document}/>
            }
        </div >
    )
}

export default KokousDocs
