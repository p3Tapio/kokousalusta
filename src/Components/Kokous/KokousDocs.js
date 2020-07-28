import React, { useState, useEffect } from 'react'
import DocumentReadOnly from '../../Components/Document/DocumentReadOnly'
import request from '../Shared/HttpRequests'
import { getUser } from '../Auth/Sessions'
import UploadedDocs from '../Document/UploadedDocs'

const KokousDocs = ({ kokous, yhdistys, setShowTable, showTable }) => {

    const [kokousDocuments, setKokousDocuments] = useState([])
    const [document, setDocument] = useState([])
    const [uploadedDocs, setUploadedDocs] = useState([])
    const [upload, setUpload] = useState([])
    const [uploadOrNot, setUploadOrNot] = useState(true)
    // const [loading, setLoading] = useState(0)


    useEffect(() => {

        const body = JSON.stringify({ call: 'getdocuments', kokousid: kokous.id })
        request.documents(body).then(res => {
            setKokousDocuments(res.data)
        }).catch(err => {
            console.log('err.response.data.message', err.response.data.message)
            console.log('err', err)
        })
        const body2 = JSON.stringify({ call: "getuploads", kokousid: kokous.id, yhdistys: yhdistys })  // voiko php-metodin tehdä siten että se toimii myös vain yhdistyksen nimellä? 
        request.documents(body2).then(res => {
            console.log('res.data', res.data)
            setUploadedDocs(res.data)
        }).catch(err => console.log('getuploads error: ', err))
    }, [kokous.id, yhdistys])

    const handleOpenDocumentClick = (item) => {
        setDocument(item)
        setShowTable(!showTable)
        setUploadOrNot(false)
    }
    const handleOpenUploadedDoc = (item) => {
        setUpload(item)
        setShowTable(!showTable)
        setUploadOrNot(true)
    }
    // const handleFileUpload = (ev) => {
    //     if (ev.target.files[0].type === 'application/pdf') {
    //         if (window.confirm(`Haluatko lisätä tiedoston "${ev.target.files[0].name}" tietokantaan?`)) {
    //             saveDocument(ev.target.files[0])
    //         }
    //     } else {
    //         alert("Tiedoston tulee olla pdf-muodossa")
    //     }
    // }
    // const saveDocument = (file) => {

    //     let data = new FormData()
    //     data.append('kokousid', kokous.id)
    //     data.append('user', getUser().email)
    //     data.append('yhdistys', yhdistys)
    //     data.append('file', file)

    //     request.documents(data).then(() => {
    //         alert('Tiedosto tallennettu!')
    //         window.location.reload() 
    //     }).catch(err => console.log('savedocument error: ', err))
    // }

    let component
    if (uploadOrNot) {
        component = (
            < table className="table table-hover table-borderless mt-2">
                <tbody>
                    {kokousDocuments.map(item =>
                        <tr key={item.id} onClick={() => handleOpenDocumentClick(item)} style={{ cursor: "pointer" }}>
                            <td>{item.type}</td>
                        </tr>)}
                </tbody>
            </table>

        )
    } else if (!uploadOrNot) {
        component = (
            <>< table className="table table-hover table-borderless mt-2">
                <tbody>
                    {uploadedDocs.map(item =>
                        <tr key={item.id} onClick={() => handleOpenUploadedDoc(item)} style={{ cursor: "pointer" }}>
                            <td>{item.nimi.substring(10)}</td>
                        </tr>)}
                </tbody>
            </table>
            </>
        )

    }

    return (
        <div className="m-auto">
            {showTable
                ?
                < table className="table table-hover table-borderless mt-2">
                    <tbody>
                        {kokousDocuments.map(item =>
                            <tr key={item.id} onClick={() => handleOpenDocumentClick(item)} style={{ cursor: "pointer" }}>
                                <td>{item.type}</td>
                            </tr>)}
                    </tbody>
                </table>
                : uploadOrNot ? <></> : <DocumentReadOnly setShowTable={setShowTable} document={document} />}

            {showTable
                ? <>< table className="table table-hover table-borderless mt-2">
                    <tbody>
                        {uploadedDocs.map(item =>
                            <tr key={item.id} onClick={() => handleOpenUploadedDoc(item)} style={{ cursor: "pointer" }}>
                                <td>{item.nimi.substring(10)}</td>
                            </tr>)}
                    </tbody>
                </table>
                </>
                : uploadOrNot ? <UploadedDocs setShowTable={setShowTable} upload={upload} /> : <></>}

            {/* {showTable
                ? <div class="float-right mx-2">
                    <form method="POST" >
                        <label for="inputFile" className="btn btn-outline-primary">Lisää asiakirja</label>
                        <input type="file" name="file" class="form-control-file" id="inputFile" aria-describedby="fileHelp" onChange={handleFileUpload} style={{ display: 'none' }} />
                        <small id="fileHelp" class="form-text text-muted">Lataa haluamasi asiakirja pdf-muodossa.</small>
                    </form>
                </div>
                : <></>
            } */}
            {/* // TODO tämä ei saisi näkyä kuin pj:lle ja vain kun table on näkyvissä: */}

        </div >
    )
}

export default KokousDocs
