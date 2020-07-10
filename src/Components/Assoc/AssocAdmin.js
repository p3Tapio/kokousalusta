import React, { useState } from 'react'
import { useHistory } from 'react-router-dom'
import Kokouslistat from './Kokouslistat'
import Jasenlista from './Jasenlista'
import HelpPop from '../Shared/HelpPop'
import { getSessionRole } from '../Auth/Sessions'

const AssocAdmin = ({ kokoukset, members, yhdistys }) => {

    let history = useHistory()
    const [showComponent, setShowComponent] = useState('kaynnissa')
    const helpText = <p >Valikon kautta voit valita haluamasi näkymän. Voit luoda uuden kokouksen painamalla uusi kokous -näppäintä. Näet myös tulevat ja käynnissä olevat kokoukset sekä menneiden kokouksien asiat valikon näppäimien kautta. Palveluun rekisteröityneet jäsenet saat näkyville yhdistyksen jäsenet -näppäintä painamalla. </p>

    const handleMenuClick = (ev) => {
        setShowComponent(ev.target.name)
    }

    let component
    if (showComponent === 'tulevat' || showComponent === 'menneet' || showComponent === 'kaynnissa') component = <Kokouslistat kokoukset={kokoukset} showComponent={showComponent} yhdistys={yhdistys} />
    else if (showComponent === 'jasenet') component = <Jasenlista members={members} />
    else component = <></>

    if (getSessionRole() && getSessionRole().role === 'admin' && getSessionRole().yhdistys === yhdistys) {
        
        return (
            <div>
                <div>
                    <div className="d-sm-flex  justify-content-center">
                        <button className="btn btn-outline-primary btn-sm mx-1" name="kaynnissa" onClick={handleMenuClick}>Käynnissä olevat kokoukset</button>
                        <button className="btn btn-outline-primary btn-sm mx-1" name="tulevat" onClick={handleMenuClick}>Tulevat kokoukset</button>
                        <button className="btn btn-outline-primary btn-sm mx-1" name="menneet" onClick={handleMenuClick}>Päättyneet kokoukset</button>
                        <button className="btn btn-outline-primary btn-sm mx-1" name="jasenet" onClick={handleMenuClick}>Yhdistyksen jäsenet</button>
                        <HelpPop heading="Yhdistyksen etusivu" text={helpText} btnText="Selitystä" placement="left" variant="btn btn-outline-danger btn-sm mx-1" />
                    </div>
                    <hr />
                </div>
                {component}
            </div>
        )
    } else if (!getSessionRole()) {
        return <p>loading.... </p>
    }
    else {
        history.push('/userpage')
        return null
    }
}
export default AssocAdmin