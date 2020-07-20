import React, { useState  } from 'react'
import Kalenteri from './Kalenteri'
import axios from 'axios';
import Sisalto from './Sisalto'
import ResizeTextArea from './ResizeTextArea'
import { FaHands, FaHandsHelping,FaHandshake,FaPenSquare,FaRegCheckSquare } from 'react-icons/fa';
const url = process.env.REACT_APP_HOST_URL
const EsitysKohta = ({kokous_id,type,title,id,alkaa,loppuu,auki=false,avaa,save}) => {
  
  const [startDate, setStartDate] = useState((alkaa!=="0000-00-00")?new Date(alkaa):"")
  const [endDate, setEndDate] = useState((loppuu!=="0000-00-00")?new Date(alkaa):"")
  
  const this_avaa = (event) => {
    if(event.target.className==="raahaa" || event.target.className==="areaText")avaa(id)}

  const this_save = (_id,data,delay,type) => {
    save(_id,data,delay,type,id)
  }

  const vaihda_tyyppi = (param) => {
    if (type==param) param=0;
    var params = new URLSearchParams()  
    params.append ("paatos_valitse", param)
    params.append ("kohta", id)
    params.append ("kokous_id", kokous_id)
    axios.post(url+'data.php', params, {withCredentials: true}).then((response) => {
      
      

    })    
    
  
}


  let alku =""
  let loppu =""
  /*if(startDate!=null && startDate !=="") alku = <Kalenteri pv={startDate.getDate()} kk = {startDate.getMonth()+1} alku={false}/>
  if(endDate!=null && endDate !=="") loppu = <Kalenteri pv={endDate.getDate()} kk = {endDate.getMonth()+1} alku={false}/>    */
  var sisalto = (auki)?<Sisalto kokous_id={kokous_id} id={id} type={type} save={this_save}/>:"";
  
  let nappit=  <div className ="valinta_iconit">
    <FaHandshake onClick={()=>vaihda_tyyppi(1)} className ={(type==1)?"kohta_valittu":""}/>
    <FaHandsHelping onClick={()=>vaihda_tyyppi(2)} className ={(type==2)?"kohta_valittu":""}/>
    <FaPenSquare onClick={()=>vaihda_tyyppi(3)} className ={(type==3)?"kohta_valittu":""}/>
    <FaRegCheckSquare onClick={()=>vaihda_tyyppi(4)} className ={(type==4)?"kohta_valittu":""}/>
  </div>

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