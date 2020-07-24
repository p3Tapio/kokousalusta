import React from 'react'
import '../../../Style/Paatos.css'

export const Paatos = ({type,kokous_id,kohta_id,teksti,hyvaksy,id}) => {
    
    
    return (
        <div className="paatos">
            <div>
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
                
        </div>
        </div>
    )
}

export default Paatos