import React, { useState, useEffect } from 'react'
import { useParams, useHistory, Link } from 'react-router-dom'
import { getUser } from '../../Components/Auth/Sessions'
import request from '../../Components/Shared/HttpRequests'
import AssocContent from '../../Components/Assoc/AssocContent'
import { setSessionRole, getSessionRole } from '../../Components/Auth/Sessions'

const AssocMain = (props) => {

    const [kokoukset, setKokoukset] = useState()
    const [members, setMembers] = useState([])
    const { yhdistys } = useParams()

    const [role, setRole] = useState('')
    const user = getUser()
    let history = useHistory()
    let yhdistys_id
    if (props.location.state === undefined) history.push('/userpage')
    else yhdistys_id = props.location.state.id_y;

    useEffect(() => {

        const member = JSON.stringify({ call: 'checkmember', email: user.email, name: yhdistys })

        request.assoc(member).then(res => {
            setRole(res.data.role)
            const userRole = { yhdistys: yhdistys, role: res.data.role }
            setSessionRole(userRole)
        }).catch(() => history.push('/userpage'))

        if (role) {

            const body = JSON.stringify({ call: 'getkokoukset', yhdistys: yhdistys, email: user.email });
            request.kokous(body).then(res => {
                setKokoukset(res.data.filter(x => x.valmis === "1"))
            }).catch(err => console.log('err.response', err.response))

            const req = JSON.stringify({ call: 'getallmembers', yhdistys: yhdistys })
            request.assoc(req).then(res => {
                setMembers(res.data)
            }).catch(err => console.log('err.response', err.response))

        }

    }, [history, user.email, yhdistys, role]); /* tekee monta kertaa*/

    if (getSessionRole() && kokoukset) {
        let component
        return (
            <div style={{ width: "100%", maxWidth: "1100px", padding: "0", marginTop: "50px" }}>
                {/*<div className="mx-auto mt-5">*/}
                <h2 className="px-3">{yhdistys}</h2>
                <h4 className="px-3">Yhdistyksen sivu</h4>
                {getSessionRole().role === 'admin' ? <Link className="px-3"
                    to={{ pathname: `/uusikokous/${yhdistys}`, state: { id_y: yhdistys_id } }}>Luo uusi kokous</Link> : <></>}
                <hr />
                <AssocContent kokoukset={kokoukset} members={members} yhdistys={yhdistys} yhdistys_id={yhdistys_id} />
            </div>
        )
    } else {
        return <p>loading.... </p>
    }
}

export default AssocMain
