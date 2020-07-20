import React, { useState } from 'react'
import { useHistory } from 'react-router-dom'
import { getSessionRole } from '../Auth/Sessions'
import Kokouslistat from './Kokouslistat'
import HelpPop from '../Shared/HelpPop'

const AssocMember = ({ yhdistys, kokoukset, yhdistys_id }) => {
    let history = useHistory()
    const [showComponent, setShowComponent] = useState('kaynnissa')
    const helpText = <p >Valikosta voit valita haluamasi näkymän. </p>

    const handleMenuClick = (ev) => {
        
        setShowComponent(ev.target.name)
        
    }

    if (getSessionRole() && getSessionRole().role === 'member' && getSessionRole().yhdistys === yhdistys && kokoukset) {

        return (
            <div>
                  <div className="d-sm-flex  justify-content-center">
                    <button className="btn btn-outline-primary btn-sm mx-1" name="kaynnissa" onClick={handleMenuClick}>e olevat kokoukset</button>
                    <button className="btn btn-outline-primary btn-sm mx-1" name="tulevat" onClick={handleMenuClick}>Tulevat kokoukset</button>
                    <button className="btn btn-outline-primary btn-sm mx-1" name="menneet" onClick={handleMenuClick}>Päättyneet kokoukset</button>
                    <HelpPop heading="Yhdistyksen etusivu" text={helpText} btnText="Selitystä" placement="left" variant="btn btn-outline-danger btn-sm mx-1" />
                    <hr />
                </div>
                <Kokouslistat kokoukset={kokoukset} showComponent={showComponent} yhdistys={yhdistys} yhdistys_id={yhdistys_id} />
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
