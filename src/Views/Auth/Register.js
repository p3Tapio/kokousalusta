import React, { useState } from 'react'
import FbRegister from '../../Components/Auth/FbRegister'
import AppRegister from '../../Components/Auth/AppRegister'
import { FaFacebook } from 'react-icons/fa';
import FacebookLogin from 'react-facebook-login/dist/facebook-login-render-props'
import { Link } from 'react-router-dom'


const Register = () => {
    const appId = process.env.REACT_APP_FB_APP_ID
    const [regSelect, setRegSelect] = useState()
    const [fbRes, setFbRes] = useState({})

    const handleClick = (ev) => {
        if (ev.target.id === 'app') setRegSelect('app')
    }
    const handleFbClick = (res) => {
        setFbRes(res)
        setRegSelect('fb')
    }
    if (!regSelect) {
        return (
            <div className="col-md-6 mx-auto mt-5">
                <div className="card card-body mt-5">
                    <h4 className="text-center mb-4">Rekisteröidy käyttäjäksi</h4>
                    <p className=" text-justify ">Palvelua voi käyttää luomalla sovelluskohtaisen tunnuksen tai rekisteröitymällä Facebook-tunnuksien avulla.
                    <br/><br/>Jos olet jo rekisteröitynyt ja haluat kirjautua, pääset kirjautumissivulle  <Link to="/login">tästä.</Link></p>
                    <hr />
                    <div className="row">
                        <button onClick={handleClick} id='app' className="btn btn-outline mr-2">Rekisteröi sovelluskohtainen tunnus</button>
                        <FacebookLogin
                            appId={appId}
                            autoLoad={false}
                            fields="first_name, last_name,email,picture"
                            callback={handleFbClick}
                            render={renderProps => (
                                <button onClick={renderProps.onClick} className="btn btn-outline">Rekisteröidy Facebook-tunnuksilla  <FaFacebook /></button>
                            )}
                        />
                    </div>
                </div>
            </div>
        )
    } else if (regSelect) {
        return (
            <> {regSelect === 'fb'
                ? <FbRegister fbRes={fbRes} />
                : <AppRegister />}</>)
    } else {
        return <p>Loading...</p>
    }
}
export default Register