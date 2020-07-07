import React, { useState } from 'react'
import { Link, useHistory } from 'react-router-dom'
import { FaFacebook } from 'react-icons/fa';
import FacebookLogin from 'react-facebook-login/dist/facebook-login-render-props'
import { setUserSession } from '../../Components/Auth/Sessions'
import request from '../../Components/Shared/HttpRequests'

import HelpPop from '../../Components/Shared/HelpPop'

const Login = () => {

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const appId = process.env.REACT_APP_FB_APP_ID
    let history = useHistory()

    const FaceBookResponse = (fbres) => {

        if (fbres) {
            const body = JSON.stringify({ call: 'fblogin', email: fbres.email, fb_id: fbres.id })

            request.fbUser(body).then(res => {
                alert(`Tervetuloa ${fbres.first_name}`)
                const user = {
                    firstname: fbres.first_name,
                    lastname: fbres.last_name,
                    email: fbres.email,
                }
                setUserSession(user, res.data.token)
                history.push('/userpage')

            }).catch(err => {
                alert(err.response.data.message)
            })
        } else {
            alert('Kirjautuminen epäonnistui')
        }
    }
    const handleInputChange = (ev) => {
        if (ev.target.name === 'email') setEmail(ev.target.value)
        else if (ev.target.name === 'password') setPassword(ev.target.value)
    }
    const handleLoginSubmit = (ev) => {

        ev.preventDefault()

        if (email === '' || password === '') alert("Anna käyttäjätunnus ja salasana!")
        else {
            const login = JSON.stringify({ call: 'applogin', email, password })

            request.appUser(login)
                .then(res => {
                    alert(`Tervetuloa ${res.data.firstname} ${res.data.lastname}!`)
                    const user = {
                        firstname: res.data.firstname,
                        lastname: res.data.lastname,
                        email: email,
                    }
                    setUserSession(user, res.data.token)
                    history.push('/userpage')

                }).catch(err => {
                    alert(err.response.data.message)
                })
        }
    }

    const helpText = "Kirjaudu järjestelmään sähköpostin ja salasanan avulla mikäli käytit niitä rekisteröityessäsi. Jos rekisteröidyit Facebook-tunnuksilla, käytä niitä myös kirjautumiseen. Mikäli unohdit tunnuksesi, voit saada ne paikasta x."

    return (
        <div className="col-md-6 m-auto">
            <div className="card card-body mt-5">
                <h2 className="text-center">Kirjaudu</h2>
                <form className="ml-2 mt-4" onSubmit={handleLoginSubmit}>
                    <div className="form-group">
                        <label>Sähköposti</label>
                        <input type="email" className="form-control" name="email" onChange={handleInputChange} />
                    </div>
                    <div className="form-group">
                        <label>Salasana</label>
                        <input type="password" className="form-control" name="password" onChange={handleInputChange} />
                    </div>
                    <div className="form-group text-right">
                        <button type="submit" className="btn btn-outline-primary mt-3">Kirjaudu</button>
                    </div>
                </form>

                <div className="text-right">
                    <p>
                        <FacebookLogin
                            appId={appId}
                            autoLoad={false}
                            fields="first_name, last_name,email,picture"
                            callback={FaceBookResponse} render={renderProps => (
                                <button onClick={renderProps.onClick} className="btn btn-outline">Kirjaudu Facebook-tunnuksilla <FaFacebook /></button>
                            )}
                        />
                    </p>
                    <hr />
                    <p className="mr-3" style={{ lineHeight: '25px' }}>
                        Haluatko rekisteröityä käyttäjäksi? <Link to="/register" className="ml-1">Rekisteröidy</Link><br />  </p>
                    <p style={{ marginTop: "-20px" }}> Tarvitsetko apua? <HelpPop heading="Kirjautuminen" text={helpText} btnText="Klikkaa tästä!" placement="left" variant="link" style={{ marginBottom: "3px", marginLeft: "-10px" }} /> </p>
                    <p className="mr-3"></p>
                </div>
            </div>
        </div>

    )
}
export default Login
