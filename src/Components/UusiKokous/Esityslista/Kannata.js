import React from 'react'
import {  FaThumbsUp } from 'react-icons/fa';
import axios from 'axios';
const url = process.env.REACT_APP_HOST_URL
const Kannata = ({kohta_id,id,teksti="kannatan",tyyppi=1}) => {
    const kannata = () => {
        var params = new URLSearchParams()
        params.append ("kannata", id)
        params.append ("tyyppi",tyyppi)
        params.append ("kohta_id",kohta_id)
        axios.post(url+'data.php', params, {withCredentials: true}).then((response) => {
            alert(response.data)
            reload()})    
    }      
    const reload = () => {
        alert("asd");
    }
    return (
        <div className="kannata">
              <div className="kannata_maara">54</div><div className="kannatan_harmaa"> <div onClick={() => kannata()}><FaThumbsUp/></div>&nbsp; {teksti}</div>
        </div>
    )
}

export default Kannata
