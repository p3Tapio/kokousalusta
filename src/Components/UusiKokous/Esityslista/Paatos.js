import React from 'react'
import '../../../Style/Paatos.css'
import { FaGavel } from 'react-icons/fa';

export const Paatos = ({type,kokous_id,kohta_id,teksti,hyvaksy,id,tila}) => {
    
    
    return (
        <div className="paatos">
            <div className="nuija"><FaGavel/></div>
            <div className="paatos_valmis">Päätettiin että jada jada jada jada jada jda jada jda daj daj daj dajd aj djdajd ajda</div>
            {(tila!="3")?<button>Tee paatos</button>:""}
           {/* <div>
            Ääniä on annettu tähän mennessä.... äänestys aikaa jäljellä vielä 2 päivää.
            </div>
        
        <div>
            Ei tarpeeksi ääniä, valintaa lykätään 5 päivällä.
        </div>
        
        <div>
            Äänestyksessä on tasapeli tilanne
        </div>
        
        <div>
            Olet saanut eniten ääniä puheenjohtaja valinnassa.
            
                <div> Hyväksyn </div> 
                <div> En halua </div> 
                <div className="teepaatos">
                
                tee päätös</div>
           </div>*/}
        </div>
    )
}

export default Paatos