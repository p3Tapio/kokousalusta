import React, { useState, useEffect } from 'react'
import { useParams, useHistory, Link } from 'react-router-dom'
import { getSessionRole, getUser } from '../../Components/Auth/Sessions'
import request from '../../Components/Shared/HttpRequests'
import KokousDocs from '../../Components/Kokous/KokousDocs'
import KokousOsallistujat from '../../Components/Kokous/KokousOsallistujat'
import Kokousaika from '../../Components/Kokous/Kokousaika'
import KokousPaatosvalta from '../../Components/Kokous/KokousPaatosvalta';
import Esityslista from '../../Components/UusiKokous/Esityslista/Esityslista';
import KokousPoytakirja from '../../Components/Kokous/KokousPoytakirja'


const KokousDetails = (props) => {

    let history = useHistory()
    const user = getUser()
    const pvmForm = { month: 'numeric', day: 'numeric', year: 'numeric' };
    const pvmYear = { year: 'numeric' };
    const { yhdistys } = useParams()
    const { kokousId } = useParams()
    const [kokousRooli, setKokousRooli] = useState()
    const [kokous, setKokous] = useState()
    const [puheenjohtaja, setPuheenjohtaja] = useState()
    const [osallistujat, setOsallistujat] = useState()
    const [jasenet, setJasenet] = useState()
    const [paatokset, setPaatokset] = useState()
    const [showComponent, setShowComponent] = useState("asiat")
    const [showTable, setShowTable] = useState(true)

    let yhdistys_id
    if (props.location.state === undefined) history.push(`/assoc/${yhdistys}`)
    else yhdistys_id = props.location.state.id_y


    useEffect(() => {

        if (getSessionRole()) {
            const body = JSON.stringify({ call: 'getkokous', id: kokousId })
            request.kokous(body).then(res => {
                setKokous(res.data)
            }).catch(err => console.log('err.response', err.response))

            const body2 = JSON.stringify({ call: 'getosallistujat', id: kokousId, email: user.email })
            request.osallistujat(body2).then(res => {
                setOsallistujat(res.data.filter(x => x.role === 'osallistuja'))
                setPuheenjohtaja(res.data.filter(x => x.role === 'puheenjohtaja'))
                const osal = res.data.filter(x => x.email === user.email)
                if (osal[0]) {
                    setKokousRooli(osal[0].role)
                } else history.push({ pathname: `/assoc/${yhdistys}`, state: { yhdistys_id } })
            }).catch(err => console.log('err.response', err.response))

            const req = JSON.stringify({ call: 'getallmembers', yhdistys: yhdistys })
            request.assoc(req).then(res => {
                setJasenet(res.data)
            }).catch(err => console.log('err.response', err.response))

            const body3 = JSON.stringify({ call: 'getpaatokset', kokousid: kokousId })
            request.kokous(body3).then(res => {
                setPaatokset(res.data)
            }).catch(err => console.log('err.response', err.response))
        }

    }, [kokousId, yhdistys, user.email, history])

    const handleMenuClick = (ev) => {
        let napit = ev.target.parentNode.querySelectorAll("button");
        for (let i = 0; i < napit.length; i++) {
            napit[i].classList.remove("valittu_menu");
        }

        ev.target.classList.add("valittu_menu");

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
            if (window.confirm(`Haluatko siirtää henkilön ${henkilo.firstname} ${henkilo.lastname} kokousosallistujaksi?`)) {
                setOsallistujat(osallistujat.concat(henkilo))
                body = JSON.stringify({ call: 'lisaaosallistuja', kokousid: kokousId, yhdistys: yhdistys, email: ev.target.name })
                runRequest = true
            }
        } else if (ev.target.id === 'poistu') {     // Kokousosallistuja: Voi ilmoittaa esteellisyydestä yksittäiseen kokoukseen ja nimetä varakokousedustajan kokousosallistujaksi tilalleen  ????
            setOsallistujat(osallistujat.filter(x => x.email !== user.email))
            body = JSON.stringify({ call: 'poistaosallistuja', kokousid: kokousId, email: user.email })
            runRequest = true
            window.location.reload();
        }
        if (runRequest) {
            request.osallistujat(body).then(res => {
                alert(res.data.message)
            }).catch(err => {
                alert(err.response.data.message)
                console.log('err.response', err.response)
            })
        }
    }
    const handlePJPoistuuKokouksesta = (syy) => {

        setOsallistujat(osallistujat.filter(x => x.email !== user.email))
        const body = JSON.stringify({ call: 'poistaosallistuja', kokousid: kokousId, email: user.email })

        request.osallistujat(body).then(res => {
            alert("Poistuit kokouksesta")
        }).catch(err => {
            alert(err.response.data.message)
            console.log('err.response', err.response)
        })

        const body2 = JSON.stringify({ call: 'pjpoistui', kokousid: kokousId, syy: syy, pv: 10 })
        request.osallistujat(body2).then(res => {
            window.location.reload();
        }).catch(err => console.log('err.response', err.response))


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
    const openKokous = (id) => {

        if (window.confirm('Haluatko avata kokoustilan osallistujille?')) {
            const body = JSON.stringify({ call: 'openkokous', id: kokousId })
            request.kokous(body).then(res => {
                alert(res.data.message)
                window.location.reload()
            }).catch(err => {
                alert(err.response.data.message)
            })
            // TODO luo asiakohta nimeltään ”Avaus” - ”Puheenjohtaja etunimi sukunimi avasi kokouksen pp.kk.vvvvv, klo hh:mm.”
            // axios.post --> id_k, user.firstname, user.lastname, timestamp
            // huom: kokous aukeaa myös automaattisesti jolloin speksien teksti on hieman harhaanjohtava? Vaihtoehtoisesti: "Kokoustila avattiin käyttäjille pp.kk.vvvv, klo hh:mm" ???  
        }
    }
    if (getSessionRole() && getSessionRole().yhdistys === yhdistys) {

        if (kokous && kokousRooli) {

            if (kokous.avoinna === "1" || kokousRooli === "puheenjohtaja") {

                let component
                if (showComponent === 'asiakirjat') component = <KokousDocs kokous={kokous} yhdistys={yhdistys} setShowComponent={setShowComponent} setShowTable={setShowTable} showTable={showTable} />
                else if (showComponent === 'asiat') component = <Esityslista kokousid={kokousId} />
                else if (showComponent === 'osallistujat') component = <KokousOsallistujat osallistujat={osallistujat} jasenet={jasenet} puheenjohtaja={puheenjohtaja} kokousRooli={kokousRooli} handleOsallistujatClick={handleOsallistujatClick} kokous={kokous} />
                else if (showComponent === 'kokousaika') component = <Kokousaika kokous={kokous} handleVaihdaKokousaika={handleVaihdaKokousaika} />
                else if (showComponent === 'paatosvaltaisuus') component = <KokousPaatosvalta kokous={kokous} osallistujat={osallistujat} puheenjohtaja={puheenjohtaja} />
                else if (showComponent === 'poytakirja') component = <KokousPoytakirja kokous={kokous} yhdistys={yhdistys} osallistujat={osallistujat} puheenjohtaja={puheenjohtaja} paatokset={paatokset} />
                else component = <p>error... </p>

                let text
                if (Date.parse(kokous.endDate) < new Date() || kokous.loppu === "1") text = "Kokous on päättynyt"
                else if (Date.parse(kokous.endDate) > new Date() && Date.parse(kokous.startDate) < new Date()) text = "Kokous on käynnissä"
                else text = "Kokous ei ole vielä alkanut"

                return (
                    <div className="mx-auto mt-5">
                        <div className="mx-3">
                            <h2 >{yhdistys}</h2>
                            <Link to={{ pathname: `/assoc/${yhdistys}`, state: { id_y: yhdistys_id } }}>Yhdistyksen pääsivu</Link>
                            <hr />
                            <div className="mb-3">
                             <h4>{kokous.otsikko} </h4>
                             {kokous.avoinna === "1" ? <></> : <div><h5 style={{color:'red', fontWeight:'bold'}}>Kokoustila on suljettu.</h5><p style={{marginTop:'-5px', marginBottom:'12px', cursor:'pointer'}}  onClick={() => openKokous()}>Avaa kokoustila osallistujille.</p></div>}
                            </div>
                            <div className="float-left" style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', lineHeight: '8px', whiteSpace: 'nowrap' }}>
                                <p>Puheenjohtaja:</p>
                                {puheenjohtaja.length !== 0
                                    ? <p>{puheenjohtaja[0].firstname} {puheenjohtaja[0].lastname} </p>
                                    : <p>Kokoukselle ei ole asetettu puheenjohtajaa. </p>}
                                <p style={{ marginRight: '10px' }}>Kokouksen numero: </p>
                                <p> {kokous.kokousnro}/{(new Date(kokous.startDate)).toLocaleDateString('fi-FI', pvmYear)}</p>
                                <p>Kokouksen alku:</p>
                                <p>{(new Date(kokous.startDate)).toLocaleDateString('fi-FI', pvmForm)}</p>
                                <p>Kokouksen päätös:</p>
                                <p>{(new Date(kokous.endDate)).toLocaleDateString('fi-FI', pvmForm)}</p>
                                <small>({text})</small>
                            </div>
                            <div className="mt-4 float-right">
                                {kokous.loppu === "0" ? <button className="btn btn-danger mb-2 ml-2" type="button" title="Peru osallistumisesi kokoukseen" id="poistu" data-toggle="modal" data-target='#poistuModal' >Peru osallistumisesi</button> : <></>}
                                <PoistuModal handlePJPoistuuKokouksesta={handlePJPoistuuKokouksesta} handleOsallistujatClick={handleOsallistujatClick} kokousRooli={kokousRooli} />
                            </div>
                            <div className="clearfix"></div>
                        </div>
                        <hr />
                        <div className="d-sm-flex second_nav">
                            <button className="text-primary valittu_menu" onClick={handleMenuClick} name="asiat" >Asiakohdat</button>
                            <button className="text-primary" onClick={handleMenuClick} name="asiakirjat">Asiakirjat</button>
                            <button className="text-primary" onClick={handleMenuClick} name="osallistujat">Osallistujat</button>
                            {kokousRooli === 'puheenjohtaja' && kokous.loppu === "0"
                                ? <>     <button className="text-primary" onClick={handleMenuClick} name="kokousaika">Kokousaika</button></>
                                : <></>
                            }
                            <button className="text-primary" onClick={handleMenuClick} name="paatosvaltaisuus">Päätösvaltaisuus</button>
                            {/* TODO pöytäkirja näkyville vasta kun päätöksiä on syntynyt ???  */}
                            {kokous.loppu === "0" && kokousRooli === 'puheenjohtaja' ? <button className="text-primary" onClick={handleMenuClick} name="poytakirja" >Pöytäkirja</button> : <></>}
                        </div>
                        {component}
                    </div>
                )
            } else {
                history.push(`/assoc/${yhdistys}`)
                return <></>
            }
        } else {
            return <p className="mt-4 mx-4">Ladataan tietoja .... </p>
        }
    } else {
        history.push(`/assoc/${yhdistys}`)
        return <></>
    }
}

