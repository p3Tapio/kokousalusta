import React, { useState} from 'react';
import ResizeTextArea from './ResizeTextArea'
import axios from 'axios';

const url = process.env.REACT_APP_HOST_URL
const Kommentit = ({thread_id,kohta_id,maara,kokous_id,tyyppi="mielipide"}) => {
    
    const [kommentti,setKommentti] = useState("")
    const [kommentit,setKommentit] = useState([]);
    const this_save = (_id,data) => {
        
        setKommentti(data);
        
        
        
    }
    const reload = () => {
        var params = new URLSearchParams()
        params.append ("hae_kommentit", tyyppi)
        params.append ("kokous_id", kokous_id)
        params.append ("kohta", kohta_id)
        params.append ("thread", thread_id)
        axios.post(url+'data.php', params, {withCredentials: true}).then((response) => {
            setKommentit(response.data[0]);
           
        })}
    const julkaise = () => {
        var params = new URLSearchParams()
        params.append ("save", "kommentti_"+tyyppi)  
        params.append("param", kommentti)
        params.append ("kohta", kohta_id)
        params.append("kokous_id", kokous_id)
        params.append ("thread",thread_id)
        axios.post(url+'data.php', params, {withCredentials: true}).then((response) => {
        console.log("sdfdsf",response.data)
        reload()}
        )  
    
    }

    const vari = (txt) => {
        let nro = 0
        for(let i=0;i<txt.length;i++){
            nro += parseInt(txt.charCodeAt(i))
        }
        console.log("Numba",txt,nro);
        
        return "rgba("+(144+nro)%255+","+(nro*2)%255+","+(120+nro)%255+","+100+(nro%155)+")"
    }

    return (
        <div className="kommentti">
            {maara}
            <svg style={{height:"15px",width:"15px"}} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none" stroke-width="4" stroke="#000"><path  d="M66.72,12.5H33.28C17.66,12.5,5,24.91,5,40.22H5A27.93,27.93,0,0,0,30.25,67.77l-7,19.73,24-19.57H66.72C82.34,67.93,95,55.52,95,40.22h0C95,24.91,82.34,12.5,66.72,12.5Z" /></svg> 
        
        {kommentit.map(x => <div key={x.mid} className="kommentti_container"><div className="kommenttiaika">{x.aika} </div> <div className="kommentoija" style={{background: vari(x.firstname+x.lastname),color:"black" }} >{x.firstname[0]}{x.lastname[0]}</div> <div className="kommenttikommentti">{x.kommentti}</div></div>)}

        <ResizeTextArea edit={true} sisus={kommentti} save={this_save}/>
        <div onClick={()=>julkaise()}>send</div>
        </div>
    )
}

export default Kommentit