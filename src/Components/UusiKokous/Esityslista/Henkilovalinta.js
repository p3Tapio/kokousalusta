import React, {useEffect, useState} from 'react'
import request from "../../Shared/HttpRequests"
import '../../../Style/Henkilovalinta.css'
import CheckboxArea from './CheckboxArea'



const Henkilovalinta = ({kokous_id,edit=false, arvot, checkValue=[], check, remove, save, uusi, type="5", tila}) => {
    const [users, setUsers] = useState([])
    const [ei_ehdokkaat,setEiEhdokkaat] = useState([])
    const [ehdokkaat,setEhdokkaat] = useState([])
    
    const [ehdokasBool,setEhdokasBool] = useState(false);
    
        let hash = new Map();
    
    useEffect(() => {
        const body2 = JSON.stringify({ call: 'getosallistujat', id: kokous_id })
        request.osallistujat(body2).then(res => {
            setUsers(res.data);
            let aania = 0;
            users.map(x => {hash.set(x.id,x.firstname+" "+x.lastname)})
            setEhdokkaat((arvot.filter(x => hash.has(x.nimi))).map(x => {
                let obj = {}
                obj["id"]=x.id;
                obj["maara"]=x.maara;
                aania+=parseInt(x.maara);
                obj["nimi"] = hash.get(x.nimi)
                hash.delete(x.nimi)
                return obj;}))
            setEiEhdokkaat(users.filter(x => hash.has(x.id) ))
           
            
            
    }).catch(error => alert(error))
    }, [arvot]
    )
    let jasenlista;
    if (tila!="3") jasenlista =
    <div>{ei_ehdokkaat.length>0?<button onClick={()=>setEhdokasBool(!ehdokasBool)} className="pj_ehdota" >{!ehdokasBool?"Lisää ehdokas":"pienennä"}</button>:""}   
    {ehdokasBool?ei_ehdokkaat.map(x=>  <div className="pj_ehdokkaita" onClick={()=>uusi(x.id)}>{x.firstname} {x.lastname}</div>):""}</div>

    
    return (
        <div className="PJ">       
            {ehdokkaat.length>0?
            <CheckboxArea type="6" tila={tila} edit={false} arvot={ehdokkaat} check={check} checkValue={checkValue} remove={remove} save={save} uusi={uusi}/>:""}
           
           {jasenlista}
            
        </div>
        
        
    )
}


export default Henkilovalinta