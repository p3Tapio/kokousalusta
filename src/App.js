import React from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import PrivateRoute from './Components/Auth/PrivateRoute'
import './Style/App.css'
import 'bootswatch/dist/flatly/bootstrap.min.css'; 
import Navbar from './Components/Shared/Navbar'
import Home from './Views/Home'
import Login from './Views/Auth/Login';
import Register from './Views/Auth/Register'
import UserPage from './Views/User/UserPage';
import AssocMain from './Views/Assoc/AssocMain';
import UusiKokous from './Views/Kokous/UusiKokous';
import KokousDetails from './Views/Kokous/KokousDetails';

function App() {
  return (
    <div>
      <Router>
        <Navbar />
        <div className="container">
          <Switch>
            <Route exact path='/' component={Login}/>
            <Route path='/login' component={Login}/>
            <Route path='/register' component={Register} />
            <PrivateRoute path='/userpage' component={UserPage}/>
            <PrivateRoute path='/assoc/:yhdistys' component={AssocMain}/>
            <PrivateRoute path='/uusikokous/:yhdistys' component={UusiKokous} />
            <PrivateRoute path='/kokous/:yhdistys/:kokousId' component={KokousDetails} />
          </Switch>
        </div>
      </Router>
    </div>
  );
}

export default App;
