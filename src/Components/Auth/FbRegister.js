import React, { useState } from 'react'
import { Link, useHistory } from 'react-router-dom'
import request from '../Shared/HttpRequests'

const FbRegister = ({ fbRes }) => {

    const [firstname, setFirstname] = useState(fbRes.first_name)
    const [lastname, setLastname] = useState(fbRes.last_name)
    const [email, setEmail] = useState(fbRes.email)
    let history = useHistory()

    const handleInputChange = (ev) => {
        if (ev.target.name === 'firstname') setFirstname(ev.target.value)
        else if (ev.target.name === 'lastname') setLastname(ev.target.value)
        else if (ev.target.name === 'email') setEmail(ev.target.value)
    }

    const handleSubmit = (ev) => {

        ev.preventDefault()
        const fb_id = fbRes.id
        if (firstname !== '' && lastname !== '' && email !== '' && fb_id !== '') {

            let user = JSON.stringify({ call: 'fbreg', firstname, lastname, email, fb_id })
            
            request.fbUser(user).then(res => {
                alert('Rekisteröityminen onnistui! Kirjauduttuasi voit liittyä yhdistyksen alueelle ja tarkastella yhdistyksen kokousasioita.')
                history.push('/login')
            }).catch(err => {
                alert(err.response.data.message)
                window.location.reload() 
            })

        } else {
            alert('Tarkasta että kaikki kentät on täytetty!')
        }
    }

    return (
        <div className="col-md-8 mx-auto mt-5">
            <h4>Terve {firstname}!</h4>
            <p>Tarkasta ennen rekisteröitymistä ovatko henkilötietosi ja sähköpostiosoitteesi oikein.</p>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Etunimi</label>
                    <input type="text" className="form-control" name="firstname" onChange={handleInputChange} value={firstname} />
                </div>
                <div className="form-group">
                    <label>Sukunimi</label>
                    <input type="text" className="form-control" name="lastname" onChange={handleInputChange} value={lastname} />
                </div>
                <div className="form-group">
                    <label>Sähköposti</label>
                    <input type="email" className="form-control" name="email" onChange={handleInputChange} value={email} />
                </div>
                <div className="form-group text-right">
                    <button type="submit" className="btn btn-outline-primary mt-3">Rekisteröidy</button>
                </div>
                <p className="text-right">
                    Haluatko valita rekisteröitymistavan uudelleen?<Link className="ml-1" to='/register' onClick={() => window.location.reload()}>Takaisin</Link><br />
                    Onko sinulla jo käyttäjä tili?<Link to="/login" className="ml-1">Kirjaudu</Link>
                </p>
            </form>
        </div>
    )
}

export default FbRegister
