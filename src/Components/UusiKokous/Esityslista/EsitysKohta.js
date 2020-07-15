import React, { useState  } from 'react'
import Kalenteri from './Kalenteri'
import Sisalto from './Sisalto'
import ResizeTextArea from './ResizeTextArea'


const EsitysKohta = ({type,title,id,alkaa,loppuu,auki=false,avaa,save}) => {
  
  const [startDate, setStartDate] = useState((alkaa!=="0000-00-00")?new Date(alkaa):"")
  const [endDate, setEndDate] = useState((loppuu!=="0000-00-00")?new Date(alkaa):"")
  
  const this_avaa = (event) => {
    if(event.target.className==="raahaa" || event.target.className==="areaText")avaa(id)}

  const this_save = (_id,data,delay,type) => {
    save(_id,data,delay,type,id)
  }

  let alku =""
  let loppu =""
  if(startDate!=null && startDate !=="") alku = <Kalenteri pv={startDate.getDate()} kk = {startDate.getMonth()+1} alku={false}/>
  if(endDate!=null && endDate !=="") loppu = <Kalenteri pv={endDate.getDate()} kk = {endDate.getMonth()+1} alku={false}/>    
  var sisalto = (auki)?<Sisalto id={id} type={type} save={this_save}/>:"";
  
  

  return (
    <div className="esitys_item"  onClick= {this_avaa}>
      <div className="otsake"><ResizeTextArea edit={auki} id={id} sisus={title} save={this_save}/></div>
      <div>
        
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