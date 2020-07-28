import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CheckboxArea from './CheckboxArea'
import ResizeTextArea from './ResizeTextArea'
import Mielipide from './Mielipide'
import Hyvaksy from './Hyvaksy'
import Henkilovalinta from './Henkilovalinta'
import '../../../Style/Sisalto.css'
import Paatos from './Paatos'

const url = process.env.REACT_APP_HOST_URL

const Sisalto = ({id,save,type,kokous_id,edit=false,tila}) => {
  
  const [valinnat,setValinnat] =useState([])
  const [valintaArvot,setValintaArvot] = useState([])
  const [kuvaus,setKuvaus] = useState([])
  const [k_alku,set_k_Alku] = useState([])
  const [k_valittu,set_k_Valittu] = useState([])
  const [k_loppu,set_k_Loppu] = useState([])
  const [mielipiteet,setMielipiteet] = useState([]);
  const [tyyppi,setTyyppi] = useState((type==2 && edit==false)?1:0);
  const [perustelu,setPerustelu] = useState ("")
  const kuvaus_save = (id,data) => {
    save(id,data,500,"kuvaus")
    setKuvaus(data)

  }
 

  const perustelu_save = (id,data) => {/*save(id,data,500,"perustelu")*/setPerustelu(data);}

  const check = (vid,multi=1) => {
      var params = new URLSearchParams()
      params.append ("check_valitse", vid)
      params.append ("kokous_id", kokous_id)   
      params.append ("kohta", id)
      params.append ("multi",multi)
      axios.post(url+'data.php', params, {withCredentials: true}).then((response) => reload())    
  }
  const check_uusi = (data="") => {
    var params = new URLSearchParams()
    params.append ("check_uusi", data)       
    params.append ("kohta", id)
    params.append ("kokous_id", kokous_id)
    axios.post(url+'data.php', params, {withCredentials: true}).then((response) => {
      
      reload(1)
      
    })    
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
  const mielipide_save = (id,data) => {
    save(id,data,500,"mielipide")
  }

  const reload = (param=0) => {
    var params = new URLSearchParams()
    params.append ("avaakohta", id)
    params.append ("kokous_id", kokous_id)
    axios.post(url+'data.php', params, {withCredentials: true}).then((response) => {
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
      if(response.data[3]!=-1)setMielipiteet(JSON.parse(response.data[3]))
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
              <div>mielipide<Mielipide tila={tila} edit={edit} id={id} arvot={mielipiteet} save={mielipide_save} positio={setPositio} kuvaus={kuvaus}/></div>,
              <div>hyvaksy<Hyvaksy tila={tila} id={id} save={perustelu_save} sisus={perustelu}/></div>,
              <div><CheckboxArea tila={tila} edit={true} arvot={valinnat} check={check} checkValue={valintaArvot} remove={check_remove} save={check_save} uusi={check_uusi}/></div>,
              <div><Henkilovalinta tila={tila} kohtaid={id} kokous_id={kokous_id}  arvot={valinnat} check={check} checkValue={valintaArvot} save={check_save} uusi={check_uusi}/></div>,
              <div><Henkilovalinta tila={tila} type={6} kohtaid={id} kokous_id={kokous_id}  arvot={valinnat} check={check} checkValue={valintaArvot} save={check_save} uusi={check_uusi}/></div>]

              
              
              [type]

    return (
      <div id={"s"+id}>
      <div id="sisalto">  
    
         {
            [<div className="kuvaus"><ResizeTextArea edit={true} id={"id"} sisus={kuvaus} save={kuvaus_save} placeholder="kuvaus"/></div>,
              <div className="kuvaus"><div  id={"kuvaus"+id} className="areaText">{kuvaus}</div></div>,
              <div className="kuvaus"><div  id={"kuvaus"+id} onMouseDown={()=>setTyyppi(1)}className="areaText">
                {k_alku}<span className='korostus'>{k_valittu}</span>{k_loppu}</div></div>]
              [tyyppi]

         }

        {setti}

        


           
         
      </div>
      {
      
      
      /*}
      <div className="sisalto"><div className="add uusi">Deadline</div></div>  
      <div className="sisalto"><div className="add uusi">Lisää liite</div></div>
      <div className="sisalto" ><div className="add uusi">Päätös</div></div>
      
      <div className="sisalto" style={{marginBottom:"10px"}}>
         <Checkbox nimi='Vaadi perustelu' check={vaadiperustelu}></Checkbox>
         <Checkbox nimi='Salli käyttäjien lisätä ehdotuksia (datepicker deadline)' check={vaadiperustelu}></Checkbox>
         <Checkbox nimi='Saa valita monta' check={vaadiperustelu}></Checkbox>
         <Checkbox nimi='Kakkosvalinta' check={vaadiperustelu}></Checkbox>datestamp on aina viimeisin eka
         <Checkbox nimi='Vastaukset anonyymeinä' check={vaadiperustelu}></Checkbox>
         <div style={{clear:"both"}}/>
         
    </div> */}
      
      </div>
    )
  
  }



  export default Sisalto