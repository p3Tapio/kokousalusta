import React from 'react'

const KokousPaatosvalta = ({ kokous }) => {
    let tila = "Ei päätösvaltainen."
    let tila_kesto = "Ei päätösvaltainen."
    if (kokous.pv_kesto !== '0') {

        const start = new Date(kokous.startDate)
        const end = new Date(kokous.endDate)
        const now = new Date()
        now.setHours(3, 0, 0, 0) // kloaika tk:sta on startissa ja endissä 3:00:00 ... ?

        const erotus_aika = end.getTime() - start.getTime() // alkupvm ja lopun erotus --- onko edes tarpeen? 
        const erotus_pv = erotus_aika / (1000 * 3600 * 24)

        const erotus_aika2 = now.getTime() - start.getTime()
        const erotus_pv2 = erotus_aika2 / (1000 * 3600 * 24)

        if (erotus_pv >= kokous.pv_kesto || erotus_pv2 >= kokous.pv_kesto) tila_kesto = "Päätösvaltainen."  // testaus 
    }


    return (
        <div className="col-md-10 m-auto">
            <div className="mt-4">
                <p>Kokous on päätösvaltainen,</p>
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
                    : <><p className="mt-4">Muut kokouksen päätösvaltaisuudelle asetetut kriteerit:</p>
                        <li>{kokous.pv_muu}</li>
                    </>}
            </div>
            <hr />
        </div>
    )
}

export default KokousPaatosvalta


/*
Kokous on päätösvaltainen,
jos vähintään n kpl kokousosallistujista on avannut esityslistan. Tila: Päätösvaltainen / Ei päätösvaltainen
jos vähintään n kpl kokousosallistujista on ottanut asioihin kantaa. Tila: Päätösvaltainen / Ei päätösvaltainen
jos kokous kestää vähintään n vuorokautta. Tila: Päätösvaltainen / Ei päätösvaltainen
Kohdan tai kohtien tila vaihtuu Ei päätösvaltaisesta Päätösvaltaiseksi automaattisesti, kun asetettu kriteeri täyttyy.

*/