export default KokousDetails


const PoistuModal = ({ handlePJPoistuuKokouksesta, handleOsallistujatClick, kokousRooli }) => {
    const [syy, setSyy] = useState('')
    const handleSyyChange = (ev) => {
        setSyy(ev.target.value)
    }
    return (
        <div className="modal fade" id="poistuModal" tabIndex="-1" role="dialog" aria-labelledby="ModalLabel" aria-hidden="true">
            <div className="modal-dialog" role="document">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="ModalLabel">Poistu kokouksesta</h5>
                        <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div className="modal-body">
                        <p>Haluatko poistua kokouksesta?</p>
                        {kokousRooli === 'puheenjohtaja'
                            ? <div className="form-group">
                                <textarea className="form-control" rows="2" name="syy" onChange={handleSyyChange} value={syy} />
                                <small className="form-text text-muted">Voit kirjoittaa kenttään syyn kokouksesta poistumiseen.</small>
                            </div>
                            : <></>}
                    </div>
                    <div className="modal-footer">
                        {kokousRooli === 'puheenjohtaja'
                            ? <button type="button" className="btn btn-outline-primary" data-dismiss="modal" id='poistu' onClick={() => handlePJPoistuuKokouksesta(syy)}>Poistu kokouksesta</button>
                            : <button type="button" className="btn btn-outline-primary" data-dismiss="modal" id='poistu' onClick={handleOsallistujatClick}>Poistu kokouksesta</button>}
                        <button type="button" className="btn btn-outline-secondary" data-dismiss="modal">Peruuta</button>
                    </div>
                </div>
            </div>
        </div>
    )
}
