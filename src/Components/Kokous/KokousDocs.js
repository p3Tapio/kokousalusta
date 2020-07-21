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

    }, [kokous.id, yhdistys])

    const handleOpenDocumentClick = (item) => {
        setDocument(item)
        setShowTable(!showTable)
    }

    return (
        <div className="m-auto">
            {showTable
                ?
                < table className="table table-hover table-borderless mt-2">
                    <tbody>
                        {kokousDocuments.map(item => 
                            <tr key={item.id} onClick={() => handleOpenDocumentClick(item)} style={{cursor:"pointer"}}>
                                <td>{item.type}</td>
                            </tr>)}
                    </tbody>
                </table>
                : <DocumentReadOnly setShowTable={setShowTable} document={document}/>
            }
        </div >
    )
}

export default KokousDocs
