import React from 'react'

const KokousPaatosvalta = ({ kokous }) => {

    let tila_kesto = "Ei päätösvaltainen"
    if (kokous.pv_kesto !== '0') {

        const start = new Date(kokous.startDate)
        const end = new Date(kokous.endDate)    
        const now = new Date() 
        now.setHours(3,0,0,0) // kloaika on startissa ja endissä 3:00:00 ... ?
        
        const erotus_aika = end.getTime() - start.getTime() // alkupvm ja lopun erotus --- onko edes tarpeen? 
        const erotus_pv = erotus_aika / (1000 * 3600 * 24)

        const erotus_aika2 = now.getTime() - start.getTime() 
        const erotus_pv2 = erotus_aika2 / (1000 * 3600 *24)

        if (erotus_pv >= kokous.pv_kesto && erotus_pv2 >= kokous.pv_kesto) tila_kesto = "Päätösvaltainen"
    }
    

    console.log('kokous', kokous)
    return (
        <div className="col-md-8 m-auto">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', lineHeight: '8px', whiteSpace: 'nowrap', marginTop: '40px' }}>
                <p>Kokous on päätösvaltainen,</p>
                <p></p>
                {kokous.pv_esityslista === '0' ? <></>
                    : <><p>jos vähintään {kokous.pv_esityslista} osallistujista on avannut esityslistan.</p>
                        <p><span>&nbsp;&nbsp;</span>Tila:</p>
                    </>}
                {kokous.pv_aktiivisuus === '0' ? <></>
                    : <><p>jos vähintään {kokous.pv_aktiivisuus} osallistujista on ottanut asioihin kantaa.</p>
                        <p><span>&nbsp;&nbsp;</span>Tila: </p>
                    </>}
                {kokous.pv_kesto === '0' ? <></>
                    : <><p>jos kokous kestää vähintään  {kokous.pv_kesto} vuorokautta.</p>
                        <p><span>&nbsp;&nbsp;</span>Tila: {tila_kesto} </p>
                    </>}
                {kokous.pv_muu === '' ? <></>
                    : <><p>{kokous.pv_muu} </p>
                        <p></p>
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