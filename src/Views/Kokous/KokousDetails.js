import React, { useState, useEffect } from 'react'
import { useParams, useHistory, Link } from 'react-router-dom'
import { getSessionRole } from '../../Components/Auth/Sessions'
import request from '../../Components/Shared/HttpRequests'
import KokousDocs from '../../Components/Kokous/KokousDocs'

const KokousDetails = () => {
    let history = useHistory()
    const pvmForm = { month: 'numeric', day: 'numeric', year: 'numeric' };
    const pvmYear = { year: 'numeric' };
    const { yhdistys } = useParams()
    const { kokousId } = useParams()
    const [kokous, setKokous] = useState()
    const [showComponent, setShowComponent] = useState()

    useEffect(() => {

        if (getSessionRole()) {
            const body = JSON.stringify({ call: 'getkokous', id: kokousId })
            request.kokous(body).then(res => {
                setKokous(res.data)
            }).catch(err => console.log('err.response.data', err.response.data))
        }

    }, [kokousId])

    const handleMenuClick = (ev) => setShowComponent(ev.target.name)
    console.log('showComponent', showComponent)


    if (getSessionRole() && getSessionRole().yhdistys === yhdistys) {
        if (kokous) {
            let component
            if (showComponent === 'asiakirjat') component = <KokousDocs kokous={kokous} yhdistys={yhdistys} />
            else component = <p>TO DO !!! </p>

            let text
            if (Date.parse(kokous.endDate) < new Date()) text = "Kokous on päättynyt"
            else if (Date.parse(kokous.endDate) > new Date() && Date.parse(kokous.startDate) < new Date()) text = "Kokous on käynnissä"
            else text = "Kokous ei ole vielä alkanut"

            return (
                <div className="col-md-10 mx-auto mt-5">
                    <h2>{yhdistys}</h2>
                    <Link to={`/assoc/${yhdistys}`}>Yhdistyksen pääsivu</Link>
                    <hr />
                    <div className="mb-3">
                        <h4>{kokous.otsikko} </h4>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 3fr', lineHeight: '8px', whiteSpace: 'nowrap' }}>
                        <p>Kokouksen numero:</p>
                        <p> {kokous.kokousnro}/{(new Date(kokous.startDate)).toLocaleDateString('fi-FI', pvmYear)}</p>
                        <p>Kokouksen alku:</p>
                        <p>{(new Date(kokous.startDate)).toLocaleDateString('fi-FI', pvmForm)}</p>
                        <p>Kokouksen päätös:</p>
                        <p>{(new Date(kokous.endDate)).toLocaleDateString('fi-FI', pvmForm)}</p>
                        <small>({text})</small>
                    </div>
                    <hr />
                    <div className="d-flex justify-content-center">
                        <button className="btn btn-outline-primary btn-sm mx-1" onClick={handleMenuClick} name="asiakirjat">Kokousasiakirjat</button>
                        <button className="btn btn-outline-primary btn-sm mx-1" onClick={handleMenuClick} name="tulevat" >Jotain juttuja</button>
                        <button className="btn btn-outline-primary btn-sm mx-1" onClick={handleMenuClick} name="menneet">Äänestä ja voita</button>
                        <button className="btn btn-outline-primary btn-sm mx-1" onClick={handleMenuClick} name="jasenet" >Muuta juttua</button>
                    </div>
                    <hr />
                    {component}
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

