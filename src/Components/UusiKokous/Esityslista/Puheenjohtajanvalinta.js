import React, {useEffect, useState} from 'react'
import request from "../../Shared/HttpRequests"
import '../../../Style/Puheenjohtajanvalinta.css'
import CheckboxArea from './CheckboxArea'



const Puheenjohtajanvalinta = ({kokous_id,edit=false, arvot, checkValue=[], check, remove, save, uusi}) => {
    const [users, setUsers] = useState([])
    const [ei_ehdokkaat,setEiEhdokkaat] = useState([])
    const [ehdokkaat,setEhdokkaat] = useState([])
    const [summa,setSumma] = useState(0)
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
            setSumma(aania)
    }).catch(error => alert(error))
    }, [arvot]
    )

    const reload = () => {}
    return (
        <div className="PJ">
            
            <CheckboxArea edit={false} arvot={ehdokkaat} summa={summa} check={check} checkValue={checkValue} remove={remove} save={save} uusi={uusi}/>
             
            
            <button className="pj_ehdota" >Ehdota Puheenjohtajaksi</button>   {/* älä näytä jos kaikki jo ehdolla */}
            {ei_ehdokkaat.map(x=>  <div onClick={()=>
                uusi(x.id)}>{x.firstname} {x.lastname}</div>)}            
            
        </div>
        
        
    )
}


export default Puheenjohtajanvalinta