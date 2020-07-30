import React, { useState, useEffect } from 'react';
import ResizeTextArea from './ResizeTextArea';
import '../../../Style/Hyvaksy.css';
/**
 * 
 * Asiakirja kohta 
 *  -  ("kuvaus" löytyy parentista)
 *  - ruutu jossa voi hyväksyä esitetyn asian.
 *  - tekstiruutu jossa voi ehdottaa muutosta asiaan.
 *  - näyttää kuinka monta on hyväksynyt.
 *  
 * 
 *  - kommenttiraita.
 * 
 */


const Hyvaksy = ({kohta_id,kokous_id, save,sisus}) => {
    const this_save = (id,data) => {
        save(id,data)
    }
    const this_check = () => {

    }
    return (
        <div className="asiakohta_hyvaksy">
            
            <Checkbox kohta_id={kohta_id} check={this_check} nimi = "hyväksyn"/>
                <div className="asiakohta_perustelu">
                
                <ResizeTextArea  edit={true} sisus={sisus} save={this_save} placeholder={"Ehdota muutosta"}/>
            </div>
        </div>
    
    )
}

export default Hyvaksy
const Checkbox = ({id,nimi,arvo,check}) => {
    const thischeck = (event) => {check(id)}
    
    const this_save = () => {}
    

   let ruutu;
   ruutu = <div  className={(arvo)?"green ruutu":"ruutu"} onClick={thischeck}></div>

    return (
        <div className="valinta" >
            {ruutu}
           
            <input onChange={this_save} spellCheck="false" className="ruutuvalinta" type="text" value={nimi}></input>
            </div>
      )
}