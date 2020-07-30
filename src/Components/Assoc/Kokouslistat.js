import React, { useState, useEffect } from 'react'
import KokousTable from './KokousTable'

const Kokouslistat = ({ kokoukset, showComponent, yhdistys, yhdistys_id }) => {

    const [tulevat, setTulevat] = useState([]);
    const [kaynnissa, setKaynnissa] = useState([]);
    const [menneet, setMenneet] = useState([]);
    
    useEffect(() => {
        if (kokoukset) {
            kokoukset.map((item) => {
                if (Date.parse(item.endDate) < new Date()) setMenneet(menneet => [...menneet, item])
                else if (Date.parse(item.endDate) > new Date() && Date.parse(item.startDate) < new Date()) {
                    setKaynnissa(kaynnissa => [...kaynnissa, item])
                }
                else setTulevat(tulevat => [...tulevat, item])
                return null;
            })
        }
    }, [kokoukset])

    let component

    if (showComponent === 'kaynnissa') {
        component =
            (<>
                {kaynnissa.length === 0
                    ? <><h5>Yhdistyksellä ei ole käynnissä olevia kokouksia</h5></>
                    : <>{/*<h5>Käynnissä olevat kokoukset</h5>*/}
                        <KokousTable kokous={kaynnissa} yhdistys={yhdistys} status="kaynnissa" yhdistys_id={yhdistys_id} />
                    </>}
            </>)
    } else if (showComponent === 'menneet') {
        component =
            (<>
                {menneet.length === 0
                    ? <><h5>Yhdistyksellä ei ole menneitä kokouksia</h5></>
                    : <>
                        <KokousTable kokous={menneet} yhdistys={yhdistys} status="paattynyt" yhdistys_id={yhdistys_id}/>
                    </>}
            </>)
    } else if (showComponent === 'tulevat') {
        component =
            (<>
                {tulevat.length === 0
                    ? <><h5>Yhdistyksellä ei ole tulevia kokouksia</h5></>
                    : <>
                        <KokousTable kokous={tulevat}  yhdistys={yhdistys} status="tuleva" yhdistys_id={yhdistys_id}/>
                    </>}
            </>)
    } else component = <></>

    return <div className="mt-2">{component}</div>

}

export default Kokouslistat

