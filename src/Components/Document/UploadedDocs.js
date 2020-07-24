// https://stackoverflow.com/questions/45596329/display-pdf-in-reactjs

import React, {useEffect} from 'react'
import request from '../Shared/HttpRequests'

const UploadedDocs = ({ upload }) => {
    console.log('uploaded', upload)

    useEffect(() => {
        const body = JSON.stringify({ call: 'getpdf', polku: upload.polku, nimi: upload.nimi })
        request.documents(body).then(res => {
            console.log('res.data', res.data)
        })

    }, [upload])


    return (
        <div>
            <p>UPLOADED DOCUMENT</p>
            {upload.nimi}
        </div>
    )
}

export default UploadedDocs
