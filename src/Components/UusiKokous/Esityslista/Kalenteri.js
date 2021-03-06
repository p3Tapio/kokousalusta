import React from 'react';

const Kalenteri = ({pvm=null, alku="false",kk="1",pv="1"}) => {
    if (pvm!=null){
      pvm = new Date(pvm);
      kk = pvm.getMonth()+1;
      pv = pvm.getDate();
    }
    const kuu = ["Tammi","Helmi","Maalis","Huhti","Touko","Kesä","Heinä","Elo","Syys","Loka","Marras","Joulu"][parseInt(kk-1)]+"kuu"
    return (
      <div className={(alku)?"paivays_alku paivays":"paivays_loppu paivays"}>
        <div className="kk">{kuu}</div>
        <div className="paivays_nro">{pv}</div>
      </div>
    )
    
  }

  export default Kalenteri