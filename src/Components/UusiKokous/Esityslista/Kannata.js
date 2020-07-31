import React, { useState, useEffect } from 'react';
import {  FaThumbsUp } from 'react-icons/fa';
import axios from 'axios';
const url = process.env.REACT_APP_HOST_URL
const Kannata = ({kokous_id,kohta_id,id,teksti="",tyyppi="mielipide"}) => {
    const [maara, setMaara] = useState("")
    const [classi, setClassi] = useState(0)
   
    const tyypit = (param) => {
        switch(param){
            case "mielipide":
                return 1;
            case "kommentti_mielipide":                
                return 2;
            case "kommentti_valinta":
                return 3;
            case "kommentti_perustelu":
                return 4;
            case "perustelu":
                return 5;

        }
    }
    const kannata = () => {
        var params = new URLSearchParams()
        params.append ("kannata", id)
        params.append ("tyyppi",tyypit(tyyppi))
        params.append ("kohta_id",kohta_id)
        params.append ("kokous_id",kokous_id)
        axios.post(url+'data.php', params, {withCredentials: true}).then((response) => {
            
            reload(1)})    
    }      
    useEffect(() => {
        reload();
        
    }, [])
    const reload = (param=0) => {
        
            var params = new URLSearchParams()
            params.append ("hae_liket", id)
            params.append ("tyyppi", tyypit(tyyppi))
            params.append ("kohta_id",kohta_id)
            axios.post(url+'data.php', params, {withCredentials: true}).then((response) => {
                if(param==1)console.log("resdsaf sd",response.data);
               if(param==1 && tyypit(tyyppi)==2) console.log(response.data);
              setMaara(response.data[0])
               
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
