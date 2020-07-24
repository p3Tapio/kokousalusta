import React, { useState } from 'react'
import Kalenteri from './Kalenteri'

import Sisalto from './Sisalto'
import ResizeTextArea from './ResizeTextArea'
import { FaHands, FaHandsHelping,FaHandshake,FaPenSquare,FaRegCheckSquare,FaUserCheck } from 'react-icons/fa';
const url = process.env.REACT_APP_HOST_URL
const EsitysKohta = ({vaihda_tyyppi,kokous_id,type,title,id,alkaa,loppuu,auki=false,avaa,save}) => {
  
  const [startDate, setStartDate] = useState((alkaa!=="0000-00-00")?new Date(alkaa):"")
  const [endDate, setEndDate] = useState((loppuu!=="0000-00-00")?new Date(alkaa):"")
  var sisalto;

  const this_save = (_id,data,delay,type) => {
    
    save(_id,data,delay,type,id)
  }
  
  
  const this_avaa = (event) => {
    if(event.target.className==="raahaa" || event.target.className==="areaText")avaa(id)}


 // var sisalto = (auki)?<Sisalto kokous_id={kokous_id} id={id} type={type} save={this_save}/>:"";

  const thisvaihda_tyyppi = (param) => {
    
    if (type==param) param=0;
      vaihda_tyyppi(id,param)
      
     
  }
    

  const thisinfo = (param,palaa=0) => {
    let teksti;
    let elem = document.getElementById("info"+id);
    switch(param){
      case 1: teksti = "Hyväksy asiakohta";break;
      case 2: teksti = "Äänestys</b>";break;
      case 3: teksti = "Mielipiteitä asiasta";break;
      case 4: teksti = "Nimitys";break;
      default: 
        teksti = "Hyväksy asiakohta";break;
        
    }
    if(palaa==1)return teksti;
    
    elem.innerHTML=teksti;
    
  }

  let alku =""
  let loppu =""
  /*if(startDate!=null && startDate !=="") alku = <Kalenteri pv={startDate.getDate()} kk = {startDate.getMonth()+1} alku={false}/>
  if(endDate!=null && endDate !=="") loppu = <Kalenteri pv={endDate.getDate()} kk = {endDate.getMonth()+1} alku={false}/>    */
  let nappeja = [ "",
                  <FaHandshake  onMouseEnter={()=>thisinfo(1)}    onClick={()=>thisvaihda_tyyppi(1)} className ={(type==1)?"kohta_valittu p_k":"p_k"}/>,
               
                  /*<FaPenSquare      onClick={()=>thisvaihda_tyyppi(3)} className ={(type==3)?"kohta_valittu":"valinnat_iconi"}/>,*/
                  
                  <svg onMouseEnter={()=>thisinfo(2)} className={(type==2)?"kohta_valittu p_k":"p_k"} onClick={()=>thisvaihda_tyyppi(2)} xmlns="http://www.w3.org/2000/svg" viewBox="-100 -100 700 700">
                   <path d="M26.42,180.11v350h350v-350Zm130.83,290.6L73.7,363.27l18.6-13.76,66.42,83.93L306.18,258.7l18.05,16Z" transform="translate(-21.42 -25.11)"/><path  d="M101.42,105.11v0h350v350h0v-350Z" transform="translate(-21.42 -25.11)"/><path  d="M176.42,30.11v0h350v350h0v-350Z" transform="translate(-21.42 -25.11)"/></svg>

                  ,
                  <FaHandsHelping onMouseEnter={()=>thisinfo(3)}  onClick={()=>thisvaihda_tyyppi(3)} className ={(type==3)?"kohta_valittu p_k":"p_k"}/>,
                  <FaUserCheck onMouseEnter={()=>thisinfo(4)} onClick={()=>thisvaihda_tyyppi(4)} className ={(type==4)?"kohta_valittu p_k":"p_k"}/>]
  
  let nappit = (type==0)?
  <div className="valinta_iconit">{nappeja[1]}{nappeja[2]}{nappeja[3]}{nappeja[4]}<div className="kohta_info" id={"info"+id}>{thisinfo(type,1)}</div></div>:
  <div className="valinta_iconit">{nappeja[type]}<div className="kohta_info" id={"info"+id}>{thisinfo(type,1)}</div></div>;
  
  sisalto = (auki)?<Sisalto key={id} kokous_id={kokous_id} id={id} type={type} save={this_save}/>:""; 

    

  return (
    <div className="esitys_item"  onClick= {this_avaa}>
      <div className="otsake"><ResizeTextArea edit={true} id={id} sisus={title} save={this_save}/></div>
      <div>
      {nappit}
      {loppu}
      {alku} 
      
      {sisalto}
      <div className="nro"/>
      </div>
      <div className="raahaa" id={"r"+id}></div>
    </div>
  )
}



export default EsitysKohta