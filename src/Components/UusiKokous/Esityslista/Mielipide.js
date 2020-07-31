import React, { useRef, useEffect, useState} from 'react';
import ResizeTextArea from './ResizeTextArea'
import '../../../Style/Mielipide.css';
import Kommentit from './Kommentit';
import Kannata from './Kannata';


var alku=0;
var loppu=0;
var thisdata =""
const Mielipide = ({kokous_id,kohta_id,tila,save,edit=false, arvot=[],kuvaus,positio}) => {
    const [kohta,setKohta] = useState("")
    const [perustelu,setPerustelu] = useState("")
    const [mbool,setMielibool] =useState(false);
    
    
    const laheta_setup = () => {
        let sendi = document.getElementById("send_mielipide"+kohta_id);
        if(sendi !=null){
            if (thisdata.length >0)
                sendi.classList.add("sendilite")
            else
                sendi.classList.remove("sendilite")
        }
    }

    const this_save = (_id,data) => {
        setPerustelu(data);
        thisdata = data;
        save(_id,[data,alku,loppu,0])
        laheta_setup();    
    }

    const julkaise = () => {
        save(kohta_id,[thisdata,alku,loppu,1])
        alku=0;loppu=0;
        thisdata =""
        setPerustelu("");
        positio(alku,loppu)
        setMielibool(alku!=loppu);
    }
    
    useEffect((paivitaKohta) => {
        document.addEventListener('selectionchange', function(event) {
            let sel = window.getSelection();
            if (sel.rangeCount) {
                let element = sel.getRangeAt(0).commonAncestorContainer;
                if(element && element.parentNode !==null && element.parentNode.id === ("kuvaus"+kohta_id)){
                    alku = sel.anchorOffset;
                    let offset = sel.focusOffset;
                    if(offset < alku ){
                        loppu = alku
                        alku = offset;
                    } else {
                        loppu = offset;
                    }
                    laheta_setup()
                    setMielibool(alku!=loppu);
                    setKohta(window.getSelection().toString());
                } 
            }
        })
        }, [])  
    const osa = (alku,loppu) => {
        let otsake = kuvaus.toString().substring(alku,loppu)
        if (otsake.length > 100) return otsake.slice(0,80)+"..."
        else return otsake;
        
    }
    
    let mielipide = ""
    if(mbool && tila!=3) mielipide = <div>
        <div className="mteksti  disable-select">Mielipide asiasta:<br></br><b> {kohta} </b></div>
        <div className="perustelu" onMouseDown={()=>{positio(alku,loppu)}}><ResizeTextArea  edit={true} sisus={perustelu} save={this_save}/></div>
        <div className="sendibutton disable-select" id={"send_mielipide"+kohta_id} onClick={() => julkaise()}>Lähetä</div></div>
    
    return (<div>
          
        {mielipide}
        {(arvot.length > 0)?<div className="MielipideHeader disable-select">Mielipiteet({arvot.length})</div>:""}
        
        {arvot.map(arvot =>
        <div>
            <div key={arvot.id} className="mielipide_container" onClick={(ev)=>{setMielibool(false);positio(arvot.alku,arvot.loppu)}}>
                <div className="kelloaika">{arvot.aika}</div>
                <div className="nimipallo" style={{background: "#ddd",color:"black" }}>{arvot.firstname[0]}{arvot.lastname[0]}</div>
                <div className="mielipide_otsake" ><b>{osa(arvot.alku,arvot.loppu)}</b></div>
                
                <div className="mielipide_teksti">{arvot.mielipide}
             </div>   
                
               <div className="mielipide_like"><Kannata teksti={"kannatan"} kokous_id={kokous_id} id={arvot.id} kohta_id={kohta_id}/></div>
                <Kommentit 
                    thread_id={arvot.id}
                    kohta_id={kohta_id}
                    kokous_id={kokous_id}
                    maara={arvot.kommentit}/>
                </div></div>
             
                                ) }    
        </div>)
}


export default Mielipide



