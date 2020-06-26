import React, { useState, useEffect } from 'react'
import { useParams, useHistory } from 'react-router-dom'
import { getUser, setRole, getRole } from '../../Components/Auth/Sessions'
import request from '../../Components/Shared/HttpRequests'
import AssocAdmin from '../../Components/Assoc/AssocAdmin'

const AssocMain = () => {

    const [kokoukset, setKokoukset] = useState([])
    const [members, setMembers] = useState([])
    const { yhdistys } = useParams()
    const user = getUser()
    let history = useHistory()

    useEffect(() => {

        const member = JSON.stringify({ call: 'checkmember', email: user.email, name: yhdistys })
        request.assoc(member).then(res => {
            setRole(res.data.role)
        }).catch(() => history.push('/userpage'))

        if (getRole()) {
            const body = JSON.stringify({ call: 'getkokoukset', name: yhdistys });
            request.kokous(body).then(res => {
                setKokoukset(res.data)
            }).catch(err => console.log('err.response', err.response))

            if (getRole() === 'admin') {
                const req = JSON.stringify({ call: 'getallmembers', name: yhdistys })
                request.assoc(req).then(res => {
                    setMembers(res.data)
                }).catch(err => console.log('err.response', err.response))
            }
        }
    }, [yhdistys, user.email, history])

    let component

    if (getRole() === 'admin') component = <AssocAdmin kokoukset={kokoukset} members={members} yhdistys={yhdistys} />
    else if (getRole() === 'member') component = <p>Olet {getRole()}</p>
    else return <p>...</p>

    return (
        <div className="col-md-10 mx-auto mt-5">
            <h2>{yhdistys}</h2>
            <h4>Yhdistyksen sivu</h4>
            <hr/>
            {component}
        </div>
    )
}

export default AssocMain
