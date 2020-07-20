import React, { useEffect, useState, useRef  } from 'react';
import ResizeTextArea from './ResizeTextArea'
import '../../../Style/Mielipide.css';

var alku=0;
var loppu=0;
const Mielipide = ({id,save,edit=false}) => {
    const [kohta,setKohta] = useState("")
    const [perustelu,setPerustelu] = useState("")
    const [mbool,setMielibool] =useState(false);
    
    const this_save = (id,data) => {
        setPerustelu(data);
        save(id,[data,alku,loppu,0])}
  
  
    useEffect((paivitaKohta) => {
    document.addEventListener('selectionchange', function(event) {
        let sel = window.getSelection();
        if (sel.rangeCount) {
            let element = sel.getRangeAt(0).commonAncestorContainer;
            if(element && element.parentNode !==null && element.parentNode.id === ("mielipide"+id)){
                let pos = getInputSelection(element.querySelector(".areaText"))
                alku = pos[0];
                loppu = pos[1];
                setMielibool(alku!==loppu)
                setKohta(window.getSelection().toString()+":"+alku+":"+loppu);
            }
            
        }
    })
    }, [])  

    
    let mielipide = ""
    if(mbool) 
        mielipide = <div>
    <div className="mteksti">Mielipide asiasta:<b> {kohta} </b></div>
    <div className="perustelu" ><ResizeTextArea  edit={true} sisus={perustelu} save={this_save}/></div>
    <div className="msend">Lähetä</div></div>

    return (<div>
       
        {mielipide}
        </div>)
}


export default Mielipide

function getInputSelection(el) {
    var start = 0, end = 0, normalizedValue, range,
        textInputRange, len, endRange;

    if (typeof el.selectionStart == "number" && typeof el.selectionEnd == "number") {
        start = el.selectionStart;
        end = el.selectionEnd;
    } else {
        range = document.selection.createRange();

        if (range && range.parentElement() == el) {
            len = el.value.length;
            normalizedValue = el.value.replace(/\r\n/g, "\n");
            textInputRange = el.createTextRange();
            textInputRange.moveToBookmark(range.getBookmark());
            endRange = el.createTextRange();
            endRange.collapse(false);
            if (textInputRange.compareEndPoints("StartToEnd", endRange) > -1) {
                start = end = len;
            } else {
                start = -textInputRange.moveStart("character", -len);
                start += normalizedValue.slice(0, start).split("\n").length - 1;

                if (textInputRange.compareEndPoints("EndToEnd", endRange) > -1) {
                    end = len;
                } else {
                    end = -textInputRange.moveEnd("character", -len);
                    end += normalizedValue.slice(0, end).split("\n").length - 1;
                }
            }
        }
    }

    return [start,end];
    
}