import React, { useState  } from 'react'
import Kalenteri from './Kalenteri'

import Sisalto from './Sisalto'
import ResizeTextArea from './ResizeTextArea'
import { FaHands, FaHandsHelping,FaHandshake,FaPenSquare,FaRegCheckSquare } from 'react-icons/fa';
const url = process.env.REACT_APP_HOST_URL
const EsitysKohta = ({vaihda_tyyppi,kokous_id,type,title,id,alkaa,loppuu,auki=false,avaa,save}) => {
  
  const [startDate, setStartDate] = useState((alkaa!=="0000-00-00")?new Date(alkaa):"")
  const [endDate, setEndDate] = useState((loppuu!=="0000-00-00")?new Date(alkaa):"")
  
  const this_avaa = (event) => {
    if(event.target.className==="raahaa" || event.target.className==="areaText")avaa(id)}

  const this_save = (_id,data,delay,type) => {
    save(_id,data,delay,type,id)
  }

  var sisalto = (auki)?<Sisalto kokous_id={kokous_id} id={id} type={type} save={this_save}/>:"";

  const thisvaihda_tyyppi = (param) => {
    if (type==param) param=0;
      vaihda_tyyppi(id,param)
      
  }
    


  let alku =""
  let loppu =""
  /*if(startDate!=null && startDate !=="") alku = <Kalenteri pv={startDate.getDate()} kk = {startDate.getMonth()+1} alku={false}/>
  if(endDate!=null && endDate !=="") loppu = <Kalenteri pv={endDate.getDate()} kk = {endDate.getMonth()+1} alku={false}/>    */
  let nappeja = [ "",
                  <FaHandshake      onClick={()=>thisvaihda_tyyppi(1)} className ={(type==1)?"kohta_valittu":""}/>,
                  <FaHandsHelping   onClick={()=>thisvaihda_tyyppi(2)} className ={(type==2)?"kohta_valittu":""}/>,
                  <FaPenSquare      onClick={()=>thisvaihda_tyyppi(3)} className ={(type==3)?"kohta_valittu":""}/>,
                  <FaRegCheckSquare onClick={()=>thisvaihda_tyyppi(4)} className ={(type==4)?"kohta_valittu":""}/>]
  
  let nappit = (type==0)?
  <div className="valinta_iconit">{nappeja[1]}{nappeja[2]}{nappeja[3]}{nappeja[4]}</div>
    :
    <div className="valinta_iconit">{nappeja[type]}</div>;

  return (
    <div className="esitys_item"  onClick= {this_avaa}>
      <div className="otsake"><ResizeTextArea edit={auki} id={id} sisus={title} save={this_save}/></div>
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