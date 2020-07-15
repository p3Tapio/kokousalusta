import React, { useState  } from 'react';
import '../../../Style/CheckboxArea.css';
import ReactDatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

var saveParams = new URLSearchParams();
const CheckboxArea = ({edit=false,arvot=[],checkValue=[],check,remove,save,uusi}) => {

    const this_remove = (id) => {remove(id)}
    const this_save = (id,nnimi) => {save(id,nnimi)}
    const this_check = (id) => {check(id)}
    
    let lisaa;
    if (edit) lisaa = <button className="uusi add" onClick={uusi}>Valinta</button>

    return (
        <div>
            {arvot.map(arvot => <EditableCheckbox arvo={(checkValue && checkValue.includes(arvot.id))} remove={this_remove} save={this_save} check={this_check} nimi={arvot.nimi} key={arvot.id} id={arvot.id} /> )}    
            {lisaa}
         <br/>
        </div>
    )
}


const EditableCheckbox = ({id,nimi,arvo,check,remove,save}) => {
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
        <div className="valinta" >
            {ruutu}
            <input onChange={this_save} spellCheck="false" className="ruutuvalinta" type="text" value={nimi}></input>
            <div className="remove" onClick={thisremove}></div>       
            
            </div>
      )
}




export default CheckboxArea