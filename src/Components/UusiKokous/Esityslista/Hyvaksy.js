import React, { useState, useEffect } from 'react';
import ResizeTextArea from './ResizeTextArea';
import '../../../Style/Hyvaksy.css';
import axios from 'axios';
import Kommentit from './Kommentit';
import Kannata from './Kannata';
import { Outline } from 'react-pdf';
const url = process.env.REACT_APP_HOST_URL
var thisdata="";
const Hyvaksy = ({arvot=[],tila,kohta_id,kokous_id,save}) => {
    
    const [perustelu,setPerustelu] = useState("")
    const this_save = (_id,data) => {
        setPerustelu(data);
        thisdata = data;
        save(_id,[data,0],"perustelu")
        
        let sendi = document.getElementById("send_perustelu"+kohta_id);
        if(sendi !=null){
            if (data.length > 0)
                sendi.classList.add("sendilite")
            else
                sendi.classList.remove("sendilite")
        }
    }
    const reload = () => {
        var params = new URLSearchParams()
        params.append ("hae_perustelut", kohta_id)
        params.append ("kokous_id", kokous_id)
        axios.post(url+'data.php', params, {withCredentials: true}).then((response) => {
        })}
    const julkaise = () => {
        if(thisdata.length==0)return;
        save(kohta_id,[thisdata,1],"perustelu")
        
        
        let sendi = document.getElementById("send_perustelu"+kohta_id);
        if(sendi !=null){
            sendi.classList.remove("sendilite")
        }
        setPerustelu("");
        thisdata="";
        
        
    
    }
    return (
        <div >
            
            {tila!=3?
                <div><ResizeTextArea edit={true} placeholder="Ehdota muutosta" sisus={perustelu} save={this_save}/>
                <div className="sendibutton" id={"send_perustelu"+kohta_id} onClick={()=>julkaise()}>send</div>
                </div>:""}
                {(arvot.length > 0)?<div style={{paddingLeft:"40px"}} className="disable-select"><b>Muutos ehdotukset({arvot.length})</b></div>:""}  
        <div >
        
        {arvot.map(arvot =>
        <div>
            <div key={arvot.id} style={{border:"1px solid #eee",borderBottom:"1px solid #f0f0f0",backgroundColor:"#f9f9f9"}}  className="asiakohta_hyvaksy">
                
                
                
                
                <div >{arvot.perustelu}
             </div>   
                
               <div className="mielipide_like"><Kannata teksti={"kannatan"} tyyppi="perustelu" kokous_id={kokous_id} id={arvot.id} kohta_id={kohta_id}/></div>
                <Kommentit 
                    tyyppi={"perustelu"}
                    thread_id={arvot.id}
                    kohta_id={kohta_id}
                    kokous_id={kokous_id}
                    maara={arvot.kommentit}/>
                </div></div>
             
                                ) } 
                                </div>
          

                 

        
        </div>
    )
}

export default Hyvaksy
