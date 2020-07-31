import React from 'react'

const KokousPaatosvalta = ({ kokous, osallistujat, puheenjohtaja }) => {

    let tila_kesto = "Ei päätösvaltainen."
    let tila_esityslista = "Ei Päätösvaltainen."
    let tila_aktiivisuus = "Ei Päätösvaltainen."
 
    const kaikki = puheenjohtaja.concat(osallistujat)
    const avannutEsityslistan = kaikki.map(x => x.pv_avannut).reduce((a, v) => (v ==="1" ? a + 1 : a), 0)
    const ollutAktiivinen = kaikki.map(x => x.pv_aktiivinen).reduce((a, v) => (v === '1' ? a + 1 : a), 0)
    console.log('ollutAktiivinen', ollutAktiivinen)
    console.log('kokous.pv_aktiivisuus', kokous.pv_aktiivisuus)
    if (kokous.pv_kesto !== '0') {
        if (kokous.pv_kesto_toteutunut === 'true') tila_kesto = "Päätösvaltainen."
    } 
    if(kokous.pv_esityslista !== '0') {
        if( kokous.pv_esityslista <= avannutEsityslistan) tila_esityslista = "Päätösvaltainen."
    }
    if(kokous.pv_aktiivisuus !== '0') {
        if(kokous.pv_aktiivisuus <= ollutAktiivinen) tila_aktiivisuus = "Päätösvaltainen."
    }


    let paatosvaltaMaaritys
    let muuKriteeriTeksti

    if (kokous.pv_esityslista === '0' && kokous.pv_aktiivisuus === '0' && kokous.pv_kesto === '0' && kokous.pv_muu === '') {
        paatosvaltaMaaritys = "Ei päätösvaltaisuuskriteerejä."
        muuKriteeriTeksti = ""
    } else {
        if (kokous.pv_esityslista === '0' && kokous.pv_aktiivisuus === '0' && kokous.pv_kesto === '0' && kokous.pv_muu !== '') {
            paatosvaltaMaaritys = ""
            muuKriteeriTeksti = "Päätösvaltaisuuskriteeri"
        } else {
            paatosvaltaMaaritys = "Kokous on päätösvaltainen,"
            muuKriteeriTeksti = "Muut kokouksen päätösvaltaisuudelle asetetut kriteerit:"
        }
    }

    return (
        <div className="col-sm-10 mt-3 mx-auto">
            <h6>{paatosvaltaMaaritys}</h6>
            {kokous.pv_esityslista === '0' ? <></>
                : <li className="text-sm-nowrap">jos vähintään {kokous.pv_esityslista} osallistujista on avannut esityslistan.<span>&nbsp;</span>Tila: {tila_esityslista}</li>
            }
            {kokous.pv_aktiivisuus === '0' ? <></>
                : <li className="text-sm-nowrap">jos vähintään {kokous.pv_aktiivisuus} osallistujista on ottanut asioihin kantaa.<span>&nbsp;&nbsp;</span>Tila: {tila_aktiivisuus}</li>
            }
            {kokous.pv_kesto === '0' ? <></>
                : <li className="text-sm-nowrap">jos kokous kestää vähintään  {kokous.pv_kesto} vuorokautta. <span>&nbsp;&nbsp;</span>Tila: {tila_kesto}</li>
            }
            {kokous.pv_muu === '' ? <></>
                : <><h6 className="mt-3">{muuKriteeriTeksti}</h6>
                    <li>{kokous.pv_muu}</li>
                </>}


        </div>
    )
}

export default KokousPaatosvalta


/*

  <div className="col-md-10 m-auto">
            <div className="mt-4">


                {paatosvaltaMaaritys}
                <p></p>


                {kokous.pv_esityslista === '0' ? <></>
                    : <><p>jos vähintään {kokous.pv_esityslista} osallistujista on avannut esityslistan.</p>
                        <p><span>&nbsp;</span>Tila: {tila}</p>
                    </>}


                {kokous.pv_aktiivisuus === '0' ? <></>
                    : <div style={{ whiteSpace: 'nowrap' }}>
                        <p>jos vähintään {kokous.pv_aktiivisuus} osallistujista on ottanut asioihin kantaa.<span>&nbsp;&nbsp;</span>Tila: {tila}</p>
                    </div>}



                {kokous.pv_kesto === '0' ? <></>
                    : <div style={{ whiteSpace: 'nowrap' }}><p>jos kokous kestää vähintään  {kokous.pv_kesto} vuorokautta. <span>&nbsp;&nbsp;</span>Tila: {tila_kesto}</p>
                    </div>}



                {kokous.pv_muu === '' ? <></>
                    : <>{muuKriteeriTeksti}
                        <li>{kokous.pv_muu}</li>
                    </>}
            </div>
            <hr />
        </div>


Kokous on päätösvaltainen,
jos vähintään n kpl kokousosallistujista on avannut esityslistan. Tila: Päätösvaltainen / Ei päätösvaltainen
jos vähintään n kpl kokousosallistujista on ottanut asioihin kantaa. Tila: Päätösvaltainen / Ei päätösvaltainen
jos kokous kestää vähintään n vuorokautta. Tila: Päätösvaltainen / Ei päätösvaltainen
Kohdan tai kohtien tila vaihtuu Ei päätösvaltaisesta Päätösvaltaiseksi automaattisesti, kun asetettu kriteeri täyttyy.
*/