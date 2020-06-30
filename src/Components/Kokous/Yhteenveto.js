import React from 'react'

const Yhteenveto = ({ perustiedot, osallistujat, paatosvaltaisuus }) => {
    const pvmForm = { month: 'numeric', day: 'numeric' };
    const start = (new Date(perustiedot.startDate)).toLocaleDateString('fi-FI', pvmForm)
    const end = (new Date(perustiedot.endDate)).toLocaleDateString('fi-FI', pvmForm)

    return (
        <div className="mt-5 mx-auto col-md-10">
            <h5 className="mb-4">Yhteenveto</h5>
            {perustiedot.otsikko}
            <h6>Esityslista{' '} {perustiedot.kokousNro}{' '}kokous alkaa{' '}{start}{' '}ja päättyy{' '}{end}</h6>
            <h6>Kokouksen avaus {(new Date(perustiedot.startDate)).toLocaleDateString('fi-FI', pvmForm)}</h6>
            <h6>Osallistujat:</h6>
            <ul>
                {osallistujat.map((item, key) =>
                    <li key={key}>{item.firstname} {item.lastname}</li>
                )}
            </ul>
            {paatosvaltaisuus.esityslista === '' || paatosvaltaisuus.esityslista === '' || paatosvaltaisuus.esityslista === ''
                ? <h6>Kokouksen päätösvaltaisuutta ei ole määritelty</h6>
                : <>
                    <h6>Kokouksen päätösvaltaisuus</h6>
                    {paatosvaltaisuus.esityslista === '' ? <></>
                        : <p>Kokous on päätösvaltainen jos vähintään {paatosvaltaisuus.esityslista} kpl kokousosallistujista on avannut esityslistan.</p>}
                    {paatosvaltaisuus.aktiivisuus === '' ? <></>
                        : <p>Kokous on päätösvaltainen jos vähintään {paatosvaltaisuus.aktiivisuus} kpl kokousosallistujista on ottanut asioihin kantaa.</p>}
                    {paatosvaltaisuus.kesto === '' ? <></>
                        : <p>Kokous on päätösvaltainen jos kokous kestää vähintään {paatosvaltaisuus.kesto} vuorokautta.</p>}
                </>
            }
            <h6>Kokouksen päättyy {(new Date(perustiedot.endDate)).toLocaleDateString('fi-FI', pvmForm)}</h6>
            <hr />
            <div className="form-group text-right">
                <button className="btn btn-outline-primary mt-3">Lähetä kokouskutsu</button>
            </div>
        </div>
    )
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
