import React, { useState, useEffect } from 'react';
import axios from 'axios';
import EsitysKohta from './EsitysKohta'
import '../../../Style/Esityslista.css'

var timer;
var updateParams = new URLSearchParams();
let auki = new Map();
const url = process.env.REACT_APP_HOST_URL
const Esityslista = ({ puheenjohtaja, setEsityslista, esityslista, kokousid = "-1", edit = "true", saveKokousDraft, setShowComponent = null}) => {
  const [items, setItems] = useState([])
  
  
  const [avaa, setKohdat] = useState(new Array());
  
  useEffect(() => {
    if (kokousid == -1) return;
    let params = new URLSearchParams();
    params.append("kokous_id", kokousid)
    axios.post(url + 'data.php', params, { withCredentials: true }).then((response) => setItems(response.data[0]))}, [kokousid])

  const axiosSave = () => {      
      let updateParams2 = updateParams;
      updateParams = new URLSearchParams();  
      axios.post(url + 'data.php', updateParams2, { withCredentials: true }).then((response) => {console.log(response.data)}) }


  const save = (thread, data, delay, type, kohta) => {
    if (updateParams.get("kohta") !== kohta || updateParams.get("type") !== type) axiosSave();
    if (type === "flags")
      setItems(items.map(items => (items.id === kohta) ? { ...items, flags: (items.flags ^ parseInt(data)) } : items))

    if (type === "otsake")
      setItems(items.map(items => (items.id === kohta) ? { ...items, n: data } : items))
    updateParams = new URLSearchParams();
    if (type === "perustelu") {
      updateParams.append("param", data[0])
      updateParams.append("draft", data[1])
      
    } else if (type === "mielipide") {
      updateParams.append("param", data[0])
      updateParams.append("alku", data[1])
      updateParams.append("loppu", data[2])
      updateParams.append("draft", data[3]) /* 0 = draft , 1= julkaise */
    } else if (type === "paatos"){
      setItems(items.map(items => (items.id === kohta) ? { ...items, paatos: data[0],tila:data[1] } : items))
      updateParams.append("param", data[0])
      updateParams.append("tila", data[1])
    } else {  updateParams.append("param", data)
      updateParams.append("param", data)
    }
    updateParams.append("thread", thread);
    updateParams.append("kohta", kohta);
    updateParams.append("kokous_id", kokousid)
    updateParams.append("save", type)
    window.clearTimeout(timer);
    timer = setTimeout(function () { axiosSave() }, delay)

  }


  const vaihda_tyyppi = (id_kohta, param) => {
    var params = new URLSearchParams()
    params.append("paatos_valitse", param)
    params.append("kohta", id_kohta)
    params.append("kokous_id", kokousid)
    axios.post(url + 'data.php', params, { withCredentials: true }).then((response) => {
      setItems(response.data[0])
        
    })
  }

  const lisaa_ja_poista = (param="Uusi",kohta="0") => {
    axiosSave();
    var params = new URLSearchParams();
    params.append(param, kohta);
    params.append("kokous_id", kokousid)
    axios.post(url + 'data.php', params, { withCredentials: true })
      .then((response) => {
        
        setItems(response.data[0])
        if(param=="Uusi")document.getElementById(response.data[0][response.data[0].length - 1].id).focus();
      })}

  const avaaItem = (id) => {
    axiosSave();
    if (timer) {
      window.clearTimeout(timer);
      axiosSave();
    }
    setKohdat ((avaa.includes(id))?avaa.filter(x=> (x!=id)):[...avaa, id]); // lisää clickattu kohta listaan tai poista se == avataan sen sisältö
  }
  
  let lisaa;
  if (edit) lisaa = <button className="lisaa_esitysitem" onClick={()=>lisaa_ja_poista()}>Asiakohta</button>
  console.log('items', items)
  let admin;
  return (
    <div>
      <div id="esitys_container">
        {items.map(items =>
          <EsitysKohta
            kokous_id={kokousid}
            vaihda_tyyppi={vaihda_tyyppi}
            type={items.type}
            avaa={avaaItem}
            save={save}
            auki={avaa.includes(items.id)}
            oikeudet={items.oikeudet}
            type={items.type}
            pj = {puheenjohtaja}
            title={items.n}
            id={items.id}
            key={items.id}
            alkaa={items.s}
            poista={lisaa_ja_poista}
            tila={items.tila}
            paatos={items.paatos}
            flags={items.flags}
             />
    
             )}
        {lisaa}
      </div>
    </div>
  )
}
































