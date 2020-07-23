// https://stackoverflow.com/questions/45596329/display-pdf-in-reactjs

import React from 'react'

const UploadedDocs = ({ upload }) => {
    console.log('uploaded', upload)
    return (
        <div>
            <p>UPLOADED DOCUMENT</p>
            {upload.nimi}
        </div>
    )
}

export default UploadedDocs
