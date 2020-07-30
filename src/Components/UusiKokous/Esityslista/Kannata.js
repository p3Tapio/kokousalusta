import React, { useState, useEffect } from 'react';
import {  FaThumbsUp } from 'react-icons/fa';
import axios from 'axios';
const url = process.env.REACT_APP_HOST_URL
const Kannata = ({kohta_id,id,teksti="",tyyppi=1}) => {
    const [maara, setMaara] = useState("")
    const [classi, setClassi] = useState(0)
    const kannata = () => {
        var params = new URLSearchParams()
        params.append ("kannata", id)
        params.append ("tyyppi",tyyppi)
        params.append ("kohta_id",kohta_id)
        axios.post(url+'data.php', params, {withCredentials: true}).then((response) => {
            
            reload()})    
    }      
    useEffect(() => {
        reload();
        
    }, [])
    const reload = () => {
        
            var params = new URLSearchParams()
            params.append ("hae_liket", id)
            params.append ("tyyppi", tyyppi)
            params.append ("kohta_id",kohta_id)
            axios.post(url+'data.php', params, {withCredentials: true}).then((response) => {
            
               setMaara(response.data[0]);
               
               setClassi(parseInt(response.data[1]));
               /*setKommentit(response.data[0]);*/
               /*setMaara(response.data[0].length)*/
            })}
    
    return (
        <div className="kannata">
           <div className="kannata_maara">{maara}</div>
              <div className={["kannatan_harmaa","kannatan_sininen"][classi]} onClick={() => kannata()}>
                   <div className="kannata_thumbsi" ><FaThumbsUp/></div>

                <div className="kannatan_teksti">{teksti}</div>
                
            </div>
        </div>
    )
}

export default Kannata
