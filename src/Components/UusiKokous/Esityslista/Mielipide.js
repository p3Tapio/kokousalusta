import React, { useRef, useEffect, useState} from 'react';
import ResizeTextArea from './ResizeTextArea'
import '../../../Style/Mielipide.css';


var alku=0;
var loppu=0;
var thisdata =""
const Mielipide = ({id,save,edit=false, arvot=[],kuvaus,positio}) => {
    const [kohta,setKohta] = useState("")
    const [perustelu,setPerustelu] = useState("")
    const [mbool,setMielibool] =useState(false);
    
    
    const laheta_setup = () => {
        let sendi = document.getElementById("send_mielipide"+id);
        if(sendi !=null){
            if (thisdata.length >0)
                sendi.classList.add("msend2")
            else
                sendi.classList.remove("msend2")
        }
    }

    const this_save = (_id,data) => {
        setPerustelu(data);
        thisdata = data;
        save(_id,[data,alku,loppu,0])
        laheta_setup();    
    }

    const julkaise = () => {
        save(id,[thisdata,alku,loppu,1])
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
                if(element && element.parentNode !==null && element.parentNode.id === ("kuvaus"+id)){
                   
                    //let pos = getInputSelection(element.querySelector(".areaText"))
                    
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
    if(mbool) 
        mielipide = <div>
    <div className="mteksti">Mielipide asiasta:<br></br><b> {kohta} </b></div>
    <div className="perustelu" onMouseDown={()=>{positio(alku,loppu)}}><ResizeTextArea  edit={true} sisus={perustelu} save={this_save}/></div>
    <div className="msend" id={"send_mielipide"+id} onClick={() => julkaise()}>Lähetä</div></div>
    
    return (<div>
          
        {mielipide}
        {(arvot.length > 0)?<div className="MielipideHeader">Mielipiteet({arvot.length})</div>:""}
        
        {arvot.map(arvot =>
            <div className="mielipide_container" onClick={(ev)=>{setMielibool(false);positio(arvot.alku,arvot.loppu)}}>
                <div className="kelloaika">{arvot.aika}</div>
                <div className="nimipallo">{arvot.firstname[0]}{arvot.lastname[0]}</div>
                <div className="mielipide_otsake" >{osa(arvot.alku,arvot.loppu)}</div>
                
                
                <div className="mielipide_teksti">{arvot.mielipide}</div>
             </div>                   
                                ) }    
        </div>)
}


export default Mielipide



