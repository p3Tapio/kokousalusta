import React from 'react'
import { Link } from 'react-router-dom'

const Home = () => {
    return (
        <div className="col-md-10 mx-auto mt-5">
            <div className="jumbotron">
                <h1 className="display-3">Hello, world!</h1>
                <p className="lead">Tähän tulisi tehdä sovelluksen etusivu.</p>
                <hr className="my-4" />
                <p>Se voi kuvailla projektin ideaa, syitä miksi se on tehty, mitä sillä voi tehdä ja mitä sen toteutuksessa on käytetty. Voisin laittaa vaikka linkin myös kirjautumiseen ja ehkä myös rekisteröitymiseen.</p>
                <hr/>
                <Link to="/login" className="btn btn-outline-primary">Kirjaudu</Link>
            </div>
        </div>
    )
}
export default Home
