import React, { useState, useEffect } from 'react'
import { useParams, useHistory, Link } from 'react-router-dom'
import { getUser } from '../../Components/Auth/Sessions'
import request from '../../Components/Shared/HttpRequests'
import AssocAdmin from '../../Components/Assoc/AssocAdmin'
import AssocMember from '../../Components/Assoc/AssocMember'
import { setSessionRole, getSessionRole } from '../../Components/Auth/Sessions'


const AssocMain = () => {

    const [kokoukset, setKokoukset] = useState()
    const [members, setMembers] = useState([])
    const { yhdistys } = useParams()
    const [role, setRole] = useState('')
    const user = getUser()
    let history = useHistory()

    useEffect(() => {

        const member = JSON.stringify({ call: 'checkmember', email: user.email, name: yhdistys })

        request.assoc(member).then(res => {
            setRole(res.data.role)
            const userRole = { yhdistys: yhdistys, role: res.data.role }
            setSessionRole(userRole)
        }).catch(() => history.push('/userpage'))

        if (role) {
            const body = JSON.stringify({ call: 'getkokoukset', name: yhdistys });
            request.kokous(body).then(res => {
                setKokoukset(res.data)
            }).catch(err => console.log('err.response', err.response))
        
            if (role === 'admin') {
                const req = JSON.stringify({ call: 'getallmembers', name: yhdistys })
                request.assoc(req).then(res => {
                    setMembers(res.data)
                }).catch(err => console.log('err.response', err.response))
            }
        }


    }, [history, user.email, yhdistys, role]);


    if (getSessionRole() && kokoukset) {
        let component
        if (getSessionRole().role === 'admin' && getSessionRole().yhdistys === yhdistys) component = <AssocAdmin kokoukset={kokoukset} members={members} yhdistys={yhdistys} />
        else if (getSessionRole().role === 'member' && getSessionRole().yhdistys === yhdistys) component = <AssocMember kokoukset={kokoukset} yhdistys={yhdistys} />
        return (
            <div className="col-md-10 mx-auto mt-5">
                <h2>{yhdistys}</h2>
                <h4>Yhdistyksen sivu</h4>
                {getSessionRole().role ==='admin' ? <Link to={ `/uusikokous/${yhdistys}`} >Luo uusi kokous</Link> : <></>}
                <hr />
                {component}
            </div>
        )
    } else {
        return <p>loading.... </p>
    }
}

export default AssocMain
