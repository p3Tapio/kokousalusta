import React, {useState} from 'react'
import { TextEditor } from '../Document/TextEditor';

const KokousPoytakirja = ({kokous, yhdistys, osallistujat, puheenjohtaja}) => {
    console.log('kokous', kokous)
    const pvmForm = { month: 'numeric', day: 'numeric', year:'numeric' };
    const pvmYear = {year:'numeric'}
    const kokousnumero = kokous.kokousnro +"/"+ (new Date(kokous.startDate)).toLocaleDateString('fi-FI', pvmYear)
    const otsikko = kokous.otsikko!=='' ? `<h2>${kokous.otsikko}</h2>` : ''
    const ajat = (new Date(kokous.startDate)).toLocaleDateString('fi-FI', pvmForm) + " - " + (new Date(kokous.endDate)).toLocaleDateString('fi-FI', pvmForm)
    const osallistuu = osallistujat.map(x => '<li>' + x.firstname + ' ' + x.lastname + '</li>').join(' ')
    let paatosvalta = ''
    if (kokous.pv_aktiivisuus === '0' && kokous.pv_esityslista === '0' && kokous.pv_kesto === '0' && kokous.pv_muu === '') paatosvalta += '<p>Kokouksen päätösvaltaisuutta ei ole määritelty.</p>'
    else { // TODO keston lisäksi muut päätösvalta kriteerit 
        if (kokous.pv_esityslista !== '0') paatosvalta += `<p>Kokous on päätösvaltainen jos vähintään ${kokous.pv_esityslista} kpl kokousosallistujista on avannut esityslistan.</p>`
        if (kokous.pv_aktiivisuus !== '0') paatosvalta += `<p>Kokous on päätösvaltainen jos vähintään ${kokous.pv_aktiivisuus} kpl kokousosallistujista on ottanut asioihin kantaa.</p>`
        if (kokous.pv_kesto  !== '0') paatosvalta += kokous.pv_kesto_toteutunut === "true" ? `<p>Kokoukselle määritelty minimikesto ${kokous.pv_kesto } vuorokautta toteutui.</p>`: `<p>Kokoukselle määritelty minimikesto ${kokous.pv_kesto} vuorokautta ei toteutunut.</p>`
        if (kokous.pv_muu !== '') paatosvalta += `<p>${kokous.pv_muu}</p>`
    }
    // TODO asiakohtien otsikot ja sisältökentät, myös "Tulostaja saa valita, haluaako tulostaa myös käytyjä keskusteluja ja annettuja kommentteja: kyllä/ei." 

    const [poytakirja, setPoytakirja] = useState(`<h1>${yhdistys}</h1>${otsikko}<h2>${kokousnumero}</h2><h2>${ajat}</h2><h2>Osallistujat</h2><ul>${osallistuu}</ul><p>Puheenjohtaja: ${puheenjohtaja[0].firstname} ${puheenjohtaja[0].lastname}<h2>Päätösvaltaisuus</h2>${paatosvalta}`)

    const editorContentChange = (poytakirja) => {
        setPoytakirja(poytakirja)
    }
    return (
        <div className="mt-5 mx-auto col-md-10">
            <TextEditor editorContentChange={editorContentChange} teksti={poytakirja} />
            <button className="float-right btn-outline-primary btn-lg mt-1">Tee jotain nappi</button>
        </div>
    )
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