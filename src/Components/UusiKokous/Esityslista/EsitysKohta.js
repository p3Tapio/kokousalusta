import React, { useState } from 'react'
import Kalenteri from './Kalenteri'
import Paatos from './Paatos'
import Sisalto from './Sisalto'
import ResizeTextArea from './ResizeTextArea'
import '../../../Style/Paatos.css'
import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import fi from 'date-fns/locale/fi';
import { FaHandshake,FaUserCheck,FaComment,FaComments,FaGavel, FaTrashAlt } from 'react-icons/fa';
const url = process.env.REACT_APP_HOST_URL
const EsitysKohta = ({flags,pj=false,oikeudet="2",vaihda_tyyppi,kokous_id,type,title,id,alkaa,loppuu,auki=false,avaa,save,poista,paatos,tila}) => {
  
  const [startDate, setStartDate] = useState((alkaa!=="0000-00-00")?new Date(alkaa):"")
  
  var sisalto
  let alku
  let loppu
  registerLocale('fi', fi)

  const this_save = (_id,data,delay,type) => {
    save(_id,data,delay,type,id)
  }  
  
  const this_avaa = () => {
    avaa(id)
  }

  const thisvaihda_tyyppi = (param) => {
    if (type==param) param=0;
    vaihda_tyyppi(id,param)
  } 

  const thisinfo = (param,palaa=0) => {
    let teksti;
    let elem = document.getElementById("info"+id);
    switch(param){
      case 3: teksti = "Hyväksy asiakohta";break;
      case 4: teksti = "Äänestys</b>";break;
      case 2: teksti = "Mielipiteitä asiasta";break;
      case 5: teksti = "Nimitys";break;
      case 6: teksti = "Puheenjohtajan valinta";break;
      default: teksti = "Tiedoksi";break;
    }
    if(palaa==1) return teksti;
    elem.innerHTML=teksti;
  }

  const paatos_save = (_id,data,delay) => {
    
    save(id,data,delay,"paatos",id)

  }

  const vaihda_aika = () => {
    
  }

  const poista_kohta = () => {
    if (window.confirm('Poista asiakohta?')) {
      poista("poista_kohta",id)
    } 
      
  }


  if(tila!=3 && startDate!=null && startDate !=="") alku = <div tabIndex="0" onClick={()=>vaihda_aika()}>
    <Kalenteri pv={startDate.getDate()} kk = {startDate.getMonth()+1} alku={false}/>
       {/* <div className="paivaysspicker">
       <DatePicker
            
                            locale="fi"
                            dateFormat="dd/MM/yyyy"
                            className="form-control"
                            selected={startDate}
                            onChange={date => setStartDate(date)}
                            selectsStart/></div> */}
    </div>

  let nappeja = [ "",
                  <FaComment onMouseEnter={()=>thisinfo(1)}  onClick={()=>thisvaihda_tyyppi(1)} className ={(type==1)?"kohta_valittu p_k":"p_k"}/>,
                  <FaComments onMouseEnter={()=>thisinfo(2)}  onClick={()=>thisvaihda_tyyppi(2)} className ={(type==2)?"kohta_valittu p_k":"p_k"}/>,
                  <FaHandshake  onMouseEnter={()=>thisinfo(3)}    onClick={()=>thisvaihda_tyyppi(3)} className ={(type==3)?"kohta_valittu p_k":"p_k"}/>, 
                  <svg onMouseEnter={()=>thisinfo(4)} className={(type==4)?"kohta_valittu p_k":"p_k"} onClick={()=>thisvaihda_tyyppi(4)} xmlns="http://www.w3.org/2000/svg" viewBox="-100 -100 700 700">
                   <path d="M26.42,180.11v350h350v-350Zm130.83,290.6L73.7,363.27l18.6-13.76,66.42,83.93L306.18,258.7l18.05,16Z" transform="translate(-21.42 -25.11)"/><path  d="M101.42,105.11v0h350v350h0v-350Z" transform="translate(-21.42 -25.11)"/><path  d="M176.42,30.11v0h350v350h0v-350Z" transform="translate(-21.42 -25.11)"/></svg>,
                  <FaUserCheck onMouseEnter={()=>thisinfo(5)} onClick={()=>thisvaihda_tyyppi(5)} className ={(type==5)?"kohta_valittu p_k":"p_k"}/>,
                  <FaGavel onMouseEnter={()=>thisinfo(6)} className ="kohta_valittu p_k"/>]
  
  let nappit = (type==0 && /* && tila != 3 && */parseInt(oikeudet)===0)?
  <div className="valinta_iconit">{nappeja[1]}{nappeja[2]}{nappeja[3]}{nappeja[4]}{nappeja[5]}<div className="kohta_info" id={"info"+id}>{thisinfo(type,1)}</div></div>:
  <div className="valinta_iconit2">{nappeja[type]}<div className="kohta_info" id={"info"+id}>{thisinfo(type,1)}</div></div>;
  sisalto = (auki)?<Sisalto flags={flags} key={id} pj={pj} oikeudet={oikeudet} oikeudet={oikeudet} kokous_id={kokous_id} id={id} type={type} save={this_save} tila={tila}/>:""; 

  return (
    <div className="esitys_item" >
      {loppu}
      
      <div onClick= {this_avaa} className="otsake">{alku}<ResizeTextArea placeholder={"Uusi kohta"} edit={(parseInt(tila) ===0 && parseInt(oikeudet)===0) || pj} id={id} sisus={title} save={this_save}/></div>
      <div>
        {nappit}
        
        {(parseInt(tila)==3 || (pj && parseInt(tila)!==0))?
          <Paatos pj={pj} tila={tila} kokous_id={kokous_id} kohta_id={id} paatos={paatos} save={paatos_save}/>:""}      
        
        <div className={"nro"}/>
        {(parseInt(tila)==3)?<div className="nro_3"></div>:""}
        {sisalto}
        
      </div>
      {(parseInt(tila)!=3 && pj )?<div  onClick= {this_avaa} className="raahaa" id={"r"+id}></div>:""}
      {((parseInt(tila) ===0 && parseInt(oikeudet)===0) || (pj && parseInt(tila)!=3) )?<div className="esityskohta_roskis" onClick={()=>poista_kohta()}><FaTrashAlt/></div> :""}
    </div>
  )
}



export default EsitysKohta