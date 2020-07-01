import React, { useState } from 'react'
import { TextEditor } from '../Document/TextEditor';
import { getUser } from '../Auth/Sessions'
import request from '../Shared/HttpRequests'

const Yhteenveto = ({ perustiedot, osallistujat, paatosvaltaisuus, yhdistys, id_y }) => {
    const user = getUser()
    const pvmForm = { month: 'numeric', day: 'numeric' };
    const start = (new Date(perustiedot.startDate)).toLocaleDateString('fi-FI', pvmForm)
    const end = (new Date(perustiedot.endDate)).toLocaleDateString('fi-FI', pvmForm)
    const nimi = perustiedot.otsikko === '' ? '' : `<h3>${perustiedot.otsikko}</h3>`
    const osallistuu = osallistujat.map(x => '<li>' + x.firstname + ' ' + x.lastname + '<li>').join(' ')

    let paatosvalta = ''
    if (paatosvaltaisuus.esityslista === '' && paatosvaltaisuus.aktiivisuus === '' && paatosvaltaisuus.kesto === '') paatosvalta += '<p>Kokouksen päätösvaltaisuutta ei ole määritelty.</p>'
    else {
        if (paatosvaltaisuus.esityslista !== '') paatosvalta += `<p>Kokous on päätösvaltainen jos vähintään ${paatosvaltaisuus.esityslista} kpl kokousosallistujista on avannut esityslistan.</p>`
        if (paatosvaltaisuus.aktiivisuus !== '') paatosvalta += `<p>Kokous on päätösvaltainen jos vähintään ${paatosvaltaisuus.aktiivisuus} kpl kokousosallistujista on ottanut asioihin kantaa.</p>`
        if (paatosvaltaisuus.kesto !== '') paatosvalta += `<p>Kokous on päätösvaltainen jos kokous kestää vähintään ${paatosvaltaisuus.kesto} vuorokautta.</p>`
    }

    const [kokouskutsu, setKokouskutsu] = useState(`
            <h3>Esityslista ${perustiedot.kokousNro} kokous alkaa ${start} ja päättyy ${end} </h3>
            ${nimi}
            <h4>Kokouksen avaus ${start}</h4>
            <h4>Osallistujat</h4>
            <ul>
            ${osallistuu.substring(0, osallistuu.length - 4)}
            </ul>
            <h4>Kokouksen päätösvaltaisuus</h4>
            ${paatosvalta}
            <h4>Kokous päättyy ${end}</h4>
            <p>Ystävällisin terveisin <br/>${user.firstname} ${user.lastname}<br/><small>${yhdistys}</small></p>
            `)


    const editorContentChange = (kokouskutsu) => {
        setKokouskutsu(kokouskutsu)
    }
    const handleClickSaveAndSend = () => {
        saveNewKokous()
        saveDocumentKokouskutsu()

    }
    const saveNewKokous = () => {

        const uusiKokous = JSON.stringify({
            call: 'luokokous',
            id_y: id_y,
            otsikko: perustiedot.otsikko,
            kokousnro: perustiedot.kokousNro.substring(0, perustiedot.kokousNro.length - 5),
            startDate: perustiedot.startDate,
            endDate: perustiedot.endDate
        })

        request.kokous(uusiKokous).then(() => {
            console.log('Kokous tallennettu ', uusiKokous)
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
        }).catch(err => {
            alert(err.response.data.message)
        })
    }

    console.log('osallistujat', osallistujat.length)
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

// Oletusotsikko siis tyyppiä: ”Esityslista 5/2019 kokous alkaa 16.5. ja päättyy 12.6.” 
// Järjestelmä tuottaa kutsuun myös oletussisällön, jossa ovat allekkain kokouksen sisältökohtien otsikot.
// Neljä esityslistan kohtaa tulostuu automaattisesti.
// - Kokouksen avaus pp.kk.vvvv
// - Osallistujat
// - Kokouksen päätösvaltaisuus
// - Kokous päättyy pp.kk.vvvv. 
// Kokous on päätösvaltainen,
// jos vähintään n kpl kokousosallistujista on avannut esityslistan. Tila: Päätösvaltainen / Ei päätösvaltainen
// jos vähintään n kpl kokousosallistujista on ottanut asioihin kantaa. Tila: Päätösvaltainen / Ei päätösvaltainen
// jos kokous kestää vähintään n vuorokautta. Tila: Päätösvaltainen / Ei päätösvaltainen
// Kohdan tai kohtien tila vaihtuu Ei päätösvaltaisesta Päätösvaltaiseksi automaattisesti, kun asetettu kriteeri
// täyttyy. 

export default Yhteenveto
