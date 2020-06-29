import React, { useState, useEffect } from 'react'
import { useParams, useHistory, Link } from 'react-router-dom'
import { getSessionRole } from '../../Components/Auth/Sessions'
import request from '../../Components/Shared/HttpRequests'

const KokousDetails = () => {
    let history = useHistory()
    const pvmForm = { month: 'numeric', day: 'numeric', year: 'numeric' };
    const pvmYear = { year: 'numeric' };
    const { yhdistys } = useParams()
    const { kokousId } = useParams()
    const [kokous, setKokous] = useState()

    useEffect(() => {

        if (getSessionRole()) {
            const body = JSON.stringify({ call: 'getkokous', id: kokousId })
            console.log('body', body)
            request.kokous(body).then(res => {
                setKokous(res.data)
            }).catch(err => console.log('err.response.data', err.response.data))
        }
    }, [kokousId])

    if (getSessionRole() && getSessionRole().yhdistys === yhdistys) {
        if (kokous) {
            let component, text
            if (Date.parse(kokous.endDate) < new Date()) {  // mennyt 
                text = "Kokous on päättynyt"
                component = (<>
                    <p>Kokous alkoi: {(new Date(kokous.startDate)).toLocaleDateString('fi-FI', pvmForm)}</p>
                    <p>Kokous päättyi: {(new Date(kokous.endDate)).toLocaleDateString('fi-FI', pvmForm)}</p>
                </>)
            } else if (Date.parse(kokous.endDate) > new Date() && Date.parse(kokous.startDate) < new Date()) { // päätos tulevaisuudessa alku, menneisyydessä --> käynnissä 
                text = "Kokous on käynnissä"
                component = (<>
                    <p>Kokous alkoi: {(new Date(kokous.startDate)).toLocaleDateString('fi-FI', pvmForm)}</p>
                    <p>Kokous päättyy: {(new Date(kokous.endDate)).toLocaleDateString('fi-FI', pvmForm)}</p>
                </>)
            } else {    // muuten tuleva 
                text = "Kokous ei ole vielä alkanut"
                component = (<>
                    <p>Kokous alkaa: {(new Date(kokous.startDate)).toLocaleDateString('fi-FI', pvmForm)}</p>
                    <p>Kokous päättyy: {(new Date(kokous.endDate)).toLocaleDateString('fi-FI', pvmForm)}</p>
                </>)
            }


            return (
                <div className="col-md-10 mx-auto mt-5">
                    <h2>{yhdistys}</h2>
                    <Link to={`/assoc/${yhdistys}`}>Yhdistyksen pääsivu</Link>
                    <hr />
                    <h4 className="mb-3">{kokous.otsikko} </h4>
                    <div style={{ lineHeight: '8px' }}>
                        <p>Kokouksen numero: {kokous.kokousnro} / {(new Date(kokous.startDate)).toLocaleDateString('fi-FI', pvmYear)}</p>
                        {component}
                    </div>
                    ({text})
                </div>
            )
        } else {
            return <p>Loading...</p>
        }
    } else {
        history.push('/userpage')
        return <></>
    }
}

export default KokousDetails

