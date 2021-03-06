import React, { useState} from 'react';
import ResizeTextArea from './ResizeTextArea'
import axios from 'axios';
import Kannata from './Kannata';

const url = process.env.REACT_APP_HOST_URL
const Kommentit = ({tila,thread_id,kohta_id,maara,kokous_id,tyyppi="mielipide"}) => {
    const [kommenttiBool,setKommenttiBool] = useState(false);
    const [kommentti,setKommentti] = useState("")
    const [kommentit,setKommentit] = useState([]);
    const [kommenttimaara,setMaara] = useState(maara);
    const this_save = (_id,data) => {
        
        setKommentti(data);
        let sendi = document.getElementById("send_kommentti"+thread_id);
        if(sendi !=null){
            
            if (data.length > 0)
                sendi.classList.add("sendilite")
            else
                sendi.classList.remove("sendilite")
        }
        
        
    }
    const reload = () => {
        var params = new URLSearchParams()
        params.append ("hae_kommentit", tyyppi)
        params.append ("kokous_id", kokous_id)
        params.append ("kohta", kohta_id)
        params.append ("thread", thread_id)
        axios.post(url+'data.php', params, {withCredentials: true}).then((response) => {
        
           setKommentit(response.data[0]);
           setMaara(response.data[0].length)
        })}
    const julkaise = () => {
        
        if(kommentti.length==0)return;
        var params = new URLSearchParams()
        params.append ("save", "kommentti_"+tyyppi)  
        params.append("param", kommentti)
        params.append ("kohta", kohta_id)
        params.append("kokous_id", kokous_id)
        params.append ("thread",thread_id)
        this_save(0,"");
        axios.post(url+'data.php', params, {withCredentials: true}).then((response) => {
        console.log("julkaisu",tyyppi,response.data)
        reload()}
        )  
    
    }

    const vari = (txt) => {
        
        return "#dddddd77";
        
    }

    return (
        
        <div className="kommentti" >
            
            <div className="kommenttimaara" onClick={() => {reload();setKommenttiBool(!kommenttiBool)}}>
            {kommenttimaara} &nbsp;
            <svg style={{height:"15px",width:"15px"}} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none" stroke-width="4" stroke="#000"><path  d="M66.72,12.5H33.28C17.66,12.5,5,24.91,5,40.22H5A27.93,27.93,0,0,0,30.25,67.77l-7,19.73,24-19.57H66.72C82.34,67.93,95,55.52,95,40.22h0C95,24.91,82.34,12.5,66.72,12.5Z" /></svg> 
            
            </div>
        {kommenttiBool?
        <div>
        {kommentit.map(x => <div key={x.kommentti_id} className="kommentti_container"><div>
            
         <div className="kommentoija" style={{background: vari(x.firstname+x.lastname),color:"black" }} >{x.firstname[0]}{x.lastname[0]}</div>
         <div className="KommentoijaFullname"><b>{x.firstname} {x.lastname}</b></div>
         <div className="kommenttiaika">{x.aika} </div>
         <div className="kommenttikommentti">{x.kommentti}</div></div>
         <div className="kommenttipeukut"><Kannata kokous_id={kokous_id} id={x.kommentti_id} tyyppi={"kommentti_"+tyyppi} kohta_id={kohta_id} /></div>
         </div>)}
        {(tila!=23)?<div>
        <ResizeTextArea edit={true} placeholder="kirjoita kommentti" sisus={kommentti} save={this_save}/>
        
        <div className="sendibutton" id={"send_kommentti"+thread_id} onClick={()=>julkaise()}>send</div></div>:""}
        </div>:""}
        </div>
    )
}

export default Kommentit
