import React, { useState } from 'react'
import {useHistory } from 'react-router-dom'
import { TextEditor } from '../Document/TextEditor';
import { getUser } from '../Auth/Sessions'
import request from '../Shared/HttpRequests'

const Yhteenveto = ({ perustiedot, osallistujat, paatosvaltaisuus, yhdistys, id_y }) => {
    let history = useHistory() 
    let user = getUser()
    const pvmForm = { month: 'numeric', day: 'numeric' };
    const start = (new Date(perustiedot.startDate)).toLocaleDateString('fi-FI', pvmForm)
    const end = (new Date(perustiedot.endDate)).toLocaleDateString('fi-FI', pvmForm)
    const nimi = perustiedot.otsikko === '' ? '' : `<h3>${perustiedot.otsikko}</h3>`
    const osallistuu = osallistujat.map(x => '<li>' + x.firstname + ' ' + x.lastname + '</li>').join(' ')

    let paatosvalta = ''
    if (paatosvaltaisuus.esityslista === '' && paatosvaltaisuus.aktiivisuus === '' && paatosvaltaisuus.kesto === '' && paatosvaltaisuus.muu === '') paatosvalta += '<p>Kokouksen päätösvaltaisuutta ei ole määritelty.</p>'
    else {
        if (paatosvaltaisuus.esityslista !== '') paatosvalta += `<p>Kokous on päätösvaltainen jos vähintään ${paatosvaltaisuus.esityslista} kpl kokousosallistujista on avannut esityslistan.</p>`
        if (paatosvaltaisuus.aktiivisuus !== '') paatosvalta += `<p>Kokous on päätösvaltainen jos vähintään ${paatosvaltaisuus.aktiivisuus} kpl kokousosallistujista on ottanut asioihin kantaa.</p>`
        if (paatosvaltaisuus.kesto !== '') paatosvalta += `<p>Kokous on päätösvaltainen jos kokous kestää vähintään ${paatosvaltaisuus.kesto} vuorokautta.</p>`
        if (paatosvaltaisuus.muu !== '') paatosvalta += `<p>${paatosvaltaisuus.muu}</p>`
    }
    // substringit sekoo jos jaat useammalle riville pelkällä enter+spacella
    const [kokouskutsu, setKokouskutsu] = useState(`<h3>Esityslista ${perustiedot.kokousNro} kokous alkaa ${start} ja päättyy ${end}</h3>${nimi}<h4>Kokouksen avaus ${start}</h4><h4>Osallistujat</h4><ul>${osallistuu.substring(0, osallistuu.length - 5)}</ul><h4>Kokouksen päätösvaltaisuus</h4>${paatosvalta}<h4>Kokous päättyy ${end}</h4><p>Terveisin <br/>${user.firstname} ${user.lastname}<br/><small>${yhdistys}</small></p>`)

    const editorContentChange = (kokouskutsu) => {
        setKokouskutsu(kokouskutsu)
    }
    const handleClickSaveAndSend = () => {
        saveNewKokous() // POST:t "ketjutettu" koska muuten bäkkipuoli ei toiminut toivotusti
    }
    const saveNewKokous = () => {

        const uusiKokous = JSON.stringify({
            call: 'luokokous',
            id_y: id_y,
            otsikko: perustiedot.otsikko,
            kokousnro: perustiedot.kokousNro.substring(0, perustiedot.kokousNro.length - 5),
            startDate: perustiedot.startDate,
            endDate: perustiedot.endDate,
            paatosvaltaisuus: paatosvaltaisuus
        })

        request.kokous(uusiKokous).then(res => {
            console.log('Kokous tallennettu ', res.data)
            saveDocumentKokouskutsu()   /// ks yllä
        }).catch(err => {
            alert(err.response.data.message)
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
        console.log('kokouskutsuDocument', kokouskutsuDocument)
        request.documents(kokouskutsuDocument).then((res) => {
            console.log('res.data', res.data)
            saveOsallistujat() /// ks yllä
        }).catch(err => {
            alert(err.response.data.message)
        })
    }
    const saveOsallistujat = () => {

        let kokousosallistujat
        kokousosallistujat = osallistujat.map(x => ({ rooli: 'osallistuja', ...x }))
        user = Object.assign({ rooli: 'puheenjohtaja' }, user)
        const call = { call: 'postosallistujat', id_y: id_y, kokousnro: perustiedot.kokousNro.substring(0, perustiedot.kokousNro.length - 5) }
        kokousosallistujat = [user].concat(kokousosallistujat)
        kokousosallistujat = [call].concat(kokousosallistujat)
        const body = JSON.stringify(kokousosallistujat)

        request.kokous(body).then(res => {
            sendInviteEmail();
            console.log('Osallistujatiedot tallennettu ', res.data)
        }).catch(err => alert(err.response.data.message))

    }
    const sendInviteEmail = () => {

        const aihe = kokouskutsu.substring(4, kokouskutsu.indexOf("</h3>"))
        const runko = kokouskutsu.substring(kokouskutsu.indexOf("</h3>") + 5)
        const kokousosallistujat = [user].concat(osallistujat)
        const invite = JSON.stringify({ call: 'sendkokousinvite', yhdistys: yhdistys, aihe: aihe, viesti: runko, osallistujat: kokousosallistujat })
        request.kokous(invite).then(res => {
            alert(res.data.message)
            history.push('/assoc/Kissaklubi')
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
    } else {
        return (
            <div className="mt-5 mx-auto col-md-10">
                <h5 className="mb-4">Yhteenveto</h5>
                <TextEditor editorContentChange={editorContentChange} kokouskutsu={kokouskutsu} />
                <div className="form-group text-right">
                    <button className="btn btn-outline-primary mt-3" onClick={handleClickSaveAndSend}>Avaa kokous ja lähetä kokouskutsu</button>
                </div>
            </div>
        )
    }
}

export default Yhteenveto
