import React, { useState } from 'react'
import request from '../Shared/HttpRequests'
import { getUser } from '../Auth/Sessions'

const JoinAssoc = ({ yhdistykset, setShowForm }) => {
    const [yhdistys, setYhdistys] = useState('')
    const [yhdistysPassword, setYhdistysPassword] = useState('')

    const handleInputChange = (ev) => {
        if (ev.target.name === 'yhdistys') setYhdistys(ev.target.value)
        else if (ev.target.name === 'password') setYhdistysPassword(ev.target.value)
    }

    const handleSubmit = (ev) => {

        ev.preventDefault()

        if (yhdistys && yhdistysPassword) {
            const body = JSON.stringify({ call: 'checkyhdistystiedot', name: yhdistys, password: yhdistysPassword })
            request.assoc(body)
                .then((res) => { 
                    setNewMember()
                })
                .catch((err) => {
                    alert(err.response.data.message)
                })
        } else {
            alert("Täytä molemmat kentät!")
        }
    }

    const setNewMember = () => {

        const user = getUser()
        const body = JSON.stringify({ call: 'joinyhdistys', email: user.email, yhdistys: yhdistys })

        request.assoc(body).then((res) => {
            alert(res.data.message)
            window.location.reload()
        }).catch(err => {
            alert(err.response.data.message)  
            if(err.response.data.message.includes('Olet jo yhdistyksen')) window.location.reload() 
        })
    }
    return (
        <div>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Yhdistyksen nimi</label>
                    <input type="text" className="form-control" name="yhdistys" onChange={handleInputChange} value={yhdistys} />
                </div>
                <div className="form-group">
                    <label>Yhdistyksen tunnus</label>
                    <input type="password" className="form-control" name="password" onChange={handleInputChange} value={yhdistysPassword} />
                </div>
                <div className="form-group text-right">
                    {yhdistykset.length > 0 ? <button type="button" onClick={() => setShowForm(true)} className="btn btn-outline-secondary mt-3 mx-2">Palaa takaisin</button> : <></>}
                    <button type="submit" className="btn btn-outline-primary mt-3">Rekisteröidy</button>
                </div>
            </form>
        </div>
    )
}
export default JoinAssoc