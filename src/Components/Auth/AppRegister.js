import React, { useState } from 'react'
import { Link, useHistory } from 'react-router-dom'
import request from '../Shared/HttpRequests'

const AppRegister = () => {

    const [firstname, setFirstname] = useState('')
    const [lastname, setLastname] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [password2, setPassword2] = useState('')
    let history = useHistory()

    const handleInputChange = (ev) => {
        if (ev.target.name === 'firstname') setFirstname(ev.target.value)
        else if (ev.target.name === 'lastname') setLastname(ev.target.value)
        else if (ev.target.name === 'email') setEmail(ev.target.value)
        else if (ev.target.name === 'password') setPassword(ev.target.value)
        else if (ev.target.name === 'password2') setPassword2(ev.target.value)
    }
    const handleSubmit = (ev) => {
        ev.preventDefault()
        if (firstname === '' || lastname === '' || email === '' || password === '' || password2 === '') {
            alert("Täytä kaikki kentät!")
        } else if (password !== password2) {
            alert("Tarkasta salasanat!")
        } else {

            const user = JSON.stringify({ call: 'appreg', firstname, lastname, email, password })

            request.appUser(user)
                .then(res => {
                    alert('Rekisteröityminen onnistui! Kirjauduttuasi voit liittyä yhdistyksen alueelle ja tarkastella yhdistyksen kokousasioita.')
                    history.push('/login')
                }).catch(err => {
                    alert(err.response.data.message)
                    window.location.reload() 
                })
        }
    }
    return (
        <div className="col-md-6 m-auto">
            <div className="card card-body mt-5">
                <h4 className="text-center mb-4">Rekisteröidy käyttäjäksi</h4>
                <p>Lisää alle henkilötietosi, sähköpostiosoitteesi ja salasana.</p>
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
                    <div className="form-group">
                        <label>Salasana</label>
                        <input type="password" className="form-control" name="password" onChange={handleInputChange} value={password} />
                    </div>
                    <div className="form-group">
                        <label>Salasana uudelleen</label>
                        <input type="password" className="form-control" name="password2" onChange={handleInputChange} value={password2} />
                    </div>
                    <div className="form-group text-right">
                        <button type="submit" className="btn btn-outline-primary mt-3">Rekisteröidy</button>
                    </div>
                    <p className="text-right">
                        Haluatko valita rekisteröitymistavan uudelleen?<Link className="ml-1" to='/register' onClick={() => window.location.reload()}>Takaisin</Link><br />
                        Onko sinulla jo käyttäjä tili? <Link to="/login" className="ml-1">Kirjaudu</Link>
                    </p>
                </form>
            </div>
        </div>
    )
}
export default AppRegister
