import React, { useEffect, useState } from 'react'
import request from '../Shared/HttpRequests'
import { FilterRight, ColumnsGap } from 'react-bootstrap-icons'



const UploadedDocs = ({ upload }) => {
    const [pdf, setPdf] = useState()

    useEffect(() => {
        const body = JSON.stringify({ call: 'getpdf', polku: upload.polku, nimi: upload.nimi })


        request.documents(body, { method: 'post', responseType: 'arraybuffer' }).then(res => {

            console.log('typeof res.data', typeof res.data) // decode, mutta mihin ???? 
            console.log('res.data', res.data)
       
            const file = new Blob([res.data], {type: 'application/pdf'});
            console.log('file', file)
            const fileURL = URL.createObjectURL(file)
            window.open(fileURL)
            setPdf(fileURL)

            // $scope.content = $sce.trustAsResourceUrl(fileURL);

        }).catch(err => console.log('err.response', err.response))






    }, [upload])

    console.log('pdf', pdf)
    if (upload) {
        return (
            <div>
                <p>UPLOADED DOCUMENT</p>
                {upload.nimi}
                <div>
                    <embed src={pdf} type="application/pdf" height="100%" width="100%"></embed>
                    <object style={{ height: '85vh' }} data={pdf} type="application/pdf" width='100%' height='100%'>alt : <a href="test.pdf" />
                    </object>
                </div>
            </div>
        )
    } else {
        return <p>Loading... </p>
    }
}

export default UploadedDocs


            // // window.open("data:application/pdf," + encodeURI(pdfString)); 
            // const file = new Blob([res.data], { type: 'application/pdf' });

            // const fileUrl = URL.createObjectURL(file)
            // // window.open(fileUrl);
            // setPdf(fileUrl)
            // console.log('file', file)

