import React, { useState, useEffect } from 'react'
import { useParams, useHistory, Link } from 'react-router-dom'
import { getSessionRole } from '../../Components/Auth/Sessions'
import request from '../../Components/Shared/HttpRequests'
import KokousDocs from '../../Components/Kokous/KokousDocs'
import KokousOsallistujat from '../../Components/Kokous/KokousOsallistujat'

const KokousDetails = () => {

    let history = useHistory()
    const pvmForm = { month: 'numeric', day: 'numeric', year: 'numeric' };
    const pvmYear = { year: 'numeric' };
    const { yhdistys } = useParams()
    const { kokousId } = useParams()
    const [kokous, setKokous] = useState()
    const [puheenjohtaja, setPuheenjohtaja] = useState()
    const [osallistujat, setOsallistujat] = useState()
    const [jasenet, setJasenet] = useState()

    const [showComponent, setShowComponent] = useState([])
    const [showTable, setShowTable] = useState(true)

    useEffect(() => {  console.log('-------------- USEEFFECT -------------------')
       
        if (getSessionRole()) {

            const body = JSON.stringify({ call: 'getkokous', id: kokousId })
            request.kokous(body).then(res => {
                setKokous(res.data)
            }).catch(err => console.log('err.response.data', err.response.data))

            const body2 = JSON.stringify({ call: 'getosallistujat', id: kokousId })
            request.kokous(body2).then(res => {
                setOsallistujat(res.data.filter(x => x.role === 'osallistuja'))
                setPuheenjohtaja(res.data.filter(x=> x.role ==='puheenjohtaja'))
            }).catch(err => console.log('err.response.data', err.response.data))

            const req = JSON.stringify({ call: 'getallmembers', name: yhdistys })
            request.assoc(req).then(res => {
                setJasenet(res.data)
            }).catch(err => console.log('err.response', err.response))
        }
       
    }, [kokousId, yhdistys])


    const handleMenuClick = (ev) => {
        setShowComponent(ev.target.name)
        if (ev.target.name === 'asiakirjat') setShowTable(true)
    }

    if (getSessionRole() && getSessionRole().yhdistys === yhdistys) {

        if (kokous) {
            let component
            if (showComponent === 'asiakirjat') component = <KokousDocs kokous={kokous} yhdistys={yhdistys} setShowComponent={setShowComponent} setShowTable={setShowTable} showTable={showTable} />
            else if (showComponent === 'osallistujat') component = <KokousOsallistujat osallistujat={osallistujat} jasenet={jasenet} puheenjohtaja={puheenjohtaja} />
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
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', lineHeight: '8px', whiteSpace: 'nowrap' }}>
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
                        <button className="btn btn-outline-primary btn-sm mx-1" onClick={handleMenuClick} name="asiat" >Asiakohdat</button>
                        <button className="btn btn-outline-primary btn-sm mx-1" onClick={handleMenuClick} name="asiakirjat">Asiakirjat</button>
                        {getSessionRole().role === 'admin'
                            ? <> <button className="btn btn-outline-primary btn-sm mx-1" onClick={handleMenuClick} name="osallistujat">Osallistujat</button>
                                <button className="btn btn-outline-primary btn-sm mx-1" onClick={handleMenuClick} name="?">Kokousaika</button></>
                            : <></>
                        }
                        <button className="btn btn-outline-primary btn-sm mx-1" onClick={handleMenuClick} name="?">Äänestä ja voita</button>
                        <button className="btn btn-outline-primary btn-sm mx-1" onClick={handleMenuClick} name="?" >Muuta juttua</button>
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

/*

Kokous on päätösvaltainen,
jos vähintään n kpl kokousosallistujista on avannut esityslistan. Tila: Päätösvaltainen / Ei päätösvaltainen
jos vähintään n kpl kokousosallistujista on ottanut asioihin kantaa. Tila: Päätösvaltainen / Ei päätösvaltainen
jos kokous kestää vähintään n vuorokautta. Tila: Päätösvaltainen / Ei päätösvaltainen
Kohdan tai kohtien tila vaihtuu Ei päätösvaltaisesta Päätösvaltaiseksi automaattisesti, kun asetettu kriteeri täyttyy. 



*/ 
