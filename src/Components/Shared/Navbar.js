import React, { useState } from 'react'
import * as Icon from 'react-bootstrap-icons';
import { Link, useHistory } from 'react-router-dom';
import { getUser, removeUserSession } from '../Auth/Sessions';

export default function Navbar() {

    const [showMenu, setShowMenu] = useState(false);
    let history = useHistory()

    const toggleMenu = () => {
        let px = "";
        if (showMenu) px = "0";
        else if (!showMenu && getUser()) px = "100px";
        else px = "150px"
        document.getElementById("dropMenu").style.height = px;
        setShowMenu(!showMenu);
    }
    const handleLogOut = () => {
        if (window.confirm(`Haluatko kirjautua ulos?`)) {
            history.push('/')
            removeUserSession()
        }
    }
    let menuItems
    if (getUser()) {
        menuItems = (<>
            <Link style={{ color: "white", width: '200px' }} className="nav-link" to="/userpage">Omat sivut</Link>
            <p onClick={handleLogOut} style={{ color: "white", width: '250px', cursor: 'pointer' }} className="nav-link" >Kirjaudu ulos</p>
        </>)
    } else {
        menuItems = (<>
            <Link style={{ color: "white", width: '200px' }} className="nav-link" to="/">Etusivu</Link>
            <Link style={{ color: "white", width: '200px' }} className="nav-link" to="/login">Kirjaudu</Link>
            <Link style={{ color: "white", width: '100px' }} className="nav-link" to="/register">Rekisteröidy</Link>
        </>)
    }
    return (
        <div className="navbar navbar-expand" style={navbar} onClick={toggleMenu}>
            <p className="MenuText mt-2 ml-5" >
                Menu
                <Icon.Justify size={30} className="ml-3 fa-5x" />
            </p>
            <div id="dropMenu" style={overlay} onClick={toggleMenu}>
                {showMenu
                    ? <>
                        {menuItems}
                    </>
                    : <></>}
            </div>
        </div>
    )
}
const overlay = {
    marginTop: '75px',
    fontFamily: 'Lato, sans-serif',
    height: '0%',
    width: '100%',
    position: 'absolute',
    zIndex: '1',
    top: '0',
    left: '0',
    backgroundColor: 'rgba(44,62,80, 0.9)',
    // overflow: 'hidden',
    transition: '0.5s',
}
const navbar = {
    color: 'white',
    backgroundColor: 'rgba(44,62,80, 0.9)',
    height: '75px',
    padding: '10px',
    position: 'relative',
    width: '100vw !important',
 /*   marginRight: '-50vw',*/
    marginLeft: 'calc(-50vw + 50%)' 
}
