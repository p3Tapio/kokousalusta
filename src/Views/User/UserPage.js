import React, { useState, useEffect } from 'react'
import JoinAssoc from '../../Components/User/JoinAssoc'
import AssocTable from '../../Components/User/AssocTable'
import { getUser } from '../../Components/Auth/Sessions'
import request from '../../Components/Shared/HttpRequests'

const UserPage = () => {

    const user = getUser()
    const [yhdistykset, setYhdistykset] = useState([])
    const [showForm, setShowForm] = useState(true)

    useEffect(() => {

        const body = JSON.stringify({ call: 'getmemberships', email: user.email })
        request.assoc(body).then(res => {
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
        <div className="col-md-8 mx-auto mt-5">
            <h4>Moi {user.firstname}!</h4>
            <hr />
            {text}
            <hr />
            {yhdistykset.length > 0 && showForm
                ? <AssocTable yhdistykset={yhdistykset} setShowForm={setShowForm} />
                : <JoinAssoc yhdistykset={yhdistykset} setShowForm={setShowForm} />
            }
        </div>
    )
}
export default UserPage
