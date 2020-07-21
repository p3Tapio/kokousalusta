import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CheckboxArea from './CheckboxArea'
import ResizeTextArea from './ResizeTextArea'
import Mielipide from './Mielipide'
import '../../../Style/Sisalto.css'

const url = process.env.REACT_APP_HOST_URL

const Sisalto = ({id,save,type,kokous_id,edit=false}) => {
  
  const [valinnat,setValinnat] =useState([])
  const [valintaArvot,setValintaArvot] = useState([])
  const [kuvaus,setKuvaus] = useState("")
  const [descBool,setDescBool] = useState(false)
  
  
  
  const kuvaus_save = (id,data) => {
    save(id,data,500,"kuvaus")
    setKuvaus(data)
  }



  const check = (vid) => {
      var params = new URLSearchParams()
      params.append ("check_valitse", vid)
      params.append ("kokous_id", kokous_id)   
      params.append ("kohta", id)
      axios.post(url+'data.php', params, {withCredentials: true}).then((response) => {
        reload()
      })    
  }

  const check_uusi = (vid) => {
    var params = new URLSearchParams()
    params.append ("check_uusi", vid)       
    params.append ("kohta", id)
    params.append ("kokous_id", kokous_id)
    axios.post(url+'data.php', params, {withCredentials: true}).then((response) => {
      reload()
      
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
  const mielipide_save = (data) => {
    save(id,data,500,"mielipide")
  }
  
  const reload = () => {
    var params = new URLSearchParams()
    params.append ("avaakohta", id)
    params.append ("kokous_id", kokous_id)
    axios.post(url+'data.php', params, {withCredentials: true}).then((response) => {
      if(response.data[2]!=-1)setValintaArvot(JSON.parse(response.data[2]))
        else setValintaArvot([])
      if(response.data[1]!=-1)setValinnat(JSON.parse(response.data[1]))   
        else setValinnat([])
      if(response.data[0]!=-1)setKuvaus(JSON.parse(response.data[0]))
        else setKuvaus("");
      setDescBool(true)
      
    })}
    
  let desc;
  
  
  if (descBool)
    desc = <div className="mielipide" id={"mielipide"+id}><ResizeTextArea edit={true} id={id} sisus={kuvaus} save={kuvaus_save} placeholder="kuvaus"/></div>

  let valinta
  
  useEffect(() => {
      reload()
      window.setTimeout(function(){
        const yOffset = 0; 
        const element = document.getElementById("s").parentNode.parentNode.querySelector(".raahaa");
        if(element.getBoundingClientRect().top<0){
            const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
            window.scrollTo({top: y, behavior: 'smooth'})}
        },100)
        
  }, [])  


  


    return (
      <div id="s">
      <div id="sisalto">  
        
         {desc}
        {

          ["",
          <Mielipide edit={true} id={id} save={mielipide_save}/>,
          <CheckboxArea edit={true} arvot={valinnat} check={check} checkValue={valintaArvot} remove={check_remove} save={check_save} uusi={check_uusi}/>,
          "ei koodattu viela(1)",
          "ei koodattu viela(2)"]
          [type]
        }

        


           
         
      </div>
      {/*}
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


  const Checkbox = ({id,nimi,arvo,check}) => {
    const thischeck = (event) => {check(id)}
    
    
    

   let ruutu;
   ruutu = <div  className={(arvo)?"green ruutu":"ruutu"} onClick={thischeck}></div>

    return (
        <div className="valinta" >
            {ruutu}
            <div spellCheck="false" className="ruutuvalinta" type="text">{nimi}</div>
            
            </div>
      )
}
  export default Sisalto