import React, { useState } from 'react'
import { useParams } from 'react-router-dom'
import { Link } from 'react-router-dom'
import request from '../../Components/Shared/HttpRequests'
import HelpPop from '../../Components/Shared/HelpPop'
import Perustiedot from '../../Components/Kokous/Perustiedot'
import Osallistujat from '../../Components/Kokous/Osallistujat'

const UusiKokous = () => {

    const { yhdistys } = useParams()
    const [showComponent, setShowComponent] = useState('perustiedot')

    const [otsikko, setOtsikko] = useState('')
    const [kokousNro, setKokousNro] = useState('')
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    const [members, setMembers] = useState() 
    const [id, setId] = useState();

    if (!kokousNro) {
        const now = Date();
        const pvmForm = { year: 'numeric' };
        const body = JSON.stringify({ call: 'kokousnro', name: yhdistys })
        request.kokous(body).then(res => {
            setKokousNro(res.data.kokousnro + "/" + (new Date(now)).toLocaleDateString('fi-FI', pvmForm))
            setId(res.data.id_y)
        })
    } else {
        const req = JSON.stringify({ call: 'getallmembers', name: yhdistys })
        request.assoc(req).then(res => {
            setMembers(res.data)
        }).catch(err => console.log('err.response', err.response))
    }

    const helpText = "Kokouksen luominen aloitetaan antamalla sille otsikko sekä alku- ja loppupäivämäärät. Kun olet valmis, paina seuraava-näppäintä, niin voit luoda esityslistan. Lopuksi näet yhteenveto-välilehdeltä luomasi kokouksen, missä voit myös tallentaa ja lähettää luomasi kokouksen sen osallistujille."

    const handleMenuClick = (ev) => {
        setShowComponent(ev.target.name)
    }
    const handlePerustiedotChange = (ev) => {
        if (ev.target.name === 'otsikko') setOtsikko(ev.target.value)
        else if (ev.target.name === 'kokousNro') setKokousNro(ev.target.value)
    }

    let component
    if (showComponent === 'perustiedot') component = <Perustiedot setShowComponent={setShowComponent} handlePerustiedotChange={handlePerustiedotChange} otsikko={otsikko} kokousNro={kokousNro} startDate={startDate} setStartDate={setStartDate} endDate={endDate} setEndDate={setEndDate} />
    else if(showComponent ==='osallistujat') component = <Osallistujat members={members} />
    else component = <></>

    return (
        <div className="col-md-10 mx-auto mt-5">
            <h2>{yhdistys}</h2>
            <h4>Luo uusi kokous</h4>
            <Link  to={`/assoc/${yhdistys}`} >Yhdistyksen pääsivu</Link>
            <hr />
            <div>
                <div className="d-flex justify-content-center">
                    <button className="btn btn-outline-primary btn-sm mx-1" name="perustiedot" onClick={handleMenuClick}>Perustiedot</button>
                    <button className="btn btn-outline-primary btn-sm mx-1" name="menneet" onClick={handleMenuClick}>Esityslista</button>
                    <button className="btn btn-outline-primary btn-sm mx-1" name="osallistujat" onClick={handleMenuClick}>Osallistujat</button>
                    <button className="btn btn-outline-primary btn-sm mx-1" name="menneet" onClick={handleMenuClick}>Yhteenveto</button>
                    <HelpPop heading="Kokouksen luominen" text={helpText} btnText="Selitystä" placement="left" variant="btn btn-outline-danger btn-sm mx-1" />
                </div>
                <hr />
            </div>
            <div className="mt-5">
                {component}
            </div>
        </div>
    )
}

export default UusiKokous
