import React, { useState, useEffect } from 'react'
import { useParams, useHistory, Link } from 'react-router-dom'
import { getSessionRole } from '../../Components/Auth/Sessions'
import request from '../../Components/Shared/HttpRequests'
import KokousDocs from '../../Components/Kokous/KokousDocs'
import KokousOsallistujat from '../../Components/Kokous/KokousOsallistujat'
import Kokousaika from '../../Components/Kokous/Kokousaika'

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
    console.log('kokous', kokous)
    useEffect(() => {

        if (getSessionRole()) {

            const body = JSON.stringify({ call: 'getkokous', id: kokousId })
            request.kokous(body).then(res => {
                setKokous(res.data)
            }).catch(err => console.log('err.response.data', err.response.data))

            const body2 = JSON.stringify({ call: 'getosallistujat', id: kokousId })
            request.kokous(body2).then(res => {
                setOsallistujat(res.data.filter(x => x.role === 'osallistuja'))
                setPuheenjohtaja(res.data.filter(x => x.role === 'puheenjohtaja'))
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
    const handleOsallistujatClick = (ev) => {

        const henkilo = jasenet.find(x => x.email === ev.target.name)
        let body
        let runRequest = false

        if (ev.target.id === 'varalle') {
            if (window.confirm(`Haluatko perua osallistujan ${henkilo.firstname} ${henkilo.lastname} osallistumisoikeuden kokoukseen?`)) {
                setOsallistujat(osallistujat.filter(x => x.email !== ev.target.name))
                body = JSON.stringify({ call: 'poistaosallistuja', kokousid: kokousId, email: ev.target.name })
                runRequest = true
            }
        } else if (ev.target.id === 'osallistujaksi') {
            if (window.confirm(`Haluatko muuttaa henkilön ${henkilo.firstname} ${henkilo.lastname} kokousosallistujaksi?`)) {
                setOsallistujat(osallistujat.concat(henkilo))
                body = JSON.stringify({ call: 'lisaaosallistuja', kokousid: kokousId, yhdistys: yhdistys, email: ev.target.name })
                runRequest = true
            }
        }
        if (runRequest) {
            console.log('body', body)
            request.kokous(body).then(res => {
                alert(res.data.message)
            }).catch(err => {
                alert(err.response.data.message)
                console.log('err.response', err.response)
            })
        }
    }

    const handleVaihdaKokousaika = (date) => {

        if (typeof date === 'object' && Date.parse(date) !== Date.parse(kokous.endDate)) {

            const pvmForm = { month: 'numeric', day: 'numeric', year: 'numeric' };
            const uusiPvm = date.toISOString().split('T')[0]

            if (window.confirm(`Haluatko vaihtaa kokouksen uudeksi päättymispäiväksi ${(new Date(uusiPvm)).toLocaleDateString('fi-FI', pvmForm)}?`)) {
                setKokous({ ...kokous, endDate: uusiPvm })
                const body = JSON.stringify({ call: 'vaihdapvm', kokousid: kokousId, enddate: date })
                request.kokous(body).then(res => {
                    alert(res.data.message)
                }).catch(err => alert(err.response.data.message))
            }
            
        } else {
            alert("Määritä uusi päättymispäivä ennen tallentamista")
        }
    }

    if (getSessionRole() && getSessionRole().yhdistys === yhdistys) {

        if (kokous) {
            let component
            if (showComponent === 'asiakirjat') component = <KokousDocs kokous={kokous} yhdistys={yhdistys} setShowComponent={setShowComponent} setShowTable={setShowTable} showTable={showTable} />
            else if (showComponent === 'osallistujat') component = <KokousOsallistujat osallistujat={osallistujat} jasenet={jasenet} puheenjohtaja={puheenjohtaja} handleOsallistujatClick={handleOsallistujatClick} />
            else if (showComponent === 'kokousaika') component = <Kokousaika kokous={kokous} setkokous={setKokous} handleVaihdaKokousaika={handleVaihdaKokousaika} />
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
                        Päätösvaltainen: {kokous.pv_muu}
                    </div>
                    <hr />
                    <div className="d-flex justify-content-center">
                        <button className="btn btn-outline-primary btn-sm mx-1" onClick={handleMenuClick} name="asiat" >Asiakohdat</button>
                        <button className="btn btn-outline-primary btn-sm mx-1" onClick={handleMenuClick} name="asiakirjat">Asiakirjat</button>
                        {getSessionRole().role === 'admin'
                            ? <> <button className="btn btn-outline-primary btn-sm mx-1" onClick={handleMenuClick} name="osallistujat">Osallistujat</button>
                                <button className="btn btn-outline-primary btn-sm mx-1" onClick={handleMenuClick} name="kokousaika">Kokousaika</button></>
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
