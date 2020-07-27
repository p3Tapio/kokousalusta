import React, { useState  } from 'react';
import '../../../Style/CheckboxArea.css';
import ReactDatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";


var summa;
const CheckboxArea = ({edit=true, arvot=[], checkValue=[], check, remove, save, uusi,multi=0,type="3",tila}) => {
    summa=0; 
    arvot.map(x=> summa+=parseInt(x.maara))
    
    
    
    
    
    
    const this_remove = (id) => {if(tila!="3")remove(id)}
    const this_save = (id,nnimi) => {if(tila!="3")save(id,nnimi)}
    const this_check = (id) => {if(tila!="3")check(id,multi)}
    edit=false;
    let lisaa;
    if (type=="3" && tila !="3") lisaa = <button className="uusi add" onClick={uusi}>Valinta</button>

    return (
        <div>
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
                 </div> )}    
            {lisaa}
         <br/>
        </div>
    )
}


const EditableCheckbox = ({tila,maara=0,edit,id,nimi,arvo,check,remove,save,summa=0}) => {
    
    const thischeck = () => {check(id)}
    const thisremove = () => {remove(id)}
    const this_save = (event) => {save(id,event.target.value)}
    const thiskey = (event) => {
        if (event.key === ' '){
            event.preventDefault();
            check(id);
        }
    }
   let ruutu;
   ruutu = <div tabIndex="0" onKeyDown={thiskey} className={(arvo)?"green ruutu":"ruutu"} onClick={thischeck}></div>
    
    return (
        <div className={(tila=="3")?"":"valintahover"}>
        <div className="valinta" >
             {(maara>0)?<div className="valinta_maara">{(parseFloat(maara)/parseFloat(summa)*100).toFixed(1)}% ({maara})</div>:""}
             
             {(summa>0)?<div style={{marginLeft:"40px",width:(parseFloat(maara)/parseFloat(summa)*90)+"%",backgroundColor:"#ddd",height:"5px",marginTop:"30px",position:"absolute"}}></div>:""}
            {ruutu}
            {(edit==0 && maara ==0)?
            
            <input onChange={this_save} spellCheck="false" className="ruutuvalinta" type="text" value={nimi} autofocus></input>:
            
            <div spellCheck="false" className="ruutuvalinta">{nimi}</div>}
            {(edit==0 && maara==0)?<div className="remove" onClick={thisremove}></div>:""}
            </div>
            </div>
      )
}




export default CheckboxArea