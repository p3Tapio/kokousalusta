import React, { useState, useEffect } from 'react'
import { TextEditor } from '../Document/TextEditor';
import request from '../Shared/HttpRequests'

const KokousPoytakirja = ({ kokous, yhdistys, osallistujat, puheenjohtaja, paatokset }) => {
    console.log('paatokset', paatokset)

    paatokset = paatokset.filter(x => x.tila === "3")

    const pvmForm = { month: 'numeric', day: 'numeric', year: 'numeric' };
    const pvmYear = { year: 'numeric' }
    const kokousnumero = kokous.kokousnro + "/" + (new Date(kokous.startDate)).toLocaleDateString('fi-FI', pvmYear)
    const otsikko = kokous.otsikko !== '' ? `<h2>${kokous.otsikko}</h2>` : ''
    const ajat = (new Date(kokous.startDate)).toLocaleDateString('fi-FI', pvmForm) + " - " + (new Date(kokous.endDate)).toLocaleDateString('fi-FI', pvmForm)
    const osallistuu = osallistujat.map(x => '<li>' + x.firstname + ' ' + x.lastname + '</li>').join(' ')
    let paatosvalta = ''
    if (kokous.pv_aktiivisuus === '0' && kokous.pv_esityslista === '0' && kokous.pv_kesto === '0' && kokous.pv_muu === '') paatosvalta += '<p>Kokouksen päätösvaltaisuutta ei ole määritelty.</p>'
    else { // TODO keston lisäksi muut päätösvalta kriteerit !!! ---------------------------
        if (kokous.pv_esityslista !== '0') paatosvalta += `<p>Kokous on päätösvaltainen jos vähintään ${kokous.pv_esityslista} kpl kokousosallistujista on avannut esityslistan.</p>`
        if (kokous.pv_aktiivisuus !== '0') paatosvalta += `<p>Kokous on päätösvaltainen jos vähintään ${kokous.pv_aktiivisuus} kpl kokousosallistujista on ottanut asioihin kantaa.</p>`
        if (kokous.pv_kesto !== '0') paatosvalta += kokous.pv_kesto_toteutunut === "true" ? `<p>Kokoukselle määritelty minimikesto ${kokous.pv_kesto} vuorokautta toteutui.</p>` : `<p>Kokoukselle määritelty minimikesto ${kokous.pv_kesto} vuorokautta ei toteutunut.</p>`
        if (kokous.pv_muu !== '') paatosvalta += `<p>${kokous.pv_muu}</p>`
    }
    const paatostiedot = paatokset.length !== 0 ? paatokset.map(x => x.paatos !== '' ? '<h3>' + x.title + '</h3>' + '<p style="margin-top: -10px;">' + x.paatos + '</p>' : '<h3>' + x.title + '</h3>').join(' ') : 'Kokouksessa ei tehty päätöksiä.'
    const pj = puheenjohtaja.length !== 0 ? puheenjohtaja[0].firstname + " " + puheenjohtaja[0].lastname : "kokouksessa ei ole puheenjohtajaa"
    const [poytakirja, setPoytakirja] = useState(`<h1>${yhdistys}</h1>${otsikko}<h2>Kokous ${kokousnumero}</h2><h2>${ajat}</h2><h2>Osallistujat</h2><ul>${osallistuu}</ul><p>Puheenjohtaja: ${pj}<h2>Päätösvaltaisuus</h2>${paatosvalta}<h2>Asiakohdat</h2>${paatostiedot}`)

    const editorContentChange = (poytakirja) => {
        setPoytakirja(poytakirja)
    }
    const handlePaataKokousClick = () => {
        if (window.confirm('Haluatko päättää kokouksen? Tietojen muuttaminen ei ole enää kokouksen päätettyäsi mahdollista')) {
            const body = JSON.stringify({ call: 'paatakokous', kokousid: kokous.id })
            request.kokous(body).then(res => {
                savePoytakirja()
            }).catch(err => console.log('err.response', err.response))
        }
    }
    const savePoytakirja = () => {

        const body = JSON.stringify({ call: 'postdoc', id_y: kokous.id_y, kokousnro: kokous.kokousnro, type: 'poytakirja', content: poytakirja, draft: 0 })
        request.documents(body).then(res => {
            alert("Kokous on päätetty ja pöytäkirja tallennettu!")
            window.location.reload()
        }).catch(err => console.log('err.response', err.response))

    }
    if (poytakirja) {
        return (
            <div className="mt-5 mx-auto col-md-10">
                <TextEditor editorContentChange={editorContentChange} teksti={poytakirja} className="mb-2" />
                <button className="float-right btn btn-outline-primary mt-1" onClick={() => handlePaataKokousClick()}>Päätä kokous ja tallenna pöytäkirja</button>
                <br></br>
            </div>
        )
    } else {
        return <p>Loading....</p>
    }
}

export default KokousPoytakirja

// Pöytäkirjaan tulostuvat automaattisesti:
//  Yhdistyksen nimi
//  Kokouksen järjestysnumero / vuosi
//  Kokousajat
//  Kokouksen osallistujat
//  Kokouksen päätösvaltaisuus
//  Asiakohtien otsikot
//  Asiakohtien sisältökentät 

