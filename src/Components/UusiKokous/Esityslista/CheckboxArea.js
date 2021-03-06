import React, { useState  } from 'react';
import '../../../Style/CheckboxArea.css';
import "react-datepicker/dist/react-datepicker.css";
import Kommentit from './Kommentit';


var summa;
const CheckboxArea = ({options=false, toggle, flags, kohta_id, kokous_id, edit=true, arvot=[], checkValue=[], check, remove, save, uusi,multi=0,type="3",tila}) => {
    summa=0; 
    arvot.map(x=> summa+=parseInt(x.maara))
    
    
    
    
    const thisuusi = () => {
        
        uusi(0)
    }
    
    const this_remove = (id) => {if(tila!="3")remove(id)}
    const this_save = (id,nnimi) => {if(tila!="3")save(id,nnimi)}
    const this_check = (id) => {if(tila!="3")check(id,multi)}

    edit=false;

    let lisaa;
    if (type=="3" && tila !="3" && (options || flags&2 )) lisaa = <button className="uusi add" onClick={()=>thisuusi()}>Valinta</button>

    return (
        <div style={{zIndex:"100"}}>
            {arvot.map(arvot => 
                 <div><EditableCheckbox
                 arvo={(checkValue && checkValue.includes(arvot.id))} 
                 summa={summa} 
                 tila={tila}
                 maara={arvot.maara} 
                 edit={arvot.tekija}
                 remove={this_remove}
                 save={this_save}
                 check={this_check}
                 nimi={arvot.nimi}
                 key={arvot.id}
                 id={arvot.id} />
                 <div><Kommentit
                    tyyppi="valinta"
                    thread_id={arvot.id}
                    kohta_id={kohta_id}
                    kokous_id={kokous_id}
                    maara={arvot.kommentit}/>
                </div>
                </div>
                  )}    
            {lisaa}
            {options?<div><hr/>
            <Checkbox check={flags&1} click={()=>toggle(kohta_id,1)} nimi={"Sallimonta valintaa"}/>
            <Checkbox check={flags&2} click={()=>toggle(kohta_id,2)} nimi={"Kaikki voi ehdottaa"}/>
            </div>:""}
        </div>
    )
}


const EditableCheckbox = ({tila,maara=0,edit,id,nimi,arvo,check,remove,save,summa=0}) => {
    
    const thischeck = () => {if(tila==23 || tila == 3)return;check(id)}
    const thisremove = () => {if(tila==23 || tila == 3)return;remove(id)}
    const this_save = (event) => {if(tila==23 || tila == 3)return;save(id,event.target.value)}
    const thiskey = (event) => {
        if (event.key === ' '){
            event.preventDefault();
            check(id);
        }
    }
   let ruutu;
   ruutu = <div tabIndex="0" onKeyDown={thiskey} className={(arvo)?"green ruutu":"ruutu"} onClick={thischeck}></div>
    
    return (
        <div className={((tila=="3" || tila=="23"))?"":"valintahover"}>
        <div className="valinta" >
            
             
             {(summa>0)?<div style={{marginLeft:"40px",width:(parseFloat(maara)/parseFloat(summa)*88)+"%",maxWidth:"calc(100% - 40px)",backgroundColor:"#ddd",height:"5px",marginTop:"30px",position:"absolute"}}></div>:""}
            {ruutu}
            {(edit==0 && maara ==0)?
            
            <input onChange={this_save} spellCheck="false" className="ruutuvalinta" type="text" value={nimi} ></input>:
            
            <div spellCheck="false" className="ruutuvalinta">{nimi} 
            {(maara>0)?<div className="valinta_maara">{(parseFloat(maara)/parseFloat(summa)*100).toFixed(1)}% ({maara})</div>:""}</div>}
 
            {(edit==0 && maara==0)?<div className="remove" onClick={thisremove}></div>:""}
            </div>
            
            </div>
            
      )
}

export default CheckboxArea
const Checkbox = ({check,click,nimi}) => {

   
   

    return (
        <div className="valinta" onClick={click}>
            <div  className={(check)?"green ruutu":"ruutu"} ></div>
            <div spellCheck="false" className="ruutuvalinta" >{nimi}</div>
            </div>
      )
}