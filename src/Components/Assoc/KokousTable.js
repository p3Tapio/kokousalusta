import React, { useState } from 'react'
import request from '../Shared/HttpRequests'
import { Link } from 'react-router-dom'
import { FaKey } from 'react-icons/fa';
import Kalenteri from '../UusiKokous/Esityslista/Kalenteri'

const KokousTable = ({ kokous, yhdistys, yhdistys_id }) => {

    const pvmYear = { year: 'numeric' };
    const [loading, setLoading] = useState(false)

    const openKokous = (id) => {

        if (window.confirm('Haluatko avata kokoustilan osallistujille?')) {
            setLoading(true)
            const body = JSON.stringify({ call: 'openkokous', id: id })
            request.kokous(body).then(res => {
                alert(res.data.message)
                window.location.reload()
            }).catch(err => {
                alert(err.response.data.message)
            })
            // TODO luo asiakohta nimeltään ”Avaus” - ”Puheenjohtaja etunimi sukunimi avasi kokouksen pp.kk.vvvvv, klo hh:mm.”
            // axios.post --> id_k, user.firstname, user.lastname, timestamp
            // huom: kokous aukeaa myös automaattisesti jolloin speksien teksti on hieman harhaanjohtava? Vaihtoehtoisesti: "Kokoustila avattiin käyttäjille pp.kk.vvvv, klo hh:mm" ???  
        }
    }
    
    if (!loading) {
        return (
            <div className="bg">
                <div >
                    {kokous.map((item) =>
                        <Link key={item.id} className="text-primary" style={{ pointerEvents: (item.avoinna === '1' || item.role === 'puheenjohtaja') ? "auto" : "none", textDecoration: "none" }}
                            to={{ pathname: `/kokous/${yhdistys}/${item.id}`, state: { id_y: yhdistys_id } }}
                            title="Tarkastele kokouksen tietoja">
                            <div className={(item.avoinna === '1' || item.role === 'puheenjohtaja') ? "taulu" : "taulu disable"} key={item.kokousnro}>
                                <Kalenteri pvm={item.startDate} alku={false} />
                                <Kalenteri pvm={item.endDate} alku={false} />
                                <div className="tauluAlku tauluotsikko">{item.otsikko}</div>
                                <div className="taulukokousnro">{item.kokousnro}/{(new Date(item.endDate)).toLocaleDateString('fi-FI', pvmYear)}</div>
                                {item.avoinna === '1'
                                    ? <></>
                                    : <>
                                        <div className="taulutila">kokoustila on suljettu</div>
                                        {item.role === 'puheenjohtaja' ? <>
                                            <div className="taulunapit">
                                                <div style={{ whiteSpace: "nowrap" }}>
                                                    {<button onClick={(event) => { event.preventDefault(); openKokous(item.id) }} id={item.id} title="Avaa kokoustila" className="btn btn-outline-primary" style={{ marginLeft: '5px' }}><FaKey /></button>}
                                                </div>
                                            </div></>
                                            : <></>}
                                    </>
                                }
                            </div>
                        </Link>
                    )}
                </div>
            </div>
        )
    } else {
       return <p className="mt-4 mx-4">Ladataan tietoja .... </p>
    }
}
export default KokousTable
