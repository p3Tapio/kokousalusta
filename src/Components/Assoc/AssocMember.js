import React, { useState } from 'react'
import { useHistory } from 'react-router-dom'
import { getSessionRole } from '../Auth/Sessions'
import Kokouslistat from './Kokouslistat'
import HelpPop from '../Shared/HelpPop'

const AssocMember = ({ yhdistys, kokoukset }) => {
    let history = useHistory()
    const [showComponent, setShowComponent] = useState('tulevat')
    const helpText = <p >Valikosta voit valita haluamasi näkymän. </p>

    const handleMenuClick = (ev) => {
        setShowComponent(ev.target.name)
    }

    if (getSessionRole() && getSessionRole().role === 'member' && getSessionRole().yhdistys === yhdistys && kokoukset) {
        let buttons
        if (showComponent === 'tulevat') {
            buttons = (<>
                <button className="btn btn-outline-primary btn-sm mx-1" name="menneet" onClick={handleMenuClick}>Päättyneet kokoukset</button>
                <button className="btn btn-outline-primary btn-sm mx-1" name="kaynnissa" onClick={handleMenuClick}>Käynnissä olevat kokoukset</button>
            </>)
        } else if (showComponent === 'kaynnissa') {
            buttons = (<>
                <button className="btn btn-outline-primary btn-sm mx-1" name="menneet" onClick={handleMenuClick}>Päättyneet kokoukset</button>
                <button className="btn btn-outline-primary btn-sm mx-1" name="tulevat" onClick={handleMenuClick}>Tulevat kokoukset</button>
            </>)
        } else {
            buttons = (<>
                <button className="btn btn-outline-primary btn-sm mx-1" name="kaynnissa" onClick={handleMenuClick}>Käynnissä olevat kokoukset</button>
                <button className="btn btn-outline-primary btn-sm mx-1" name="tulevat" onClick={handleMenuClick}>Tulevat kokoukset</button>
            </>)
        }
        return (
            <div>
                <div>
                    {buttons}
                    <HelpPop heading="Yhdistyksen etusivu" text={helpText} btnText="Selitystä" placement="left" variant="btn btn-outline-danger btn-sm mx-1" />
                    <hr />
                </div>
                <Kokouslistat kokoukset={kokoukset} showComponent={showComponent} yhdistys={yhdistys} />
            </div>
        )
    } else if (!getSessionRole() && !kokoukset) {
        return <p>Loading....</p>
    } else {
        history.push('/userpage')
        return null
    }
}

export default AssocMember
