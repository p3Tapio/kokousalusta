import React, { useEffect, useRef } from 'react';

const ResizeTextArea = ({sisus,id=0,save,placeholder="",edit=false,avaa,alku=0,loppu=0}) => {
    const Tarea = useRef(null); 
    const updatethis = (event) => {     
      save(id,event.target.value,500,"otsake")
      /*event.target.style.minHeight = 'auto'
      event.target.style.minHeight = (event.target.scrollHeight-15)+'px'*/
    }

    useEffect(() => {
    
      Tarea.current.style.minHeight = 'auto'
      Tarea.current.style.minHeight = (Tarea.current.scrollHeight-15)+'px'}, [sisus,edit])  

      let sisusta;

      if (edit) sisusta = <textarea ref={Tarea} className="areaText" id={id} spellCheck="false" onChange = {updatethis} onInput= {updatethis} value={sisus} placeholder={placeholder}></textarea>
      else sisusta = <div 
                      ref={Tarea} tabIndex="0"
                       style={{paddingBottom:15}}
                       className="areaText" id={id}
                       spellCheck="false" >{sisus}</div>

    return (
      <div>{sisusta}</div>
      
    )
  }
  
  export default ResizeTextArea