import React, { useState  } from 'react';
import '../../../Style/CheckboxArea.css';
import ReactDatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

var saveParams = new URLSearchParams();
const CheckboxArea = ({edit=false, arvot=[], checkValue=[], check, remove, save, uusi,summa,multi=0}) => {
    
    const this_remove = (id) => {remove(id)}
    const this_save = (id,nnimi) => {save(id,nnimi)}
    const this_check = (id) => {check(id,multi)}
    edit=false;
    let lisaa;
    if (edit) lisaa = <button className="uusi add" onClick={uusi}>Valinta</button>

    return (
        <div>
            {arvot.map(arvot => <EditableCheckbox arvo={(checkValue && checkValue.includes(arvot.id))} summa={summa} maara={arvot.maara} edit={edit} remove={this_remove} save={this_save} check={this_check} nimi={arvot.nimi} key={arvot.id} id={arvot.id} /> )}    
            {lisaa}
         <br/>
        </div>
    )
}


const EditableCheckbox = ({maara=0,edit,id,nimi,arvo,check,remove,save,summa=0}) => {
    
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
             {(maara>0)?<div className="valinta_maara">{(parseFloat(maara)/parseFloat(summa)*100).toFixed(1)}% ({maara})</div>:""}
             
             {(summa>0)?<div style={{marginLeft:"60px",width:(parseFloat(maara)/parseFloat(summa)*90)+"%",backgroundColor:"#ddd",height:"5px",marginTop:"30px",position:"absolute"}}></div>:""}
            {ruutu}
            {(edit)?<input onChange={this_save} spellCheck="false" className="ruutuvalinta" type="text" value={nimi}></input>:
            <div spellCheck="false" className="ruutuvalinta">{nimi}</div>}
            <div className="remove" onClick={thisremove}></div>       
            </div>
      )
}




export default CheckboxArea