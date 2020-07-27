import React, { useState, useEffect } from 'react'
// import Modal from 'react-modal'
import Rodal from 'rodal'
import 'rodal/lib/rodal.css';
import JoinAssoc from '../../Components/User/JoinAssoc'
import AssocTable from '../../Components/User/AssocTable'
import { getUser } from '../../Components/Auth/Sessions'
import request from '../../Components/Shared/HttpRequests'

const UserPage = (props) => {

    const user = getUser()
    // const [isModalOpen, setIsModalOpen] = useState(props.location.state !== undefined && props.location.state.login ? true : false)
    const [isModalOpen, setIsModalOpen] = useState(true)
    const [yhdistykset, setYhdistykset] = useState([])
    const [showForm, setShowForm] = useState(true)
    console.log('isModalOpen', isModalOpen)

    useEffect(() => {

        const body = JSON.stringify({ call: 'getmemberships', email: user.email })
        request.assoc(body).then(res => {
            console.log("res.data", res.data)
            setYhdistykset(res.data)
        }).catch(err => {
            if (err.response.data) console.log('err.response.data', err.response.data)
        })

    }, [user.email])

    let text
    if (yhdistykset.length > 0 && showForm) text = "Alla näet yhdistykset, joiden kokoustilaan olet liittynyt. Painamalla nappia saat näkyviisi kaavakkeen, jolla voit lisätä itsesi yhdistyksen kokoustilan käyttäjäksi."
    else if (yhdistykset.length > 0 && !showForm) text = "Voit liittää itsesi yhdistyksen kokoustilaan antamalla yhdistyksen nimen ja sovelluskohtaisen salasanan. Saat tarvittavan tunnuksen sovelluksen pääkäyttäjältä."
    else text = "Et ole vielä rekisteröitynyt yhdistysten kokoustilan käyttäjäksi. Alla olevan kentän avulla voit liittää itsesi yhdistyksen kokoustilaan antamalla yhdistyksen nimen ja sovelluskohtaisen salasanan. Saat tarvittavan tunnuksen sovelluksen pääkäyttäjältä."

    return (
        <div style={{ width: "100%", maxWidth: "1100px", padding: "0", marginTop: "50px" }}>
            <h4 className="px-3">Moi {user.firstname}!</h4>
            <hr />
            <p className="px-3">
                {text}
            </p>
            <hr />

            {yhdistykset.length > 0 && showForm
                ? <AssocTable yhdistykset={yhdistykset} setShowForm={setShowForm} />
                : <JoinAssoc yhdistykset={yhdistykset} setShowForm={setShowForm} />
            }
            <TervetuloaModal isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} />
        </div>
    )
}
export default UserPage


const TervetuloaModal = ({ isModalOpen, setIsModalOpen }) => {

    const user = getUser()
    console.log('user', user)

    return (
        <Rodal visible={isModalOpen} onClose={() => setIsModalOpen(false)} animation={'door'} height={100} className="justify-content-center" >
            <div className="Modal" onClick={() => setIsModalOpen(false)}>
                <h5 className="modal-title mx-auto">Tervetuloa {user.firstname}! </h5>
            </div>
        </Rodal>
    )
}
