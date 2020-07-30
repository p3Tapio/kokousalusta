import React, { useState, useEffect } from 'react';
import '../../../Style/Paatos.css'
import { FaGavel } from 'react-icons/fa';
import ResizeTextArea from './ResizeTextArea'
import EsitysKohta from './EsitysKohta';
/**
 * tila: 5 -> 
 * tila: 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 */



export const Paatos = ({pj=false, type,kokous_id,kohta_id,tila,paatos,save}) => {
    var thisdata =""
    const [nappiBool, setnappibool] = useState(false) 
    thisdata = paatos;
    const this_save = (_id,data,delay) => {
        thisdata = data;
        save(kohta_id,[data,2],delay)
      } 
    
    const naytavalinnat = () => {
        
        setnappibool(!nappiBool);
    }

    return (
        <div>
        <div className={"paatos"+tila}>
            {pj?<div className="nuija" onClick={()=>naytavalinnat()}><div className="nuija2"><FaGavel/></div> </div>:""}
            <div className="paatos_editori"><ResizeTextArea edit={tila!=3 && pj} id={kohta_id} sisus={paatos} save={this_save}/></div>
          </div>
            {nappiBool?
            (tila==3)?<div  className="paatos_valinnat"><div className="avaa" onClick={()=>{setnappibool(false);save(kohta_id,[paatos,2],100)}}>AVAA</div></div>:
            <div  className="paatos_valinnat"><div onClick={()=>{setnappibool(false);save(kohta_id,[thisdata,3],100)}}>Hyväksy!</div><div>Lisäaikaa</div><div>Hylkää</div></div>:""}
            
          
           {
           /* 
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
                <div className="teepaatos">
                
                tee päätös</div>
           </div>*/
           }
        </div>
       
        
    )
}

export default Paatos