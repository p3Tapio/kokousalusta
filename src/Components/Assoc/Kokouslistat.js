import React, { useState, useEffect } from 'react'
import KokousTable from './KokousTable'

const Kokouslistat = ({ kokoukset, kumpi, showComponent }) => {

    const [kaynnissa, setKaynnissa] = useState([]);
    const [menneet, setMenneet] = useState([]);

    useEffect(() => {

        kokoukset.map((item) => {
            if (Date.parse(item.endDate) < new Date()) setMenneet(menneet => [...menneet, item])
            else if (Date.parse(item.endDate) >= new Date()) setKaynnissa(kaynnissa => [...kaynnissa, item])
            return null;
        })

    }, [kokoukset])

    let component

    if (showComponent === 'tulevat') {
        component =
            (<>
                {kaynnissa.length === 0
                    ? <><h5>Yhdistyksellä ei ole tulevia tai käynnissä olevia kokouksia</h5></>
                    : <><h5>Tulevat ja käynnissä olevat kokoukset</h5>
                        <KokousTable data={kaynnissa} />
                    </>}
            </>)
    } else if (showComponent==='menneet') {
        component =
            (<>
                { menneet.length === 0
                ? <><h5>Yhdistyksellä ei ole menneitä kokouksia</h5></>
                : <><h5 className="mt-4">Päättyneet kokoukset</h5>
                    <KokousTable data={menneet} />
                </>}
            </>)

    } else component = <></>

    return  <div className="mt-5">{component}</div>
          
}

export default Kokouslistat
