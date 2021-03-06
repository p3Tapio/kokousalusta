import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CheckboxArea from './CheckboxArea'
import ResizeTextArea from './ResizeTextArea'
import Mielipide from './Mielipide'
import Hyvaksy from './Hyvaksy'
import Henkilovalinta from './Henkilovalinta'
import '../../../Style/Sisalto.css'
import DatePicker, { registerLocale } from "react-datepicker";

const url = process.env.REACT_APP_HOST_URL

const Sisalto = ({flags,pj=false,oikeudet="2",id,save,type,kokous_id,edit=false,tila}) => {
  
  const [pickerDate, setPickerDate] = useState()
  

  
  const [valinnat,setValinnat] =useState([])
  const [valintaArvot,setValintaArvot] = useState([])
  const [kuvaus,setKuvaus] = useState([])
  const [k_alku,set_k_Alku] = useState([])
  const [k_valittu,set_k_Valittu] = useState([])
  const [k_loppu,set_k_Loppu] = useState([])
  const [mielipiteet,setMielipiteet] = useState([]);
  const [tyyppi,setTyyppi] = useState((type==2 && edit==false)?1:0);
  const [perustelut,setPerustelut] = useState ([])
  const kuvaus_save = (id,data) => {
    save(id,data,500,"kuvaus")
    setKuvaus(data)

  }
 

  
  const check = (vid) => {
      var params = new URLSearchParams()
      params.append ("check_valitse", vid)
      params.append ("kokous_id", kokous_id)   
      params.append ("kohta", id)
      params.append ("multi",(flags&1))
      axios.post(url+'data.php', params, {withCredentials: true}).then((response) => reload())    
  }
  const check_uusi = (data) => {
    var params = new URLSearchParams()
    params.append ("check_uusi", data)       
    params.append ("kohta", id)
    params.append ("kokous_id", kokous_id)
    axios.post(url+'data.php', params, {withCredentials: true}).then((response) => reload())
  }
  const check_remove = (vid) => {
    var params = new URLSearchParams();      
    params.append ("check_remove", vid)
    params.append ("kohta", id);
    params.append ("kokous_id", kokous_id)
    axios.post(url+'data.php', params, {withCredentials: true}).then((response) => {
      reload();
    })    
  }
  const check_save = (id,nnimi, delay) => {
     
      save(id,nnimi,500,"check");
      
      setValinnat(valinnat.map(arvot => (arvot.id === id)?{ ...arvot, nimi:nnimi}:arvot))
     
    
  }
  const check_toggle = (id,flag) => {
    
    save(id,flag,0,"flags");
    
  }

  const mielipide_save = (_id,data) => {
    if(data[3]==0)
      save(_id,data,500,"mielipide")
    else {
      
      var params = new URLSearchParams()
      params.append("param", data[0])
      params.append("save", "mielipide")
      params.append("alku", data[1])
      params.append("loppu", data[2])
      params.append("draft", 1) 
      params.append("thread", _id);
      params.append("kohta", id);
      params.append("kokous_id", kokous_id)
      axios.post(url+'data.php', params, {withCredentials: true}).then((response) =>reload());    
    }
  }
    const teksti_save = (_id,data,type) => {
      
      
      
      if(data[1]==0)
        save(_id,data,500,type)
      else {
          var params = new URLSearchParams()
          params.append("param", data[0])
          params.append("save", "perustelu")
          params.append("draft", 1) 
          params.append("thread", _id);
          params.append("kohta", id);
          params.append("kokous_id", kokous_id)
          axios.post(url+'data.php', params, {withCredentials: true}).then((response) =>reload());    
    }
       
        
    }



  

  const reload = () => {
    var params = new URLSearchParams()
    params.append ("avaakohta", id)
    params.append ("kokous_id", kokous_id)
    axios.post(url+'data.php', params, {withCredentials: true}).then((response) => {
      
      if(response.data[4]!=-1)setPerustelut(JSON.parse(response.data[4]))
        else setPerustelut([])
      if(response.data[2]!=-1)setValintaArvot(JSON.parse(response.data[2]))
        else setValintaArvot([])
      if(response.data[1]!=-1){
        setValinnat(JSON.parse(response.data[1]))   
      }
        else setValinnat([])
      if(response.data[0]!=-1){
        setKuvaus(JSON.parse(response.data[0]))
      }
        else {
          setKuvaus("");
        }
      set_k_Loppu("");
      set_k_Valittu("");
      if(response.data[3]!=-1){setMielipiteet(JSON.parse(response.data[3]))
        setTyyppi(1);
      }
        else setMielipiteet([]);
     
       
    })}
  
  const osa = (s,e) => {
     return kuvaus.toString().substring(s,e);
   }

  const setPositio = (a,l) => {
    set_k_Alku(osa(0,a));set_k_Valittu(osa(a,l));set_k_Loppu(osa(l,parseInt(kuvaus.toString().length)));setTyyppi(2);
  }  

  useEffect(() => {
      reload()
      const element = document.getElementById("s"+id).parentNode.querySelector(".nro");
        if(true || element.getBoundingClientRect().top<0){
            const y = element.getBoundingClientRect().top + window.pageYOffset;
            window.scrollTo({top: y, behavior: 'smooth'})}
      window.setTimeout(function(){
        const yOffset = -40; 
        const element = document.getElementById("s"+id).parentNode.parentNode.querySelector(".nro");
        if(true || element.getBoundingClientRect().top<0){
            const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
            window.scrollTo({top: y, behavior: 'smooth'})}
        },100)
        
  }, [])  


  
  let setti = ["",
              "", /*tiedoksi*/
              <div><Mielipide tila={tila} edit={edit} kohta_id={id} kokous_id={kokous_id} arvot={mielipiteet} save={mielipide_save} positio={setPositio} kuvaus={kuvaus}/></div>,
              <div><Hyvaksy save={teksti_save} kokous_id={kokous_id} kohta_id={id} tila={tila} arvot={perustelut}/></div>,
              <div><CheckboxArea options={(parseInt(tila)===0 && parseInt(oikeudet)===0) || (pj && tila!=3)} toggle={check_toggle} flags={flags} kokous_id={kokous_id} kohta_id={id} tila={tila} edit={true} arvot={valinnat} check={check} checkValue={valintaArvot} remove={check_remove} save={check_save} uusi={check_uusi}/></div>,
              <div><Henkilovalinta tila={tila} kohta_id={id} kokous_id={kokous_id}  arvot={valinnat} check={check} checkValue={valintaArvot} save={check_save} uusi={check_uusi}/></div>,
              <div><Henkilovalinta toggle={check_toggle} tila={tila} type={6} kohta_id={id} kokous_id={kokous_id}  arvot={valinnat} check={check} checkValue={valintaArvot} save={check_save} uusi={check_uusi}/></div>]
              [type]

    return (
      <div id={"s"+id}>
      <div id="sisalto">  
    
         {
            [<div className="kuvaus"><ResizeTextArea edit={(parseInt(tila)===0 && parseInt(oikeudet)===0) ||( pj && type!=2)} id={"id"} sisus={kuvaus} save={kuvaus_save} placeholder="kuvaus"/></div>,
              <div className="kuvaus"><div  id={"kuvaus"+id} className="areaText">{kuvaus}</div></div>,
              <div className="kuvaus"><div  id={"kuvaus"+id} onMouseDown={()=>setTyyppi(1)}className="areaText">
                {k_alku}<span className='korostus'>{k_valittu}</span>{k_loppu}</div></div>]
              [tyyppi]

         }

        {setti}


           
         
      </div>
      
      </div>
    )
  
  }



  export default Sisalto