import React, { useState, useEffect } from 'react'
import { useParams, useHistory } from 'react-router-dom'
import { Link } from 'react-router-dom'
import request from '../../Components/Shared/HttpRequests'
import HelpPop from '../../Components/Shared/HelpPop'
import Perustiedot from '../../Components/UusiKokous/Perustiedot'
import Osallistujat from '../../Components/UusiKokous/Osallistujat'
import Paatosvaltaisuus from '../../Components/UusiKokous/Paatosvaltaisuus'
import Yhteenveto from '../../Components/UusiKokous/Yhteenveto'
import { getSessionRole, getUser } from '../../Components/Auth/Sessions'

const UusiKokous = () => {

    const { yhdistys } = useParams()
    const [members, setMembers] = useState()

    const [showComponent, setShowComponent] = useState('perustiedot')
    let history = useHistory()

    const [perustiedot, setPerustiedot] = useState({ otsikko: '', kokousNro: null, startDate: '', endDate: '' })
    const [osallistujat, setOsallistujat] = useState()
    const [puheenjohtaja, setPuheenjohtaja] = useState()
    const [varalla, setVaralla] = useState([])
    const [paatosvaltaisuus, setPaatosvaltaisuus] = useState({ esityslista: '', aktiivisuus: '', kesto: '', muu: ''  })
    const [id_y, setId_y] = useState();

    useEffect(() => {

        if (!perustiedot.kokousNro) {
            const now = Date();
            const pvmForm = { year: 'numeric' };
            const body = JSON.stringify({ call: 'kokousnro', name: yhdistys })
            request.kokous(body).then(res => {
                setPerustiedot({ ...perustiedot, kokousNro: res.data.kokousnro + "/" + (new Date(now)).toLocaleDateString('fi-FI', pvmForm) })
                setId_y(res.data.id_y)
            })
        }
        if (!members) {
            const req = JSON.stringify({ call: 'getallmembers', name: yhdistys })
            request.assoc(req).then(res => {
                setMembers(res.data)
                setOsallistujat(res.data.filter(x => x.email !== getUser().email))
                setPuheenjohtaja(res.data.filter(x => x.email === getUser().email))
            }).catch(err => console.log('err.response', err.response))
        }
    }, [members, perustiedot, yhdistys])


    const helpText = "Aloita kokous antamalla sille otsikko sekä alku- ja loppupäivämäärät. Kun olet valmis, paina seuraava-näppäintä, niin voit luoda esityslistan ja päättää voiko yhdistyksen jäsenet liittää omia esityksiään esityslistalle. Seuraavaksi voit määritellä kokouksen osallistujat ja päätösvaltaisuuden. Lopuksi näet kutsu kokous -välilehdeltä luomasi kokouksen tiedot, missä voit tallentaa ja lähettää kutsun kokoukseen osallistujille."

    const handleMenuClick = (ev) => {
        setShowComponent(ev.target.name)
    }
    const handlePerustiedotChange = (ev) => {
        if (ev.target.name === 'otsikko') setPerustiedot({ ...perustiedot, otsikko: ev.target.value })
        else if (ev.target.name === 'kokousnro') setPerustiedot({ ...perustiedot, kokousNro: ev.target.value })
    }
    const handlePaatosvaltaChange = (ev) => {
        console.log('ev.target.name', ev.target.name)
        if (ev.target.name === 'esityslista') setPaatosvaltaisuus({ ...paatosvaltaisuus, esityslista: ev.target.value })
        else if (ev.target.name === 'aktiivisuus') setPaatosvaltaisuus({ ...paatosvaltaisuus, aktiivisuus: ev.target.value })
        else if (ev.target.name === 'kesto') setPaatosvaltaisuus({ ...paatosvaltaisuus, kesto: ev.target.value })
        else if (ev.target.name === 'muu') setPaatosvaltaisuus({ ...paatosvaltaisuus, muu: ev.target.value })
    }

    let component
    if (showComponent === 'perustiedot') component = <Perustiedot setShowComponent={setShowComponent} handlePerustiedotChange={handlePerustiedotChange} perustiedot={perustiedot} setPerustiedot={setPerustiedot} />
    else if (showComponent === 'osallistujat') component = <Osallistujat puheenjohtaja={puheenjohtaja} osallistujat={osallistujat} setOsallistujat={setOsallistujat} varalla={varalla} setVaralla={setVaralla} setShowComponent={setShowComponent} />
    else if (showComponent === 'paatosvaltaisuus') component = <Paatosvaltaisuus setShowComponent={setShowComponent} handlePaatosvaltaChange={handlePaatosvaltaChange} paatosvaltaisuus={paatosvaltaisuus} />
    else if (showComponent === 'yhteenveto') component = <Yhteenveto perustiedot={perustiedot} osallistujat={osallistujat} paatosvaltaisuus={paatosvaltaisuus} yhdistys={yhdistys} id_y={id_y}/>
    else component = <></>


    if (getSessionRole() && getSessionRole().role === 'admin' && getSessionRole().yhdistys === yhdistys) {
        return (
            <div className="col-md-10 mx-auto mt-5">
                <h2>{yhdistys}</h2>
                <h4>Luo uusi kokous</h4>
                <Link to={`/assoc/${yhdistys}`} >Yhdistyksen pääsivu</Link>
                <hr />
                <div>
                    <div className="d-flex justify-content-center">
                        <button className="btn btn-outline-primary btn-sm mx-1" name="perustiedot" onClick={handleMenuClick}>Perustiedot</button>
                        <button className="btn btn-outline-primary btn-sm mx-1" name="menneet" onClick={handleMenuClick}>Esityslista</button>
                        <button className="btn btn-outline-primary btn-sm mx-1" name="osallistujat" onClick={handleMenuClick}>Osallistujat</button>
                        <button className="btn btn-outline-primary btn-sm mx-1" name="paatosvaltaisuus" onClick={handleMenuClick}>Päätösvaltaisuus</button>
                        <button className="btn btn-outline-primary btn-sm mx-1" name="yhteenveto" onClick={handleMenuClick}>Kutsu kokous</button>
                        <HelpPop heading="Kokouksen luominen" text={helpText} btnText="Selitystä" placement="left" variant="btn btn-outline-danger btn-sm mx-1" />
                    </div>
                    <hr />
                </div>
                <div className="mt-5">
                    {component}
                </div>
            </div>
        )
    } else {
        history.push('/userpage')
        return <></>
    }
}
export default UusiKokous