import React, { useState } from 'react'
import request from '../Shared/HttpRequests'
import { Link } from 'react-router-dom'
import { FaInfoCircle, FaKey } from 'react-icons/fa';
import Kalenteri from '../UusiKokous/Esityslista/Kalenteri'

const KokousTable = ({ kokous, yhdistys, yhdistys_id }) => {

    const pvmForm = { month: 'numeric', day: 'numeric', year: 'numeric' };
    const pvmYear = { year: 'numeric' };
    const [loading, setLoading] = useState(false)

    const openKokous = (id) => {
        if (window.confirm('Haluatko avata kokoustilan osallistujille?')) {
            setLoading(true)
            const body = JSON.stringify({ call: 'openkokous', id: id })
            console.log('body', body)
            request.kokous(body).then(res => {
                alert(res.data.message)
                window.location.reload()
            }).catch(err => {
                alert(err.response.data.message)
            })
        }
    }
    
    if (!loading) {
        return (
            <div className="bg">
                
                    {/*<div className="taulu">
                        <div>alkaa</div><div>loppuu</div><div>kokous</div><div>kokousnro</div><div>tila</div><div></div>
        </div >*/}
                <div >
                    
                        {kokous.map((item) =>
                            <Link className="text-primary" style={{pointerEvents: (item.avoinna==='1' || item.role === 'puheenjohtaja')?"auto":"none",textDecoration:"none"}}
                             to={{pathname:`/kokous/${yhdistys}/${item.id}`, state:{id_y:yhdistys_id}}}
                              title="Tarkastele kokouksen tietoja"> 
                            <div className={(item.avoinna==='1' || item.role === 'puheenjohtaja')?"taulu":"taulu disable" } key={item.kokousnro}>
                                <Kalenteri pvm={item.startDate} alku={false} />
                                <Kalenteri pvm={item.endDate } alku={false} />
                               <div className="tauluAlku tauluotsikko">{item.otsikko}</div>
                                <div className="taulukokousnro">{item.kokousnro}/{(new Date(item.endDate)).toLocaleDateString('fi-FI', pvmYear)}</div>
                                
                                
                                
                                
                              
                                {/* adminille (vai pj:lle? if pj.email = user.email) oikeus tarkastella tietoja ennen avaamista  */}
                                {item.avoinna === '1'
                                    ? <>
                                      {/*  <div className="taulutila">Kokoustila on avoinna</div>
                                      }  <div className="taulunapit">
                                        <Link to={`/kokous/${yhdistys}/${item.id}`} title="Tarkastele kokouksen tietoja" className="btn btn-outline-primary" ><FaInfoCircle /></Link></div>
                            */}
                                    </>
                                    : <>
                                        <div className="taulutila">kokoustila on suljettu</div>
                                        {item.role === 'puheenjohtaja' ? <>
                                            <div className="taulunapit">
                                                <div style={{ whiteSpace: "nowrap"}}>
                                                    {/*<Link to={{pathname:`/kokous/${yhdistys}/${item.id}`, state:{id_y:yhdistys_id}}} title="Tarkastele kokouksen tietoja" className="btn btn-outline-primary" style= {{backgroundColor:"white"}}><FaInfoCircle /></Link>*/}
                                                    {<button  onClick={(event) => {event.preventDefault();openKokous(item.id)}} id={item.id} title="Avaa kokoustila" className="btn btn-outline-primary" style={{ marginLeft: '5px'}}><FaKey /></button>}
                                                </div>
                                            </div></>
                                            : <><div></div></>}
                                    </>
                                }
                            
                            </div>
                            
                            </Link>
                            
                        )}
                        
                    </div>
                </div>
                
        )
    } else {
        return <></>
    }
}
export default KokousTable



        // let x = kokous.map(x => x.puheenjohtaja); x = x[0];
        // const pjCheck = x.filter(item => item.email === user.email)