var keys = { 37: 1, 38: 1, 39: 1, 40: 1 };

function preventDefault(e) {
  e.preventDefault();
}

function preventDefaultForScrollKeys(e) {
  if (keys[e.keyCode]) {
    preventDefault(e);
    return false;
  }
}


var supportsPassive = false;
try {
  window.addEventListener("test", null, Object.defineProperty({}, 'passive', {
    get: function () { supportsPassive = true; }
  }));
} catch (e) { }

var wheelOpt = supportsPassive ? { passive: false } : false;
var wheelEvent = 'onwheel' in document.createElement('div') ? 'wheel' : 'mousewheel';

// call this to Disable
function disableScroll() {
  window.addEventListener('DOMMouseScroll', preventDefault, false); // older FF
  window.addEventListener(wheelEvent, preventDefault, wheelOpt); // modern desktop
  window.addEventListener('touchmove', preventDefault, wheelOpt); // mobile
  window.addEventListener('keydown', preventDefaultForScrollKeys, false);
}

// call this to Enable
function enableScroll() {
  window.removeEventListener('DOMMouseScroll', preventDefault, false);
  window.removeEventListener(wheelEvent, preventDefault, wheelOpt);
  window.removeEventListener('touchmove', preventDefault, wheelOpt);
  window.removeEventListener('keydown', preventDefaultForScrollKeys, false);
}
var raahattavat, raahattava, tar;
window.addEventListener('touchstart', raahausalku);
window.addEventListener('mousedown', raahausalku);
window.addEventListener('touchend', raahausloppu);
window.addEventListener('mouseup', raahausloppu);
window.addEventListener('mousemove', raahausmove);
window.addEventListener('touchmove', raahausmove);
function raahausalku(event) {

  if (raahattava) return;
  tar = -1;
  raahattavat = document.getElementsByClassName("raahaa");
  for (var i = 0; i < raahattavat.length; i++) {
    if (raahattavat[i].contains(event.target)) {
      disableScroll();
      raahattava = raahattavat[i];
      window.setTimeout(() => {
        if (raahattava != null) raahattava.parentNode.classList.add("harmaa");
      }, 100, this);
      document.body.classList.add("disable-select");
      break;
    }
  }
}


function raahausmove(event) {
  if (raahattava != null) {
    var dy = (event.touches) ? event.touches[0].clientY : event.clientY;
    var after = false;
    var h = raahattava.parentNode.getBoundingClientRect().height;
    for (var i = 0; i < raahattavat.length; i++) {
      if (raahattavat[i] === raahattava)
        after = true;
      else {
        var y2 = raahattavat[i].parentNode.getBoundingClientRect().y;
        var y3 = raahattavat[i].parentNode.getBoundingClientRect().height
        if (y3 > h) y3 = h;
        if (dy >= y2 && y3 + y2 > dy) {

          var parent = raahattava.parentNode.parentNode;
          if (after) {
            tar = i + 1;
            parent.insertBefore(raahattava.parentNode, raahattavat[i].parentNode.nextSibling);
          }
          else {
            tar = i + 1;
            parent.insertBefore(raahattava.parentNode, raahattavat[i].parentNode);
          }
          break;
        }
      }
    }
  }
}
function raahausloppu(event) {
  enableScroll();
  if (raahattava != null) {
    if (tar !== -1) {
      var params = new URLSearchParams();
      params.append('NODE', raahattava.id);
      params.append('KOHDE', tar);

      axios.post(url + 'data.php', params)
        .then((response) => {


        });
    }



    raahattava.parentNode.classList.remove("harmaa");
    raahattava = null;
    document.body.classList.remove("disable-select");
  }
}

export default Esityslista