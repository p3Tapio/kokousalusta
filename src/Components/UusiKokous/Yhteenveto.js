import React, { useState } from 'react'
import { useHistory } from 'react-router-dom'
import { TextEditor } from '../Document/TextEditor';
import { getUser } from '../Auth/Sessions'
import request from '../Shared/HttpRequests'
import Loading from '../Shared/Loading';

const Yhteenveto = ({ perustiedot, esityslista_otsakkeet, osallistujat, paatosvaltaisuus, yhdistys, id_y }) => {
    
    const [loading, setLoading] = useState(false)
    let history = useHistory()
    let user = getUser()
    const pvmForm = { month: 'numeric', day: 'numeric' };
    const start = (new Date(perustiedot.startDate)).toLocaleDateString('fi-FI', pvmForm)
    const end = (new Date(perustiedot.endDate)).toLocaleDateString('fi-FI', pvmForm)
    const nimi = perustiedot.otsikko === '' ? '' : `<h3>${perustiedot.otsikko}</h3>`
    const osallistuu = osallistujat.map(x => '<li>' + x.firstname + ' ' + x.lastname + '</li>').join(' ')
    let otsikot = esityslista_otsakkeet.map(x => x.otsikko !=='' ? '<li>'+ x.otsikko +'</li>' : '<li>Asiakohdalla ei ole otsikkoa</li>').join(' ')
    otsikot = otsikot.length === 0 ? '<p>Kokoukselle ei ole määritelty esityslistaa</p>' : otsikot 
    // otsikot = otsikot.map(x=> x.otsikko !== '' ? x.otsikko : 'Asiakohdalle ei ole annettu otsikkoa.') 
    let paatosvalta = ''
    if (paatosvaltaisuus.esityslista === '' && paatosvaltaisuus.aktiivisuus === '' && paatosvaltaisuus.kesto === '' && paatosvaltaisuus.muu === '') paatosvalta += '<p>Kokouksen päätösvaltaisuutta ei ole määritelty.</p>'
    else {
        if (paatosvaltaisuus.esityslista !== '') paatosvalta += `<p>Kokous on päätösvaltainen jos vähintään ${paatosvaltaisuus.esityslista} kpl kokousosallistujista on avannut esityslistan.</p>`
        if (paatosvaltaisuus.aktiivisuus !== '') paatosvalta += `<p>Kokous on päätösvaltainen jos vähintään ${paatosvaltaisuus.aktiivisuus} kpl kokousosallistujista on ottanut asioihin kantaa.</p>`
        if (paatosvaltaisuus.kesto !== '') paatosvalta += `<p>Kokous on päätösvaltainen jos kokous kestää vähintään ${paatosvaltaisuus.kesto} vuorokautta.</p>`
        if (paatosvaltaisuus.muu !== '') paatosvalta += `<p>${paatosvaltaisuus.muu}</p>`
    }
    // substringit sekoo jos jaat useammalle riville pelkällä enter+spacella
    const [kokouskutsu, setKokouskutsu] = useState(`<h3>Esityslista ${perustiedot.kokousNro} kokous alkaa ${start} ja päättyy ${end}</h3>${nimi}<h4>Kokouksen avaus ${start}</h4><h4>Esityslista</h4><ol>${otsikot}</ol><h4>Osallistujat</h4><ul>${osallistuu.substring(0, osallistuu.length - 5)}</ul><h4>Kokouksen päätösvaltaisuus</h4>${paatosvalta}<h4>Kokous päättyy ${end}</h4><p>Terveisin <br/>${user.firstname} ${user.lastname}<br/><small>${yhdistys}</small></p>`)


    const editorContentChange = (kokouskutsu) => {
        setKokouskutsu(kokouskutsu)
    }
    const handleClickSaveAndSend = () => {
        if (window.confirm('Haluatko tallentaa kokouksen ja lähettää kutsun osallistujille?')) {
            setLoading(true)
            saveNewKokous() // POST:t "ketjutettu" koska muuten bäkkipuoli ei toiminut toivotusti
        }
    }
    const saveNewKokous = () => {

        const uusiKokous = JSON.stringify({
            call: 'luokokous',
            id_y: id_y,
            kokousid: perustiedot.kokousid,
            otsikko: perustiedot.otsikko,
            kokousnro: perustiedot.kokousNro.substring(0, perustiedot.kokousNro.length - 5),
            startDate: perustiedot.startDate,
            endDate: perustiedot.endDate,
            avoinna: perustiedot.avoinna,
            paatosvaltaisuus: paatosvaltaisuus,
            valmis: true
        })
        request.kokous(uusiKokous).then(res => {
            saveDocumentKokouskutsu()   /// ks yllä
        }).catch(err => {
            alert(err.response.data.message)
            setLoading(false)
        })
    }
    const saveDocumentKokouskutsu = () => {

        const kokouskutsuDocument = JSON.stringify({
            call: 'postdoc',
            id_y: id_y,
            kokousnro: perustiedot.kokousNro.substring(0, perustiedot.kokousNro.length - 5),
            type: 'kokouskutsu',
            draft: 'false',
            content: kokouskutsu
        })

        request.documents(kokouskutsuDocument).then((res) => {
            saveOsallistujat() /// ks yllä
        }).catch(err => {
            alert(err.response.data.message)
        })
    }
    const saveOsallistujat = () => {

        let kokousosallistujat
        kokousosallistujat = osallistujat.map(x => ({ rooli: 'osallistuja', ...x }))
        user = Object.assign({ rooli: 'puheenjohtaja' }, user)
        const call = { call: 'postosallistujat', id_y: id_y, kokousid: perustiedot.kokousid }
        kokousosallistujat = [user].concat(kokousosallistujat)
        kokousosallistujat = [call].concat(kokousosallistujat)
        const body = JSON.stringify(kokousosallistujat)
 
        request.osallistujat(body).then(res => {
            sendInviteEmail();
        }).catch(err => alert(err.response.data.message))

    }
    const sendInviteEmail = () => {

        const aihe = kokouskutsu.substring(4, kokouskutsu.indexOf("</h3>"))
        const runko = kokouskutsu.substring(kokouskutsu.indexOf("</h3>") + 5)
        const kokousosallistujat = [user].concat(osallistujat)
        const invite = JSON.stringify({ call: 'sendkokousinvite', yhdistys: yhdistys, aihe: aihe, viesti: runko, osallistujat: kokousosallistujat })
        console.log('invite', invite)
        request.kokous(invite).then(res => {
            alert(res.data.message)
            setLoading(false)
            history.push({pathname:`/assoc/${yhdistys}`, state:{id_y}})
        }).catch(err => alert(err.response.data.message))
    }

    if (!perustiedot.startDate || !perustiedot.endDate) {
        return (
            <div className="mt-5 mx-auto col-md-10">
                <h5 className="mb-4">Päivämäärätiedot ovat puutteelliset. Täytä tarvittavat tiedot perustiedot-välilehdellä.</h5>
            </div>
        )
    } else if (osallistujat.length === 0) {
        return (
            <div className="mt-5 mx-auto col-md-10">
                <h5 className="mb-4">Kokouksessa ei ole osallistujia. Lisää kokousosallistujat osallistujat-välilehdellä.</h5>
            </div>
        )
    } else if (!loading) {
        return (
            <div className="mt-5 mx-auto col-md-10">
                <h5 className="mb-4">Yhteenveto</h5>
                <p className="mb-4">Tarkasta kokouksen tiedot. Painamalla ruudun pohjalla olevaa näppäintä kokous tallentuu ja järjestelmä lähettää kutsun osallistujille kokoukseen s-postitse.</p>
                <TextEditor editorContentChange={editorContentChange} teksti={kokouskutsu} />
                <div className="form-group text-right">
                    <button className="btn btn-outline-primary mt-3" onClick={handleClickSaveAndSend}>Tallenna ja lähetä kokouskutsu</button>
                </div>
            </div>
        )
    } else if (loading) {
        return (
            <div className="mt-5 mx-auto col-md-10">
                <h5 className="mb-4">Pyyntöä käsitellään, odota hetki....</h5>
                <Loading/>
            </div>
        )
    }
}

export default Yhteenveto
