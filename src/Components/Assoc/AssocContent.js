import React, { useState} from 'react'
import { useHistory } from 'react-router-dom'
import Kokouslistat from './Kokouslistat'
import Jasenlista from './Jasenlista'
import HelpPop from '../Shared/HelpPop'
import { getSessionRole } from '../Auth/Sessions'
import Loading from '../Shared/Loading'

const AssocAdmin = ({ kokoukset, members, yhdistys, yhdistys_id }) => {
    
    let history = useHistory()
    const [showComponent, setShowComponent] = useState('kaynnissa')
    const helpText = <p >Valikon kautta voit valita haluamasi näkymän. Voit luoda uuden kokouksen painamalla uusi kokous -näppäintä. Näet myös tulevat ja käynnissä olevat kokoukset sekä menneiden kokouksien asiat valikon näppäimien kautta. Palveluun rekisteröityneet jäsenet saat näkyville yhdistyksen jäsenet -näppäintä painamalla. </p>

    const handleMenuClick = (ev) => {
        let napit = ev.target.parentNode.querySelectorAll("button");
        for (let i = 0; i < napit.length; i++) {
            napit[i].classList.remove("valittu_menu");
          }
        setShowComponent(ev.target.name)
        ev.target.classList.add("valittu_menu");
    }

    let component
    if (showComponent === 'tulevat' || showComponent === 'menneet' || showComponent === 'kaynnissa') component = <Kokouslistat kokoukset={kokoukset} showComponent={showComponent} yhdistys={yhdistys} yhdistys_id={yhdistys_id} />
    else if (showComponent === 'jasenet') component = <Jasenlista members={members} />
    else component = <></>

    if (getSessionRole() && getSessionRole().yhdistys === yhdistys && kokoukset)  {

        return (
            <div >
                    <div className="d-sm-flex justify-content-center second_nav">
                        <button className="text-primary valittu_menu" name="kaynnissa" onClick={handleMenuClick}>Kokoukset</button>
                        <button className="text-primary " name="tulevat" onClick={handleMenuClick}>Tulevat kokoukset</button>
                        <button className="text-primary " name="menneet" onClick={handleMenuClick}>Päättyneet kokoukset</button>
                        <button className="text-primary " name="jasenet" onClick={handleMenuClick}>Jäsenlista</button> 
                        <HelpPop heading="Yhdistyksen etusivu" text={helpText} btnText="Selitystä" placement="left" variant="btn btn-outline-danger btn-sm mx-1" />
                    </div>    
                {component}
            </div>
        )
    } else if (!getSessionRole()) {
        return <Loading/>
    }
    else {
        history.push('/userpage')
        return null
    }
}
export default AssocAdmin